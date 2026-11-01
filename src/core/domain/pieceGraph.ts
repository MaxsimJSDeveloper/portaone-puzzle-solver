import type { PuzzlePiece } from "./puzzlePiece";

const NO_EDGES: readonly PuzzlePiece[] = [];

export class PieceGraph {
  private readonly outEdges = new Map<string, PuzzlePiece[]>();
  private readonly balances = new Map<string, number>();
  private edgeCount = 0;

  constructor(pieces: Iterable<PuzzlePiece> = []) {
    for (const piece of pieces) this.addEdge(piece);
  }

  public get size(): number {
    return this.edgeCount;
  }

  public addEdge(piece: PuzzlePiece): void {
    const edges = this.outEdges.get(piece.head);
    if (edges) edges.push(piece);
    else this.outEdges.set(piece.head, [piece]);

    this.shiftBalance(piece.head, +1);
    this.shiftBalance(piece.tail, -1);
    this.edgeCount++;
  }

  public removeEdge(piece: PuzzlePiece): boolean {
    const edges = this.outEdges.get(piece.head);
    const index = edges ? edges.indexOf(piece) : -1;
    if (!edges || index === -1) return false;

    edges[index] = edges[edges.length - 1];
    edges.pop();
    this.onEdgeRemoved(piece);
    return true;
  }

  public takeEdgeFrom(node: string): PuzzlePiece | undefined {
    const piece = this.outEdges.get(node)?.pop();
    if (piece) this.onEdgeRemoved(piece);
    return piece;
  }

  public edgesFrom(node: string): readonly PuzzlePiece[] {
    return this.outEdges.get(node) ?? NO_EDGES;
  }

  public balanceOf(node: string): number {
    return this.balances.get(node) ?? 0;
  }

  public nodes(): string[] {
    return [...this.balances.keys()];
  }

  public pieces(): PuzzlePiece[] {
    return [...this.outEdges.values()].flat();
  }

  private onEdgeRemoved(piece: PuzzlePiece): void {
    this.shiftBalance(piece.head, -1);
    this.shiftBalance(piece.tail, +1);
    this.edgeCount--;
  }

  private shiftBalance(node: string, delta: number): void {
    this.balances.set(node, this.balanceOf(node) + delta);
  }
}