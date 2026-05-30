using Grpc.Core;
using LogWatcher.Grpc;
using LogWatcher.Web.Config;
using LogWatcher.Web.Dto;
using LogWatcher.Web.Sessions;

namespace LogWatcher.Web.Services
{
    /// <summary>
    /// gRPC endpoint that replaces AgentHub.
    /// Each agent opens one bidirectional stream and keeps it open for the session lifetime.
    /// </summary>
    public class AgentGrpcService : AgentGateway.AgentGatewayBase
    {
        private readonly IAgentRegistry _registry;
        private readonly WatchSessionManager _sessions;
        private readonly KnownAgentsRepository _knownAgents;
        private readonly ILogger<AgentGrpcService> _log;

        public AgentGrpcService(IAgentRegistry registry, WatchSessionManager sessions, KnownAgentsRepository knownAgents, ILogger<AgentGrpcService> log)
        {
            _registry = registry;
            _sessions = sessions;
            _knownAgents = knownAgents;
            _log = log;
        }

        public override async Task Connect(
            IAsyncStreamReader<AgentMessage> requestStream,
            IServerStreamWriter<BackendMessage> responseStream,
            ServerCallContext context)
        {
            string agentId = null;

            // The agent sends BackendMessage to this writer.
            // Wrap in a channel so multiple callers can enqueue messages safely.
            var channel = System.Threading.Channels.Channel.CreateUnbounded<BackendMessage>();

            async Task SendToAgent(BackendMessage msg)
            {
                await channel.Writer.WriteAsync(msg, context.CancellationToken);
            }

            // Forward channel writes to the actual gRPC stream on a dedicated task
            var writeTask = Task.Run(async () =>
            {
                await foreach (var msg in channel.Reader.ReadAllAsync(context.CancellationToken))
                    await responseStream.WriteAsync(msg);
            }, context.CancellationToken);

            try
            {
                await foreach (var agentMsg in requestStream.ReadAllAsync(context.CancellationToken))
                {
                    switch (agentMsg.PayloadCase)
                    {
                        case AgentMessage.PayloadOneofCase.Register:
                            agentId = agentMsg.Register.AgentId;
                            _registry.Register(
                                agentId,
                                agentMsg.Register.Hostname,
                                agentMsg.Register.Capabilities.ToArray(),
                                SendToAgent);
                            _knownAgents.Upsert(agentId, agentMsg.Register.Hostname);
                            _sessions.OnAgentReconnected(agentId);
                            _log.LogInformation("Agent registered: {AgentId} ({Hostname})", agentId, agentMsg.Register.Hostname);
                            break;

                        case AgentMessage.PayloadOneofCase.PushLines:
                            var pl = agentMsg.PushLines;
                            await _sessions.HandleAgentPushAsync(
                                pl.SessionId,
                                pl.Lines.ToArray(),
                                pl.Offsets.ToArray(),
                                pl.IsInitialLoad,
                                pl.IsReset);
                            break;

                        case AgentMessage.PayloadOneofCase.PushRequested:
                            var pr = agentMsg.PushRequested;
                            await _sessions.HandleAgentPageAsync(pr.SessionId, pr.StartLine, pr.Lines.ToArray());
                            break;

                        case AgentMessage.PayloadOneofCase.PushFileInfo:
                            var pfi = agentMsg.PushFileInfo;
                            await _registry.CompleteFileInfoRequestAsync(pfi.RequestId, pfi.SizeBytes, pfi.Exists);
                            break;

                        case AgentMessage.PayloadOneofCase.PushFileList:
                            var pfl = agentMsg.PushFileList;
                            var files = pfl.Files.Select(f => new RemoteFileInfoDto
                            {
                                Path = f.Path,
                                IsDirectory = f.IsDirectory,
                                SizeBytes = f.SizeBytes,
                                LastModified = DateTimeOffset.TryParse(f.LastModified, out var dt) ? dt : DateTimeOffset.UtcNow,
                                HasChildren = f.HasChildren,
                            }).ToArray();
                            await _registry.CompleteListRequestAsync(pfl.RequestId, files);
                            break;

                        case AgentMessage.PayloadOneofCase.PushError:
                            await _sessions.HandleAgentErrorAsync(agentMsg.PushError.SessionId, agentMsg.PushError.Message);
                            break;

                        case AgentMessage.PayloadOneofCase.PushFilter:
                            var pf = agentMsg.PushFilter;
                            await _registry.CompleteFilterRequestAsync(pf.RequestId, pf.MatchingLines.ToArray());
                            break;

                        case AgentMessage.PayloadOneofCase.PushSearch:
                            var ps = agentMsg.PushSearch;
                            await _registry.CompleteSearchRequestAsync(ps.RequestId, ps.MatchingPaths.ToArray());
                            break;
                    }
                }
            }
            catch (RpcException ex) when (ex.StatusCode == StatusCode.Cancelled) { }
            catch (OperationCanceledException) { }
            catch (Exception ex)
            {
                _log.LogError(ex, "AgentGrpcService.Connect error for agent {AgentId}", agentId);
            }
            finally
            {
                channel.Writer.TryComplete();
                if (agentId != null)
                {
                    _registry.Unregister(agentId);
                    _log.LogInformation("Agent disconnected: {AgentId}", agentId);
                }
                try { await writeTask; } catch { }
            }
        }
    }
}
