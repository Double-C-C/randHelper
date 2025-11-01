import { File } from "lucide-react";
import type { HistoryItem } from "@/store/runtimeStore";
import { useCallback, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

type RandomFileHistoryProps = {
  history: HistoryItem[];
  openFile: (Filepath: string) => void;
  revealFile: (Filepath: string) => void;
  clearHistory: () => void;
};

export default function RandomFileHistory({
  history,
  openFile,
  revealFile,
  clearHistory,
}: RandomFileHistoryProps) {
  //当前选中的项目ID
  const [selectedId, setSelectedId] = useState<string | null>(null);

  //缓存缩略图
  const [thumbCache, setThumbCache] = useState<Record<string, string>>({});

  const [loading, SetLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelect = useCallback(
    async (item: HistoryItem) => {
      setSelectedId(item.id);
      setErrorMsg(null);

      if (thumbCache[item.id]) return;

      SetLoading(true);
      try {
        const dataUrl = await invoke<string>("generate_thumbnail", {
          path: item.path,
          maxWidth: 128,
          maxHeight: 128,
        });

        setThumbCache((prev) => ({
          ...prev,
          [item.id]: dataUrl,
        }));
      } catch (e) {
        console.error("缩略图生成失败", e);
        setErrorMsg(
          typeof e === "string" ? e : "缩略图生成失败（tauri侧报错）"
        );
      } finally {
        SetLoading(false);
      }
    },
    [thumbCache]
  );

  const selectedItem =
    selectedId != null
      ? history.find((h) => h.id === selectedId) ?? null
      : null;

  // 当前选中的缩略图
  const selectedThumb =
    selectedId && thumbCache[selectedId] ? thumbCache[selectedId] : null;

  return (
    <section className="mt-5">
      <div className="mt-3 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700 ">前五次随机历史</h3>
        <button
          className="rounded-2xl border border-slate-400 p-2 text-sm text-gray-500 bg-white"
          onClick={clearHistory}
        >
          清空
        </button>
      </div>

      <ul className="rounded-lg border border-slate-200 bg-white my-3">
        {history.length === 0 ? (
          <li className="p-4 text-sm text-slate-500 ">暂无历史</li>
        ) : (
          history.map((it) => {
            const isActive = it.id === selectedId;
            return (
              <li
                key={it.id}
                className={[
                  "p-3 flex items-center gap-3 cursor-pointer",
                  isActive
                    ? "bg-sky-50 border-l-4 border-sky-400"
                    : "hover:bg-slate-50 border-l-4 border-transparent",
                ].join(" ")}
                onClick={() => handleSelect(it)}
              >
                <div className="w-8 h-8 shrink-0 grid place-items-center rounded bg-slate-100 text-slate-500">
                  <File />
                </div>

                <div className="min-w-0 flex-1 flex-col ">
                  <div className="truncate font-medium text-slate-900">
                    {it.name}
                  </div>
                  <div className="truncate text-xs text-slate-500">
                    {it.path}
                  </div>
                </div>

                <div className="hidden md:block text-xs text-slate-400 mr-2 whitespace-nowrap">
                  {it.at}
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-2 py-1 text-xs rounded border border-sky-100 bg-white text-slate-500 hover:border-slate-300"
                    onClick={() => openFile(it.path)}
                  >
                    打开
                  </button>
                  <button
                    className="px-2 py-1 text-xs rounded border border-sky-100 bg-white text-slate-500 hover:border-slate-300"
                    onClick={() => revealFile(it.path)}
                  >
                    位置
                  </button>
                </div>
              </li>
            );
          })
        )}
      </ul>

      {/* 预览区 */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 flex flex-col gap-3 md:flex-row md:items-start">
        {/* 左：缩略图框 */}
        <div className="w-32 h-32 shrink-0 border rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden text-[10px] text-gray-400">
          {selectedItem ? (
            selectedThumb ? (
              <img
                src={selectedThumb}
                alt="缩略图"
                className="object-contain w-full h-full"
              />
            ) : loading ? (
              <span>生成中…</span>
            ) : (
              <span>暂无预览</span>
            )
          ) : (
            <span>未选择</span>
          )}
        </div>

        {/* 右：详细信息 */}
        <div className="flex-1 min-w-0 text-xs text-slate-600 leading-relaxed">
          {selectedItem ? (
            <>
              <div className="text-slate-900 font-medium text-sm truncate">
                {selectedItem.name}
              </div>
              <div className="truncate">
                <span className="text-slate-400 mr-1">路径:</span>
                <span title={selectedItem.path}>{selectedItem.path}</span>
              </div>
              <div className="text-slate-500">
                <span className="text-slate-400 mr-1">时间:</span>
                {selectedItem.at}
              </div>
              <div className="text-slate-500">
                <span className="text-slate-400 mr-1">ID:</span>
                {selectedItem.id}
              </div>
            </>
          ) : (
            <div className="text-slate-400">点击上方列表项可预览缩略图</div>
          )}
        </div>
      </div>
    </section>
  );
}
