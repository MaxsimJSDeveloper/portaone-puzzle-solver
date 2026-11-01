import { DisjointSet } from "./disjointSet";
import { PieceGraph, PuzzlePiece } from "@/core/domain";

export class ComponentSplitter {
  public split(pieces: Iterable<PuzzlePiece>): PieceGraph[] {
    const all = [...pieces];

    const sets = new DisjointSet<string>();
    for (const piece of all) sets.union(piece.head, piece.tail);

    const groups = new Map<string, PuzzlePiece[]>();
    for (const piece of all) {
      const key = sets.find(piece.head);
      const group = groups.get(key);
      if (group) group.push(piece);
      else groups.set(key, [piece]);
    }

    return [...groups.values()].map((group) => new PieceGraph(group));
  }
}