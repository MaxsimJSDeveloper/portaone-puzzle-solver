# Puzzle Solver

Builds the **longest single-row (1D) sequence** from a set of numeric string fragments.

Two fragments connect when the **last 2 digits** of one equal the **first 2 digits** of the next. Every fragment can be used **at most once**, and the overlapping digits are written only once in the result.

```
608017  248460  962282  994725  177092

2484(60) + (60)80(17) + (17)7092  ->  24846080177092
```

The project has two entry points that share the same core: a React web UI and a terminal CLI.

---

## Quick Start

Requires Node.js `^20.19` or `>=22.12` (Vite 8).

```bash
npm install

npm run dev                         # web UI
npm run solve:cli                   # solve public/source.txt in the terminal
npm run solve:cli -- path/to/input.txt   # solve any custom file
npm run build                       # type-check + production build
npm run lint                        # run oxlint
npm run generate:data               # regenerate a 12k-fragment stress set into public/source.txt
```

> ⚠️ `generate:data` **overwrites** `public/source.txt`. Back up the bundled dataset first if you want to preserve it.

**Input format:** One fragment per line, digits only, at least 4 characters. Lines that do not match are skipped and reported as "rejected".

---

## Web UI Features

- **Multi-Source Data Input**: Load the default test dataset, upload any custom `.txt` file, or generate a synthetic stress-test dataset directly in the browser.
- **In-Browser Dataset Generator**: Tweak parameters for the main chain, isolated components, and dead-end noise branches to stress-test graph traversal.
- **Detailed Solver Metrics**: Visual feedback displaying execution time ($ms$), reconstructed sequence length, utilized fragment count, and rejected invalid entries.
- **Fragment Inspection with Pagination**: Inspect loaded dataset fragments in a color-coded grid with client-side pagination to ensure smooth rendering.

---

## How It Works

Fragments are modelled as a directed multigraph: **nodes are 2-digit codes, fragments are edges** (`head -> tail`). A chain is a trail that never reuses an edge, and a code may be visited many times. The graph has at most 100 nodes, regardless of the number of input fragments.

1. **Validation**: `FragmentValidator` trims lines and filters out invalid fragments (e.g., non-numeric or length $< 4$).
2. **Component Splitting**: `ComponentSplitter` (Disjoint-Set Union / Union-Find) splits the graph into weakly connected components (WCC), as a valid chain can only exist inside a single component.
3. **Budgeted Exact Search**: For each component, `TrailSearcher` runs a depth-first search (DFS) trying edges in order of `weight + potential(tail)`. `PotentialCalculator` computes the potential using Tarjan's algorithm for Strongly Connected Components (SCC). If the search completes within its step budget (1,000,000 steps), the result is provably optimal.
4. **Graph Balancing & Eulerian Trail**: For large inputs, `GraphBalancer` repeatedly removes the cheapest path (Dijkstra) from nodes with surplus outgoing edges to nodes with deficits until at most one surplus remains. This guarantees the existence of an Eulerian trail. `TrailFinder` then reconstructs it using an iterative Hierholzer algorithm in $O(E)$.
5. **Assembly**: `PathFinder` selects the longest candidate trail, and `ChainAssembler` joins the pieces, discarding overlapping boundary digits.

---

## Algorithm Performance Analysis & Benchmarks

Several algorithmic modifications were benchmarked on a standardized stress dataset consisting of **12,557 fragments** (10,000 main chain + 1,500 isolated + ~1,043 dead-end noise items).

| Algorithm Variant | Total Fragments | Noise Fragments / Type | Execution Time ($ms$) | Memory Delta ($MB$) | Sequence Length (chars) | Coverage ($\%$) |
|---|---|---|---|---|---|---|
| **Hierholzer (Baseline)** | 12,557 | 1,500 (Isolated) + ~1,043 (DeadEnds) | 13.54 ms | 1.24 MB | 48,674 / 50,230 | 96.90% |
| **Hierholzer + Greedy Lookahead** | 12,557 | 1,500 (Isolated) + ~1,043 (DeadEnds) | 16.17 ms | 5.97 MB | 33,486 / 50,230 | 66.67% |
| **Hierholzer + WCC & Pruning** | 12,557 | 1,500 (Isolated) + ~1,043 (DeadEnds) | 21.74 ms | 4.71 MB | 48,674 / 50,230 | 96.90% |
| **Hierholzer + Balance (Selected)** | 12,557 | 1,500 (Isolated) + ~1,043 (DeadEnds) | **14.37 ms** | **4.10 MB** | **49,874 / 50,230** | **99.29%** |

### Key Benchmark Takeaways
- **Greedy Lookahead** frequently trapped the traversal in local dead-ends, reducing sequence coverage down to **66.67%**.
- **WCC & Pruning** maintained strong coverage but introduced unnecessary runtime overhead (**21.74 ms**).
- **Hierholzer + Balance (Our Implemented Core)** achieved the highest sequence coverage (**99.29%**, 49,874 / 50,230 characters) while executing in **~14.37 ms**.

---

## Results Summary

| Dataset | Fragments | Used | Length | Time |
|---|---|---|---|---|
| Bundled `public/source.txt` | 142 | 67 | 270 chars | ~0.1 s |
| Generated stress set (10k main + 1.5k isolated + dead ends) | 12,557 | 12,467 | 49,874 chars (99.29% max coverage) | ~14.37 ms, ~4.1 MB heap delta |

*Note: For the bundled dataset, the result was verified against an exact branch-and-bound solver, proving 270 characters to be optimal.*

---

## Technical Stack & Resources

- **Language & Runtime**: TypeScript, React 19, Vite 8, Node.js (`^20.19` || `>=22.12`).
- **Styling**: Tailwind CSS v4 using modern `@theme` directive configuration.
- **Typography**: Local `.woff2` fonts (Inter for UI elements and JetBrains Mono for numeric fragments).
- **Icons & Notifications**: Lucide React icons, Sonner toast notifications.
- **Code Quality**: `oxlint`, strict TypeScript aliases (`@/core`, `@/ui`, `@/utils`).

---

## Project Structure

```
scripts/
  solveCli.ts            CLI runner and benchmark script
  generateData.ts        Node-based dataset generator
src/
  assets/                Fonts (Inter, JetBrains Mono .woff2)
  core/                  Framework-agnostic domain layer
    domain/              PuzzlePiece, PieceGraph
    services/            FragmentValidator, GraphBuilder, ComponentSplitter, 
                         PotentialCalculator, TrailSearcher, GraphBalancer, 
                         TrailFinder, ChainAssembler, PathFinder
    puzzleSolver.ts      Main facade connecting core services
  ui/                    React presentation layer
    components/          Header, FragmentGrid, FragmentCard, SolutionCard
    features/            DatasetInput (File Upload, Fetch, Generator, Controls), ResultViewer
    hooks/               useDataset, useDatasetInput
    shared/              Button, Card, Heading, Tabs, Loader
  utils/                 datasetParser, datasetGenerator
public/source.txt        Bundled 142-fragment default dataset
```

---

## Limitations

- **Exact Search Budget**: The search is exact when completing within its step budget ($1,000,000$ steps). For dense graphs exceeding the budget, the result falls back to the graph balancing heuristic (near-optimal).
- **Single Thread Traversal**: Web UI solves on the main thread. It remains responsive up to ~15,000 fragments; much larger datasets would benefit from offloading execution to a Web Worker.