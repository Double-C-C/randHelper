import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { openPath, revealItemInDir } from "@tauri-apps/plugin-opener";
import RandomFileHistory from "./RandomFileHistory";
import type { HistoryItem } from "@/store/runtimeStore";
import { get } from "@/lib/KVPerf";


function basename(p: string) {
  const parts = p.split(/[/\\]/);
  return parts[parts.length - 1] || p;
}

function dirname(p: string) {
  const parts = p.split(/[/\\]/);
  parts.pop();
  return parts.join("/") || p;
}

function nowStr() {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function pushHistoryItem(
  prev: HistoryItem[],
  item: Omit<HistoryItem, "id" | "at">,
  limit = 5
): HistoryItem[] {
  const now = new Date().toISOString();

  const shifted = prev.map(it => ({ ...it, id: it.id + 1 }));
  const updated = [{ ...item, id: 0, at: now }, ...shifted];

  return updated.slice(0, limit);
}
export default function RandomFileCard() {
  //使用全局KV储存
  const[dir,setDir] = useState<string>(() => get<string>("rf.dir") || "");
  const[exts,setExts] = useState<string>(() => get<string>("rf.exts") || "");
  const[picked,setPicked] = useState<string>(() => get<string>("rf.picked") || "");
  const[test,setTest] = useState<string>(() => get<string>("test") || "");

  //新增 : 随机指定格式文件

  // const [dir, setDir] = useState<string | null>(null);
  // const [exts, setExts] = useState<string>(".jpg,.png");
  // const [picked, setPicked] = useState<string | null>("debug");
  const [err, setErr] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>("selection1");

  async function chooseFolder() {
    const folder = await open({
      directory: true,
      multiple: false,
      title: "选择一个文件夹",
    });
    if (typeof folder === "string") {
setDir(folder);
setPicked("");
      setErr(null);
    }
  }

  async function pickFile() {
    if (!dir) return;
    try {
      setErr(null);
      const file = await invoke<string>("pick_random_file", { dir, exts });
setPicked(file);

      //增加历史记录

      const item: HistoryItem = {
        path: file,
        name: basename(file),
        at: nowStr(),
      };
    } catch (e: any) {
      setState({ picked: "" });
      setErr(String(e));
    }
  }

  async function openFile(picked: string) {
    if (!picked) return;
    try {
      await openPath(picked);
    } catch (e: any) {
      setErr(String(e));
    }
  }

  async function revealFile(picked: string) {
    if (!picked) return;
    try {
      await revealItemInDir(picked);
    } catch (e: any) {
      setErr(String(e));
    }
  }

  return (
    <section className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-3">随机文件</h2>

      <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-3">
        <div className="flex items-center gap-3">
          <button
            onClick={chooseFolder}
            className="rounded-lg border border-slate-300 px-3 py-2 hover:bg-slate-50 transition"
          >
            选择文件夹
          </button>
          <div className="text-sm text-slate-600 truncate max-w-[60ch]">
            {dir || "未选择"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">扩展名(英文逗号分隔)</span>
          <input
            value={exts}
            onChange={(e) => setState({ exts: e.target.value })}
            placeholder=".jpg,.png"
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 "
          />

          <button
            onClick={pickFile}
            disabled={!dir}
            className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 transition disabled:opacity-50"
          >
            抽一个!
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-3 mt-6">
        {picked && (
          <div className="rounded-md bg-slate-50 border-slate-200 p-2 text-sm break-all text-center">
            选中文件 <span className="font-bold">{picked} </span> !
          </div>
        )}
        {picked && (
          <div className="flex justify-center gap-4 mt-3">
            <button
              className="rounded-lg border border-slate-300 shadow-2xl text-gray-600 
              px-3 py-1 hover:bg-slate-50 hover:text-gray-700"
              onClick={() => openFile(picked)}
            >
              打开文件
            </button>
            <button
              className="rounded-lg border border-slate-300 shadow-2xl text-gray-600 
              px-3 py-1 hover:bg-slate-50 hover:text-gray-700"
              onClick={() => revealFile(picked)}
            >
              在文件夹里显示
            </button>
          </div>
        )}
      </div>

      {err && (
        <div className="text-sm text-rase-700 bg-rose-50 border border-rose-300 p-2 rounded mt-3">
          发生错误 : {err}
        </div>
      )}

      {selected && <RandomFileHistory />}
    </section>
  );
}
