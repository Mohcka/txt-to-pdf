import { PDFDocument, StandardFonts, rgb, ensureFileSync } from "./deps.ts";

export async function convertTxtToPdf(
  inputFilePath: string,
  outputFilePath: string
): Promise<void> {
  try {
    // Read the text file
    let text = await Deno.readTextFile(inputFilePath);
    
    // Normalize line endings to just LF
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Courier);
    
    // Add a page to the document
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12;
    const margin = 50;
    const lineHeight = fontSize * 1.2;
    
    // Calculate available width for text
    const maxWidth = width - 2 * margin;
    
    // Split text into paragraphs
    const paragraphs = text.split("\n");
    let y = height - margin;
    
    for (const paragraph of paragraphs) {
      // Skip empty paragraphs
      if (!paragraph.trim()) {
        y -= lineHeight;
        if (y < margin) {
          page = pdfDoc.addPage();
          y = height - margin;
        }
        continue;
      }
      
      // Sanitize paragraph to remove unsupported characters
      const sanitizedParagraph = sanitizeText(paragraph);
      
      // Split paragraph into words
      const words = sanitizedParagraph.split(" ");
      let line = "";
      
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const testLine = line ? `${line} ${word}` : word;
        
        try {
          const textWidth = font.widthOfTextAtSize(testLine, fontSize);
          
          if (textWidth > maxWidth && line) {
            // Draw the current line
            page.drawText(line, {
              x: margin,
              y,
              size: fontSize,
              font,
              color: rgb(0, 0, 0),
            });
            
            // Move to next line
            y -= lineHeight;
            
            // Check if we need a new page
            if (y < margin) {
              page = pdfDoc.addPage();
              y = height - margin;
            }
            
            // Start a new line with the current word
            line = word;
          } else {
            line = testLine;
          }
        } catch (e) {
          // If there's an encoding error, try to skip or replace the problematic word
          console.warn(`Warning: Could not encode word "${word}", skipping it.`);
          continue;
        }
      }
      
      // Draw any remaining text
      if (line) {
        try {
          page.drawText(line, {
            x: margin,
            y,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
          });
        } catch (e) {
          console.warn(`Warning: Could not encode line "${line}", skipping it.`);
        }
        
        y -= lineHeight;
      }
      
      // Extra line break between paragraphs
      y -= lineHeight / 2;
      
      // Check if we need a new page
      if (y < margin) {
        page = pdfDoc.addPage();
        y = height - margin;
      }
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

// Helper function to remove or replace characters that can't be encoded in WinAnsi
function sanitizeText(text: string): string {
  // Replace common problematic characters
  return text
    // Remove control characters
    .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Replace smart quotes with regular quotes
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    // Replace em dash and en dash
    .replace(/[\u2013\u2014]/g, '-')
    // Replace ellipsis
    .replace(/\u2026/g, '...')
    // Replace other common special characters
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, '');
}
