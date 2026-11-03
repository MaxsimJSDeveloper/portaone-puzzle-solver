import type { PieceGraph, PuzzlePiece } from "@/core/domain";
import { ChainAssembler } from "./chainAssembler";
import { ComponentSplitter } from "./componentSplitter";
import { GraphBalancer } from "./graphBalancer";
import { TrailFinder } from "./trailFinder";
import { TrailSearcher } from "./trailSearcher";

export class PathFinder {
  private readonly searcher: TrailSearcher;
  private readonly balancer: GraphBalancer;
  private readonly trailFinder: TrailFinder;
  private readonly assembler: ChainAssembler;
  private readonly splitter: ComponentSplitter;

  constructor(
    searcher = new TrailSearcher(),
    balancer = new GraphBalancer(),
    trailFinder = new TrailFinder(),
    assembler = new ChainAssembler(),
    splitter = new ComponentSplitter()
  ) {
    this.searcher = searcher;
    this.balancer = balancer;
    this.trailFinder = trailFinder;
    this.assembler = assembler;
    this.splitter = splitter;
  }

  public findLongPath(components: readonly PieceGraph[]): readonly PuzzlePiece[] {
    let best: readonly PuzzlePiece[] = [];

    for (const component of components) {
      best = this.longest(best, [this.searcher.search(component)]);
    }
    return this.walkWithBalancing(components, best);
  }

  private walkWithBalancing(
    components: readonly PieceGraph[],
    initialBest: readonly PuzzlePiece[]
  ): readonly PuzzlePiece[] {
    const queue = [...components];
    let best = initialBest;

    for (let graph = queue.pop(); graph; graph = queue.pop()) {
      if (graph.size === 0) continue;

      const sacrificedPaths = this.balancer.balance(graph);
      const trail = this.trailFinder.find(graph);
      if (trail.length === 0) continue;

      best = this.longest(best, [...this.assembler.splitIntoChains(trail), ...sacrificedPaths]);

      queue.push(...this.splitter.split(graph.pieces()));
    }
    return best;
  }

  private longest(
    current: readonly PuzzlePiece[],
    chains: readonly (readonly PuzzlePiece[])[]
  ): readonly PuzzlePiece[] {
    let best = current;
    for (const chain of chains) {
      if (this.lengthOf(chain) > this.lengthOf(best)) best = chain;
    }
    return best;
  }

  private lengthOf(chain: readonly PuzzlePiece[]): number {
    return chain.reduce((sum, piece) => sum + piece.weight, 0);
  }
}