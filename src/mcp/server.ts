import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import path from "node:path";
import { pdfKitWriteToPdf } from "../pdfCreation/write-to-pdf.js";
import { writeHtmlToPdf } from "../pdfCreation/html-to-pdfs.js";
import {parsePdf} from "../readPdfs/parsePdf.js"
import {readAllPdfsRecusively} from "../readPdfs/read-all-pdfs-in-directory.js"

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
      description: `Renders a complete, self-contained HTML document into a PDF. Provide full HTML (include <html>, <head>, and inline CSS); it is rendered in a real browser, so flexbox/grid/web-fonts/@media print all work. Automatically adds .pdf to filename.`,
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

    server.registerTool(
    "read-pdf-by-filepath",
    {
      title: "Read PDF by File Path",
      description: `Reads a pdf file based on a file path. Use the terminal or ask user for a direct path link`,
      inputSchema: {
        filepath: z.string().min(1).max(255),
      },
    },
    async ({ filepath }) => {
      const result = await parsePdf(filepath);
      return { content: [{ type: "text", text: result }] };
    }
  );

      server.registerTool(
    "read-pdf-by-filename",
    {
      title: "Read PDF by Filename",
      description: `Reads a pdf file based on FILENAME, the user has predefined the file path`,
      inputSchema: {
        filename: z.string().min(1).max(255),
      },
    },
    async ({ filename }) => {
      const dir = process.env.PDF_READ_PATH;
      if (!dir) {
        throw new Error("PDF_READ_PATH is not set in the environment");
      }
      if (filename.includes("..")) {
        throw new Error("Filename cannot contain '..' — path traversal is not allowed");
      }
      const fullPath = path.join(dir, filename);
      const correctedName = fullPath.endsWith(".pdf") ? fullPath : `${fullPath}.pdf`;
      const result = await parsePdf(correctedName);
      return { content: [{ type: "text", text: result }] };
    }
  );
  
      server.registerTool(
    "read-all-pdfs-in-directory",
    {
      title: "Read All PDFs in Directory",
      description: `reads all pdfs in a filepath, defaults to user defined file path if none provided
      No relative paths are accepted as a security measure`,
      inputSchema: {
        filepath: z.string().min(1).max(255).optional(),
        includeNested: z.boolean().optional()
      },
    },
    async ({ filepath, includeNested }) => {
      if(!process.env.PDF_READ_PATH){
        throw Error("no read path has been provided")
      }
      if(!filepath){
      filepath = process.env.PDF_READ_PATH;
    }
    if(filepath.includes("..")){
      throw Error("Computer cannot accept relative paths for searching for pdfs!")
    }
      const result = await readAllPdfsRecusively(filepath, includeNested);
      return { content: [{ type: "text", text: result }] };
    }
  );

  return server;
}
