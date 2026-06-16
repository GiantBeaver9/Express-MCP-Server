import {PDFParse }  from "pdf-parse"
import fs from "node:fs"


export async function parsePdf(filepath: string): Promise<string>{
    
    const buffer = fs.readFileSync(filepath);
    const pdfParser = new PDFParse({data: buffer})
    try{

    const  data = await pdfParser.getText()
      return data.text.trim() ? `extracted text: \n${data.text}`: `failed data extraction or PDF has no legible/readable fields`;
   
}
finally{
    pdfParser.destroy()
}
}