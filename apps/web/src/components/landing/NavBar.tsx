import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function NavBar() {
  const navLinks = [
    { label: "METHODOLOGY", href: "#methodology" },
    { label: "INTELLIGENCE", href: "#intelligence" },
    { label: "ACCESS", href: "#access" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 backdrop-blur-md bg-white/80 border-b border-slate-200/60">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-white"
          >
            <path d="M22 10v6M2 10v6" />
            <path d="M20 22a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10l8-8 8 8Z" />
          </svg>
        </div>
        <span className="text-xl font-bold tracking-widest text-slate-900">LEARNPATH</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-xs font-medium tracking-widest text-slate-600 hover:text-blue-600 transition-colors duration-200"
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-6">
        <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
          Log in
        </Link>
        <Button 
            className="rounded-full bg-slate-900 px-6 py-2 text-xs font-bold tracking-widest text-white ring-1 ring-slate-900 hover:bg-slate-800 hover:shadow-lg transition-all duration-300"
        >
            INITIALIZE
        </Button>
      </div>
    </div>
  );
}
