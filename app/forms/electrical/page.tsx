import Card, { CardBody, CardHeader } from "../../../components/ui/Card";
import { Zap } from "lucide-react";

export default function ElectricalFormPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Zap className="h-6 w-6" /> Electrical Permit Application
      </h1>
      <Card>
        <CardHeader>
          <div className="font-semibold">Form Details</div>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            This is a scaffold for the Electrical Permit Application. Add fields and validation here.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}

