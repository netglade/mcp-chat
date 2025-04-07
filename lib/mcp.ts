// import { McpServerState } from "@/types/mcpServer";
// import { Sandbox } from "@e2b/code-interpreter";
// import { startMcpSandbox } from "@netglade/mcp-sandbox";

// export async function startServer(command: string, envs: Record<string, string>, id: string)
// {
//     console.log("Starting server...");

//     const sandbox = await startMcpSandbox({
//       command: command,
//       apiKey: process.env.E2B_API_KEY!,
//       envs: envs,
//       timeoutMs: 1000 * 60 * 10,
//     })
    
//     const url = sandbox.getUrl();

//     const server = mcps.servers.find(server => server.id === id)

//     if (server) {
//       server.url = url;
//       server.state = 'running' as McpServerState;
//       server.sandbox = sandbox;
//     }
    
// }

// export async function extendOrRestartServer(serverId: string): Promise<boolean> {
//   const server = mcps.servers.find(server => server.id === serverId);
//   if (!server) {
//     throw new Error(`Server not found: ${serverId}`);
//   }

//   // Check if server is running
//   if (server.sandbox) {
//     const isRunning = await server.sandbox.sandbox.isRunning();
//     if (isRunning) {
//       // Extend timeout if server is running
//       await server.sandbox.sandbox.setTimeout(300_000);
//       console.log("Server is running, timeout extended:", server.url);
//       return false; // Not restarted
//     }
//     console.log("Server stopped, restarting...");
//   }

//   // Server not running, restart it
//   try {
//     const sandbox = await startMcpSandbox({
//       command: server.command,
//       apiKey: process.env.E2B_API_KEY!,
//       envs: server.envs,
//       timeoutMs: 1000 * 60 * 10,
//     });
    
//     const newUrl = sandbox.getUrl();
    
//     // Update server with new sandbox and URL
//     server.url = newUrl;
//     server.sandbox = sandbox;
//     server.state = 'running' as McpServerState;
    
//     console.log("Server restarted successfully:", newUrl);
//     return true; // Was restarted
//   } catch (error) {
//     console.error("Failed to restart server:", error);
//     server.state = 'error' as McpServerState;
//     throw error; // Propagate the error
//   }
// }