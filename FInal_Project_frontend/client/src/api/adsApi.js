const BIJIRA_BASE_URL =
  "https://a88642b8-2b68-4d73-b038-49eb67884ca4-prod.e1-us-east-azure.bijiraapis.dev/default/ceylonstay-ads-service/v1.0";
const PUBLIC_READ_BEARER_TOKEN = (import.meta.env.VITE_PUBLIC_READ_BEARER_TOKEN || "").trim();
const RAW_PUBLIC_ADS_IMAGE_BASE_URL = (
  import.meta.env.VITE_PUBLIC_ADS_IMAGE_BASE_URL || "http://100.72.161.91:32104/ads"
).replace(/\/+$/, "");
const PUBLIC_ADS_IMAGE_BASE_URL =
  RAW_PUBLIC_ADS_IMAGE_BASE_URL.endsWith("/ads")
    ? `${RAW_PUBLIC_ADS_IMAGE_BASE_URL}/image`
    : RAW_PUBLIC_ADS_IMAGE_BASE_URL;

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

export const resolveReadAccessToken = (accessToken) => {
  if (accessToken) return accessToken;
  return PUBLIC_READ_BEARER_TOKEN;
};

const sanitizeImageName = (imageName) =>
  String(imageName)
    .replace("boarding-images/", "")
    .replace(/^\/+/, "");

export const getImageUrl = (imageName, options = {}) => {
  if (!imageName || imageName === "undefined") {
    return "https://placehold.co/800x500?text=No+Image";
  }

  const value = String(imageName);
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const cleaned = sanitizeImageName(value);

  if (options.usePublic) {
    return `${PUBLIC_ADS_IMAGE_BASE_URL}/${encodeURIComponent(cleaned)}`;
  }

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
  const readToken = resolveReadAccessToken(accessToken);
  const response = await fetch(`${BIJIRA_BASE_URL}/ads/active`, {
    method: "GET",
    headers: getAuthHeaders(readToken, null, false)
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
