export class DisjointSet<T> {
  private readonly parent = new Map<T, T>();

  public find(item: T): T {
    let root = item;
    while (this.parentOf(root) !== root) root = this.parentOf(root);

    let node = item;
    while (node !== root) {
      const next = this.parentOf(node);
      this.parent.set(node, root);
      node = next;
    }
    return root;
  }

  public union(a: T, b: T): void {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA !== rootB) this.parent.set(rootA, rootB);
  }

  private parentOf(item: T): T {
    return this.parent.get(item) ?? item;
  }
}