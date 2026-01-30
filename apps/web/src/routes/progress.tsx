import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProgressView } from "@/components/dashboard/ProgressView";

export const Route = createFileRoute("/progress")({
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
      <ProgressView />
    </DashboardLayout>
  );
}
