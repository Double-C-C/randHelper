import { Dice5 } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-2x1 bg-slate-900 text-white grid place-items-center shadow">
        <Dice5 className="h-5 w-5" />
      </div>
      <h1 className="text-2x1 font-bold tracking-tight">和一位助手</h1>
      <p className="text-slate-500 text-sm">全是伪随机太有操作了</p>
    </header>
  );
}
