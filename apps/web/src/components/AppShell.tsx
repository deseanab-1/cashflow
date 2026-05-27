import { NavLink, Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Spin } from "antd";


const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-md px-3 py-2 text-sm transition",
    isActive ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5",
  ].join(" ");

export function AppShell() {
  const { logout, isAuthenticated, isLoading } = useAuth0();
  const location = useLocation();

  const publicPaths = ["/", "/register"];
  const isPublicPath = publicPaths.includes(location.pathname);

  if (isLoading) {
    return <Spin/>;
  }

  return (
    <div className="min-h-full bg-gray-100 text-slate-800">
      <header className="border-b bg-green-600 border-white/10 text-slate-100">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="font-semibold tracking-tight text-white">Cash Flow</div>
          <nav className="flex items-center gap-1">
            {isAuthenticated && (
              <>
                <NavLink to="/dashboard" end className={navLinkClass}>Dashboard</NavLink>
                <NavLink to="/transactions" className={navLinkClass}>Transactions</NavLink>
                <NavLink to="/budgets" className={navLinkClass}>Budgets</NavLink>
                <NavLink to="/settings" className={navLinkClass}>Settings</NavLink>
                <button
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                  className="rounded-md px-3 py-2 text-sm transition text-slate-300 hover:bg-white/5 cursor-pointer"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        {isPublicPath || isAuthenticated ? (
          <Outlet />
        ) : (
          <Navigate to="/" replace />
        )}
      </main>
    </div>
  );
}