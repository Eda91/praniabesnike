import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import { api } from "../../backend/src/services/api";

function ShtoAnkese() {
  const navigate = useNavigate();

  // =========================================================
  // LOOKUPS
  // =========================================================

  const [directorates, setDirectorates] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [deputies, setDeputies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [notificationTypes, setNotificationTypes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FORM
  // =========================================================

  const [form, setForm] = useState({
    // 1. IDENTIFIKIMI
    directorate_id: "",
    municipality_id: "",
    county: "",
    administrative_unit_address: "",

    // 2. BURIMI I ANKESËS
    deputy_id: "",
    pb_code: "",
    received_date: "",

    // 3. ANKUESI
    first_name: "",
    last_name: "",
    contact: "",

    // 4. KËRKESA
    category_id: "",
    request_description: "",
    has_ashk_application: "",
    application_number: "",
    application_date: "",

    // 5. NDJEKJA
    status_id: "",
    obstacle_id: "",
    last_action_next_step: "",
    last_update_date: "",
    sector_id: "",
    responsible_specialist: "",
    notification_type_id: "",
    notification_date: "",
    closing_date: "",
    notes: "",
  });

  // =========================================================
  // LOAD LOOKUPS
  // =========================================================

  useEffect(() => {
    async function loadLookups() {
      try {
        setLoading(true);
        setError("");

        const [
          directoratesData,
          deputiesData,
          categoriesData,
          statusesData,
          obstaclesData,
          sectorsData,
          notificationTypesData,
        ] = await Promise.all([
          api.getDirectorates(),
          api.getDeputies(),
          api.getCategories(),
          api.getStatuses(),
          api.getObstacles(),
          api.getSectors(),
          api.getNotificationTypes(),
        ]);

        setDirectorates(directoratesData || []);
        setDeputies(deputiesData || []);
        setCategories(categoriesData || []);
        setStatuses(statusesData || []);
        setObstacles(obstaclesData || []);
        setSectors(sectorsData || []);
        setNotificationTypes(notificationTypesData || []);
      } catch (err) {
        console.error("Gabim gjatë ngarkimit të lookup-eve:", err);

        setError(
          "Nuk u ngarkuan të dhënat nga serveri. Kontrollo backend-in."
        );
      } finally {
        setLoading(false);
      }
    }

    loadLookups();
  }, []);

  // =========================================================
  // NORMAL CHANGE
  // =========================================================

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // =========================================================
  // DREJTORIA -> BASHKITË
  // =========================================================

  async function handleDirectorateChange(e) {
    const directorateId = e.target.value;

    setForm((prev) => ({
      ...prev,
      directorate_id: directorateId,
      municipality_id: "",
      county: "",
    }));

    setMunicipalities([]);

    if (!directorateId) {
      return;
    }

    try {
      const data =
        await api.getMunicipalitiesByDirectorate(directorateId);

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

  // =========================================================
  // BASHKIA -> QARKU
  // =========================================================

  function handleMunicipalityChange(e) {
    const municipalityId = e.target.value;

    const selectedMunicipality = municipalities.find(
      (item) =>
        String(item.id) === String(municipalityId)
    );

    setForm((prev) => ({
      ...prev,
      municipality_id: municipalityId,
      county:
        selectedMunicipality?.county_name || "",
    }));
  }

  // =========================================================
  // APLIKIMI ASHK
  // =========================================================

  function handleApplicationChange(e) {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      has_ashk_application: value,

      // Nëse kalon në "Jo", pastrojmë fushat
      application_number:
        value === "Po"
          ? prev.application_number
          : "",

      application_date:
        value === "Po"
          ? prev.application_date
          : "",
    }));
  }

  // =========================================================
  // SELECTED OBJECTS
  // =========================================================

  const selectedDirectorate = useMemo(
    () =>
      directorates.find(
        (item) =>
          String(item.id) ===
          String(form.directorate_id)
      ),
    [directorates, form.directorate_id]
  );

  const selectedStatus = useMemo(
    () =>
      statuses.find(
        (item) =>
          String(item.id) ===
          String(form.status_id)
      ),
    [statuses, form.status_id]
  );

  // =========================================================
  // MONITORIMI AUTOMATIK
  // =========================================================

  const statusGroup =
    selectedStatus?.group_name || "";

  const daysInProcess = calculateDays(
    form.received_date,
    form.closing_date
  );

  const deadlineState = calculateDeadlineState(
    form.received_date,
    form.closing_date,
    statusGroup
  );

  const daysWithoutUpdate =
    statusGroup === "Hapur"
      ? calculateDays(form.last_update_date)
      : "";

  const completeness = calculateCompleteness({
    form,
    statusGroup,
    selectedStatus,
  });

  // =========================================================
  // PREVIEW KODI I ANKESËS
  // =========================================================
  // Numri real dhe kodi përfundimtar duhet të gjenerohen
  // nga backend-i kur ankesa ruhet.
  // Këtu japim vetëm preview.

  const complaintCodePreview =
    selectedDirectorate?.code
      ? `${selectedDirectorate.code}-AUTO`
      : "Gjenerohet automatikisht";

  // =========================================================
  // SUBMIT
  // =========================================================

  function handleSubmit(e) {
    e.preventDefault();

    if (completeness !== "OK") {
      setError(
        "Plotëso fushat e detyrueshme para ruajtjes së ankesës."
      );

      return;
    }

    setError("");

    console.log("FORM DATA:", form);

    // Hapi pasardhës:
    // await api.createComplaint(form);
  }

  // =========================================================
  // JSX
  // =========================================================

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl space-y-6">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Prania Besnike
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Shto ankesë
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Regjistrimi i një rasti të ri në regjistrin e ankesave
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/regjistri")}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            ← Kthehu te regjistri
          </button>

        </div>

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ===================================================
            LOADING
        =================================================== */}

        {loading && (
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
            Duke ngarkuar të dhënat...
          </div>
        )}

        <form
          className="space-y-6"
          onSubmit={handleSubmit}
        >

          {/* =================================================
              1. IDENTIFIKIMI
          ================================================= */}

          <Section
            number="01"
            title="IDENTIFIKIMI"
            description="Të dhënat bazë të identifikimit të ankesës"
          >

            <Field label="Nr.">
              <input
                className={automaticClass}
                value="Automatik"
                disabled
              />
            </Field>

            <Field label="Kodi i ankesës">
              <input
                className={automaticClass}
                value={complaintCodePreview}
                disabled
              />
            </Field>

            <Field label="Drejtoria Vendore *">
              <select
                className={inputClass}
                name="directorate_id"
                value={form.directorate_id}
                onChange={handleDirectorateChange}
                required
              >
                <option value="">
                  Zgjidh Drejtorinë Vendore
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
            </Field>

            <Field label="Bashkia *">
              <select
                className={inputClass}
                name="municipality_id"
                value={form.municipality_id}
                onChange={handleMunicipalityChange}
                disabled={!form.directorate_id}
                required
              >
                <option value="">
                  {form.directorate_id
                    ? "Zgjidh Bashkinë"
                    : "Zgjidh fillimisht Drejtorinë Vendore"}
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
            </Field>

            <Field
              label="Qarku"
              automatic
            >
              <input
                className={automaticClass}
                type="text"
                value={form.county}
                placeholder="Plotësohet automatikisht"
                disabled
              />
            </Field>

            <Field label="Njësia administrative / adresa">
              <input
                className={inputClass}
                type="text"
                name="administrative_unit_address"
                value={form.administrative_unit_address}
                onChange={handleChange}
                placeholder="Njësia administrative / adresa"
              />
            </Field>

          </Section>

          {/* =================================================
              2. BURIMI I ANKESËS
          ================================================= */}

          <Section
            number="02"
            title="BURIMI I ANKESËS"
            description="Burimi dhe regjistrimi fillestar i ankesës"
          >

            <Field label="Deputeti *">
              <select
                className={inputClass}
                name="deputy_id"
                value={form.deputy_id}
                onChange={handleChange}
                required
              >
                <option value="">
                  Zgjidh deputetin
                </option>

                {deputies.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Kodi PB (nr. regjistrimi)">
              <input
                className={inputClass}
                type="text"
                name="pb_code"
                value={form.pb_code}
                onChange={handleChange}
                placeholder="p.sh. PB-2026-0101"
              />
            </Field>

            <Field label="Data e marrjes së ankesës *">
              <input
                className={inputClass}
                type="date"
                name="received_date"
                value={form.received_date}
                onChange={handleChange}
                required
              />
            </Field>

          </Section>

          {/* =================================================
              3. ANKUESI
          ================================================= */}

          <Section
            number="03"
            title="ANKUESI"
            description="Të dhënat e qytetarit që ka paraqitur ankesën"
          >

            <Field label="Emri *">
              <input
                className={inputClass}
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                placeholder="Emri"
                required
              />
            </Field>

            <Field label="Mbiemri *">
              <input
                className={inputClass}
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                placeholder="Mbiemri"
                required
              />
            </Field>

            <Field label="Kontakti (tel / email)">
              <input
                className={inputClass}
                type="text"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="Telefon ose email"
              />
            </Field>

          </Section>

          {/* =================================================
              4. KËRKESA
          ================================================= */}

          <Section
            number="04"
            title="KËRKESA"
            description="Kategoria dhe përmbajtja e kërkesës së qytetarit"
          >

            <Field label="Kategoria *">
              <select
                className={inputClass}
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                required
              >
                <option value="">
                  Zgjidh kategorinë
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
            </Field>

            <Field label="Ka aplikim në ASHK? *">
              <select
                className={inputClass}
                name="has_ashk_application"
                value={form.has_ashk_application}
                onChange={handleApplicationChange}
                required
              >
                <option value="">
                  Zgjidh
                </option>

                <option value="Po">
                  Po
                </option>

                <option value="Jo">
                  Jo
                </option>
              </select>
            </Field>

            <div className="md:col-span-2">
              <Field label="Përshkrimi i kërkesës *">
                <textarea
                  className={`${inputClass} min-h-32 resize-y`}
                  name="request_description"
                  value={form.request_description}
                  onChange={handleChange}
                  placeholder="Përshkruaj kërkesën e qytetarit..."
                  required
                />
              </Field>
            </div>

            {form.has_ashk_application === "Po" && (
              <>
                <Field label="Nr. aplikimi / vetëdeklarimi *">
                  <input
                    className={inputClass}
                    type="text"
                    name="application_number"
                    value={form.application_number}
                    onChange={handleChange}
                    placeholder="Nr. aplikimi / vetëdeklarimi"
                    required
                  />
                </Field>

                <Field label="Data e aplikimit">
                  <input
                    className={inputClass}
                    type="date"
                    name="application_date"
                    value={form.application_date}
                    onChange={handleChange}
                  />
                </Field>
              </>
            )}

          </Section>

          {/* =================================================
              5. NDJEKJA E ANKESËS
          ================================================= */}

          <Section
            number="05"
            title="NDJEKJA E ANKESËS"
            description="Kjo pjesë përditësohet gjatë trajtimit të ankesës"
          >

            <Field label="Statusi *">
              <select
                className={inputClass}
                name="status_id"
                value={form.status_id}
                onChange={handleChange}
                required
              >
                <option value="">
                  Zgjidh statusin
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
            </Field>

            <Field
              label={
                selectedStatus?.name ===
                "Në pritje të qytetarit"
                  ? "Pengesa kryesore *"
                  : "Pengesa kryesore"
              }
            >
              <select
                className={inputClass}
                name="obstacle_id"
                value={form.obstacle_id}
                onChange={handleChange}
                required={
                  selectedStatus?.name ===
                  "Në pritje të qytetarit"
                }
              >
                <option value="">
                  Zgjidh pengesën
                </option>

                {obstacles.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>

            <div className="md:col-span-2">
              <Field label="Veprimi i fundit / hapi i radhës">
                <textarea
                  className={`${inputClass} min-h-28 resize-y`}
                  name="last_action_next_step"
                  value={form.last_action_next_step}
                  onChange={handleChange}
                  placeholder="Përshkruaj veprimin e fundit ose hapin e radhës..."
                />
              </Field>
            </div>

            <Field label="Data e përditësimit të fundit *">
              <input
                className={inputClass}
                type="date"
                name="last_update_date"
                value={form.last_update_date}
                onChange={handleChange}
                required
              />
            </Field>

            <Field label="Sektori përgjegjës">
              <select
                className={inputClass}
                name="sector_id"
                value={form.sector_id}
                onChange={handleChange}
              >
                <option value="">
                  Zgjidh sektorin
                </option>

                {sectors.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Specialisti përgjegjës">
              <input
                className={inputClass}
                type="text"
                name="responsible_specialist"
                value={form.responsible_specialist}
                onChange={handleChange}
                placeholder="Emri i specialistit"
              />
            </Field>

            <Field label="Njoftimi i qytetarit">
              <select
                className={inputClass}
                name="notification_type_id"
                value={form.notification_type_id}
                onChange={handleChange}
              >
                <option value="">
                  Zgjidh mënyrën e njoftimit
                </option>

                {notificationTypes.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Data e njoftimit">
              <input
                className={inputClass}
                type="date"
                name="notification_date"
                value={form.notification_date}
                onChange={handleChange}
              />
            </Field>

            <Field label="Data e mbylljes">
              <input
                className={inputClass}
                type="date"
                name="closing_date"
                value={form.closing_date}
                onChange={handleChange}
              />
            </Field>

            <div className="md:col-span-2">
              <Field label="Shënime">
                <textarea
                  className={`${inputClass} min-h-28 resize-y`}
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Shënime shtesë..."
                />
              </Field>
            </div>

          </Section>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">

            <p className="hidden text-xs text-slate-400 sm:block">
              Fushat me * janë të detyrueshme
            </p>

            <div className="ml-auto flex items-center gap-3">

              <button
                type="button"
                onClick={() =>
                  navigate("/regjistri")
                }
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Anulo
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Ruaj ankesën
              </button>

            </div>
          </div>

        </form>
      </div>
    </MainLayout>
  );
}

// =========================================================
// SECTION
// =========================================================

function Section({
  number,
  title,
  description,
  children,
  automatic = false,
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

      <div
        className={`border-b px-6 py-4 ${
          automatic
            ? "border-slate-200 bg-slate-50"
            : "border-slate-100"
        }`}
      >
        <div className="flex items-center gap-4">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
            {number}
          </div>

          <div>
            <h2 className="text-sm font-bold tracking-wide text-slate-800">
              {title}
            </h2>

            {description && (
              <p className="mt-1 text-xs text-slate-400">
                {description}
              </p>
            )}
          </div>

          {automatic && (
            <span className="ml-auto rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
              Automatik
            </span>
          )}

        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
        {children}
      </div>

    </section>
  );
}

// =========================================================
// FIELD
// =========================================================

function Field({
  label,
  children,
  automatic = false,
}) {
  return (
    <label className="block">

      <div className="mb-2 flex items-center gap-2">

        <span className="text-sm font-medium text-slate-700">
          {label}
        </span>

        {automatic && (
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-400">
            Auto
          </span>
        )}

      </div>

      {children}

    </label>
  );
}

// =========================================================
// MONITOR CARD
// =========================================================

function MonitorCard({
  label,
  value,
  success = false,
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        success
          ? "border-emerald-200 bg-emerald-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-2 text-sm font-semibold ${
          success
            ? "text-emerald-700"
            : "text-slate-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

// =========================================================
// DAYS
// =========================================================

function calculateDays(
  startDate,
  endDate = ""
) {
  if (!startDate) {
    return "";
  }

  const start = new Date(
    `${startDate}T00:00:00`
  );

  const end = endDate
    ? new Date(`${endDate}T00:00:00`)
    : new Date();

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    return "";
  }

  const diff =
    end.getTime() - start.getTime();

  return Math.max(
    0,
    Math.floor(
      diff / (1000 * 60 * 60 * 24)
    )
  );
}

// =========================================================
// DEADLINE
// Excel uses STANDARD_PROCESSING_DAYS = 30
// =========================================================

function calculateDeadlineState(
  receivedDate,
  closingDate,
  statusGroup
) {
  if (!receivedDate || !statusGroup) {
    return "";
  }

  const days = calculateDays(
    receivedDate,
    closingDate
  );

  if (days === "") {
    return "";
  }

  if (statusGroup === "Hapur") {
    return days > 30
      ? "Jashtë afatit"
      : "Brenda afatit";
  }

  if (!closingDate) {
    return "Mungon data e mbylljes";
  }

  return days > 30
    ? "Mbyllur jashtë afatit"
    : "Mbyllur në afat";
}

// =========================================================
// COMPLETENESS
// Sipas kontrollit të plotësisë në Excel
// =========================================================

function calculateCompleteness({
  form,
  statusGroup,
  selectedStatus,
}) {
  const missing = [];

  if (!form.directorate_id) {
    missing.push("DV");
  }

  if (!form.municipality_id) {
    missing.push("bashkia");
  }

  if (!form.deputy_id) {
    missing.push("deputeti");
  }

  if (!form.received_date) {
    missing.push("data e marrjes");
  }

  if (!form.first_name) {
    missing.push("emri");
  }

  if (!form.last_name) {
    missing.push("mbiemri");
  }

  if (!form.category_id) {
    missing.push("kategoria");
  }

  if (!form.request_description) {
    missing.push("përshkrimi");
  }

  if (!form.has_ashk_application) {
    missing.push("aplikimi Po/Jo");
  }

  if (!form.status_id) {
    missing.push("statusi");
  }

  if (!form.last_update_date) {
    missing.push("data e përditësimit");
  }

  if (
    form.has_ashk_application === "Po" &&
    !form.application_number
  ) {
    missing.push("nr. aplikimi");
  }

  if (
    ["Zgjidhur", "Orientuar", "Pa zgjidhje"].includes(
      statusGroup
    ) &&
    !form.closing_date
  ) {
    missing.push("data e mbylljes");
  }

  if (
    selectedStatus?.name ===
      "Në pritje të qytetarit" &&
    !form.obstacle_id
  ) {
    missing.push("pengesa");
  }

  if (missing.length === 0) {
    return "OK";
  }

  return `Mungon: ${missing.join("; ")}`;
}

// =========================================================
// STYLES
// =========================================================

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

const automaticClass =
  "w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-500 outline-none";

export default ShtoAnkese;