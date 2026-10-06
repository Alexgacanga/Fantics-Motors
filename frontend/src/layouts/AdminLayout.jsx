import { CarFront, LogOut } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="border-b border-white/10 bg-[#111111]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <NavLink
            to="/admin/vehicles"
            className="flex min-w-0 items-center gap-3"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#0066FF]/15 text-[#0066FF]">
              <CarFront aria-hidden="true" size={22} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold sm:text-base">
                Fantics Cars
              </span>
              <span className="block text-xs text-gray-400">
                Administration
              </span>
            </span>
          </NavLink>

          <nav
            aria-label="Admin navigation"
            className="order-3 flex w-full gap-2 sm:order-none sm:w-auto"
          >
            <NavLink
              to="/admin/vehicles"
              className={({ isActive }) =>
                `inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors ${isActive ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`
              }
            >
              <CarFront aria-hidden="true" size={17} />
              Vehicles
            </NavLink>
          </nav>

          <div className="ml-auto flex min-w-0 items-center gap-3 sm:ml-0">
            <span className="hidden max-w-48 truncate text-sm text-gray-400 md:block">
              {user?.email || user?.username || "Administrator"}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Log out"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/15 px-3 text-sm font-semibold text-gray-200 transition-colors hover:border-[#0066FF] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]"
            >
              <LogOut aria-hidden="true" size={16} />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
