"use client";

import { useState } from "react";
import type { PrepPlan } from "@/lib/types";
import { getPrep } from "@/lib/api";
import { CONTENT_TABS, type ContentTypeKey } from "@/lib/utils";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface PrepAccordionProps {
  jobId: number;
}

export function PrepAccordion({ jobId }: PrepAccordionProps) {
  const [activeTab, setActiveTab] = useState<ContentTypeKey | null>(null);
  const [plans, setPlans] = useState<Partial<Record<ContentTypeKey, PrepPlan>>>({});
  const [loading, setLoading] = useState<Partial<Record<ContentTypeKey, boolean>>>({});
  const [errors, setErrors] = useState<Partial<Record<ContentTypeKey, string>>>({});

  async function handleTabClick(type: ContentTypeKey) {
    if (activeTab === type) {
      setActiveTab(null);
      return;
    }
    setActiveTab(type);
    if (plans[type]) return;
    setLoading((p) => ({ ...p, [type]: true }));
    setErrors((p) => ({ ...p, [type]: undefined }));
    try {
      const plan = await getPrep(jobId, type);
      setPlans((p) => ({ ...p, [type]: plan }));
    } catch (e) {
      setErrors((p) => ({ ...p, [type]: String(e) }));
    } finally {
      setLoading((p) => ({ ...p, [type]: false }));
    }
  }

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-violet-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-slate-900">AI Interview Prep</h2>
            <p className="text-xs text-slate-500 mt-0.5">Personalized plans · Powered by Claude Opus · Cached after first load</p>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="grid grid-cols-5 border-b border-slate-100 bg-white">
        {CONTENT_TABS.map((tab) => {
          const isActive = activeTab === tab.type;
          const isDone = !!plans[tab.type as ContentTypeKey];
          const isLoading = !!loading[tab.type as ContentTypeKey];
          return (
            <button
              key={tab.type}
              onClick={() => handleTabClick(tab.type as ContentTypeKey)}
              className={`relative flex flex-col items-center justify-center gap-1 py-4 px-2 text-center transition-all border-b-2 ${
                isActive
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-transparent hover:bg-slate-50"
              }`}
            >
              <span className="text-xl">{isLoading ? "⏳" : tab.emoji}</span>
              <span className={`text-[11px] font-semibold leading-tight ${isActive ? "text-indigo-700" : "text-slate-500"}`}>
                {tab.label}
              </span>
              {isDone && !isLoading && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400" title="Cached" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab description strip */}
      {activeTab && (
        <div className="px-6 py-2 bg-slate-50 border-b border-slate-100">
          <p className="text-xs text-slate-500">
            {CONTENT_TABS.find((t) => t.type === activeTab)?.desc}
          </p>
        </div>
      )}

      {/* Content */}
      <div className="min-h-[200px]">
        {!activeTab && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
            <div className="flex gap-3">
              {CONTENT_TABS.map((t) => (
                <span key={t.type} className="text-2xl opacity-60">{t.emoji}</span>
              ))}
            </div>
            <p className="text-sm font-medium text-slate-600">Click a tab above to generate your prep plan</p>
            <p className="text-xs text-slate-400">Each plan takes 30–60s to generate, then cached instantly for future visits</p>
          </div>
        )}

        {activeTab && loading[activeTab] && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700">Generating with Claude Opus</p>
              <p className="text-xs text-slate-400 mt-1">Building a personalized plan just for this role…</p>
              <p className="text-xs text-slate-400 mt-0.5">~30–60 seconds · Result cached after first load</p>
            </div>
          </div>
        )}

        {activeTab && errors[activeTab] && (
          <div className="m-6 p-4 rounded-xl bg-rose-50 border border-rose-100">
            <p className="text-sm font-medium text-rose-700 mb-1">Generation failed</p>
            <p className="text-xs text-rose-500">{errors[activeTab]}</p>
          </div>
        )}

        {activeTab && plans[activeTab] && !loading[activeTab] && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <span className={`badge ${plans[activeTab]!.cached ? "bg-emerald-50 text-emerald-700" : "bg-indigo-50 text-indigo-700"}`}>
                {plans[activeTab]!.cached ? "✓ Served from cache" : "✨ Freshly generated"}
              </span>
              <span className="badge bg-slate-50 text-slate-500">{plans[activeTab]!.model}</span>
            </div>
            <MarkdownRenderer content={plans[activeTab]!.content} />
          </div>
        )}
      </div>
    </div>
  );
}
