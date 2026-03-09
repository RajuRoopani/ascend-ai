import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCompany } from "@/lib/api";
import { LevelBadge } from "@/components/jobs/LevelBadge";
import { RemotePill } from "@/components/jobs/RemotePill";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params;
  let company;
  try {
    company = await getCompany(slug);
  } catch {
    return notFound();
  }

  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 pt-10 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 text-sm flex items-center gap-2 text-slate-400">
            <Link href="/companies" className="hover:text-white transition-colors">Companies</Link>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-300">{company.name}</span>
          </nav>

          <div className="flex items-start gap-5">
            <div className="w-18 h-18 w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
              {company.logo_url ? (
                <Image src={company.logo_url} alt={company.name} width={64} height={64} className="object-contain p-2" />
              ) : (
                <span className="text-2xl font-bold text-white/40">{company.name[0]}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-extrabold text-white tracking-tight">{company.name}</h1>
                <span className={`badge ${company.tier === "faang_plus" ? "bg-amber-400/20 text-amber-300" : "bg-violet-400/20 text-violet-300"}`}>
                  {company.tier === "faang_plus" ? "FAANG+" : "AI Startup"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <span>📍 {company.hq}</span>
                <span>·</span>
                <span>👥 {company.size} employees</span>
                <span>·</span>
                <span className={company.open_roles > 0 ? "text-emerald-400 font-semibold" : ""}>
                  {company.open_roles} open {company.open_roles === 1 ? "role" : "roles"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 pb-16 space-y-5">
        {/* About */}
        <div className="card p-6">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">About</h2>
          <p className="text-slate-700 leading-relaxed">{company.about}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Interview loop */}
          {company.loop_desc && (
            <div className="card p-6">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span>🔄</span> Interview Loop
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">{company.loop_desc}</p>
            </div>
          )}

          {/* Comp */}
          {company.comp_range && (
            <div className="card p-6">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span>💰</span> Total Compensation
              </h2>
              <div className="space-y-2">
                {company.comp_range.split("|").map((range, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                    <p className="text-sm text-slate-700">{range.trim()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Open roles */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <span>💼</span> Open SWE Roles ({company.open_roles})
            </h2>
            {company.open_roles > 0 && (
              <Link href={`/?company=${company.id}`} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                View all →
              </Link>
            )}
          </div>

          {company.jobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm">No open SWE roles right now</p>
              <p className="text-slate-300 text-xs mt-1">Jobs refresh every 6 hours</p>
            </div>
          ) : (
            <div className="space-y-2">
              {company.jobs.map((job) => (
                <div key={job.id} className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <LevelBadge level={job.level} />
                    <span className="text-sm font-medium text-slate-800 truncate group-hover:text-indigo-700 transition-colors">
                      {job.title}
                    </span>
                    <RemotePill remote={job.remote} />
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link href={`/jobs/${job.id}`} className="btn-primary text-xs py-1.5 px-3">
                      Prep ✨
                    </Link>
                    <a href={job.url} target="_blank" rel="noopener noreferrer" className="btn-ghost text-xs py-1.5 px-3">
                      Apply
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
