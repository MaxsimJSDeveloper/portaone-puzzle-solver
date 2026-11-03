import { ChainAssembler, FragmentValidator, GraphBuilder, PathFinder } from "@/core/services";
import type { ISolverResult } from "./types";

export class PuzzleSolver {
  private readonly fragments: readonly string[];
  private readonly graphBuilder: GraphBuilder;
  private readonly pathFinder: PathFinder;
  private readonly validator: FragmentValidator;
  private readonly assembler: ChainAssembler;
  public readonly rejectedFragments: readonly string[];

  constructor(
    rawFragments: readonly string[],
    graphBuilder = new GraphBuilder(),
    pathFinder = new PathFinder(),
    validator = new FragmentValidator(),
    assembler = new ChainAssembler()
  ) {
    this.graphBuilder = graphBuilder;
    this.pathFinder = pathFinder;
    this.validator = validator;
    this.assembler = assembler;

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
    const chain = this.pathFinder.findLongPath(components);

    return {
      sequence: this.assembler.merge(chain),
      usedCount: chain.length,
      rejectedCount: this.rejectedFragments.length,
    };
  }
}