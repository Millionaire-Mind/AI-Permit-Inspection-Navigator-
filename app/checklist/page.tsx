import Checklist from "@/components/Checklist";

export default function ChecklistPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Checklist</h1>
      <Checklist items={[
        { id: "1", label: "Verify zoning" },
        { id: "2", label: "Prepare site plan" },
        { id: "3", label: "Upload forms" },
        { id: "4", label: "Schedule inspection" },
      ]} />
    </div>
  );
}

