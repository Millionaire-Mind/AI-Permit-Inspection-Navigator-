import Card, { CardBody, CardHeader } from "../../../components/ui/Card";
import { Settings } from "lucide-react";

export default function MechanicalFormPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Settings className="h-6 w-6" /> Mechanical Permit Application
      </h1>
      <Card>
        <CardHeader>
          <div className="font-semibold">Form Details</div>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            This is a scaffold for the Mechanical Permit Application. Add fields and validation here.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}

