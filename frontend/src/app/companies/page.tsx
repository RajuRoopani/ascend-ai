"use client";

import { useState, useEffect, useMemo } from "react";
import { getCompanies } from "@/lib/api";
import type { Company, CompaniesResponse } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

function CompanyCard({ company }: { company: Company }) {
  return (
    <Link
      href={`/companies/${company.slug}`}
      className="card p-5 flex flex-col gap-4 hover:shadow-md hover:border-indigo-100 hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
          {company.logo_url ? (
            <Image src={company.logo_url} alt={company.name} width={48} height={48} className="object-contain p-1" />
          ) : (
            <span className="text-lg font-bold text-slate-300">{company.name[0]}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-semibold text-slate-900 text-sm group-hover:text-indigo-700 transition-colors truncate">
              {company.name}
            </p>
          </div>
          <p className="text-xs text-slate-400 truncate">{company.hq}</p>
        </div>
        <span className={`badge flex-shrink-0 ${
          company.tier === "faang_plus" ? "bg-amber-50 text-amber-700" : "bg-violet-50 text-violet-700"
        }`}>
          {company.tier === "faang_plus" ? "FAANG+" : "AI"}
        </span>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{company.about}</p>

      <div className="flex items-center justify-between pt-1 border-t border-slate-50">
        <span className="text-xs text-slate-400">{company.size} employees</span>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
          company.open_roles > 0 ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-400"
        }`}>
          {company.open_roles > 0 ? `${company.open_roles} open roles` : "No open roles"}
        </span>
      </div>
    </Link>
  );
}

function TierGrid({ title, icon, companies }: { title: string; icon: string; companies: Company[] }) {
  if (companies.length === 0) return null;
  const openRoles = companies.reduce((s, c) => s + c.open_roles, 0);
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl">{icon}</span>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-400">{companies.length} companies · {openRoles} open roles</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {companies.map((c) => <CompanyCard key={c.id} company={c} />)}
      </div>
    </section>
  );
}

export default function CompaniesPage() {
  const [data, setData] = useState<CompaniesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getCompanies()
      .then(setData)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!data) return null;
    const q = search.toLowerCase();
    if (!q) return data;
    const match = (c: Company) =>
      c.name.toLowerCase().includes(q) ||
      c.hq.toLowerCase().includes(q) ||
      c.about.toLowerCase().includes(q);
    return { faang_plus: data.faang_plus.filter(match), ai_startup: data.ai_startup.filter(match) };
  }, [data, search]);

  const totalCompanies = (filtered?.faang_plus.length ?? 0) + (filtered?.ai_startup.length ?? 0);
  const totalRoles = [...(filtered?.faang_plus ?? []), ...(filtered?.ai_startup ?? [])].reduce((s, c) => s + c.open_roles, 0);

  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-600 via-indigo-700 to-indigo-800 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-indigo-200 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              31 companies tracked
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">Company Directory</h1>
            <p className="text-indigo-200 text-lg">
              Explore FAANG++, big tech, and leading AI startups. Interview loops, TC ranges, and live job counts.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 pb-16">
        {/* Search + stats bar */}
        <div className="card px-5 py-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all"
            />
          </div>
          {!loading && data && (
            <p className="text-sm text-slate-500">
              <span className="font-bold text-slate-900">{totalCompanies}</span> companies ·{" "}
              <span className="font-bold text-slate-900">{totalRoles}</span> open SWE roles
            </p>
          )}
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="card p-5 animate-pulse space-y-3">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 bg-slate-100 rounded-full w-3/4" />
                    <div className="h-3 bg-slate-100 rounded-full w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-slate-100 rounded-full" />
                <div className="h-3 bg-slate-100 rounded-full w-5/6" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="card p-8 text-center">
            <p className="text-rose-500 font-medium mb-1">Failed to load companies</p>
            <p className="text-slate-400 text-sm">{error}</p>
          </div>
        )}

        {filtered && (
          <div className="space-y-12">
            <TierGrid title="FAANG++ & Big Tech" icon="🏆" companies={filtered.faang_plus} />
            <TierGrid title="Leading AI Startups" icon="🚀" companies={filtered.ai_startup} />
            {totalCompanies === 0 && (
              <div className="card py-16 text-center">
                <p className="text-slate-400">No companies match "{search}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
