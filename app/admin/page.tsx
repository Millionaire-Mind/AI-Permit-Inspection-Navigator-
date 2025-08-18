import Scorecard from "@/components/Scorecard";
import SLAWidgets from "@/components/SLAWidgets";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <SLAWidgets />
      <Scorecard />
    </div>
  );
}
