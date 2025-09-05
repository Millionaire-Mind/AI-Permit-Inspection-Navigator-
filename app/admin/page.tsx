import dynamic from "next/dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const AdminDashboard = dynamic(() => import("@/components/admin/AdminDashboard"), { ssr: false });

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role ?? '').toUpperCase() !== 'ADMIN') {
    return null;
  }
  return <AdminDashboard />;
}
