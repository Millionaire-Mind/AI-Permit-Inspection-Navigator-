import Link from "next/link";
import { Droplets, Home, Zap, Cog } from "lucide-react";

export default function FormsPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Forms</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/forms/electrical" className="border rounded p-4 bg-white hover:bg-gray-50 flex items-center space-x-2">
          <Zap className="h-5 w-5" />
          <span>Electrical Permit Application</span>
        </Link>
        <Link href="/forms/plumbing" className="border rounded p-4 bg-white hover:bg-gray-50 flex items-center space-x-2">
          <Droplets className="h-5 w-5" />
          <span>Plumbing Permit Application</span>
        </Link>
        <Link href="/forms/mechanical" className="border rounded p-4 bg-white hover:bg-gray-50 flex items-center space-x-2">
          <Cog className="h-5 w-5" />
          <span>Mechanical Permit Application</span>
        </Link>
        <Link href="/forms/residential" className="border rounded p-4 bg-white hover:bg-gray-50 flex items-center space-x-2">
          <Home className="h-5 w-5" />
          <span>Residential Building Permit</span>
        </Link>
      </div>
    </div>
  );
}

