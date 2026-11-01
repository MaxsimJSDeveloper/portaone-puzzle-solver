import type { PieceGraph, PuzzlePiece } from "@/core/domain";
import { PotentialCalculator } from "./potentialCalculator";

interface IFrame {
  readonly node: string;
  next: number;
}

export class TrailSearcher {
  private readonly maxSteps: number;
  private readonly calculator: PotentialCalculator;

  constructor(maxSteps = 1_000_000, calculator = new PotentialCalculator()) {
    this.maxSteps = maxSteps;
    this.calculator = calculator;
  }

  public search(graph: PieceGraph): PuzzlePiece[] {
    const potential = this.calculator.calculate(graph);
    const potentialOf = (node: string): number => potential.get(node) ?? 0;

    const adjacency = new Map<string, PuzzlePiece[]>();
    for (const node of graph.nodes()) {
      const edges = [...graph.edgesFrom(node)];
      if (edges.length === 0) continue;
      edges.sort((a, b) => b.weight + potentialOf(b.tail) - (a.weight + potentialOf(a.tail)));
      adjacency.set(node, edges);
    }

    const starts = [...adjacency.keys()].sort((a, b) => potentialOf(b) - potentialOf(a));
    const used = new Set<PuzzlePiece>();
    const trail: PuzzlePiece[] = [];
    let weight = 0;
    let best: PuzzlePiece[] = [];
    let bestWeight = 0;
    let steps = 0;

    for (const start of starts) {
      const frames: IFrame[] = [{ node: start, next: 0 }];

      while (frames.length > 0 && steps < this.maxSteps) {
        const frame = frames[frames.length - 1];
        const edges = adjacency.get(frame.node) ?? [];

        if (frame.next < edges.length) {
          const piece = edges[frame.next++];
          steps++;
          if (used.has(piece)) continue;

          used.add(piece);
          trail.push(piece);
          weight += piece.weight;
          frames.push({ node: piece.tail, next: 0 });
          continue;
        }

        if (weight > bestWeight) {
          best = trail.slice();
          bestWeight = weight;
        }
        frames.pop();
        const last = trail.pop();
        if (last) {
          used.delete(last);
          weight -= last.weight;
        }
      }

      if (weight > bestWeight) {
        best = trail.slice();
        bestWeight = weight;
      }
      if (steps >= this.maxSteps) break;
    }
    return best;
  }
}