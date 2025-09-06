import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import ReportForm from "@/components/ReportForm";
import QuickSuggestionBanner from "@/components/QuickSuggestionBanner";
import Card, { CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import InspectionsTimeline from "@/components/InspectionsTimeline";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-[240px_1fr] gap-6">
      <Sidebar />
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <QuickSuggestionBanner />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardBody>
              <div className="text-sm text-gray-600">Active Projects</div>
              <div className="text-2xl font-semibold">—</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="text-sm text-gray-600">Upcoming Inspections</div>
              <div className="text-2xl font-semibold">—</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="text-sm text-gray-600">Open Appeals</div>
              <div className="text-2xl font-semibold">—</div>
            </CardBody>
          </Card>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/projects"><Button size="sm">New Project</Button></Link>
          <Link href="/forms"><Button variant="secondary" size="sm">Find Forms</Button></Link>
          <Link href="/ask-ai"><Button variant="secondary" size="sm">Ask AI</Button></Link>
        </div>

        <ReportForm />

        <InspectionsTimeline />
      </div>
    </div>
  );
}
