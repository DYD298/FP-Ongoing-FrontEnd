const BIJIRA_BASE_URL =
  "https://a88642b8-2b68-4d73-b038-49eb67884ca4-prod.e1-us-east-azure.bijiraapis.dev/default/ceylonstay-ads-service/v1.0";

export const getAuthHeaders = (accessToken, email, json = true) => {
  const headers = {
    Accept: "application/json"
  };

  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  if (email) headers["X-User-Email"] = email;
  if (json) headers["Content-Type"] = "application/json";

  return headers;
};

export const parseApiResponse = async (response) => {
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

export const getImageUrl = (imageName) => {
  if (!imageName || imageName === "undefined") {
    return "https://placehold.co/800x500?text=No+Image";
  }

  const cleaned = String(imageName)
    .replace("boarding-images/", "")
    .replace(/^\/+/, "");

  return `${BIJIRA_BASE_URL}/ads/image/${encodeURIComponent(cleaned)}`;
};

export const normalizeFacilities = (facilities) => {
  if (Array.isArray(facilities)) return facilities;
  if (!facilities) return [];
  return String(facilities)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export const fetchActiveAds = async (accessToken) => {
  const response = await fetch(`${BIJIRA_BASE_URL}/ads/active`, {
    method: "GET",
    headers: getAuthHeaders(accessToken, null, false)
  });

  return parseApiResponse(response);
};

export const fetchMyAds = async (accessToken, email) => {
  const response = await fetch(`${BIJIRA_BASE_URL}/ads/me`, {
    method: "GET",
    headers: getAuthHeaders(accessToken, email, false)
  });

  return parseApiResponse(response);
};

export const fetchAdById = async (accessToken, adId, email) => {
  const response = await fetch(`${BIJIRA_BASE_URL}/ads/${adId}`, {
    method: "GET",
    headers: getAuthHeaders(accessToken, email, false)
  });

  return parseApiResponse(response);
};

export const deleteAdById = async (accessToken, adId, email) => {
  const response = await fetch(`${BIJIRA_BASE_URL}/ads/${adId}`, {
    method: "DELETE",
    headers: getAuthHeaders(accessToken, email, false)
  });

  return parseApiResponse(response);
};

export const updateDraftAd = async (accessToken, adId, email, payload) => {
  const response = await fetch(`${BIJIRA_BASE_URL}/ads/draft/${adId}`, {
    method: "PUT",
    headers: getAuthHeaders(accessToken, email, true),
    body: JSON.stringify(payload)
  });

  return parseApiResponse(response);
};

export const publishDraftAd = async (accessToken, adId, email) => {
  const response = await fetch(`${BIJIRA_BASE_URL}/ads/draft/${adId}/publish`, {
    method: "POST",
    headers: getAuthHeaders(accessToken, email, false)
  });

  return parseApiResponse(response);
};
