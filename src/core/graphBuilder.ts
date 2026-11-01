import type { IPuzzlePiece, IGraphData } from "./types";

export class GraphBuilder {
  public build(fragments: string[]): IGraphData {
    const graph = new Map<string, IPuzzlePiece[]>();
    const inDegree = new Map<string, number>();
    const outDegree = new Map<string, number>();

    for (let i = 0; i < fragments.length; i++) {
      const value = fragments[i];
      const head = value.slice(0, 2);
      const tail = value.slice(-2);
      
      const piece: IPuzzlePiece = {
        id: `${i}_${value}`,
        value,
        head,
        tail,
      };

      if (!graph.has(head)) {
        graph.set(head, []);
      }
      graph.get(head)!.push(piece);

      outDegree.set(head, (outDegree.get(head) || 0) + 1);
      inDegree.set(tail, (inDegree.get(tail) || 0) + 1);
    }

    return { graph, inDegree, outDegree };
  }
}