"use client";

import { useCallback } from "react";
import type { JobFilters } from "@/lib/api";
import type { Company } from "@/lib/types";
import { LEVEL_CONFIG } from "@/lib/utils";

const LEVELS = Object.keys(LEVEL_CONFIG);

interface JobFiltersProps {
  filters: JobFilters;
  companies: Company[];
  onChange: (filters: JobFilters) => void;
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2.5">{title}</p>
      {children}
    </div>
  );
}

export function JobFiltersPanel({ filters, companies, onChange }: JobFiltersProps) {
  const update = useCallback(
    (patch: Partial<JobFilters>) => onChange({ ...filters, page: 1, ...patch }),
    [filters, onChange]
  );

  const hasActiveFilters = !!(filters.q || filters.level || filters.remote || filters.company || filters.tier);

  return (
    <aside className="space-y-6">
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search roles..."
          value={filters.q || ""}
          onChange={(e) => update({ q: e.target.value || undefined })}
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all"
        />
      </div>

      {/* Tier */}
      <FilterSection title="Company Type">
        <div className="space-y-1">
          {[
            { value: undefined, label: "All Companies", icon: "🏢" },
            { value: "faang_plus", label: "FAANG++ & Big Tech", icon: "🏆" },
            { value: "ai_startup", label: "AI Startups", icon: "🚀" },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => update({ tier: opt.value })}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2.5 ${
                filters.tier === opt.value
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
              {filters.tier === opt.value && (
                <svg className="w-4 h-4 ml-auto text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Levels */}
      <FilterSection title="Level">
        <div className="grid grid-cols-3 gap-1.5">
          {LEVELS.map((lvl) => {
            const cfg = LEVEL_CONFIG[lvl];
            const active = filters.level === lvl;
            return (
              <button
                key={lvl}
                onClick={() => update({ level: active ? undefined : lvl })}
                className={`px-2 py-2 rounded-xl text-xs font-semibold text-center transition-all ${
                  active
                    ? `${cfg.bg} ${cfg.text} ring-2 ring-offset-1 ring-current`
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                }`}
              >
                {lvl}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Remote */}
      <FilterSection title="Work Style">
        <button
          onClick={() => update({ remote: filters.remote ? undefined : true })}
          className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2.5 ${
            filters.remote
              ? "bg-emerald-50 text-emerald-700 font-semibold"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${filters.remote ? "bg-emerald-400" : "bg-slate-200"}`} />
          Remote Only
          {filters.remote && (
            <svg className="w-4 h-4 ml-auto text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      </FilterSection>

      {/* Company */}
      <FilterSection title="Company">
        <select
          value={filters.company || ""}
          onChange={(e) => update({ company: e.target.value ? Number(e.target.value) : undefined })}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent cursor-pointer transition-all"
        >
          <option value="">All Companies</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.open_roles})
            </option>
          ))}
        </select>
      </FilterSection>

      {/* Clear */}
      {hasActiveFilters && (
        <button
          onClick={() => onChange({ page: 1, limit: filters.limit })}
          className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-xl hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear all filters
        </button>
      )}
    </aside>
  );
}
