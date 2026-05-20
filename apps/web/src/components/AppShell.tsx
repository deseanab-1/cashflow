import { NavLink, Outlet } from "react-router-dom";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-md px-3 py-2 text-sm transition",
    isActive ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5",
  ].join(" ");

export function AppShell() {
  return (
    <div className="min-h-full bg-gray-100 text-slate-100">
      <header className="border-b bg-green-600 border-white/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="font-semibold tracking-tight">Cash Flow</div>
          <nav className="flex items-center gap-1">
            <NavLink to="/dashboard" end className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/transactions" className={navLinkClass}>
              Transactions
            </NavLink>
            <NavLink to="/budgets" className={navLinkClass}>
              Budgets
            </NavLink>
            <NavLink to="/settings" className={navLinkClass}>
              Settings
            </NavLink>
            <NavLink to="/logout" className={navLinkClass}>
              Logout
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <Outlet />
      </main>
    </div>
  );
}

