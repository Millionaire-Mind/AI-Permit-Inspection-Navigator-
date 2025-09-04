"use client";

export default function TipsPanel({ tips }: { tips: string[] }) {
  return (
    <div className="border rounded p-4 bg-white">
      <h3 className="text-lg font-semibold mb-2">Tips</h3>
      <ul className="list-disc pl-5 text-sm text-gray-800">
        {tips.map((t, i) => (<li key={i} className="mb-1">{t}</li>))}
      </ul>
    </div>
  );
}

