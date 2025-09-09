import Card, { CardBody, CardHeader } from "../../../components/ui/Card";
import { Home } from "lucide-react";

export default function ResidentialFormPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Home className="h-6 w-6" /> Residential Building Permit
      </h1>
      <Card>
        <CardHeader>
          <div className="font-semibold">Form Details</div>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            This is a scaffold for the Residential Building Permit. Add fields and validation here.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}

