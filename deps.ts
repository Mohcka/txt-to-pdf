// PDF generation library
export { PDFDocument, StandardFonts, rgb } from "https://cdn.skypack.dev/pdf-lib@1.17.1?dts";

// File system and path utilities
export { parse } from "https://deno.land/std@0.220.1/flags/mod.ts";
export { ensureFileSync } from "https://deno.land/std@0.220.1/fs/ensure_file.ts";
export { basename, dirname, join, resolve } from "https://deno.land/std@0.220.1/path/mod.ts";
