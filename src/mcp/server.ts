import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import path from "node:path";
import { pdfKitWriteToPdf } from "../pdfCreation/write-to-pdf.js";
import { writeHtmlToPdf } from "../pdfCreation/html-to-pdfs.js";

export function createMCPServer() {
  const server = new McpServer({ name: "Express-Pdf-MCP", version: "0.0" });

  server.registerTool(
    "export-text-to-pdf",
    {
      title: "exportTextToPdf",
      description: "Tool that takes plain text and creates a pdf, automatically adds .pdf to filename",
      inputSchema: {
        text: z.string().min(20),
        filename: z.string().min(1),
      },
    },
    async ({ text, filename }) => {

      const dir = process.env.PDF_WRITE_PATH;
      if (!dir) {
        throw new Error("PDF_WRITE_PATH is not set in the environment");
      }

      const correctedName = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
      const outputWritePath = path.join(dir, correctedName);

      const writtenPath = await pdfKitWriteToPdf(text, outputWritePath);
      return { content: [{ type: "text", text: `PDF written to ${writtenPath}` }] };
    }
  );

  server.registerTool(
    "export-html-to-pdf",
    {
      title: "exportHtmlToPdf",
      description:
        "Renders a complete, self-contained HTML document into a PDF. Provide full HTML " +
        "(include <html>, <head>, and inline CSS); it is rendered in a real browser, so " +
        "flexbox/grid/web-fonts/@media print all work. Automatically adds .pdf to filename.",
      inputSchema: {
        html: z.string().min(1),
        filename: z.string().min(1),
      },
    },
    async ({ html, filename }) => {
      const dir = process.env.PDF_WRITE_PATH;
      if (!dir) {
        throw new Error("PDF_WRITE_PATH is not set in the environment");
      }

      const correctedName = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
      const outputWritePath = path.join(dir, correctedName);

      const result = await writeHtmlToPdf(html, outputWritePath);
      return { content: [{ type: "text", text: result }] };
    }
  );

  return server;
}
