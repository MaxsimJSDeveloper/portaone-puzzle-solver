export interface IPuzzlePiece {
  id: string;
  value: string;
  head: string;
  tail: string;
}

export interface IGraphData {
  graph: Map<string, IPuzzlePiece[]>;
  inDegree: Map<string, number>;
  outDegree: Map<string, number>;
}
