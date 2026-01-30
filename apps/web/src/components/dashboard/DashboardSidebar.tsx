import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
  const location = useLocation();

  const navItems = [
    { label: "Overview", icon: "dashboard", href: "/dashboard" },
    { label: "Study Path", icon: "map", href: "/study-path" },
    { label: "Priorities", icon: "priority_high", href: "/priorities" },
    { label: "Progress & Stats", icon: "bar_chart", href: "/progress" },
    { label: "Study Assistant", icon: "smart_toy", href: "/study-assistant" },
    { label: "Insights", icon: "lightbulb", href: "/insights" },
    { label: "Mind Map", icon: "account_tree", href: "/mind-map" },
  ];

  return (
    <aside className="w-64 border-r border-[#e7ebf3] bg-white hidden lg:flex flex-col p-4 shrink-0 min-h-[calc(100vh-65px)]">
      <div className="flex flex-col gap-6">
        <div className="px-3">
          <h1 className="text-base font-bold text-[#0d121b]">Academic Planning</h1>
          <p className="text-xs text-[#4c669a]">Intelligent Learning Platform</p>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-[#e7ebf3] text-[#135bec]"
                    : "text-[#4c669a] hover:bg-[#f6f6f8]"
                )}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <p className={cn("text-sm", isActive ? "font-semibold" : "font-medium")}>
                  {item.label}
                </p>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
