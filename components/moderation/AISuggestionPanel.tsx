import React, { useState } from "react";
import { CheckCircle2, XCircle, Loader2, AlertTriangle } from "lucide-react";

type Props = {
  category?: string;
  confidence?: number;
  rationale?: string;
  slaUrgency?: "low" | "medium" | "high";
  loading?: boolean;
  error?: string | null;
  appealId?: string;
  moderatorId?: string;
  suggestionId?: string;
};

export const AISuggestionPanel: React.FC<Props> = ({ category, confidence, rationale, slaUrgency, loading, error, appealId, moderatorId, suggestionId }) => {
  const [feedback, setFeedback] = useState<"accepted" | "rejected" | null>(null);
  const [sending, setSending] = useState(false);

  const sendFeedback = async (decision: "accepted" | "rejected") => {
    if (!appealId || !moderatorId) return;
    setSending(true);
    try {
      await fetch("/api/moderation/assist/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appealId,
          suggestion: { id: suggestionId, category, confidence, rationale },
          moderatorId,
          decision
        })
      });
      setFeedback(decision);
    } catch (err) {
      console.error("feedback error", err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50 flex items-center space-x-2">
        <Loader2 className="animate-spin h-5 w-5 text-gray-500" />
        <span className="text-sm text-gray-600">Generating AI suggestion...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border rounded-lg bg-red-50 flex items-center space-x-2">
        <AlertTriangle className="h-5 w-5 text-red-500" />
        <span className="text-sm text-red-700">AI suggestion failed: {error}</span>
      </div>
    );
  }

  if (!category) return null;

  const urgencyColors: Record<string, string> = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800"
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-800">AI Suggestion</h3>
        <span className={`px-2 py-0.5 text-xs rounded-full ${urgencyColors[slaUrgency || "low"]}`}>{(slaUrgency || "low").toUpperCase()}</span>
      </div>
      <div>
        <p className="text-sm text-gray-600">
          <strong>Category:</strong> {category} ({(confidence ?? 0) * 100}%)
        </p>
        <p className="text-xs text-gray-500 mt-1">{rationale}</p>
      </div>

      {feedback ? (
        <div className="flex items-center space-x-2 text-sm">
          {feedback === "accepted" ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
          <span className="font-medium">{feedback === "accepted" ? "Suggestion accepted" : "Suggestion rejected"}</span>
        </div>
      ) : (
        <div className="flex space-x-2">
          <button disabled={sending} onClick={() => sendFeedback("accepted")} className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50">
            Accept
          </button>
          <button disabled={sending} onClick={() => sendFeedback("rejected")} className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50">
            Reject
          </button>
        </div>
      )}
    </div>
  );
};
