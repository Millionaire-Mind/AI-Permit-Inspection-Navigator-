import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Building
} from "lucide-react";
import Link from "next/link";

interface RecentActivityProps {
  reports: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: Date;
    project?: { name: string } | null;
    user?: { name: string } | null;
  }>;
  projects: Array<{
    id: string;
    name: string;
    status: string;
    createdAt: Date;
    user?: { name: string } | null;
  }>;
}

export function RecentActivity({ reports, projects }: RecentActivityProps) {
  // Combine and sort activities by creation date
  const activities = [
    ...reports.map(report => ({
      id: report.id,
      type: 'report' as const,
      title: report.title,
      project: report.project?.name || 'Unknown Project',
      time: report.createdAt,
      status: report.status.toLowerCase(),
      user: report.user?.name || 'Unknown User'
    })),
    ...projects.map(project => ({
      id: project.id,
      type: 'project' as const,
      title: project.name,
      project: project.name,
      time: project.createdAt,
      status: project.status.toLowerCase(),
      user: project.user?.name || 'Unknown User'
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
   .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'success';
      case 'pending':
      case 'draft':
        return 'secondary';
      case 'rejected':
        return 'danger';
      case 'in_review':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (type: 'report' | 'project', status: string) => {
    if (type === 'report') {
      switch (status) {
        case 'approved':
          return <CheckCircle className="h-4 w-4" />;
        case 'rejected':
          return <AlertTriangle className="h-4 w-4" />;
        case 'pending':
        case 'in_review':
          return <Clock className="h-4 w-4" />;
        default:
          return <FileText className="h-4 w-4" />;
      }
    } else {
      switch (status) {
        case 'completed':
          return <CheckCircle className="h-4 w-4" />;
        case 'cancelled':
          return <AlertTriangle className="h-4 w-4" />;
        case 'draft':
        case 'submitted':
        case 'in_review':
          return <Clock className="h-4 w-4" />;
        default:
          return <Building className="h-4 w-4" />;
      }
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <EmptyState
            icon={<Clock className="h-12 w-12" />}
            title="No recent activity"
            description="Activity will appear here as you work on projects and reports."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates from your projects and reports</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={`${activity.type}-${activity.id}`} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary-50 transition-colors">
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon(activity.type, activity.status)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-secondary-900">{activity.title}</p>
                <p className="text-sm text-secondary-600">
                  {activity.type === 'report' ? 'Report for ' : 'Project: '}{activity.project}
                </p>
                <p className="text-xs text-secondary-500">
                  by {activity.user} • {formatTimeAgo(activity.time)}
                </p>
              </div>
              <Badge variant={getStatusColor(activity.status) as any} size="sm">
                {activity.status.replace('_', ' ')}
              </Badge>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-secondary-200">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href="/dashboard/activity">
              View All Activity
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}