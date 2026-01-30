import { Link, useLocation } from "@tanstack/react-router";

import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isDashboardRelated = ["/study-path", "/priorities", "/insights", "/dependencies", "/progress", "/change-context"].includes(location.pathname);

  if (isHome || isDashboard || isDashboardRelated) {
    return null;
  }

  const links = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
  ] as const;

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-2 py-1">
        <nav className="flex gap-4 text-lg">
          {links.map(({ to, label }) => {
            return (
              <Link key={to} to={to}>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
      <hr />
    </div>
  );
}
