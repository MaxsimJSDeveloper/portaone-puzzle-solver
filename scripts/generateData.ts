import fs from "node:fs";
import path from "node:path";

import { generatePuzzleDataset } from "@/utils";

const MAIN_CHAIN_COUNT = 10000;
const SECONDARY_CHAIN_COUNT = 1500;
const DEAD_ENDS_COUNT = 300;

const fragments = generatePuzzleDataset({
  mainLength: MAIN_CHAIN_COUNT,
  secondaryLength: SECONDARY_CHAIN_COUNT,
  deadEndsCount: DEAD_ENDS_COUNT,
});

const outputPath = path.resolve(process.cwd(), "public/source.txt");
fs.writeFileSync(outputPath, fragments.join("\n"), "utf-8");

const expectedMaxSeqLength = 6 + (MAIN_CHAIN_COUNT - 1) * 4;

console.log("=== STRESS-TEST DATASET GENERATED ===");
console.log(`Main Chain Length: ${MAIN_CHAIN_COUNT} fragments (~${expectedMaxSeqLength} chars)`);
console.log(`Secondary Isolated Chain: ${SECONDARY_CHAIN_COUNT} fragments`);
console.log(`Dead Ends Added: ${DEAD_ENDS_COUNT}`);
console.log(`Total Fragments in file: ${fragments.length}`);