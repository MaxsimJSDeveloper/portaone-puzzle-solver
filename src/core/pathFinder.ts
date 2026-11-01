import type { IPuzzlePiece, IGraphData } from "./types";

export class PathFinder {
  public findLongestPath({ graph, inDegree, outDegree }: IGraphData): string {
    const startNode = this.findStartNode(graph, inDegree, outDegree);
    if (!startNode) return "";

    const path: IPuzzlePiece[] = [];
    const stack: { node: string; edge: IPuzzlePiece | null }[] = [
      { node: startNode, edge: null }
    ];

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const edges = graph.get(current.node);

      if (edges && edges.length > 0) {
        const nextEdge = edges.pop()!;
        stack.push({ node: nextEdge.tail, edge: nextEdge });
      } else {
        const popped = stack.pop()!;
        if (popped.edge !== null) {
          path.push(popped.edge);
        }
      }
    }

    path.reverse();
    return this.assembleSequence(path);
  }

  private findStartNode(
    graph: Map<string, IPuzzlePiece[]>,
    inDegree: Map<string, number>,
    outDegree: Map<string, number>
  ): string {
    for (const [node, out] of outDegree.entries()) {
      const inCount = inDegree.get(node) || 0;
      if (out - inCount === 1) {
        return node;
      }
    }
    return graph.keys().next().value || "";
  }

  private assembleSequence(pieces: IPuzzlePiece[]): string {
    if (pieces.length === 0) return "";

    let longestChain: IPuzzlePiece[] = [];
    let currentChain: IPuzzlePiece[] = [pieces[0]];

    for (let i = 1; i < pieces.length; i++) {
      if (pieces[i - 1].tail === pieces[i].head) {
        currentChain.push(pieces[i]);
      } else {
        if (currentChain.length > longestChain.length) {
          longestChain = currentChain;
        }
        currentChain = [pieces[i]];
      }
    }

    if (currentChain.length > longestChain.length) {
      longestChain = currentChain;
    }

    let result = longestChain[0].value;
    for (let i = 1; i < longestChain.length; i++) {
      result += longestChain[i].value.slice(2);
    }

    return result;
  }
}