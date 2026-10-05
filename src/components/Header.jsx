import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [open, setOpen] = useState(false);

  let user = null;

  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const username = user?.username || "Përdorues";
  const isAdmin = user?.role === "admin";

  const initial = username
    ? username.charAt(0).toUpperCase()
    : "P";

  // Mbyll dropdown-in kur klikon jashtë
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleSettings() {
    setOpen(false);
    navigate("/cilesimet");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setOpen(false);

    navigate("/", {
      replace: true,
    });
  }

  return (
    <header className="relative flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6">

      {/* TITULLI */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          Prania Besnike
        </h2>

        <p className="text-sm text-slate-500">
          Regjistri i ankesave
        </p>
      </div>

      {/* USER */}
      <div
        ref={dropdownRef}
        className="relative"
      >
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="
            flex
            items-center
            gap-3
            rounded-xl
            px-2
            py-1.5
            transition
            hover:bg-slate-50
          "
        >
          {/* USER INFO */}
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-800">
              {username}
            </p>

            <p className="text-xs text-slate-500">
              {isAdmin ? "Administrator" : "Përdorues"}
            </p>
          </div>

          {/* AVATAR */}
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-slate-900
              font-semibold
              text-white
              shadow-sm
            "
          >
            {initial}
          </div>

          {/* ARROW */}
          <svg
            className={`h-4 w-4 text-slate-400 transition-transform ${
              open ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* DROPDOWN */}
        {open && (
          <div
            className="
              absolute
              right-0
              top-14
              z-50
              w-64
              overflow-hidden
              rounded-xl
              border
              border-slate-200
              bg-white
              shadow-xl
            "
          >

            {/* PROFILE INFO */}
            <div className="border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 font-semibold text-white">
                  {initial}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {username}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {isAdmin
                      ? "Administrator · Pamje e plotë"
                      : "Përdorues"}
                  </p>
                </div>

              </div>
            </div>

            {/* SETTINGS */}
            <div className="p-2">
              <button
                type="button"
                onClick={handleSettings}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-lg
                  px-3
                  py-2.5
                  text-left
                  text-sm
                  text-slate-700
                  transition
                  hover:bg-slate-100
                "
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                  ⚙
                </span>

                <div>
                  <p className="font-medium">
                    Cilësimet
                  </p>

                  <p className="text-xs text-slate-400">
                    Menaxho llogarinë
                  </p>
                </div>
              </button>
            </div>

            {/* LOGOUT */}
            <div className="border-t border-slate-100 p-2">
              <button
                type="button"
                onClick={handleLogout}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-lg
                  px-3
                  py-2.5
                  text-left
                  text-sm
                  font-medium
                  text-red-600
                  transition
                  hover:bg-red-50
                "
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                  ↪
                </span>

                Dil nga sistemi
              </button>
            </div>

          </div>
        )}

      </div>
    </header>
  );
}

export default Header;