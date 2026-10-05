import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { api } from "../../backend/src/services/api";

export default function Users() {
  const [showModal, setShowModal] = useState(false);

  const [directorates, setDirectorates] = useState([]);
  const [loadingDirectorates, setLoadingDirectorates] = useState(true);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    username: "",
    password: "",
    directorate_id: "",
    role: "user",
  });

  // =========================================================
  // NGARKO DREJTORITË NGA BACKEND
  // =========================================================

useEffect(() => {
  async function loadData() {
    try {
      setLoadingDirectorates(true);
      setLoadingUsers(true);

      const [
        directoratesData,
        usersData,
      ] = await Promise.all([
        api.getDirectorates(),
        api.getUsers(),
      ]);

      setDirectorates(
        Array.isArray(directoratesData)
          ? directoratesData
          : []
      );

      setUsers(
        Array.isArray(usersData)
          ? usersData
          : []
      );
    } catch (error) {
      console.error(
        "Gabim gjatë ngarkimit:",
        error
      );
    } finally {
      setLoadingDirectorates(false);
      setLoadingUsers(false);
    }
  }

  loadData();
}, []);

  // =========================================================
  // FORM
  // =========================================================

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleRoleChange(e) {
    const role = e.target.value;

    setForm((prev) => ({
      ...prev,
      role,

      // Admin nuk lidhet me një drejtori
      directorate_id:
        role === "admin"
          ? ""
          : prev.directorate_id,
    }));
  }

  // =========================================================
  // MODAL
  // =========================================================

 function openModal() {
  setError("");

  setForm({
    username: "",
    password: "",
    directorate_id: "",
    role: "user",
  });

  setShowModal(true);
}

  function closeModal() {
    setShowModal(false);
  }

  // =========================================================
  // SAVE USER
  // =========================================================

async function handleSubmit(e) {
  e.preventDefault();

  try {
    setSaving(true);
    setError("");

    const payload = {
      username: form.username.trim(),
      password: form.password,
      role: form.role,

      directorate_id:
        form.role === "admin"
          ? null
          : Number(form.directorate_id),
    };

    const createdUser =
      await api.createUser(payload);

    setUsers((prev) => [
      createdUser,
      ...prev,
    ]);

    setForm({
      username: "",
      password: "",
      directorate_id: "",
      role: "user",
    });

    // Mbyll modal-in vetëm pas suksesit
    setShowModal(false);

  } catch (err) {
    console.error(
      "Gabim gjatë krijimit të përdoruesit:",
      err
    );

    setError(
      err.message ||
        "Nuk u krijua përdoruesi."
    );
  } finally {
    setSaving(false);
  }
}

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-8">

          {/* =====================================================
              HEADER
          ===================================================== */}

          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Përdoruesit
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Menaxhimi i përdoruesve të sistemit
              </p>
            </div>

            <button
              type="button"
              onClick={openModal}
              className="
                flex
                items-center
                gap-2
                rounded-lg
                bg-slate-900
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-slate-800
              "
            >
              <span className="text-lg leading-none">
                +
              </span>

              Shto përdorues
            </button>
          </div>

          {/* =====================================================
              TABLE
          ===================================================== */}

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="overflow-x-auto">
              <table className="w-full">

                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Përdoruesi
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Drejtoria
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Roli
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Statusi
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                      Veprime
                    </th>

                  </tr>
                </thead>

               <tbody>
  {loadingUsers ? (
    <tr>
      <td
        colSpan="5"
        className="px-6 py-12 text-center text-sm text-slate-500"
      >
        Duke ngarkuar përdoruesit...
      </td>
    </tr>
  ) : users.length === 0 ? (
    <tr>
      <td
        colSpan="5"
        className="px-6 py-12 text-center text-sm text-slate-500"
      >
        Nuk ka përdorues.
      </td>
    </tr>
  ) : (
    users.map((user) => (
      <tr
        key={user.id}
        className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
      >
        {/* USERNAME */}
        <td className="px-6 py-4">
          <p className="text-sm font-semibold text-slate-800">
            {user.username}
          </p>
        </td>

        {/* DREJTORIA */}
        <td className="px-6 py-4 text-sm text-slate-600">
          {user.directorate_name || "—"}
        </td>

        {/* ROLI */}
        <td className="px-6 py-4">
          <span
            className={`
              inline-flex
              rounded-full
              px-3
              py-1
              text-xs
              font-semibold
              ${
                user.role === "admin"
                  ? "bg-purple-50 text-purple-700"
                  : "bg-blue-50 text-blue-700"
              }
            `}
          >
            {user.role === "admin"
              ? "Administrator"
              : "Përdorues"}
          </span>
        </td>

        {/* STATUSI */}
        <td className="px-6 py-4">
          <span
            className={`
              inline-flex
              rounded-full
              px-3
              py-1
              text-xs
              font-semibold
              ${
                user.active
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }
            `}
          >
            {user.active
              ? "Aktiv"
              : "Jo aktiv"}
          </span>
        </td>

        {/* VEPRIME */}
        <td className="px-6 py-4 text-right">
          <button
            type="button"
            className="
              rounded-lg
              border
              border-slate-200
              px-3
              py-2
              text-xs
              font-semibold
              text-slate-600
              transition
              hover:bg-slate-100
            "
          >
            Ndrysho
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>

              </table>
            </div>

          </div>
        </div>

        {/* =====================================================
            MODAL - SHTO PËRDORUES
        ===================================================== */}

        {showModal && (
          <div
            className="
              fixed
              inset-0
              z-[100]
              flex
              items-center
              justify-center
              bg-slate-900/50
              p-4
              backdrop-blur-[2px]
            "
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                closeModal();
              }
            }}
          >

            <div
              className="
                w-full
                max-w-lg
                overflow-hidden
                rounded-2xl
                bg-white
                shadow-2xl
              "
            >

              {/* =================================================
                  MODAL HEADER
              ================================================= */}

              <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Shto përdorues
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Krijo një llogari të re në sistem.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    text-xl
                    text-slate-400
                    transition
                    hover:bg-slate-100
                    hover:text-slate-700
                  "
                >
                  ×
                </button>

              </div>

              {/* =================================================
                  FORM
              ================================================= */}

              <form onSubmit={handleSubmit}>

                <div className="space-y-5 px-6 py-6">
                    {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                    )}

                  {/* USERNAME */}

                  <div>
                    <label
                      htmlFor="new-username"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Username

                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      id="new-username"
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="Shkruani username"
                      required
                      autoComplete="off"
                      className="
                        h-11
                        w-full
                        rounded-lg
                        border
                        border-slate-300
                        bg-white
                        px-4
                        text-sm
                        text-slate-800
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-slate-500
                        focus:ring-4
                        focus:ring-slate-100
                      "
                    />
                  </div>

                  {/* PASSWORD */}

                  <div>
                    <label
                      htmlFor="new-password"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Fjalëkalimi

                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      id="new-password"
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Vendos fjalëkalimin"
                      required
                      autoComplete="new-password"
                      className="
                        h-11
                        w-full
                        rounded-lg
                        border
                        border-slate-300
                        bg-white
                        px-4
                        text-sm
                        text-slate-800
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-slate-500
                        focus:ring-4
                        focus:ring-slate-100
                      "
                    />

                    <p className="mt-1.5 text-xs text-slate-400">
                      Përdoruesi mund ta ndryshojë më vonë nga Cilësimet.
                    </p>
                  </div>

                  {/* =================================================
                      DREJTORIA - NGA BACKEND
                  ================================================= */}

                  <div>
                    <label
                      htmlFor="directorate"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Drejtoria Vendore

                      {form.role === "user" && (
                        <span className="ml-1 text-red-500">
                          *
                        </span>
                      )}
                    </label>

                    <select
                      id="directorate"
                      name="directorate_id"
                      value={form.directorate_id}
                      onChange={handleChange}
                      required={form.role === "user"}
                      disabled={
                        form.role === "admin" ||
                        loadingDirectorates
                      }
                      className="
                        h-11
                        w-full
                        rounded-lg
                        border
                        border-slate-300
                        bg-white
                        px-4
                        text-sm
                        text-slate-800
                        outline-none
                        transition
                        focus:border-slate-500
                        focus:ring-4
                        focus:ring-slate-100
                        disabled:cursor-not-allowed
                        disabled:bg-slate-100
                        disabled:text-slate-400
                      "
                    >

                      <option value="">
                        {loadingDirectorates
                          ? "Duke ngarkuar drejtoritë..."
                          : "Zgjidh drejtorinë"}
                      </option>

                      {directorates.map((directorate) => (
                        <option
                          key={directorate.id}
                          value={directorate.id}
                        >
                          {directorate.name}
                        </option>
                      ))}

                    </select>

                    {form.role === "admin" && (
                      <p className="mt-1.5 text-xs text-slate-400">
                        Administratori ka akses në të gjitha drejtoritë.
                      </p>
                    )}
                  </div>

                  {/* =================================================
                      ROLE
                  ================================================= */}

                  <div>
                    <label
                      htmlFor="role"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Roli

                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <select
                      id="role"
                      name="role"
                      value={form.role}
                      onChange={handleRoleChange}
                      className="
                        h-11
                        w-full
                        rounded-lg
                        border
                        border-slate-300
                        bg-white
                        px-4
                        text-sm
                        text-slate-800
                        outline-none
                        transition
                        focus:border-slate-500
                        focus:ring-4
                        focus:ring-slate-100
                      "
                    >
                      <option value="user">
                        Përdorues
                      </option>

                      <option value="admin">
                        Administrator
                      </option>
                    </select>
                  </div>

                </div>

                {/* =================================================
                    MODAL FOOTER
                ================================================= */}

                <div
                  className="
                    flex
                    items-center
                    justify-end
                    gap-3
                    border-t
                    border-slate-200
                    bg-slate-50
                    px-6
                    py-4
                  "
                >

                  <button
                    type="button"
                    onClick={closeModal}
                    className="
                      rounded-lg
                      border
                      border-slate-300
                      bg-white
                      px-5
                      py-2.5
                      text-sm
                      font-semibold
                      text-slate-700
                      transition
                      hover:bg-slate-100
                    "
                  >
                    Anulo
                  </button>

                    <button
                    type="submit"
                    disabled={saving}
                    className="
                        rounded-lg
                        bg-slate-900
                        px-5
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        shadow-sm
                        transition
                        hover:bg-slate-800
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                    >
                    {saving
                        ? "Duke ruajtur..."
                        : "Ruaj përdoruesin"}
                    </button>

                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
}