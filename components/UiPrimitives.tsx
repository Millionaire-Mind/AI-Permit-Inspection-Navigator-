export function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white border rounded shadow-sm p-4">{children}</div>;
}
export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold mb-2">{children}</h2>;
}
