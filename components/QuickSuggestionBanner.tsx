"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";

type Suggestion = {
  id: string;
  text: string;
  actionLabel?: string;
  actionHref?: string;
};

const DEFAULT_SUGGESTIONS: Suggestion[] = [
  { id: "zoning", text: "Zoning check recommended for this address.", actionLabel: "Run Check", actionHref: "/ask-ai" },
  { id: "docs", text: "Upload required site plan to avoid delays.", actionLabel: "Upload", actionHref: "/forms" },
];

export default function QuickSuggestionBanner() {
  const [sug, setSug] = useState<Suggestion | null>(null);

  useEffect(() => {
    // Placeholder: in future, fetch personalized suggestions
    const pick = DEFAULT_SUGGESTIONS[Math.floor(Math.random() * DEFAULT_SUGGESTIONS.length)];
    setSug(pick);
  }, []);

  if (!sug) return null;
  return (
    <Alert variant="info" className="flex items-center justify-between">
      <div className="text-sm">
        <span className="font-medium">Quick Suggestion:</span> {sug.text}
      </div>
      {sug.actionHref && (
        <Button variant="secondary" size="sm" onClick={() => (window.location.href = sug.actionHref!)}>
          {sug.actionLabel || "Open"}
        </Button>
      )}
    </Alert>
  );
}

