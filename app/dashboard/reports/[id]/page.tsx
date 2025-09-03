import ReportTimeline from "@/components/ReportTimeline";
import { prisma } from "@/lib/prisma";

export default async function ReportDetail({ params }: { params: { id: string }}) {
  const report = await prisma.report.findUnique({ where: { id: params.id } });
  if (!report) return <div className="p-4">Not found</div> as any;
  return (
    <div className="p-4 space-y-4">
      <div className="text-xl font-semibold">Report {report.id}</div>
      <div className="text-sm text-gray-700">Status: {report.status}</div>
      <ReportTimeline reportId={report.id} />
    </div>
  );
}
