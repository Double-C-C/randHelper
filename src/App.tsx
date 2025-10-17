import { Separator } from "@/components/ui/separator";
import Header from "./components/Header";
import RandomNumberCard from "./components/RandomNumberCard";
import RandomFileCard from "./components/RandomFileCard";
import { useState } from "react";
import { Sidebar, SidebarOpen } from "lucide-react";
import SidebarItem from "./components/ui/SidebarItem";

type Tab = "number" | "file";

function App() {
  const [tab, setTab] = useState<Tab>("number");

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
          {tab === "file" && <RandomFileCard />}
        </main>
      </div>
    </div>
  );
}

export default App;
