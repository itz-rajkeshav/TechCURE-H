import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { InsightsView } from "@/components/dashboard/InsightsView";

export const Route = createFileRoute("/insights")({
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
  return (
    <DashboardLayout>
      <InsightsView />
    </DashboardLayout>
  );
}
