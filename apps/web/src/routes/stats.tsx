import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useAppStore } from "@/store/appStore";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { UserStatsPanel } from "@/components/dashboard/UserStatsPanel";

export const Route = createFileRoute("/stats")({
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
  const { initializeDefaults } = useAppStore();
  
  // Initialize defaults on first load
  useEffect(() => {
    initializeDefaults();
  }, [initializeDefaults]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Learning Stats</h1>
          <p className="text-muted-foreground">Track your progress and achievements</p>
        </div>
        <UserStatsPanel />
      </div>
    </DashboardLayout>
  );
}