import { useEffect, useState } from "react";

export function App() {
  const [fragments, setFragments] = useState<string[]>([]);

  useEffect(() => {
    fetch("/source.txt")
      .then((res) => res.text())
      .then((text) => {
        const parsedData = text
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line.length >= 4);
        
        setFragments(parsedData);
      })
      .catch((err) => console.error("Download error :", err));
  }, []);

  return (
    <div>
      <h1>Puzzle Solver</h1>
      <ul>{fragments.map((fragment, index)=><li key={index}>{fragment}</li>)}</ul>
    </div>
  );
}

export default App;