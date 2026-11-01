import { PuzzlePiece, type PieceGraph } from "@/core/domain";
import { ComponentSplitter } from "@/core/services";

export class GraphBuilder {
  private readonly splitter: ComponentSplitter;

  constructor(splitter = new ComponentSplitter()) {
    this.splitter = splitter;
  }

  public build(fragments: readonly string[]): PieceGraph[] {
    return this.splitter.split(fragments.map((value) => new PuzzlePiece(value)));
  }
}