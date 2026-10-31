import type { IGraphBuilder, IPuzzlePiece } from "@/core/types";

export class GraphBuilder implements IGraphBuilder {
  build(fragments: string[]) {
    const graph = new Map<string, IPuzzlePiece[]>();

    fragments.forEach((value, index) => {
      const piece: IPuzzlePiece = {
        id: `${index}_${value}`,
        value,
        head: value.slice(0, 2),
        tail: value.slice(-2),
      };

      const existingPieces = graph.get(piece.head) ?? [];
      graph.set(piece.head, [...existingPieces, piece]);
    });

    return graph;
  }
}