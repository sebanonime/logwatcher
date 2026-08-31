using Grpc.Core;
using LogWatcher.Grpc;
using LogWatcher.Web.Config;
using LogWatcher.Web.Dto;
using LogWatcher.Web.Sessions;
using Microsoft.AspNetCore.Authorization;

namespace LogWatcher.Web.Services
{
    /// <summary>
    /// gRPC endpoint that replaces AgentHub.
    /// Each agent opens one bidirectional stream and keeps it open for the session lifetime.
    /// </summary>
    [Authorize(Policy = "AgentOnly")]
    public class AgentGrpcService : AgentGateway.AgentGatewayBase
    {
        // Diagnostics for the agent gRPC push path (see WatchSession's "TailDiag" logger for the
        // SMB tail path). Isolated to logs/tail-diag-*.log via nlog.config (logger name="TailDiag").
        private static readonly NLog.Logger _diag = NLog.LogManager.GetLogger("TailDiag");

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
                            _diag.Info("Agent registered agentId={0} hostname={1} capabilities={2}", agentId, agentMsg.Register.Hostname, string.Join(",", agentMsg.Register.Capabilities));
                            break;

                        case AgentMessage.PayloadOneofCase.PushLines:
                            var pl = agentMsg.PushLines;
                            var plLines = pl.Lines.ToArray();
                            var plOffsets = pl.Offsets.ToArray();
                            _diag.Debug(
                                "PushLines received agentId={0} session={1} count={2} isInitialLoad={3} isReset={4} firstOffset={5} lastOffset={6}",
                                agentId, pl.SessionId, plLines.Length, pl.IsInitialLoad, pl.IsReset,
                                plOffsets.Length > 0 ? plOffsets[0] : -1,
                                plOffsets.Length > 0 ? plOffsets[^1] : -1);
                            await _sessions.HandleAgentPushAsync(
                                pl.SessionId,
                                plLines,
                                plOffsets,
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
                                IsArchive = f.IsArchive,
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
                            var fileResults = ps.FileResults.Select(fr => new FileSearchMatchDto
                            {
                                Path = fr.Path,
                                LastModified = DateTimeOffset.TryParse(fr.LastModified, out var frDt) ? frDt : DateTimeOffset.UtcNow,
                                Lines = fr.Lines.Select(l => new MatchedLineDto { LineNumber = l.LineNumber, Text = l.Text }).ToList(),
                                Truncated = fr.Truncated,
                            }).ToArray();
                            await _registry.CompleteSearchRequestAsync(ps.RequestId, fileResults);
                            break;
                    }
                }
            }
            catch (RpcException ex) when (ex.StatusCode == StatusCode.Cancelled) { }
            catch (OperationCanceledException) { }
            catch (Exception ex)
            {
                _log.LogError(ex, "AgentGrpcService.Connect error for agent {AgentId}", agentId);
                _diag.Warn("Connect stream error agentId={0} error={1}", agentId, ex.Message);
            }
            finally
            {
                channel.Writer.TryComplete();
                if (agentId != null)
                {
                    _registry.Unregister(agentId);
                    _log.LogInformation("Agent disconnected: {AgentId}", agentId);
                    _diag.Info("Agent disconnected agentId={0}", agentId);
                }
                try { await writeTask; } catch { }
            }
        }
    }
}
