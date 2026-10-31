import type { IPathFinder, IPuzzlePiece } from "./types";

export class PathFinder implements IPathFinder {
  findLongestPath(graph: Map<string, IPuzzlePiece[]>): string {
    let longestPathPieces: IPuzzlePiece[] = [];

    const allPieces: IPuzzlePiece[] = [];
    graph.forEach((pieces) => allPieces.push(...pieces));

    const visitedIds = new Set<string>();

    const dfs = (currentPiece: IPuzzlePiece, currentPath: IPuzzlePiece[]) => {
      if (currentPath.length > longestPathPieces.length) {
        longestPathPieces = [...currentPath];
      }

      const nextHead = currentPiece.tail;
      const candidates = graph.get(nextHead) ?? [];

      for (const nextPiece of candidates) {
        if (!visitedIds.has(nextPiece.id)) {
          visitedIds.add(nextPiece.id);
          currentPath.push(nextPiece);

          dfs(nextPiece, currentPath);

          currentPath.pop();
          visitedIds.delete(nextPiece.id);
        }
      }
    };

    for (const startPiece of allPieces) {
      visitedIds.clear();
      visitedIds.add(startPiece.id);
      dfs(startPiece, [startPiece]);
    }

    return this.assembleSequence(longestPathPieces);
  }

  private assembleSequence(pieces: IPuzzlePiece[]): string {
    if (pieces.length === 0) return "";

    let result = pieces[0].value;

    for (let i = 1; i < pieces.length; i++) {
      result += pieces[i].value.slice(2);
    }

    return result;
  }
}