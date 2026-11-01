import type { PieceGraph, PuzzlePiece } from "@/core/domain";

export class PotentialCalculator {
  public calculate(graph: PieceGraph): Map<string, number> {
    const componentOf = this.findComponents(graph);
    const count = new Set(componentOf.values()).size;

    const inner: number[] = new Array<number>(count).fill(0);
    const exits: PuzzlePiece[][] = Array.from({ length: count }, () => []);

    for (const piece of graph.pieces()) {
      const from = this.read(componentOf, piece.head);
      const to = this.read(componentOf, piece.tail);
      if (from === to) inner[from] += piece.weight;
      else exits[from].push(piece);
    }

    const potential: number[] = [];
    for (let id = 0; id < count; id++) {
      let bestExit = 0;
      for (const piece of exits[id]) {
        bestExit = Math.max(bestExit, piece.weight + potential[this.read(componentOf, piece.tail)]);
      }
      potential[id] = inner[id] + bestExit;
    }

    const result = new Map<string, number>();
    for (const [node, id] of componentOf) result.set(node, potential[id]);
    return result;
  }

  private findComponents(graph: PieceGraph): Map<string, number> {
    const componentOf = new Map<string, number>();
    const order = new Map<string, number>();
    const low = new Map<string, number>();
    const stack: string[] = [];
    const onStack = new Set<string>();
    let counter = 0;
    let components = 0;

    const visit = (node: string): void => {
      order.set(node, counter);
      low.set(node, counter);
      counter++;
      stack.push(node);
      onStack.add(node);

      for (const edge of graph.edgesFrom(node)) {
        const next = edge.tail;
        if (!order.has(next)) {
          visit(next);
          low.set(node, Math.min(this.read(low, node), this.read(low, next)));
        } else if (onStack.has(next)) {
          low.set(node, Math.min(this.read(low, node), this.read(order, next)));
        }
      }

      if (this.read(low, node) !== this.read(order, node)) return;

      for (let member = stack.pop(); member !== undefined; member = stack.pop()) {
        onStack.delete(member);
        componentOf.set(member, components);
        if (member === node) break;
      }
      components++;
    };

    for (const node of graph.nodes()) {
      if (!order.has(node)) visit(node);
    }
    return componentOf;
  }

  private read(map: ReadonlyMap<string, number>, key: string): number {
    const value = map.get(key);
    if (value === undefined) throw new Error(`No value for node "${key}"`);
    return value;
  }
}