import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useAppStore } from "@/store/appStore";
import { SubjectSelector } from "@/components/shared/SubjectSelector";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { OverviewView } from "@/components/dashboard/OverviewView";

export const Route = createFileRoute("/dashboard")({
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
  const { selectedSubject, initializeDefaults } = useAppStore();
  
  // Initialize defaults on first load
  useEffect(() => {
    initializeDefaults();
  }, [initializeDefaults]);

  return (
    <DashboardLayout>
        <OverviewView />
    </DashboardLayout>
  );
}
