"use client";

import { useState } from "react";
import Scorecard from "@/components/Scorecard";
import SLAWidgets from "@/components/SLAWidgets";
import { ForecastTrendGraph } from "@/components/admin/ForecastTrendGraph";
import { ForecastLogCard } from "@/components/admin/ForecastLogCard";
import dynamic from "next/dynamic";
import AdminFilters, { AdminFilters as AdminFiltersType } from "@/components/admin/AdminFilters";
import AlertTimeline from "@/components/admin/AlertTimeline";

const RetrainAdmin = dynamic(() => import("@/components/admin/RetrainAdmin"), { ssr: false });
const ModelCanary = dynamic(() => import("@/components/admin/ModelCanary"), { ssr: false });

export default function AdminDashboard() {
  const [filters, setFilters] = useState<AdminFiltersType>({});

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <AdminFilters onChange={setFilters} />
      <SLAWidgets filters={filters} />
      <Scorecard />
      <ForecastTrendGraph />
      <ForecastLogCard />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RetrainAdmin />
        <ModelCanary />
      </div>
      <AlertTimeline filters={filters} />
    </div>
  );
}

