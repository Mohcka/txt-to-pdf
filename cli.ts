import { parse, basename, dirname, join } from "./deps.ts";
import { convertTxtToPdf } from "./converter.ts";

export function printHelp(): void {
  console.log(`
  txt-to-pdf - Convert text files to PDF

  USAGE:
    txt-to-pdf <input-file> [options]

  OPTIONS:
    -o, --output <file>    Output PDF file path (default: same as input with .pdf extension)
    -h, --help             Show this help message
  `);
}

export async function processCli(args: string[]): Promise<void> {
  const parsedArgs = parse(args, {
    string: ["output", "o"],
    boolean: ["help", "h"],
    alias: { h: "help", o: "output" },
  });

  if (parsedArgs.help || parsedArgs.h) {
    printHelp();
    return;
  }

  // Get the input file path
  const inputFilePath = parsedArgs._[0]?.toString();
  
  if (!inputFilePath) {
    console.error("Error: No input file specified");
    printHelp();
    Deno.exit(1);
  }

  try {
    // Check if the input file exists
    await Deno.stat(inputFilePath);
    
    // Determine the output file path
    let outputFilePath = parsedArgs.output || parsedArgs.o;
    
    if (!outputFilePath) {
      // Use the same name as the input file but with .pdf extension
      const inputBasename = basename(inputFilePath, ".txt");
      outputFilePath = join(dirname(inputFilePath), `${inputBasename}.pdf`);
    }
    
    // Convert the file
    await convertTxtToPdf(inputFilePath, outputFilePath);
  } catch (error: unknown) {
    if (error instanceof Deno.errors.NotFound) {
      console.error(`Error: Input file '${inputFilePath}' not found`);
    } else {
      console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
    Deno.exit(1);
  }
}
