import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";


export function createMCPServer() {

    const server = new McpServer({name:"Express-Pdf-MCP", version: "0.0"});
    server.registerTool( 
        "export-text-to-pdf", 
        {
            title: "exportTextToPdf", 
            description: "Tool that takes plain text and creates a pdf",
            inputSchema: {text: z.string(),
                filename: z.string()
            }
        }, async ({text, filename}) => {return {content: []}}) ;


    return server;
    
}