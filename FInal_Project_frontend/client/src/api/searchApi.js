const normalizeBaseUrl = (rawValue) => {
  const cleaned = String(rawValue || "").replace(/\/+$/, "");
  return cleaned.endsWith("/ads") ? cleaned.slice(0, -4) : cleaned;
};

const PUBLIC_SEARCH_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_PUBLIC_SEARCH_BASE_URL || "http://100.72.161.91:30111"
);

const AUTH_SEARCH_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_AUTH_SEARCH_BASE_URL ||
    "https://a88642b8-2b68-4d73-b038-49eb67884ca4-dev.e1-us-east-azure.bijiraapis.dev/default/search-service/v1.0"
);

const parseSearchApiResponse = async (response) => {
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
      (typeof data === "string" ? data : null) ||
      `Search API failed: HTTP ${response.status}`;

    const error = new Error(
      typeof message === "string" ? message : `Search API failed: HTTP ${response.status}`
    );
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
};

const isInvalidTokenError = (error) => {
  if (!error || ![401, 403].includes(error.status)) return false;

  const payloadText =
    typeof error.payload === "string"
      ? error.payload
      : JSON.stringify(error.payload || {});

  const combined = `${error.message || ""} ${payloadText}`.toLowerCase();

  return (
    combined.includes("invalid_token") ||
    combined.includes("provided token is invalid") ||
    combined.includes("invalid credentials")
  );
};

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    query.set(key, String(value));
  });

  return query.toString();
};

const normalizeSearchResponse = (data) => {
  if (Array.isArray(data)) {
    return {
      total: data.length,
      items: data
    };
  }

  const items = Array.isArray(data?.items) ? data.items : [];
  const total = Number.isFinite(data?.total) ? data.total : items.length;

  return { total, items };
};

const requestPublic = async (path, params = {}) => {
  const query = buildQueryString(params);
  const url = `${PUBLIC_SEARCH_BASE_URL}${path}${query ? `?${query}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  });

  return parseSearchApiResponse(response);
};

const requestAuthorized = async (path, accessToken, params = {}) => {
  const query = buildQueryString(params);
  const url = `${AUTH_SEARCH_BASE_URL}${path}${query ? `?${query}` : ""}`;

  const baseHeaders = {
    Accept: "application/json"
  };
  const authHeaders = accessToken
    ? {
        ...baseHeaders,
        Authorization: `Bearer ${accessToken}`
      }
    : baseHeaders;

  const doFetch = async (headers) => {
    const response = await fetch(url, {
      method: "GET",
      headers
    });

    return parseSearchApiResponse(response);
  };

  try {
    return await doFetch(authHeaders);
  } catch (error) {
    if (accessToken && isInvalidTokenError(error)) {
      return doFetch(baseHeaders);
    }
    throw error;
  }
};

export const fetchPublicAds = async (params = {}) => {
  const data = await requestPublic("/ads", {
    skip: 0,
    limit: 100,
    only_active: true,
    ...params
  });

  return normalizeSearchResponse(data);
};

export const fetchPublicAdById = async (adId) => {
  const encodedId = encodeURIComponent(String(adId));
  const data = await requestPublic(`/ads/${encodedId}`);
  return data || null;
};

export const fetchAuthorizedAds = async (accessToken, params = {}) => {
  const query = {
    skip: 0,
    limit: 100,
    only_active: true,
    ...params
  };

  try {
    const data = await requestAuthorized("/ads", accessToken, query);
    return normalizeSearchResponse(data);
  } catch (error) {
    if (isInvalidTokenError(error)) {
      return fetchPublicAds(query);
    }
    throw error;
  }
};

const maybeNumber = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const maybeInt = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const normalizeText = (value) => String(value || "").trim().toLowerCase();
const normalizeType = (value) => normalizeText(value).replace(/[_\s]+/g, "-");

const matchesFilter = (ad, params = {}) => {
  const q = normalizeText(params.q);
  const district = normalizeText(params.district);
  const type = normalizeType(params.type);
  const minPrice = maybeNumber(params.min_price);
  const maxPrice = maybeNumber(params.max_price);
  const beds = maybeInt(params.beds);
  const baths = maybeInt(params.baths);

  const title = normalizeText(ad?.title);
  const description = normalizeText(ad?.description);
  const address = normalizeText(ad?.address);
  const adDistrict = normalizeText(ad?.district);
  const adType = normalizeType(ad?.type);
  const adPrice = maybeNumber(ad?.price);
  const adBeds = maybeInt(ad?.beds);
  const adBaths = maybeInt(ad?.baths);

  if (q && !title.includes(q) && !description.includes(q) && !address.includes(q)) return false;
  if (district && !adDistrict.includes(district)) return false;
  if (type && adType !== type) return false;
  if (minPrice !== undefined && (adPrice === undefined || adPrice < minPrice)) return false;
  if (maxPrice !== undefined && (adPrice === undefined || adPrice > maxPrice)) return false;
  if (beds !== undefined && adBeds !== beds) return false;
  if (baths !== undefined && adBaths !== baths) return false;

  return true;
};

export const searchPublicAds = async (params = {}) => {
  const query = {
    skip: 0,
    limit: 100,
    only_active: true,
    ...params
  };

  try {
    const data = await requestPublic("/ads/search", query);
    return normalizeSearchResponse(data);
  } catch (error) {
    if (error?.status !== 422) {
      throw error;
    }

    // Fallback for route-order issues where /ads/{ad_id} catches /ads/search.
    const fallback = await fetchPublicAds({
      skip: query.skip,
      limit: query.limit,
      only_active: query.only_active
    });
    const items = fallback.items.filter((ad) => matchesFilter(ad, query));

    return {
      total: items.length,
      items
    };
  }
};

export const searchAuthorizedAds = async (accessToken, params = {}) => {
  const query = {
    skip: 0,
    limit: 100,
    only_active: true,
    ...params
  };

  try {
    const data = await requestAuthorized("/ads/search", accessToken, query);
    return normalizeSearchResponse(data);
  } catch (error) {
    if (isInvalidTokenError(error)) {
      return searchPublicAds(query);
    }

    if (error?.status !== 422) {
      throw error;
    }

    const fallback = await fetchAuthorizedAds(accessToken, {
      skip: query.skip,
      limit: query.limit,
      only_active: query.only_active
    });
    const items = fallback.items.filter((ad) => matchesFilter(ad, query));

    return {
      total: items.length,
      items
    };
  }
};
