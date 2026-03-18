const SUPER_ADMIN_BASE_URL =
  (
    import.meta.env.VITE_SUPER_ADMIN_API_BASE_URL ||
    "https://a88642b8-2b68-4d73-b038-49eb67884ca4-prod.e1-us-east-azure.bijiraapis.dev/default/ceylonstay-super-admin-se/v1.0"
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

  if (!email) {
    throw new Error("No user email found in the current session.");
  }

  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
    "X-User-Email": email
  };

  if (json) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

const buildTokenHeaders = (accessToken) => {
  if (!accessToken) {
    throw new Error("No access token available. Please log in again.");
  }

  return {
    Accept: "application/json",
    Authorization: `Bearer ${accessToken}`
  };
};

export const getSuperAdminHealth = async (accessToken) => {
  const response = await fetch(`${SUPER_ADMIN_BASE_URL}/health`, {
    method: "GET",
    headers: buildTokenHeaders(accessToken)
  });

  return parseResponse(response);
};

export const getSuperAdminKpis = async (accessToken, email) => {
  const response = await fetch(`${SUPER_ADMIN_BASE_URL}/dashboard/kpis`, {
    method: "GET",
    headers: buildHeaders(accessToken, email)
  });

  return parseResponse(response);
};

export const getAdmins = async (accessToken, email) => {
  const response = await fetch(`${SUPER_ADMIN_BASE_URL}/admins`, {
    method: "GET",
    headers: buildHeaders(accessToken, email)
  });

  return parseResponse(response);
};

export const addAdmin = async (accessToken, email, payload) => {
  const response = await fetch(`${SUPER_ADMIN_BASE_URL}/admins`, {
    method: "POST",
    headers: buildHeaders(accessToken, email, true),
    body: JSON.stringify(payload)
  });

  return parseResponse(response);
};

export const activateAdmin = async (accessToken, email, adminId) => {
  const response = await fetch(`${SUPER_ADMIN_BASE_URL}/admins/${adminId}/activate`, {
    method: "PATCH",
    headers: buildHeaders(accessToken, email)
  });

  return parseResponse(response);
};

export const deactivateAdmin = async (accessToken, email, adminId) => {
  const response = await fetch(`${SUPER_ADMIN_BASE_URL}/admins/${adminId}/deactivate`, {
    method: "PATCH",
    headers: buildHeaders(accessToken, email)
  });

  return parseResponse(response);
};

export const removeAdmin = async (accessToken, email, adminId) => {
  const response = await fetch(`${SUPER_ADMIN_BASE_URL}/admins/${adminId}`, {
    method: "DELETE",
    headers: buildHeaders(accessToken, email)
  });

  return parseResponse(response);
};
