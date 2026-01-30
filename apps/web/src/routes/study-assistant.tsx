import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StudyAssistantView } from "@/components/dashboard/StudyAssistantView";

export const Route = createFileRoute("/study-assistant")({
  component: StudyAssistant,
});

function StudyAssistant() {
  return (
    <DashboardLayout>
      <StudyAssistantView />
    </DashboardLayout>
  );
}
