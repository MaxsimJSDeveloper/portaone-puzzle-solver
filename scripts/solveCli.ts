import fs from "node:fs";
import path from "node:path";
import { PuzzleSolver } from "../src/core/puzzleSolver";

const filePath = path.resolve(process.cwd(), process.argv[2] ?? "public/source.txt");
const rawText = fs.readFileSync(filePath, "utf-8");

const fragments = rawText
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line.length >= 4);

const maxPossibleLength = fragments.reduce((sum, f) => sum + f.length - 2, 0) + 2;

if (global.gc) global.gc();
const memoryBefore = process.memoryUsage().heapUsed;

console.time("Execution time");
const solver = new PuzzleSolver(fragments);
const result = solver.solve();
console.timeEnd("Execution time");

const memoryAfter = process.memoryUsage().heapUsed;

const sequenceLength = result.sequence.length;
const coveragePercentage = ((sequenceLength / maxPossibleLength) * 100).toFixed(2);

const memoryUsedMB = ((memoryAfter - memoryBefore) / 1024 / 1024).toFixed(2);
const totalHeapMB = (memoryAfter / 1024 / 1024).toFixed(2);

console.log("\n--- BENCHMARK RESULTS ---");
console.log(`Total fragments in file: ${fragments.length}`);
console.log(`Used fragments in path:  ${result.usedCount}`);
console.log(`Rejected fragments:      ${result.rejectedCount}`);
console.log(`Sequence length:         ${sequenceLength} / ${maxPossibleLength} chars (${coveragePercentage}%)`);
console.log(`Algorithm Memory (Delta): ${memoryUsedMB} MB`);
console.log(`Total Heap Memory:       ${totalHeapMB} MB`);