import Link from "next/link";

export default function Home() {
  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-bold">AI Permit & Inspection Navigator</h1>
      <p>End-to-end permitting + moderation with trust, explainability, and SLAs.</p>
      <div className="space-x-4">
        <Link href="/login" className="underline">Login (pick role)</Link>
        <Link href="/dashboard" className="underline">Dashboard</Link>
        <Link href="/moderator/review" className="underline">Moderator Review</Link>
        <Link href="/admin" className="underline">Admin</Link>
      </div>
    </main>
  );
}
