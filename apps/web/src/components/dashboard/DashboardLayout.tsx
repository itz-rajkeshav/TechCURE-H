import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#f6f6f8] font-display text-[#0d121b]">
       <DashboardHeader />
       <div className="flex flex-1 w-full">
          <DashboardSidebar />
          <main className="flex-1 p-6 md:p-10">
            {children}
          </main>
       </div>
    </div>
  );
}
