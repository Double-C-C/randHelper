import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";

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

  //新增 : 随机指定格式文件

  const [dir, setDir] = useState<string | null>(null);
  const [exts, setExts] = useState<string>(".jpg,.png");
  const [picked, setPicked] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function chooseFolder() {
    const folder = await open({
      directory: true,
      multiple: false,
      title: "选择一个文件夹 : ",
    });
    if (typeof folder === "string") {
      setDir(folder);
      setPicked(null);
      setErr(null);
    }
  }

  async function pickFile() {
    if (!dir) return;
    try {
      setErr(null);
      const file = await invoke<string>("pick_random_file", { dir, exts });
      setPicked(file);
    } catch (e: any) {
      setPicked(null);
      setErr(String(e));
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

      <hr style={{ margin: "24px 0" }} />

      <h2>📁 指定格式随机抽文件</h2>
      <div>
        <button onClick={chooseFolder}>选择文件夹</button>
        {dir && <div style={{ wordBreak: "break-all" }}>当前目录：{dir}</div>}
      </div>

      <div style={{ marginTop: 8 }}>
        <label>扩展名（逗号分隔）：</label>
        <input
          value={exts ?? ""}
          onChange={(e) => setExts(e.target.value)}
          placeholder=".jpg,.png"
          style={{ width: 240, marginLeft: 6 }}
        />
      </div>

      <button onClick={pickFile} disabled={!dir} style={{ marginTop: 10 }}>
        随机抽一个
      </button>

      {picked && (
        <div style={{ marginTop: 10, wordBreak: "break-all" }}>
          🎯 结果：{picked}
        </div>
      )}
      {err && (
        <div style={{ color: "crimson", marginTop: 10 }}>错误：{err}</div>
      )}
    </div>
  );
}

export default App;
