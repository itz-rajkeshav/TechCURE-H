import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PrioritiesView } from "@/components/dashboard/PrioritiesView";

export const Route = createFileRoute("/priorities")({
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
      <PrioritiesView />
    </DashboardLayout>
  );
}
