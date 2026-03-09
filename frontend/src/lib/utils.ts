import { formatDistanceToNow } from "date-fns";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function timeAgo(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
}

export const LEVEL_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  "L3": { label: "L3 · Junior",    bg: "bg-emerald-50",  text: "text-emerald-700", dot: "bg-emerald-400" },
  "L4": { label: "L4 · Mid",       bg: "bg-sky-50",      text: "text-sky-700",     dot: "bg-sky-400" },
  "L5": { label: "L5 · Senior",    bg: "bg-indigo-50",   text: "text-indigo-700",  dot: "bg-indigo-400" },
  "L6": { label: "L6 · Staff",     bg: "bg-violet-50",   text: "text-violet-700",  dot: "bg-violet-400" },
  "L7+": { label: "L7+ · Principal", bg: "bg-rose-50",   text: "text-rose-700",    dot: "bg-rose-400" },
};

export const CONTENT_TABS = [
  { type: "coding",       emoji: "📝", label: "Coding Plan",    desc: "DSA patterns, 6-week plan, must-do problems" },
  { type: "system_design",emoji: "🏗", label: "System Design",  desc: "Company-specific questions, level-calibrated depth" },
  { type: "behavioral",   emoji: "🎯", label: "Behavioral",     desc: "STAR stories, LP mapping, bar raiser playbook" },
  { type: "company_tips", emoji: "🏢", label: "Company Tips",   desc: "Loop structure, TC ranges, cultural signals" },
  { type: "edge_tech",    emoji: "⚡", label: "Edge Tech",      desc: "Top-of-band skills, sprint plan, promo criteria" },
] as const;

export type ContentTypeKey = typeof CONTENT_TABS[number]["type"];
