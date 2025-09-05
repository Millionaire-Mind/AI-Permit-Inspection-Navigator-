import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-2rem)] -mx-4 md:mx-0">
      {/* Header / Hero */}
      <section className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8 text-sm bg-gray-800 rounded-md px-4 py-2">
            <div className="text-white/90">PermitIQ</div>
            <Link href="/dashboard" className="text-white hover:opacity-90">Dashboard</Link>
          </div>
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">AI Permit & Inspection Navigator</h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              End-to-end permitting + moderation with trust, explainability, and SLAs.
            </p>
            <div>
              <Link href="/login" className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-accent text-white font-medium shadow hover:opacity-90">
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-900 py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 text-gray-200 rounded-lg shadow-md ring-1 ring-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-2 text-white">Faster Permitting</h3>
            <p className="text-sm text-gray-300">Automated guidance, form checks, and proactive alerts reduce back-and-forth.</p>
          </div>
          <div className="bg-gray-800 text-gray-200 rounded-lg shadow-md ring-1 ring-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-2 text-white">Explainable Moderation</h3>
            <p className="text-sm text-gray-300">Transparent AI reasoning with human-in-the-loop controls and audit trails.</p>
          </div>
          <div className="bg-gray-800 text-gray-200 rounded-lg shadow-md ring-1 ring-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-2 text-white">SLA Tracking</h3>
            <p className="text-sm text-gray-300">Real-time visibility with dashboards and alerts to meet service commitments.</p>
          </div>
        </div>
      </section>

      {/* User Types / Value Props */}
      <section className="bg-gray-900 py-6 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 text-gray-200 rounded-lg shadow-md ring-1 ring-gray-700 p-6">
            <h4 className="font-semibold mb-1 text-white">Contractors</h4>
            <p className="text-sm text-gray-300 mb-3">Fast submissions, fewer rejections, and clear next steps.</p>
            <Link href="/login?role=CONTRACTOR" className="inline-flex px-4 py-2 rounded-md bg-accent text-white text-sm">Choose Contractor</Link>
          </div>
          <div className="bg-gray-800 text-gray-200 rounded-lg shadow-md ring-1 ring-gray-700 p-6">
            <h4 className="font-semibold mb-1 text-white">Homeowners</h4>
            <p className="text-sm text-gray-300 mb-3">Friendly guidance from idea to inspection sign-off.</p>
            <Link href="/login?role=HOMEOWNER" className="inline-flex px-4 py-2 rounded-md bg-accent text-white text-sm">Choose Homeowner</Link>
          </div>
          <div className="bg-gray-800 text-gray-200 rounded-lg shadow-md ring-1 ring-gray-700 p-6">
            <h4 className="font-semibold mb-1 text-white">Moderators</h4>
            <p className="text-sm text-gray-300 mb-3">Explainable decisions, queues, and tools to resolve quickly.</p>
            <Link href="/login?role=MODERATOR" className="inline-flex px-4 py-2 rounded-md bg-accent text-white text-sm">Choose Moderator</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="opacity-80">© {new Date().getFullYear()} PermitIQ</div>
          <nav className="flex items-center gap-6">
            <Link href="#" className="hover:text-white">Pricing</Link>
            <Link href="#" className="hover:text-white">Contact</Link>
            <Link href="#" className="hover:text-white">Privacy</Link>
            <Link href="#" className="hover:text-white">Terms</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
