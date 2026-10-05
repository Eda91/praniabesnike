import { useState } from "react";
import MainLayout from "../layouts/MainLayout";

export default function Settings() {
  const [form, setForm] = useState({
    username: "admin",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    console.log("Cilësimet:", form);
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-8">

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">
              Cilësimet
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Menaxho të dhënat dhe sigurinë e llogarisë
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >

            {/* LLOGARIA */}

            <div className="border-b border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Të dhënat e llogarisë
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Informacioni bazë i përdoruesit
              </p>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Emri i përdoruesit
                </label>

                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="
                    w-full
                    rounded-lg
                    border
                    border-slate-300
                    px-4
                    py-2.5
                    outline-none
                    transition
                    focus:border-slate-500
                    focus:ring-2
                    focus:ring-slate-100
                  "
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div className="p-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Ndrysho fjalëkalimin
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Për siguri, vendos fillimisht fjalëkalimin aktual
              </p>

              <div className="mt-6 space-y-5">

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Fjalëkalimi aktual
                  </label>

                  <input
                    type="password"
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Fjalëkalimi i ri
                  </label>

                  <input
                    type="password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Konfirmo fjalëkalimin e ri
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                  />
                </div>

              </div>
            </div>

            {/* FOOTER */}

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Ruaj ndryshimet
              </button>
            </div>

          </form>
        </div>
      </div>
    </MainLayout>
  );
}