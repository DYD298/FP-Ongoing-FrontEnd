const BIJIRA_BASE_URL =
  "https://a88642b8-2b68-4d73-b038-49eb67884ca4-prod.e1-us-east-azure.bijiraapis.dev/default/ceylonstay-ads-service/v1.0";
const resolveEnvValue = (...keys) => {
  for (const key of keys) {
    const value = import.meta.env[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
};

const PUBLIC_READ_BEARER_TOKEN = resolveEnvValue(
  "VITE_PUBLIC_READ_BEARER_TOKEN",
  "VITE_BIJIRA_TOKEN",
  "VITE_PUBLIC_BIJIRA_TOKEN"
);
const PUBLIC_READ_API_KEY = resolveEnvValue(
  "VITE_PUBLIC_READ_API_KEY",
  "VITE_BIJIRA_API_KEY",
  "VITE_PUBLIC_API_KEY"
);
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

const getGuestReadHeaders = () => {
  if (PUBLIC_READ_BEARER_TOKEN) {
    return getAuthHeaders(PUBLIC_READ_BEARER_TOKEN, null, false);
  }

  if (PUBLIC_READ_API_KEY) {
    return {
      Accept: "application/json",
      apikey: PUBLIC_READ_API_KEY,
      "API-Key": PUBLIC_READ_API_KEY
    };
  }

  return {
    Accept: "application/json"
  };
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

const fetchActiveAdsWithHeaders = async (headers) =>
  fetch(`${BIJIRA_BASE_URL}/ads/active`, {
    method: "GET",
    headers
  });

const fetchActiveAdsAsGuest = async () => {
  const firstResponse = await fetchActiveAdsWithHeaders(getGuestReadHeaders());

  if (firstResponse.ok) {
    return parseApiResponse(firstResponse);
  }

  const shouldRetryWithApiKey =
    !!PUBLIC_READ_BEARER_TOKEN &&
    !!PUBLIC_READ_API_KEY &&
    [401, 403].includes(firstResponse.status);

  if (shouldRetryWithApiKey) {
    const retryResponse = await fetchActiveAdsWithHeaders({
      Accept: "application/json",
      apikey: PUBLIC_READ_API_KEY,
      "API-Key": PUBLIC_READ_API_KEY
    });

    return parseApiResponse(retryResponse);
  }

  if (!PUBLIC_READ_BEARER_TOKEN && !PUBLIC_READ_API_KEY) {
    throw new Error(
      "Guest read credential missing. Set VITE_PUBLIC_READ_BEARER_TOKEN or VITE_PUBLIC_READ_API_KEY in .env.local, then restart Vite."
    );
  }

  return parseApiResponse(firstResponse);
};

export const fetchActiveAds = async (accessToken) => {
  if (accessToken) {
    const response = await fetchActiveAdsWithHeaders(getAuthHeaders(accessToken, null, false));

    if (response.ok) {
      return parseApiResponse(response);
    }

    const authRejected = [401, 403].includes(response.status);
    const hasGuestFallback = !!PUBLIC_READ_BEARER_TOKEN || !!PUBLIC_READ_API_KEY;

    if (authRejected && hasGuestFallback) {
      return fetchActiveAdsAsGuest();
    }

    if (authRejected && !hasGuestFallback) {
      throw new Error(
        "Logged-in token is not authorized for Ads API. Subscribe this OAuth app to ceylonstay-ads-service in Bijira Dev Portal, or set VITE_PUBLIC_READ_BEARER_TOKEN / VITE_PUBLIC_READ_API_KEY for fallback."
      );
    }

    return parseApiResponse(response);
  }

  return fetchActiveAdsAsGuest();
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
