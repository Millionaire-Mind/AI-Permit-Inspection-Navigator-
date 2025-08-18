import Sidebar from "@/components/Sidebar";
import ReportForm from "@/components/ReportForm";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-[240px_1fr] gap-6">
      <Sidebar />
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <ReportForm />
      </div>
    </div>
  );
}
