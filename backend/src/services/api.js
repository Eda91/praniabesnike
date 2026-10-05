const API_URL = "http://localhost:3000/api";

// =========================================================
// REQUEST
// =========================================================

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.body
      ? { "Content-Type": "application/json" }
      : {}),
    ...(token
      ? { Authorization: `Bearer ${token}` }
      : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error(
      `Gabim nga serveri: ${response.status}`
    );
  }

  if (!response.ok) {
    throw new Error(
      result.message ||
        `API error: ${response.status}`
    );
  }

  if (!result.success) {
    throw new Error(
      result.message || "Gabim në API"
    );
  }

  return result.data;
}


// =========================================================
// API
// =========================================================

export const api = {

  // =======================================================
  // LOOKUPS
  // =======================================================

  getDirectorates: () =>
    request("/lookups/directorates"),

  getCounties: () =>
    request("/lookups/counties"),

  getMunicipalities: () =>
    request("/lookups/municipalities"),

  getMunicipalitiesByDirectorate: (directorateId) =>
    request(
      `/lookups/municipalities/directorate/${directorateId}`
    ),

  getDeputies: () =>
    request("/lookups/deputies"),

  getCategories: () =>
    request("/lookups/categories"),

  getStatuses: () =>
    request("/lookups/statuses"),

  getObstacles: () =>
    request("/lookups/obstacles"),

  getSectors: () =>
    request("/lookups/sectors"),

  getNotificationTypes: () =>
    request("/lookups/notification-types"),

  getParameters: () =>
    request("/lookups/parameters"),


  // =======================================================
  // COMPLAINTS
  // =======================================================

  getComplaints: () =>
    request("/complaints"),


  // =======================================================
  // USERS
  // =======================================================

  getUsers: () =>
    request("/users"),


  createUser: (data) =>
    request("/users", {
      method: "POST",

      body: JSON.stringify(data),
    }),


  updateUser: (id, data) =>
    request(`/users/${id}`, {
      method: "PUT",

      body: JSON.stringify(data),
    }),


  updateUserStatus: (id, active) =>
    request(`/users/${id}/status`, {
      method: "PATCH",

      body: JSON.stringify({
        active,
      }),
    }),

};