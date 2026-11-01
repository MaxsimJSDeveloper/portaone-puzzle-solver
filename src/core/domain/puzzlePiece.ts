import { OVERLAP } from "../config";

export class PuzzlePiece {
  public readonly value: string;
  public readonly head: string;
  public readonly tail: string;
  public readonly weight: number;

  constructor(value: string) {
    this.value = value;
    this.head = value.slice(0, OVERLAP);
    this.tail = value.slice(-OVERLAP);
    this.weight = value.length - OVERLAP;
  }

  public canFollow(previous: PuzzlePiece): boolean {
    return previous.tail === this.head;
  }
}