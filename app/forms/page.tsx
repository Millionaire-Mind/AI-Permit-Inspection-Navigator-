import Link from "next/link";
import Card, { CardBody } from "../../components/ui/Card";
import { Droplets, Home, Settings, Zap } from "lucide-react";

const forms = [
  {
    title: "Electrical Permit Application",
    href: "/forms/electrical",
    Icon: Zap,
  },
  {
    title: "Plumbing Permit Application",
    href: "/forms/plumbing",
    Icon: Droplets,
  },
  {
    title: "Mechanical Permit Application",
    href: "/forms/mechanical",
    Icon: Settings,
  },
  {
    title: "Residential Building Permit",
    href: "/forms/residential",
    Icon: Home,
  },
];

export default function FormsPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Forms</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {forms.map(({ title, href, Icon }) => (
          <Link key={href} href={href} className="group">
            <Card className="hover:shadow-lg transition-shadow">
              <CardBody className="flex items-center gap-4">
                <div className="rounded-md p-2 bg-gray-100 text-gray-700 group-hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:group-hover:bg-gray-700">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="font-medium group-hover:text-gray-900 dark:group-hover:text-gray-100">
                  {title}
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

