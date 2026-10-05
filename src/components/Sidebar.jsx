import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  // Për momentin lexojmë user-in nga localStorage.
  // Kur lidhim Login.jsx, do ta ruajmë aty pas login-it.
  let user = null;

  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const isAdmin = user?.role === "admin";

  const menuClass = ({ isActive }) =>
    `mb-2 block rounded-lg px-4 py-3 transition ${
      isActive
        ? "bg-slate-700 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", { replace: true });
  }

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col bg-slate-900 text-white">

      {/* LOGO / TITULLI */}
      <div className="flex h-20 items-center border-b border-slate-700 px-6">
        <div>
          <h1 className="text-xl font-bold">
            Prania Besnike
          </h1>

          <p className="mt-1 text-xs text-slate-400">
            Sistemi i menaxhimit
          </p>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 p-4">

        <NavLink
          to="/dashboard"
          className={menuClass}
        >
          Pasqyra
        </NavLink>

        <NavLink
          to="/regjistri"
          className={menuClass}
        >
          Regjistri
        </NavLink>

        {/*
        <NavLink
          to="/ankesa/shto"
          className={menuClass}
        >
          + Shto ankesë
        </NavLink>
        */}

        {/* ADMIN */}
        {isAdmin && (
          <>
            <div className="my-4 border-t border-slate-700" />

            <NavLink
              to="/perdoruesit"
              className={menuClass}
            >
              Përdoruesit
            </NavLink>
          </>
        )}

        {/* ADMIN + USER */}
        <NavLink
          to="/cilesimet"
          className={menuClass}
        >
          Cilësimet
        </NavLink>

      </nav>

      {/* USER / LOGOUT */}
      <div className="border-t border-slate-700 p-4">

        {user && (
          <div className="mb-3 px-4">
            <p className="truncate text-sm font-medium text-white">
              {user.username}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {isAdmin ? "Administrator" : "Përdorues"}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="
            w-full
            rounded-lg
            px-4
            py-3
            text-left
            text-sm
            text-slate-300
            transition
            hover:bg-red-500/10
            hover:text-red-300
          "
        >
          Dil
        </button>

      </div>
    </aside>
  );
}

export default Sidebar;