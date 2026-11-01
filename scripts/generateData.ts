import fs from "node:fs";
import path from "node:path";

const MAIN_CHAIN_COUNT = 10000;
const SECONDARY_CHAIN_COUNT = 1500;
const DEAD_ENDS_COUNT = 300;

const fragments: string[] = [];

function generateChain(length: number, startNode?: string): { chain: string[]; lastNode: string } {
  const chain: string[] = [];
  let currentTail = startNode || Math.floor(Math.random() * 100).toString().padStart(2, "0");
  
  for (let i = 0; i < length; i++) {
    const middleAndTail = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    const fragment = currentTail + middleAndTail;
    chain.push(fragment);
    currentTail = middleAndTail.slice(-2);
  }
  return { chain, lastNode: currentTail };
}

const mainChain = generateChain(MAIN_CHAIN_COUNT);
fragments.push(...mainChain.chain);

const secondaryChain = generateChain(SECONDARY_CHAIN_COUNT);
fragments.push(...secondaryChain.chain);

for (let i = 0; i < DEAD_ENDS_COUNT; i++) {
  const randomMainFragment = mainChain.chain[Math.floor(Math.random() * mainChain.chain.length)];
  const attachNode = randomMainFragment.slice(-2);
  
  const deadEndLength = Math.floor(Math.random() * 4) + 2;
  const deadEnd = generateChain(deadEndLength, attachNode);
  fragments.push(...deadEnd.chain);
}

for (let i = fragments.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [fragments[i], fragments[j]] = [fragments[j], fragments[i]];
}

const outputPath = path.resolve(process.cwd(), "public/source.txt");
fs.writeFileSync(outputPath, fragments.join("\n"), "utf-8");

const expectedMaxSeqLength = 6 + (MAIN_CHAIN_COUNT - 1) * 4;

console.log("=== STRESS-TEST DATASET GENERATED ===");
console.log(`Main Chain Length: ${MAIN_CHAIN_COUNT} fragments (${expectedMaxSeqLength} chars)`);
console.log(`Secondary Isolated Chain: ${SECONDARY_CHAIN_COUNT} fragments`);
console.log(`Dead Ends Added: ${DEAD_ENDS_COUNT}`);
console.log(`Total Fragments in file: ${fragments.length}`);