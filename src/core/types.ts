export interface IPuzzlePiece {
  id: string;
  value: string;
  head: string;
  tail: string;
}

export interface IGraphBuilder {
  build(fragments: string[]): Map<string, IPuzzlePiece[]>;
}

export interface IPathFinder {
  findLongestPath(graph: Map<string, IPuzzlePiece[]>): string;
}