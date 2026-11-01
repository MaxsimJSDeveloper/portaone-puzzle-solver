export interface IValidationResult {
  readonly valid: string[];
  readonly rejected: string[];
}

export interface ISolverResult {
  sequence: string;
  usedCount: number;
  rejectedCount: number;
}