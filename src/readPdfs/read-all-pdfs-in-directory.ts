import { parsePdf } from "./parsePdf.js"
import fs from "node:fs"
import path from "node:path"

export async function readAllPdfsRecusively(directory: string, includeNested: boolean = false): Promise<string> {
    
    const files = fs.readdirSync(directory, {recursive: includeNested, encoding: "utf-8"})
    .filter(name => name.endsWith(".pdf"))
    .map(name => path.join(directory, name))
    let finalValue = ""
    for (const file of files){
        const val = await parsePdf(file);
        finalValue += `${file} \n ${val} \n`
    }
    

    return finalValue;
}