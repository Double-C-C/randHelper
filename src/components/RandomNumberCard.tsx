import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

export default function RandomNumberCard() {
  const [max, setMax] = useState(100);
  const [min, setMin] = useState(1);
  const [result, setResult] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function generate() {
    setErr("");
    try {
      const r = await invoke<number>("generate_random", { min, max });
      setResult(r);
    } catch (e: any) {
      setErr(String(e));
      setResult(null);
    }
  }

  return (
    <section className="max-w-xl">
      <h2 className="text-xl font-semibold mb-3">🔢 随机数生成</h2>

      <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">最小</span>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(Number(e.target.value))}
              className="w-28 rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">最大</span>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(Number(e.target.value))}
              className="w-28 rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          <button
            onClick={generate}
            className="ml-auto rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 transition"
          >
            生成
          </button>
        </div>

        {result !== null && (
          <div className="text-2xl font-bold mt-1">结果：{result}</div>
        )}
        {err && (
          <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 p-2 rounded">
            错误：{err}
          </div>
        )}
      </div>
    </section>
  );
}
