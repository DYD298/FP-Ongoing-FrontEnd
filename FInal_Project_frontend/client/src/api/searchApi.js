const PUBLIC_SEARCH_BASE_URL = (
  import.meta.env.VITE_PUBLIC_SEARCH_BASE_URL || "http://100.72.161.91:30111"
).replace(/\/+$/, "");

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

const maybeNumber = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const matchesFilter = (ad, params = {}) => {
  const q = String(params.q || "").trim().toLowerCase();
  const district = String(params.district || "").trim().toLowerCase();
  const type = String(params.type || "").trim().toLowerCase();
  const minPrice = maybeNumber(params.min_price);
  const maxPrice = maybeNumber(params.max_price);
  const beds = maybeNumber(params.beds);
  const baths = maybeNumber(params.baths);

  const title = String(ad?.title || "").toLowerCase();
  const description = String(ad?.description || "").toLowerCase();
  const adDistrict = String(ad?.district || "").toLowerCase();
  const adType = String(ad?.type || "").toLowerCase();
  const adPrice = maybeNumber(ad?.price);
  const adBeds = maybeNumber(ad?.beds);
  const adBaths = maybeNumber(ad?.baths);

  if (q && !title.includes(q) && !description.includes(q)) return false;
  if (district && adDistrict !== district) return false;
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
