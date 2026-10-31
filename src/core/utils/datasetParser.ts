export class DatasetParser {
  public static parseText(text: string): string[] {
    return text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length >= 4 && /^\d+$/.test(line));
  }

  public static async parseFile(file: File): Promise<string[]> {
    const text = await file.text();
    return this.parseText(text);
  }
}