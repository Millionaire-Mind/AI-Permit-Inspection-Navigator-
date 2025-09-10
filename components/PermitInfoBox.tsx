"use client";

type PermitInfo = {
  permitType: string;
  requirements: string[];
  timeline: string;
  fees: string;
  confidence?: number;
};

export default function PermitInfoBox({ permitType, requirements, timeline, fees, confidence }: PermitInfo) {
  return (
    <div className="border rounded p-4 bg-white">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Permit Information</h3>
        <div className="flex items-center gap-2">
          {typeof confidence === 'number' && (
            <span className="text-xs px-2 py-0.5 rounded bg-green-50 text-green-800">AI Confidence: {Math.round(confidence * 100)}%</span>
          )}
          <span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded">{permitType}</span>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div className="p-3 bg-gray-50 rounded">
          <div className="text-gray-600 mb-1">Requirements</div>
          <ul className="list-disc pl-5">
            {requirements.map((r, i) => (<li key={i}>{r}</li>))}
          </ul>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <div className="text-gray-600 mb-1">Timeline</div>
          <div className="font-medium">{timeline}</div>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <div className="text-gray-600 mb-1">Fees</div>
          <div className="font-medium">{fees}</div>
        </div>
      </div>
    </div>
  );
}

