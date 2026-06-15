import PDFDocument from "pdfkit";
import fs from "fs"
export async function pdfKitWriteToPdf(text: string, filepath: string): Promise<string>{
    return new Promise((resolve, reject)=>{
        let successful = true;
try{
        const pdfDoc = new PDFDocument();
        const stream = fs.createWriteStream(filepath)

        pdfDoc.pipe(stream);
        pdfDoc.text(text);
        pdfDoc.end()

        stream.on("finish", () => resolve(filepath));
        stream.on("error", reject)
}
catch{
    successful = false;
}
finally
{
    return successful ? `wrote pdf to ${filepath}` : `failed to write to ${filepath}`
}

    });
}