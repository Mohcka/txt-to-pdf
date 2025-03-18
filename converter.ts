import { PDFDocument, StandardFonts, rgb, ensureFileSync } from "./deps.ts";

export async function convertTxtToPdf(
  inputFilePath: string,
  outputFilePath: string
): Promise<void> {
  try {
    // Read the text file
    const text = await Deno.readTextFile(inputFilePath);
    
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Courier);
    
    // Add a page to the document
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12;
    const margin = 50;
    
    // Split text into lines and calculate positions
    const lines = text.split("\n");
    let y = height - margin;
    const lineHeight = fontSize * 1.2;
    
    // Add text to the page
    for (const line of lines) {
      if (y < margin) {
        // Create a new page when we run out of space
        const newPage = pdfDoc.addPage();
        y = newPage.getSize().height - margin;
      }
      
      page.drawText(line, {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      
      y -= lineHeight;
    }
    
    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    
    // Ensure the output directory exists
    ensureFileSync(outputFilePath);
    
    // Write the PDF to file
    await Deno.writeFile(outputFilePath, pdfBytes);
    
    console.log(`Successfully converted ${inputFilePath} to ${outputFilePath}`);
  } catch (error: unknown) {
    console.error(`Error converting file: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}
