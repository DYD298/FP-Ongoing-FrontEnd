const NOTIFICATION_BASE_URL =
  "https://a88642b8-2b68-4d73-b038-49eb67884ca4-prod.e1-us-east-azure.bijiraapis.dev/default/ceylonstay-notification-s/v1.0";

const parseApiResponse = async (response) => {
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

const buildHeaders = (accessToken, email) => ({
  Authorization: `Bearer ${accessToken}`,
  "X-User-Email": email,
  Accept: "application/json"
});

export const fetchNotifications = async (accessToken, email) => {
  const response = await fetch(`${NOTIFICATION_BASE_URL}/notifications`, {
    method: "GET",
    headers: buildHeaders(accessToken, email)
  });

  const data = await parseApiResponse(response);
  return Array.isArray(data) ? data : [];
};

export const markAllNotificationsRead = async (accessToken, email) => {
  const response = await fetch(`${NOTIFICATION_BASE_URL}/notifications/mark-read`, {
    method: "PUT",
    headers: buildHeaders(accessToken, email)
  });

  return parseApiResponse(response);
};
