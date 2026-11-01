import { MIN_FRAGMENT_LENGTH } from "../config";
import type { IValidationResult } from "../types";

export class FragmentValidator {
  private static readonly DIGITS_ONLY = /^\d+$/;

  public validate(rawFragments: readonly string[]): IValidationResult {
    const valid: string[] = [];
    const rejected: string[] = [];

    for (const fragment of rawFragments) {
      (this.isValid(fragment) ? valid : rejected).push(fragment);
    }
    return { valid, rejected };
  }

  public isValid(fragment: string): boolean {
    return (
      fragment.length >= MIN_FRAGMENT_LENGTH &&
      FragmentValidator.DIGITS_ONLY.test(fragment)
    );
  }
}