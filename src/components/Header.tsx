import { Dice5 } from "lucide-react";
import RandomFileCard from "./RandomFileCard";
import RandomNumberCard from "./RandomNumberCard";

export default function Header() {
  return (
    <header className="h-14 border-b border-slate-200 flex items-center px-4 bg-white">
      <div className="text-lg font-bold text-slate-800 tracking-tight">
        🎲 随机助手
      </div>
      <div className="ml-auto text-sm text-slate-500">盛唐小工具 版本-v0.2</div>
    </header>
  );
}
