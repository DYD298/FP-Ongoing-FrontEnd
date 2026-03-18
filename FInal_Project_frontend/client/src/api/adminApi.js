const ADMIN_BASE_URL =
  (
    import.meta.env.VITE_ADMIN_API_BASE_URL ||
    "https://a88642b8-2b68-4d73-b038-49eb67884ca4-prod.e1-us-east-azure.bijiraapis.dev/default/ceylonstay-admin-service/v1.0"
  ).replace(/\/+$/, "");

const parseResponse = async (response) => {
  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text || null;
  }

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      data?.error_description ||
      (typeof data === "string" ? data : null) ||
      `Request failed: HTTP ${response.status}`;

    throw new Error(message);
  }

  return data;
};

const buildHeaders = (accessToken, email, json = false) => {
  if (!accessToken) {
    throw new Error("No access token available. Please log in again.");
  }

  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${accessToken}`
  };

  if (email) {
    headers["X-User-Email"] = email;
  }

  if (json) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

const toQueryString = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    query.set(key, String(value));
  });

  const encoded = query.toString();
  return encoded ? `?${encoded}` : "";
};

export const getAdminHealth = async (accessToken, email) => {
  const response = await fetch(`${ADMIN_BASE_URL}/health`, {
    method: "GET",
    headers: buildHeaders(accessToken, email)
  });

  return parseResponse(response);
};

export const getAdminKpis = async (accessToken, email) => {
  const response = await fetch(`${ADMIN_BASE_URL}/dashboard/kpis`, {
    method: "GET",
    headers: buildHeaders(accessToken, email)
  });

  return parseResponse(response);
};

export const getAdminOverview = async (accessToken, email) => {
  const response = await fetch(`${ADMIN_BASE_URL}/dashboard/overview`, {
    method: "GET",
    headers: buildHeaders(accessToken, email)
  });

  return parseResponse(response);
};

export const getAdminAds = async (accessToken, email, filters = {}) => {
  const query = toQueryString(filters);
  const response = await fetch(`${ADMIN_BASE_URL}/ads${query}`, {
    method: "GET",
    headers: buildHeaders(accessToken, email)
  });

  return parseResponse(response);
};

