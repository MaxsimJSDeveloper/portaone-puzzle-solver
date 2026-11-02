export interface GeneratorConfig {
  mainLength: number;
  secondaryLength: number;
  deadEndsCount: number;
}

export function generatePuzzleDataset(config: GeneratorConfig): string[] {
  const fragments: string[] = [];

  const generateChain = (length: number, startNode?: string): string[] => {
    const chain: string[] = [];
    let currentTail = startNode || Math.floor(Math.random() * 100).toString().padStart(2, "0");

    for (let i = 0; i < length; i++) {
      const middleAndTail = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
      const fragment = currentTail + middleAndTail;
      chain.push(fragment);
      currentTail = middleAndTail.slice(-2);
    }
    return chain;
  };

  const mainChain = generateChain(config.mainLength);
  fragments.push(...mainChain);

  if (config.secondaryLength > 0) {
    const secondaryChain = generateChain(config.secondaryLength);
    fragments.push(...secondaryChain);
  }

  for (let i = 0; i < config.deadEndsCount; i++) {
    const randomMainFragment = mainChain[Math.floor(Math.random() * mainChain.length)];
    const attachNode = randomMainFragment.slice(-2);
    const deadEndLength = Math.floor(Math.random() * 3) + 1;
    const deadEnd = generateChain(deadEndLength, attachNode);
    fragments.push(...deadEnd);
  }

  // Fisher-Yates shuffle
  for (let i = fragments.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [fragments[i], fragments[j]] = [fragments[j], fragments[i]];
  }

  return fragments;
}