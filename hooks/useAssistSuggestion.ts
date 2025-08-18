import { useEffect, useState } from "react";

type Suggestion = {
  category: string;
  confidence: number;
  rationale: string;
  slaUrgency: "low" | "medium" | "high";
  id?: string;
};

export function useAssistSuggestion(appealId?: string, content?: string, moderatorId?: string) {
  const [data, setData] = useState<Suggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!appealId || !content || !moderatorId) return;
    setLoading(true);
    setError(null);
    fetch("/api/moderation/assist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appealId, content, context: { moderatorId } })
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setData(json.suggestion);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [appealId, content, moderatorId]);

  return { data, loading, error };
}
