import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import { api } from "../../backend/src/services/api";

function Regjistri() {
  const navigate = useNavigate();

  // ---------------------------------------------
  // LOOKUPS
  // ---------------------------------------------

  const [directorates, setDirectorates] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);

  // ---------------------------------------------
  // COMPLAINTS
  // ---------------------------------------------

  const [complaints, setComplaints] = useState([]);

  // ---------------------------------------------
  // FILTERS
  // ---------------------------------------------

  const [filters, setFilters] = useState({
    directorate_id: "",
    municipality_id: "",
    category_id: "",
    status_id: "",
  });

  // ---------------------------------------------
  // UI STATE
  // ---------------------------------------------

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------------------------------------------
  // LOAD LOOKUPS
  // ---------------------------------------------

  useEffect(() => {
    async function loadLookups() {
      try {
        setLoading(true);
        setError("");

        const [
          directoratesData,
          categoriesData,
          statusesData,
          complaintsData,
        ] = await Promise.all([
          api.getDirectorates(),
          api.getCategories(),
          api.getStatuses(),
          api.getComplaints(),
        ]);

        setDirectorates(directoratesData || []);
        setCategories(categoriesData || []);
        setStatuses(statusesData || []);
         setComplaints(complaintsData || []);
      } catch (err) {
        console.error(
          "Gabim gjatë ngarkimit të filtrave:",
          err
        );

        setError(
          "Nuk u ngarkuan të dhënat e filtrave."
        );
      } finally {
        setLoading(false);
      }
    }

    loadLookups();
  }, []);

  // ---------------------------------------------
  // DREJTORIA -> BASHKITË
  // ---------------------------------------------

  async function handleDirectorateChange(e) {
    const directorateId = e.target.value;

    setFilters((prev) => ({
      ...prev,
      directorate_id: directorateId,
      municipality_id: "",
    }));

    setMunicipalities([]);

    if (!directorateId) {
      return;
    }

    try {
      const data =
        await api.getMunicipalitiesByDirectorate(
          directorateId
        );

      setMunicipalities(data || []);
    } catch (err) {
      console.error(
        "Gabim gjatë ngarkimit të bashkive:",
        err
      );

      setError(
        "Nuk u ngarkuan bashkitë e Drejtorisë Vendore."
      );
    }
  }

  // ---------------------------------------------
  // FILTER CHANGE
  // ---------------------------------------------

  function handleFilterChange(e) {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // ---------------------------------------------
  // RESET FILTERS
  // ---------------------------------------------

  function resetFilters() {
    setFilters({
      directorate_id: "",
      municipality_id: "",
      category_id: "",
      status_id: "",
    });

    setMunicipalities([]);
  }

  // ---------------------------------------------
  // FILTER COMPLAINTS
  // Për momentin funksionon edhe kur complaints = []
  // ---------------------------------------------

  const filteredComplaints = complaints.filter(
    (complaint) => {
      if (
        filters.directorate_id &&
        String(complaint.directorate_id) !==
          String(filters.directorate_id)
      ) {
        return false;
      }

      if (
        filters.municipality_id &&
        String(complaint.municipality_id) !==
          String(filters.municipality_id)
      ) {
        return false;
      }

      if (
        filters.category_id &&
        String(complaint.category_id) !==
          String(filters.category_id)
      ) {
        return false;
      }

      if (
        filters.status_id &&
        String(complaint.status_id) !==
          String(filters.status_id)
      ) {
        return false;
      }

      return true;
    }
  );

  // ---------------------------------------------
  // DATE FORMAT
  // ---------------------------------------------

  function formatDate(date) {
    if (!date) return "—";

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return date;
    }

    return value.toLocaleDateString("sq-AL");
  }

  // ---------------------------------------------
  // JSX
  // ---------------------------------------------

  return (
    <MainLayout>
      <div className="space-y-6">

        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Regjistri
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Regjistri i plotë i ankesave të Prania Besnike
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/ankesa/shto")}
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            + Shto ankesë
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* FILTERS */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">
              Filtrat
            </h2>

            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              Pastro filtrat
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

            {/* DREJTORIA */}

            <select
              className={selectClass}
              name="directorate_id"
              value={filters.directorate_id}
              onChange={handleDirectorateChange}
            >
              <option value="">
                Të gjitha Drejtoritë Vendore
              </option>

              {directorates.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}
            </select>

            {/* BASHKIA */}

            <select
              className={selectClass}
              name="municipality_id"
              value={filters.municipality_id}
              onChange={handleFilterChange}
              disabled={!filters.directorate_id}
            >
              <option value="">
                {filters.directorate_id
                  ? "Të gjitha Bashkitë"
                  : "Zgjidh fillimisht DV"}
              </option>

              {municipalities.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}
            </select>

            {/* KATEGORIA */}

            <select
              className={selectClass}
              name="category_id"
              value={filters.category_id}
              onChange={handleFilterChange}
            >
              <option value="">
                Të gjitha kategoritë
              </option>

              {categories.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}
            </select>

            {/* STATUSI */}

            <select
              className={selectClass}
              name="status_id"
              value={filters.status_id}
              onChange={handleFilterChange}
            >
              <option value="">
                Të gjitha statuset
              </option>

              {statuses.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}
            </select>

          </div>
        </div>

        {/* REGJISTRI */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* TABLE HEADER */}

          <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="font-semibold text-slate-800">
                Lista e ankesave
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {filteredComplaints.length} ankesa
              </p>
            </div>

            {loading && (
              <span className="text-sm text-slate-400">
                Duke ngarkuar...
              </span>
            )}

          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap text-left text-sm">

              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">
                    Nr.
                  </th>

                  <th className="px-4 py-3">
                    DV
                  </th>

                  <th className="px-4 py-3">
                    Bashkia
                  </th>

                  <th className="px-4 py-3">
                    Qarku
                  </th>

                  <th className="px-4 py-3">
                    Qytetari
                  </th>

                  <th className="px-4 py-3">
                    Kategoria
                  </th>

                  <th className="px-4 py-3">
                    Statusi
                  </th>

                  <th className="px-4 py-3">
                    Data e regjistrimit
                  </th>

                  <th className="px-4 py-3 text-right">
                    Veprime
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {!loading &&
                  filteredComplaints.length === 0 && (
                    <tr>
                      <td
                        colSpan="9"
                        className="px-4 py-14 text-center"
                      >
                        <div className="mx-auto max-w-sm">

                          <div className="text-sm font-medium text-slate-600">
                            Nuk ka ende ankesa të regjistruara.
                          </div>

                          <p className="mt-1 text-xs text-slate-400">
                            Shto ankesën e parë për ta shfaqur në regjistër.
                          </p>

                        </div>
                      </td>
                    </tr>
                  )}

                {filteredComplaints.map(
                  (complaint, index) => (
                    <tr
                      key={complaint.id}
                      className="transition hover:bg-slate-50"
                    >

                      <td className="px-4 py-3 text-slate-500">
                        {index + 1}
                      </td>

                      <td className="px-4 py-3 font-medium text-slate-700">
                        {complaint.directorate_name ||
                          "—"}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {complaint.municipality_name ||
                          "—"}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {complaint.county_name ||
                          "—"}
                      </td>

                      <td className="px-4 py-3 text-slate-700">
                      {[
                          complaint.complainant_first_name,
                          complaint.complainant_last_name,
                        ]
                          .filter(Boolean)
                          .join(" ") || "—"}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {complaint.category_name ||
                          "—"}
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge
                          status={
                            complaint.status_name
                          }
                        />
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {formatDate(complaint.received_date)}
                      </td>

                      <td className="px-4 py-3 text-right">

                        <button
                          type="button"
                          className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        >
                          Shiko
                        </button>

                      </td>

                    </tr>
                  )
                )}

              </tbody>
            </table>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}

// --------------------------------------------------
// STATUS BADGE
// --------------------------------------------------

function StatusBadge({ status }) {
  if (!status) {
    return (
      <span className="text-slate-400">
        —
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
      {status}
    </span>
  );
}

// --------------------------------------------------
// STYLE
// --------------------------------------------------

const selectClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400";

export default Regjistri;