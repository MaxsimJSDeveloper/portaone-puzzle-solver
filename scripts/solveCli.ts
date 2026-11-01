import fs from "node:fs";
import path from "node:path";
import { PuzzleSolver } from "../src/core/puzzleSolver";

const filePath = path.resolve(process.cwd(), "public/source.txt");
const rawText = fs.readFileSync(filePath, "utf-8");

const fragments = rawText
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line.length >= 4);

const memoryBefore = process.memoryUsage().heapUsed;

console.time("Execution time");
const solver = new PuzzleSolver(fragments);
const result = solver.solve();
console.timeEnd("Execution time");

const memoryAfter = process.memoryUsage().heapUsed;

const memoryUsedMB = ((memoryAfter - memoryBefore) / 1024 / 1024).toFixed(2);
const totalHeapMB = (memoryAfter / 1024 / 1024).toFixed(2);

const expectedLength = 6 + (fragments.length - 1) * 4;
const percentage = ((result.length / expectedLength) * 100).toFixed(2);

console.log("\n--- BENCHMARK RESULTS ---");
console.log(`Fragments count: ${fragments.length}`);
console.log(`Length of sequence: ${result.length} / ${expectedLength} (${percentage}%)`);
console.log(`Algorithm Memory Usage (Delta): ${memoryUsedMB} MB`);
console.log(`Total Heap Memory: ${totalHeapMB} MB`);