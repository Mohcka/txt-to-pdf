#!/usr/bin/env -S deno run --allow-read --allow-write

import { processCli } from "./cli.ts";

if (import.meta.main) {
  processCli(Deno.args);
}
