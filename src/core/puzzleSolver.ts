import { FragmentValidator, GraphBuilder, PathFinder } from "@/core/services";
import type { ISolverResult } from "./types";

export class PuzzleSolver {
  private readonly fragments: readonly string[];
  private readonly graphBuilder: GraphBuilder;
  private readonly pathFinder: PathFinder;
  private readonly validator: FragmentValidator;
  public readonly rejectedFragments: readonly string[];

  constructor(
    rawFragments: readonly string[],
    graphBuilder = new GraphBuilder(),
    pathFinder = new PathFinder(),
    validator = new FragmentValidator()
  ) {
    this.graphBuilder = graphBuilder;
    this.pathFinder = pathFinder;
    this.validator = validator;

    const { valid, rejected } = this.validator.validate(rawFragments);
    this.fragments = valid;
    this.rejectedFragments = rejected;
  }

  public solve(): ISolverResult {
    if (this.fragments.length === 0) {
      return {
        sequence: "",
        usedCount: 0,
        rejectedCount: this.rejectedFragments.length,
      };
    }

    const components = this.graphBuilder.build(this.fragments);
    const sequence = this.pathFinder.findLongPath(components);

    const usedCount = sequence.length >= 6 ? (sequence.length - 6) / 4 + 1 : 0;

    return {
      sequence,
      usedCount,
      rejectedCount: this.rejectedFragments.length,
    };
  }
}