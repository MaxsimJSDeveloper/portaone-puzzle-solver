import { PieceGraph, PuzzlePiece } from "@/core/domain";

interface IStep {
  readonly node: string;
  readonly via: PuzzlePiece | null;
}

export class TrailFinder {
  public find(graph: PieceGraph): PuzzlePiece[] {
    const start = this.pickStart(graph);
    if (start === undefined) return [];

    const trail: PuzzlePiece[] = [];
    const stack: IStep[] = [{ node: start, via: null }];

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const next = graph.takeEdgeFrom(current.node);

      if (next) {
        stack.push({ node: next.tail, via: next });
      } else {
        stack.pop();
        if (current.via) trail.push(current.via);
      }
    }
    return trail.reverse();
  }

  private pickStart(graph: PieceGraph): string | undefined {
    let best: string | undefined;
    let bestBalance = 0;

    for (const node of graph.nodes()) {
      const balance = graph.balanceOf(node);
      if (balance > bestBalance) {
        best = node;
        bestBalance = balance;
      }
    }
    return best ?? graph.nodes().find((node) => graph.edgesFrom(node).length > 0);
  }
}