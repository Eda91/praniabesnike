import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import { api } from "../../backend/src/services/api";

function Dashboard() {
  const navigate = useNavigate();

  /* =========================================================
     STATE
  ========================================================= */

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD COMPLAINTS
  ========================================================= */

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const data = await api.getComplaints();

        setComplaints(
          Array.isArray(data) ? data : []
        );
      } catch (err) {
        console.error(
          "Gabim gjatë ngarkimit të monitorimit:",
          err
        );

        setError(
          "Nuk u ngarkuan të dhënat e monitorimit."
        );

        setComplaints([]);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  /* =========================================================
     HELPERS
  ========================================================= */

  function normalize(value) {
    return String(value || "")
      .trim()
      .toLowerCase();
  }

  function isClosedComplaint(complaint) {
    const group = normalize(
      complaint.status_group
    );

    const status = normalize(
      complaint.status_name
    );

    return (
      group.includes("mbyll") ||
      group.includes("zgjidh") ||
      group.includes("përfund") ||
      group.includes("perfund") ||
      status.includes("mbyll") ||
      status.includes("zgjidh") ||
      status.includes("përfund") ||
      status.includes("perfund")
    );
  }

  function isOpenComplaint(complaint) {
    return !isClosedComplaint(complaint);
  }

  function isIncompleteComplaint(complaint) {
    return (
      !complaint.directorate_id ||
      !complaint.municipality_id ||
      !complaint.category_id ||
      !complaint.status_id ||
      !complaint.complainant_first_name
    );
  }

  /* =========================================================
     MONITORING CALCULATIONS
  ========================================================= */

  const monitoring = useMemo(() => {
    const total = complaints.length;

    const open = complaints.filter(
      isOpenComplaint
    ).length;

    const resolved = complaints.filter(
      isClosedComplaint
    ).length;

    /*
      Për momentin:
      Jashtë afatit = më shumë se 30 ditë dhe ende e hapur.

      Më vonë mund ta marrim 30 nga
      system_parameters nëse e kemi të konfiguruar.
    */
    const overdue = complaints.filter(
      (complaint) => {
        const days = Number(
          complaint.days_in_process || 0
        );

        return (
          isOpenComplaint(complaint) &&
          days > 30
        );
      }
    ).length;

    /*
      Pa përditësim = më shumë se 7 ditë
      pa ndryshim dhe ankesa ende e hapur.
    */
    const noUpdate = complaints.filter(
      (complaint) => {
        const days = Number(
          complaint.days_without_update || 0
        );

        return (
          isOpenComplaint(complaint) &&
          days > 7
        );
      }
    ).length;

    const incomplete = complaints.filter(
      isIncompleteComplaint
    ).length;

    const activeComplaints =
      complaints.filter(isOpenComplaint);

    const totalDays =
      activeComplaints.reduce(
        (sum, complaint) => {
          return (
            sum +
            Number(
              complaint.days_in_process || 0
            )
          );
        },
        0
      );

    const averageDays =
      activeComplaints.length > 0
        ? Math.round(
            totalDays /
              activeComplaints.length
          )
        : 0;

    return {
      total,
      open,
      resolved,
      overdue,
      noUpdate,
      incomplete,
      averageDays,
    };
  }, [complaints]);

  /* =========================================================
     CASES REQUIRING ATTENTION
  ========================================================= */

  const attentionCases = useMemo(() => {
    return complaints.filter(
      (complaint) => {
        const overdue =
          isOpenComplaint(complaint) &&
          Number(
            complaint.days_in_process || 0
          ) > 30;

        const noUpdate =
          isOpenComplaint(complaint) &&
          Number(
            complaint.days_without_update || 0
          ) > 7;

        const incomplete =
          isIncompleteComplaint(complaint);

        return (
          overdue ||
          noUpdate ||
          incomplete
        );
      }
    );
  }, [complaints]);

  /* =========================================================
     STATS
  ========================================================= */

  const stats = [
    {
      title: "Ankesa gjithsej",
      value: monitoring.total,
      description:
        "Të gjitha ankesat e regjistruara",
      icon: "📋",
      filter: "all",
    },
    {
      title: "Të hapura",
      value: monitoring.open,
      description:
        "Ankesa ende në trajtim",
      icon: "⏳",
      filter: "open",
    },
    {
      title: "Të zgjidhura",
      value: monitoring.resolved,
      description:
        "Ankesa të përfunduara",
      icon: "✓",
      filter: "resolved",
    },
    {
      title: "Jashtë afatit",
      value: monitoring.overdue,
      description:
        "Kanë kaluar afatin e trajtimit",
      icon: "!",
      filter: "overdue",
    },
    {
      title: "Pa përditësim",
      value: monitoring.noUpdate,
      description:
        "Raste pa përditësim në afatin e përcaktuar",
      icon: "↻",
      filter: "no-update",
    },
    {
      title: "Të paplota",
      value: monitoring.incomplete,
      description:
        "Raste me të dhëna të paplota",
      icon: "⚠",
      filter: "incomplete",
    },
  ];

  /* =========================================================
     CARD NAVIGATION
  ========================================================= */

  function handleCardClick(filter) {
    if (filter === "all") {
      navigate("/regjistri");
      return;
    }

    navigate(
      `/regjistri?filter=${filter}`
    );
  }

  /* =========================================================
     DATE FORMAT
  ========================================================= */

  function formatDate(date) {
    if (!date) {
      return "—";
    }

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return date;
    }

    return value.toLocaleDateString(
      "sq-AL"
    );
  }

  /* =========================================================
     JSX
  ========================================================= */

  return (
    <MainLayout>
      <div className="space-y-7">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Prania Besnike
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Pasqyra
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Monitorimi i regjistrit të ankesave
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/ankesa/shto")
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            <span className="text-lg">
              +
            </span>

            Shto ankesë
          </button>

        </div>

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ===================================================
            LOADING
        =================================================== */}

        {loading && (
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">

            <svg
              className="h-5 w-5 animate-spin text-slate-600"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="3"
                className="opacity-20"
              />

              <path
                fill="currentColor"
                className="opacity-80"
                d="M12 3a9 9 0 0 1 9 9h-3a6 6 0 0 0-6-6V3z"
              />
            </svg>

            <span className="text-sm text-slate-500">
              Duke ngarkuar monitorimin...
            </span>

          </div>
        )}

        {/* ===================================================
            MONITORIMI
        =================================================== */}

        <section>

          <div className="mb-4 flex items-end justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Monitorimi
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Gjendja aktuale e trajtimit të ankesave
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/regjistri")
              }
              className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              Shiko regjistrin →
            </button>

          </div>


          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

            {stats.map((stat) => (
              <StatCard
                key={stat.title}
                {...stat}
                onClick={() =>
                  handleCardClick(
                    stat.filter
                  )
                }
              />
            ))}

          </div>

        </section>

        {/* ===================================================
            TREGUESIT E MONITORIMIT
        =================================================== */}

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-6 py-4">

            <h2 className="font-semibold text-slate-800">
              Treguesit e monitorimit
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Tregues të llogaritur automatikisht nga sistemi
            </p>

          </div>


          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">

            <IndicatorCard
              title="Gjithsej"
              value={monitoring.total}
              description="Ankesa të regjistruara"
              onClick={() =>
                navigate("/regjistri")
              }
            />

            <IndicatorCard
              title="Mesatarja e ditëve në trajtim"
              value={`${monitoring.averageDays} ditë`}
              description="Koha mesatare e trajtimit"
              onClick={() =>
                navigate(
                  "/regjistri?filter=processing-days"
                )
              }
            />

            <IndicatorCard
              title="Gjendja e afatit"
              value={monitoring.overdue}
              description="Raste jashtë afatit"
              onClick={() =>
                handleCardClick(
                  "overdue"
                )
              }
            />

            <IndicatorCard
              title="Ditë pa përditësim"
              value={monitoring.noUpdate}
              description="Raste që kërkojnë përditësim"
              onClick={() =>
                handleCardClick(
                  "no-update"
                )
              }
            />

          </div>

        </section>

        {/* ===================================================
            SINJALIZIME + KONTROLLI I PLOTËSISË
        =================================================== */}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

          {/* =================================================
              RASTE QË KËRKOJNË VËMENDJE
          ================================================= */}

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-2">

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">

              <div>

                <h2 className="font-semibold text-slate-800">
                  Raste që kërkojnë vëmendje
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Ankesa jashtë afatit, pa përditësim ose të paplota
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/regjistri")
                }
                className="text-sm font-medium text-slate-500 hover:text-slate-900"
              >
                Shiko të gjitha →
              </button>

            </div>


            {/* NUK KA RASTE */}

            {!loading &&
              attentionCases.length ===
                0 && (

                <div className="flex min-h-56 items-center justify-center p-8">

                  <div className="text-center">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-xl text-emerald-600">
                      ✓
                    </div>

                    <p className="mt-4 text-sm font-semibold text-slate-700">
                      Nuk ka raste që kërkojnë vëmendje
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Nuk ka ankesa jashtë afatit, pa përditësim ose të paplota.
                    </p>

                  </div>

                </div>

              )}


            {/* KA RASTE */}

            {!loading &&
              attentionCases.length >
                0 && (

                <div className="divide-y divide-slate-100">

                  {attentionCases
                    .slice(0, 5)
                    .map(
                      (complaint) => (

                        <button
                          key={
                            complaint.id
                          }
                          type="button"
                          onClick={() =>
                            navigate(
                              "/regjistri"
                            )
                          }
                          className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition hover:bg-slate-50"
                        >

                          <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-2">

                              <span className="font-semibold text-slate-800">
                                {complaint.complaint_code ||
                                  `Ankesa #${complaint.id}`}
                              </span>

                              {isIncompleteComplaint(
                                complaint
                              ) && (
                                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                                  E paplotë
                                </span>
                              )}

                              {isOpenComplaint(
                                complaint
                              ) &&
                                Number(
                                  complaint.days_in_process ||
                                    0
                                ) >
                                  30 && (
                                  <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                                    Jashtë afatit
                                  </span>
                                )}

                              {isOpenComplaint(
                                complaint
                              ) &&
                                Number(
                                  complaint.days_without_update ||
                                    0
                                ) >
                                  7 && (
                                  <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                                    Pa përditësim
                                  </span>
                                )}

                            </div>

                            <p className="mt-1 truncate text-sm text-slate-500">
                              {[
                                complaint.complainant_first_name,
                                complaint.complainant_last_name,
                              ]
                                .filter(
                                  Boolean
                                )
                                .join(
                                  " "
                                ) ||
                                "Qytetar i papërcaktuar"}
                            </p>

                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">

                              <span>
                                {complaint.directorate_name ||
                                  "Pa DV"}
                              </span>

                              <span>
                                {complaint.municipality_name ||
                                  "Pa bashki"}
                              </span>

                              <span>
                                {formatDate(
                                  complaint.received_date
                                )}
                              </span>

                            </div>

                          </div>


                          <div className="shrink-0 text-right">

                            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                              {complaint.status_name ||
                                "Pa status"}
                            </span>

                            <div className="mt-2 text-xs text-slate-400">
                              Shiko →
                            </div>

                          </div>

                        </button>

                      )
                    )}

                </div>

              )}

          </div>


          {/* =================================================
              KONTROLLI I PLOTËSISË
          ================================================= */}

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-6 py-4">

              <h2 className="font-semibold text-slate-800">
                Kontrolli i plotësisë
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Cilësia e të dhënave të regjistrit
              </p>

            </div>


            <div className="space-y-6 p-6">

              <ProgressItem
                label="Të plota"
                value={
                  monitoring.total -
                  monitoring.incomplete
                }
                total={
                  monitoring.total
                }
              />

              <ProgressItem
                label="Të paplota"
                value={
                  monitoring.incomplete
                }
                total={
                  monitoring.total
                }
              />


              <button
                type="button"
                onClick={() =>
                  handleCardClick(
                    "incomplete"
                  )
                }
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                Shiko rastet e paplota
              </button>

            </div>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  description,
  icon,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
    >

      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-slate-50 transition-transform duration-300 group-hover:scale-125" />

      <div className="relative">

        <div className="flex items-start justify-between">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl font-semibold text-slate-700 transition group-hover:bg-slate-900 group-hover:text-white">
            {icon}
          </div>

          <span className="flex h-8 w-8 items-center justify-center rounded-full text-slate-300 transition group-hover:bg-slate-100 group-hover:text-slate-700">
            →
          </span>

        </div>


        <p className="mt-5 text-sm font-medium text-slate-500">
          {title}
        </p>

        <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </p>

        <p className="mt-2 text-xs text-slate-400">
          {description}
        </p>

        <div className="mt-5 border-t border-slate-100 pt-3 text-xs font-medium text-slate-400 transition group-hover:text-slate-700">
          Shiko detajet →
        </div>

      </div>

    </button>
  );
}

/* =========================================================
   INDICATOR CARD
========================================================= */

function IndicatorCard({
  title,
  value,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-slate-300 hover:bg-white hover:shadow-sm"
    >

      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-xl font-bold text-slate-800">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>

    </button>
  );
}

/* =========================================================
   PROGRESS ITEM
========================================================= */

function ProgressItem({
  label,
  value,
  total,
}) {
  const percentage =
    total > 0
      ? Math.round(
          (value / total) * 100
        )
      : 0;

  return (
    <div>

      <div className="mb-2 flex items-center justify-between">

        <span className="text-sm text-slate-600">
          {label}
        </span>

        <span className="text-sm font-semibold text-slate-800">
          {value}
        </span>

      </div>


      <div className="h-2 overflow-hidden rounded-full bg-slate-100">

        <div
          className="h-full rounded-full bg-slate-700 transition-all duration-500"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>


      <p className="mt-1 text-right text-xs text-slate-400">
        {percentage}%
      </p>

    </div>
  );
}

export default Dashboard;