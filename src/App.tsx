import Header from "./components/Header";
import RandomNumberCard from "./components/RandomNumberCard";
import RandomFileCard from "./components/RandomFileCard";
import { useEffect, useState } from "react";
import SidebarItem from "./components/ui/SidebarItem";
import { load, save } from "./lib/store";

type Tab = "number" | "file";

function App() {
  const [tab, setTab] = useState<Tab>("number");
  const [rfDir, setRfDir] = useState("");
  const [rfExts, setRfExts] = useState(".jpg,.png");
  const [rfPicked, setRfPicked] = useState("");

  useEffect(() => {
    (async () => {
      setRfDir(await load("rf_dir", ""));
      setRfExts(await load("rf_exts", ""));
      setRfPicked(await load("rf_picked", ""));
    })();
  }, []);

  //变更文件夹,picked时保存
  useEffect(() => {
    save("rf_dir", rfDir);
  }, [rfDir]);
  useEffect(() => {
    save("rf_exts", rfExts);
  }, [rfExts]);
  useEffect(() => {
    save("rf_picked", rfPicked);
  }, [rfPicked]);

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-60 border-r border-slate-200 p-4 flex flex-col">
          <nav className="space-y-1">
            <SidebarItem
              active={tab === "number"}
              onClick={() => setTab("number")}
              emoji="🔢"
              label="随机数字"
              desc="区间内取整"
            />
            <SidebarItem
              active={tab === "file"}
              onClick={() => setTab("file")}
              emoji="📁"
              label="随机文件"
              desc="可指定格式"
            />
          </nav>
        </aside>

        <main className="flex-1 p-6 overflow-auto">
          {tab === "number" && <RandomNumberCard />}
          {tab === "file" && (
            <RandomFileCard
              dir={rfDir}
              setDir={setRfDir}
              exts={rfExts}
              setExts={setRfExts}
              picked={rfPicked}
              setPicked={setRfPicked}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
