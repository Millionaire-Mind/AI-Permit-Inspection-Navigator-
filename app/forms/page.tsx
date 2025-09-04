export default function FormsPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Forms</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a className="border rounded p-4 bg-white hover:bg-gray-50" href="#">Electrical Permit Application</a>
        <a className="border rounded p-4 bg-white hover:bg-gray-50" href="#">Plumbing Permit Application</a>
        <a className="border rounded p-4 bg-white hover:bg-gray-50" href="#">Mechanical Permit Application</a>
        <a className="border rounded p-4 bg-white hover:bg-gray-50" href="#">Residential Building Permit</a>
      </div>
    </div>
  );
}

