import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">SWE Prep</p>
              <p className="text-xs text-slate-400">AI-powered interview preparation</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link href="/" className="hover:text-slate-600 transition-colors">Jobs</Link>
            <Link href="/companies" className="hover:text-slate-600 transition-colors">Companies</Link>
            <span>Powered by Claude Opus</span>
            <span>·</span>
            <span>Greenhouse · Lever · Ashby</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
