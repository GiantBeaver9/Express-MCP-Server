import { PDFDocument } from "pdf-lib";
import pdfKit from "pdfkit";
export async function pdfKitWriteToPdf(title: string, text: string, filepath: string): Promise<string>{
    return new Promise((resolve, reject)=>{

        const document = new PDFDocument();
        const stream = new fs.createFileStream(path.join(filepath, title + ".pdf"))
    });
}