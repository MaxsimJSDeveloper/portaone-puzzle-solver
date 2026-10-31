import fs from "node:fs";
import path from "node:path";
import { PuzzleSolver } from "../src/core/puzzleSolver";

const filePath = path.resolve(process.cwd(), "public/source.txt");
const rawText = fs.readFileSync(filePath, "utf-8");

const fragments = rawText
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line.length >= 4);

console.time("Execution time");
const solver = new PuzzleSolver(fragments);
const result = solver.solve();
console.timeEnd("Execution time");

console.log("\n--- RESULT ---");
console.log("Length of sequence:", result.length);
console.log("Sequence:", result);