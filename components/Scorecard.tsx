"use client";

import { Card, SectionTitle } from "./UiPrimitives";
import ForecastChart from "./ForecastChart";

export default function Scorecard() {
  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle>Moderator Scorecard (Demo)</SectionTitle>
        <div className="text-sm">Handled: 42 • Avg Response: 31m • Reversals: 3 • SLA Breach: 9%</div>
      </Card>
      <ForecastChart />
    </div>
  );
}
