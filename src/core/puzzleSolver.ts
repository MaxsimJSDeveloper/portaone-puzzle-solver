import { GraphBuilder } from "./graphBuilder";
import { PathFinder } from "./pathFinder";

export class PuzzleSolver {
  private fragments: string[];
  private graphBuilder: GraphBuilder;
  private pathFinder: PathFinder;

  constructor(rawFragments: string[]) {
    this.fragments = rawFragments.filter((f) => /^\d{4,}$/.test(f));
    this.graphBuilder = new GraphBuilder();
    this.pathFinder = new PathFinder();
  }

  public solve(): string {
    if (this.fragments.length === 0) return "";

    const graphData = this.graphBuilder.build(this.fragments);
    return this.pathFinder.findLongestPath(graphData);
  }
}