import { LEVEL_CONFIG } from "@/lib/utils";

export function LevelBadge({ level }: { level: string }) {
  const cfg = LEVEL_CONFIG[level] ?? { label: level, bg: "bg-slate-50", text: "text-slate-600", dot: "bg-slate-400" };
  return (
    <span className={`badge ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
