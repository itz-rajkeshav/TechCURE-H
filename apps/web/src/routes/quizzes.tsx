import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useAppStore } from "@/store/appStore";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { QuizView } from "@/components/dashboard/QuizView";

export const Route = createFileRoute("/quizzes")({
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
      <QuizView />
    </DashboardLayout>
  );
}