const ADMIN_BASE_URL =
  (
    import.meta.env.VITE_ADMIN_API_BASE_URL ||
    "https://a88642b8-2b68-4d73-b038-49eb67884ca4-prod.e1-us-east-azure.bijiraapis.dev/default/ceylonstay-admin-service/v1.0"
  ).replace(/\/+$/, "");

const SUPER_ADMIN_BASE_URL =
  (
    import.meta.env.VITE_SUPER_ADMIN_API_BASE_URL ||
    "https://a88642b8-2b68-4d73-b038-49eb67884ca4-prod.e1-us-east-azure.bijiraapis.dev/default/ceylonstay-super-admin-se/v1.0"
  ).replace(/\/+$/, "");

const CACHE_TTL_MS = 5 * 60 * 1000;

let accessCache = null;
let inflightPromise = null;

const buildHeaders = (accessToken, email) => ({
  Accept: "application/json",
  Authorization: `Bearer ${accessToken}`,
  "X-User-Email": email
});

const probeAccess = async (url, headers) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers
    });

    return response.ok;
  } catch {
    return false;
  }
};

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const isCacheValid = (email) =>
  !!accessCache &&
  accessCache.email === normalizeEmail(email) &&
  Date.now() - accessCache.timestamp < CACHE_TTL_MS;

export const clearRoleAccessCache = () => {
  accessCache = null;
};

export const resolveRoleAccess = async (accessToken, email, options = {}) => {
  const force = !!options.force;
  const normalizedEmail = normalizeEmail(email);

  if (!accessToken || !normalizedEmail) {
    return { isAdmin: false, isSuperAdmin: false };
  }

  if (!force && isCacheValid(normalizedEmail)) {
    return accessCache.data;
  }

  if (!force && inflightPromise) {
    return inflightPromise;
  }

  const headers = buildHeaders(accessToken, normalizedEmail);

  inflightPromise = (async () => {
    const [adminAllowed, superAdminAllowed] = await Promise.all([
      probeAccess(`${ADMIN_BASE_URL}/dashboard/kpis`, headers),
      probeAccess(`${SUPER_ADMIN_BASE_URL}/dashboard/kpis`, headers)
    ]);

    const data = {
      isAdmin: adminAllowed || superAdminAllowed,
      isSuperAdmin: superAdminAllowed
    };

    accessCache = {
      email: normalizedEmail,
      data,
      timestamp: Date.now()
    };

    return data;
  })();

  try {
    return await inflightPromise;
  } finally {
    inflightPromise = null;
  }
};

