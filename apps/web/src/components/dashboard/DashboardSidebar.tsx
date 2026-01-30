import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
  const navItems = [
    { label: "Overview", icon: "dashboard", href: "/dashboard", active: true },
    { label: "Study Path", icon: "map", href: "/dashboard", active: false },
    { label: "Priorities", icon: "priority_high", href: "/dashboard", active: false },
    { label: "Insights", icon: "lightbulb", href: "/dashboard", active: false },
    { label: "Dependencies", icon: "account_tree", href: "/dashboard", active: false },
    { label: "Progress", icon: "bar_chart", href: "/dashboard", active: false },
    { label: "Study Assistant", icon: "chat_bubble", href: "/dashboard", active: false },
    { label: "Change Context", icon: "swap_horiz", href: "/change-context", active: false },
  ];

  return (
    <aside className="w-64 border-r border-[#e7ebf3] bg-white hidden lg:flex flex-col p-4 shrink-0 min-h-[calc(100vh-65px)]">
      <div className="flex flex-col gap-6">
        <div className="px-3">
          <h1 className="text-base font-bold text-[#0d121b]">Academic Planning</h1>
          <p className="text-xs text-[#4c669a]">Student Dashboard</p>
        </div>
        
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                item.active 
                  ? "bg-[#e7ebf3] text-[#135bec]" 
                  : "text-[#4c669a] hover:bg-[#f6f6f8]"
              )}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <p className={cn("text-sm", item.active ? "font-semibold" : "font-medium")}>
                {item.label}
              </p>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
