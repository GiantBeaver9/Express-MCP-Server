import puppeteer from "puppeteer";

export async function writeHtmlToPdf(html: string,  filepath:string): Promise<string> {
    let successful = true;
    const browser = await puppeteer.launch();
    try{
    const page = await browser.newPage();
    await page.setContent(html, {waitUntil: "load"} )
    await page.pdf({path: filepath, format: "A4", printBackground: true})


    }
    catch (err){
        successful = false;
        
    }
    finally{
        
    await browser.close()
    }
    return successful ? `wrote the html to ${filepath}` : `failed to write html to ${filepath}`
}