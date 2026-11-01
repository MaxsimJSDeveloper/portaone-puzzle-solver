import { ChainAssembler } from "./chainAssembler";
import { ComponentSplitter } from "./componentSplitter";
import { GraphBalancer } from "./graphBalancer";
import { TrailFinder } from "./trailFinder";
import { PieceGraph, PuzzlePiece } from "@/core/domain";

export class PathFinder {
  private readonly balancer: GraphBalancer;
  private readonly trailFinder: TrailFinder;
  private readonly assembler: ChainAssembler;
  private readonly splitter: ComponentSplitter;

  constructor(
    balancer = new GraphBalancer(),
    trailFinder = new TrailFinder(),
    assembler = new ChainAssembler(),
    splitter = new ComponentSplitter()
  ) {
    this.balancer = balancer;
    this.trailFinder = trailFinder;
    this.assembler = assembler;
    this.splitter = splitter;
  }

  public findLongPath(components: readonly PieceGraph[]): string {
    const queue = [...components];
    let best = "";

    for (let graph = queue.pop(); graph; graph = queue.pop()) {
      if (graph.size === 0) continue;

      const sacrificedPaths = this.balancer.balance(graph);
      const trail = this.trailFinder.find(graph);
      if (trail.length === 0) continue;

      const chains = [...this.assembler.splitIntoChains(trail), ...sacrificedPaths];
      best = this.longest(best, chains);

      queue.push(...this.splitter.split(graph.pieces()));
    }
    return best;
  }

  private longest(current: string, chains: readonly (readonly PuzzlePiece[])[]): string {
    let best = current;
    for (const chain of chains) {
      const candidate = this.assembler.merge(chain);
      if (candidate.length > best.length) best = candidate;
    }
    return best;
  }
}