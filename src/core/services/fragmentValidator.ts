import { MIN_FRAGMENT_LENGTH } from "../config";
import type { IValidationResult } from "../types";

export class FragmentValidator {
  private static readonly DIGITS_ONLY = /^\d+$/;

  public validate(rawFragments: readonly string[]): IValidationResult {
    const valid: string[] = [];
    const rejected: string[] = [];

    const digitRegex = new RegExp(`^\\d{${MIN_FRAGMENT_LENGTH},}$`);

    for (const item of rawFragments) {
      const trimmed = item.trim();
      if (digitRegex.test(trimmed)) {
        valid.push(trimmed);
      } else if (trimmed.length > 0) {
        rejected.push(trimmed);
      }
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