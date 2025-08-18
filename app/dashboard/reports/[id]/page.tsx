import ReportTimeline from "@/components/ReportTimeline";
import AppealForm from "@/components/AppealForm";

export default async function ReportDetail({ params }: { params: { id: string }}) {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Report Detail</h1>
      <ReportTimeline reportId={params.id} />
      <AppealForm reportId={params.id} />
    </div>
  );
}
