import fs from "node:fs";
import path from "node:path";

const N = 1000;
const fragments: string[] = [];

let currentTail = Math.floor(Math.random() * 100).toString().padStart(2, '0');

for (let i = 0; i < N; i++) {
  const middleAndTail = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  fragments.push(currentTail + middleAndTail);
  currentTail = middleAndTail.slice(-2);
}

for (let i = fragments.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [fragments[i], fragments[j]] = [fragments[j], fragments[i]];
}

const outputPath = path.resolve(process.cwd(), "public/source.txt");

fs.writeFileSync(outputPath, fragments.join("\n"), "utf-8");
console.log(`Згенеровано ${N} фрагментів.`);
console.log(`Еталонна максимальна довжина: ${6 + (N - 1) * 4}`);