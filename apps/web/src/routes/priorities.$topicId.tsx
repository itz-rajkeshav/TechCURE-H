import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PriorityDetailView } from "@/components/dashboard/PriorityDetailView";

export const Route = createFileRoute("/priorities/$topicId")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      redirect({
        to: "/login",
        throw: true,
      });
    }
    return { session };
  },
});

function RouteComponent() {
  const { topicId } = Route.useParams();
  
  return (
    <DashboardLayout>
      <PriorityDetailView topicId={topicId} />
    </DashboardLayout>
  );
}
