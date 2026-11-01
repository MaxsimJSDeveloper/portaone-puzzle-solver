import { OVERLAP } from "../config";
import type { PuzzlePiece } from "@/core/domain";

export class ChainAssembler {
  public splitIntoChains(trail: readonly PuzzlePiece[]): PuzzlePiece[][] {
    const chains: PuzzlePiece[][] = [];
    let current: PuzzlePiece[] = [];

    for (const piece of trail) {
      const previous = current.at(-1);
      if (previous && !piece.canFollow(previous)) {
        chains.push(current);
        current = [];
      }
      current.push(piece);
    }

    if (current.length > 0) chains.push(current);
    return chains;
  }

  public merge(chain: readonly PuzzlePiece[]): string {
    if (chain.length === 0) return "";

    let result = chain[0].value;
    for (let i = 1; i < chain.length; i++) {
      result += chain[i].value.slice(OVERLAP);
    }
    return result;
  }
}