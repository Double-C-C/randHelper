interface Props {
  active: boolean;
  onClick: () => void;
  emoji: string;
  label: string;
  desc?: string;
}

export default function SidebarItem({
  active,
  onClick,
  emoji,
  label,
  desc,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full text-left px-3 py-2 rounded-lg transition",
        active
          ? "bg-slate-300 text-slate-900"
          : "hover:bg-slate-100 text-slate-800",
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <span className="text-base">{emoji}</span>
        <div>
          <div className="text-sm font-medium">{label}</div>
          {desc && (
            <div
              className={
                active ? "text-slate-800 text-xs" : "text-slate-500 text-xs"
              }
            >
              {desc}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
