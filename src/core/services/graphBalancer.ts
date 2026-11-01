import { PieceGraph, PuzzlePiece } from "@/core/domain";

export class GraphBalancer {
  public balance(graph: PieceGraph): PuzzlePiece[][] {
    const sacrificed: PuzzlePiece[][] = [];
    const hopeless = new Set<string>();

    while (this.countExcess(graph) > 1) {
      const source = this.pickSource(graph, hopeless);
      if (source === undefined) break;

      const path = this.findCheapestRepairPath(graph, source);
      if (path === null) {
        hopeless.add(source);
        continue;
      }

      for (const piece of path) graph.removeEdge(piece);
      sacrificed.push(path);
    }
    return sacrificed;
  }

  private countExcess(graph: PieceGraph): number {
    let excess = 0;
    for (const node of graph.nodes()) {
      const balance = graph.balanceOf(node);
      if (balance > 0) excess += balance;
    }
    return excess;
  }

  private pickSource(graph: PieceGraph, hopeless: ReadonlySet<string>): string | undefined {
    return graph.nodes().find((node) => graph.balanceOf(node) > 0 && !hopeless.has(node));
  }

  private findCheapestRepairPath(graph: PieceGraph, from: string): PuzzlePiece[] | null {
    const cost = new Map<string, number>([[from, 0]]);
    const cameBy = new Map<string, PuzzlePiece>();
    const settled = new Set<string>();

    for (;;) {
      const current = this.closestUnsettled(graph, cost, settled);
      if (current === undefined) return null;

      const [node, nodeCost] = current;
      if (graph.balanceOf(node) < 0) return this.restorePath(cameBy, from, node);
      settled.add(node);

      for (const edge of graph.edgesFrom(node)) {
        if (settled.has(edge.tail)) continue;

        const total = nodeCost + edge.weight;
        if (total < (cost.get(edge.tail) ?? Infinity)) {
          cost.set(edge.tail, total);
          cameBy.set(edge.tail, edge);
        }
      }
    }
  }

  private closestUnsettled(
    graph: PieceGraph,
    cost: ReadonlyMap<string, number>,
    settled: ReadonlySet<string>
  ): [string, number] | undefined {
    let best: [string, number] | undefined;
    for (const [node, value] of cost) {
      if (settled.has(node)) continue;

      const isBetter =
        best === undefined ||
        value < best[1] ||
        (value === best[1] && graph.balanceOf(node) < 0 && graph.balanceOf(best[0]) >= 0);
      if (isBetter) best = [node, value];
    }
    return best;
  }

  private restorePath(cameBy: ReadonlyMap<string, PuzzlePiece>, from: string, to: string): PuzzlePiece[] {
    const path: PuzzlePiece[] = [];
    let node = to;

    while (node !== from) {
      const edge = cameBy.get(node);
      if (!edge) throw new Error(`Broken path tree: no edge leads to node "${node}"`);
      path.push(edge);
      node = edge.head;
    }
    return path.reverse();
  }
}