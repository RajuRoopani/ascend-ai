import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getJob } from "@/lib/api";
import { LevelBadge } from "@/components/jobs/LevelBadge";
import { RemotePill } from "@/components/jobs/RemotePill";
import { PrepAccordion } from "@/components/prep/PrepAccordion";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const jobId = Number(id);
  if (isNaN(jobId)) return notFound();

  let job;
  try {
    job = await getJob(jobId);
  } catch {
    return notFound();
  }

  return (
    <>
      {/* Hero strip */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 pt-10 pb-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 text-sm flex items-center gap-2 text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Jobs</Link>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <Link href={`/companies/${job.company_slug}`} className="hover:text-white transition-colors">
              {job.company_name}
            </Link>
          </nav>

          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
              {job.company_logo_url ? (
                <Image src={job.company_logo_url} alt={job.company_name} width={64} height={64} className="object-contain p-2" />
              ) : (
                <span className="text-2xl font-bold text-white/40">{job.company_name[0]}</span>
              )}
            </div>
            <div className="flex-1">
              <p className="text-slate-400 text-sm mb-1">{job.company_name}</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <LevelBadge level={job.level} />
                <RemotePill remote={job.remote} />
                {job.location && (
                  <span className="badge bg-white/10 text-slate-300">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {job.location}
                  </span>
                )}
                {job.department && (
                  <span className="badge bg-white/10 text-slate-300">{job.department}</span>
                )}
              </div>
            </div>
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-all shadow"
            >
              Apply Now
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 pb-16 space-y-5">
        {/* Mobile apply */}
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="sm:hidden w-full btn-primary justify-center py-3"
        >
          Apply Now →
        </a>

        {/* AI Prep */}
        <PrepAccordion jobId={jobId} />

        {/* Job Description */}
        {job.description && (
          <div className="card p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Job Description
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>
        )}
      </div>
    </>
  );
}
