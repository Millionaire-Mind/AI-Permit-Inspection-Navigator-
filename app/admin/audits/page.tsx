import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export default async function Audits() {
  const session: any = await getServerSession(authOptions as any);
  if (!session || (session.user.role ?? '').toUpperCase() !== 'ADMIN') {
    return null;
  }
  const client: any = prisma as any;
  const rows = client.audit?.findMany ? await client.audit.findMany({ orderBy: { createdAt: 'desc' }, take: 200 }) : [];
  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">Audit Trail</h1>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Timestamp</th>
            <th className="p-2 text-left">User</th>
            <th className="p-2 text-left">Action</th>
            <th className="p-2 text-left">Detail</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r: any) => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{new Date(r.createdAt).toLocaleString()}</td>
              <td className="p-2">{r.actor ?? 'system'}</td>
              <td className="p-2">{r.action}</td>
              <td className="p-2"><pre className="whitespace-pre-wrap break-words">{JSON.stringify(r.detail ?? {}, null, 0)}</pre></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
