import { FragmentValidator, GraphBuilder, PathFinder } from "@/core/services";

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

  public solve(): string {
    if (this.fragments.length === 0) return "";

    const components = this.graphBuilder.build(this.fragments);
    return this.pathFinder.findLongPath(components);
  }
}