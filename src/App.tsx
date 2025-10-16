import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function App() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setError(null);
    try {
      const num = await invoke<number>("generate_random", { min, max });
      setResult(num);
    } catch (e: any) {
      setError(String(e));
      setResult(null);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "80px auto", textAlign: "center" }}>
      <h1>🎲 随机数生成器</h1>

      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "center",
          margin: "16px 0",
        }}
      >
        <input
          type="number"
          value={min}
          onChange={(e) => setMin(Number(e.target.value))}
          style={{ width: 100, padding: 6 }}
        />
        <span>到</span>
        <input
          type="number"
          value={max}
          onChange={(e) => setMax(Number(e.target.value))}
          style={{ width: 100, padding: 6 }}
        />
      </div>

      <button onClick={generate} style={{ padding: "8px 16px" }}>
        生成
      </button>

      {result !== null && (
        <div style={{ marginTop: 16, fontSize: 20 }}>
          结果：<b>{result}</b>
        </div>
      )}
      {error && (
        <div style={{ marginTop: 12, color: "crimson" }}>错误：{error}</div>
      )}
    </div>
  );
}

export default App;
