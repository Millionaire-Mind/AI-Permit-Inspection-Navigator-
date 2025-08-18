import React from "react";
import { AISuggestionPanel } from "./AISuggestionPanel";
import { useAssistSuggestion } from "@/hooks/useAssistSuggestion";

export const AppealReviewModal: React.FC<{ appeal: any; moderatorId: string }> = ({ appeal, moderatorId }) => {
  const { data, loading, error } = useAssistSuggestion(appeal?.id, appeal?.address ?? appeal?.content ?? "", moderatorId);

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded">
        <h2 className="text-lg font-bold">Appeal</h2>
        <p className="mt-2 text-gray-700">{appeal?.content ?? appeal?.address}</p>
      </div>

      <AISuggestionPanel
        category={data?.category}
        confidence={data?.confidence}
        rationale={data?.rationale}
        slaUrgency={data?.slaUrgency}
        loading={loading}
        error={error}
        appealId={appeal?.id}
        moderatorId={moderatorId}
        suggestionId={data?.id}
      />

      {/* Approve / Reject / Notes UI would go here */}
    </div>
  );
};
