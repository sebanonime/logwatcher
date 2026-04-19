import * as signalR from '@microsoft/signalr'

let connection: signalR.HubConnection | null = null

export function getLogHub(): signalR.HubConnection {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl('/logHub', {
        accessTokenFactory: () => localStorage.getItem('logwatcher_token') ?? '',
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning)
      .build()
  }
  return connection
}

export async function startLogHub(): Promise<void> {
  const hub = getLogHub()
  if (hub.state === signalR.HubConnectionState.Disconnected) {
    await hub.start()
  }
}

export async function stopLogHub(): Promise<void> {
  if (connection) {
    await connection.stop()
    connection = null
  }
}
