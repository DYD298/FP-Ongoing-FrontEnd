import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Loader2,
  Save,
  RefreshCw,
  ArrowLeft,
  UserX,
  Trash2,
  ShieldCheck,
  SaveAll
} from "lucide-react";
import { fetchMyAds, deleteAdById } from "../api/adsApi";

const API_BASE =
  "https://a88642b8-2b68-4d73-b038-49eb67884ca4-prod.e1-us-east-azure.bijiraapis.dev/default/ceylonstay-user-service/v1.0";

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #f8fafc 0%, #eef2ff 40%, #f5f3ff 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "32px 16px",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  wrapper: {
    width: "100%",
    maxWidth: "980px",
    display: "grid",
    gridTemplateColumns: "1fr 1.4fr",
    gap: "24px"
  },
  sidebarCard: {
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.7)",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)"
  },
  mainCard: {
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.8)",
    borderRadius: "24px",
    padding: "30px",
    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)"
  },
  avatar: {
    width: "84px",
    height: "84px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #46904d, #3cdf67)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    marginBottom: "18px",
    boxShadow: "0 12px 30px rgba(79, 70, 229, 0.25)"
  },
  heading: {
    fontSize: "28px",
    fontWeight: 800,
    color: "#0f172a",
    margin: 0
  },
  subheading: {
    fontSize: "14px",
    color: "#64748b",
    marginTop: "8px",
    lineHeight: 1.6
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: "14px"
  },
  profileMeta: {
    marginTop: "22px",
    display: "grid",
    gap: "12px"
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#475569",
    fontSize: "14px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: "12px 14px",
    borderRadius: "14px"
  },
  formGrid: {
    display: "grid",
    gap: "18px"
  },
  inputGroup: {
    display: "grid",
    gap: "8px"
  },
  label: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#334155"
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#ffffff",
    border: "1px solid #dbeafe",
    borderRadius: "16px",
    padding: "14px 16px",
    boxShadow: "0 4px 14px rgba(15, 23, 42, 0.04)"
  },
  icon: {
    color: "#3e7e33",
    flexShrink: 0
  },
  input: {
    width: "100%",
    border: "none",
    outline: "none",
    fontSize: "15px",
    color: "#0f172a",
    background: "transparent"
  },
  textareaWrapper: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    background: "#ffffff",
    border: "1px solid #dbeafe",
    borderRadius: "16px",
    padding: "14px 16px",
    boxShadow: "0 4px 14px rgba(15, 23, 42, 0.04)"
  },
  textarea: {
    width: "100%",
    minHeight: "110px",
    border: "none",
    outline: "none",
    fontSize: "15px",
    color: "#0f172a",
    resize: "vertical",
    background: "transparent",
    fontFamily: "inherit"
  },
  bannerSuccess: {
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    color: "#065f46",
    padding: "12px 14px",
    borderRadius: "14px",
    fontSize: "14px",
    marginBottom: "18px"
  },
  bannerError: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    padding: "12px 14px",
    borderRadius: "14px",
    fontSize: "14px",
    marginBottom: "18px"
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "24px"
  },
  topBarLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  topBarActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap"
  },
  formTitle: {
    fontSize: "26px",
    fontWeight: 800,
    color: "#0f172a",
    margin: 0
  },
  formSubtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0
  },
  buttonRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "10px"
  },
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px 18px",
    borderRadius: "14px",
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg, #0d6116, #3fa539)",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "14px",
    boxShadow: "0 12px 24px rgba(79, 70, 229, 0.22)"
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px 18px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    cursor: "pointer",
    background: "#ffffff",
    color: "#334155",
    fontWeight: 700,
    fontSize: "14px"
  },
  warningButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px 18px",
    borderRadius: "14px",
    border: "none",
    cursor: "pointer",
    background: "#fff7ed",
    color: "#c2410c",
    fontWeight: 700,
    fontSize: "14px"
  },
  dangerButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px 18px",
    borderRadius: "14px",
    border: "none",
    cursor: "pointer",
    background: "#fef2f2",
    color: "#b91c1c",
    fontWeight: 700,
    fontSize: "14px"
  },
  disabled: {
    opacity: 0.6,
    cursor: "not-allowed"
  },
  actionSection: {
    marginTop: "26px",
    paddingTop: "22px",
    borderTop: "1px solid #e2e8f0"
  },
  loadingBox: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg, #f8fafc 0%, #eef2ff 40%, #f5f3ff 100%)",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  loadingCard: {
    background: "#ffffff",
    padding: "30px 34px",
    borderRadius: "24px",
    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "14px"
  },
  spinner: {
    animation: "spin 1s linear infinite"
  }
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon,
  readOnly = false
}) => (
  <div style={styles.inputGroup}>
    <label style={styles.label}>{label}</label>
    <div style={styles.inputWrapper}>
      <div style={styles.icon}>{icon}</div>
      <input
        style={styles.input}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </div>
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const { state, signOut, getAccessToken } = useAuthContext();
  const sessionEmail = state?.email || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: ""
  });

  const [loading, setLoading] = useState(true);
  const [workingAction, setWorkingAction] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const getSessionCredentials = useCallback(async () => {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      throw new Error("No access token available. Please log in again.");
    }

    if (!sessionEmail) {
      throw new Error("No user email found in the current session.");
    }

    return { accessToken, email: sessionEmail };
  }, [getAccessToken, sessionEmail]);

  const buildHeaders = useCallback(async (json = false) => {
    const { accessToken, email } = await getSessionCredentials();

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "X-User-Email": email,
      Accept: "application/json"
    };

    if (json) headers["Content-Type"] = "application/json";
    return headers;
  }, [getSessionCredentials]);

  const deleteAllPostedAds = useCallback(async () => {
    const result = {
      totalCount: 0,
      deletedCount: 0,
      failedCount: 0,
      failedAdIds: [],
      warning: ""
    };

    const isIgnorableDeleteError = (error) => {
      const text = String(error?.message || "").toLowerCase();
      return text.includes("404") || text.includes("not found") || text.includes("already deleted");
    };

    try {
      const { accessToken, email } = await getSessionCredentials();
      const ads = await fetchMyAds(accessToken, email);

      if (!Array.isArray(ads) || ads.length === 0) {
        return result;
      }

      result.totalCount = ads.length;

      for (const ad of ads) {
        if (!ad?.id) continue;

        let deleted = false;
        let lastError = null;

        for (let attempt = 1; attempt <= 2; attempt += 1) {
          try {
            await deleteAdById(accessToken, ad.id, email);
            deleted = true;
            break;
          } catch (error) {
            lastError = error;

            if (isIgnorableDeleteError(error)) {
              deleted = true;
              break;
            }

            if (attempt === 1) {
              await new Promise((resolve) => setTimeout(resolve, 250));
            }
          }
        }

        if (deleted) {
          result.deletedCount += 1;
        } else {
          console.error(`Failed to delete ad ${ad.id}:`, lastError);
          result.failedAdIds.push(ad.id);
        }
      }

      result.failedCount = result.failedAdIds.length;
      return result;
    } catch (error) {
      console.error("Could not complete ad cleanup before account action:", error);
      result.warning = error?.message || "Could not verify ad cleanup.";
      return result;
    }
  }, [getSessionCredentials]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 4000);
  };

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: "GET",
        headers: await buildHeaders()
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch profile: ${res.status}`);
      }

      const data = await res.json();

      setFormData({
        name: data.name || "",
        email: data.email || sessionEmail,
        phone: data.phone || "",
        address: data.address || "",
        description: data.description || ""
      });
    } catch (err) {
      console.error(err);
      showMessage("error", "Unable to load profile details.");
      setFormData((prev) => ({
        ...prev,
        email: sessionEmail
      }));
    } finally {
      setLoading(false);
    }
  }, [buildHeaders, sessionEmail]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const updateProfile = async () => {
    setWorkingAction("put");

    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: await buildHeaders(true),
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          description: formData.description
        })
      });

      if (!res.ok) throw new Error("Update failed");

      showMessage("success", "Profile updated successfully.");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      console.error(err);
      showMessage("error", "Profile update failed.");
    } finally {
      setWorkingAction("");
    }
  };

  const patchProfile = async () => {
    setWorkingAction("patch");

    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: "PATCH",
        headers: await buildHeaders(true),
        body: JSON.stringify({
          phone: formData.phone,
          address: formData.address
        })
      });

      if (!res.ok) throw new Error("update failed");

      showMessage("success", "Selected fields updated successfully.");
    } catch (err) {
      console.error(err);
      showMessage("error", "update request failed.");
    } finally {
      setWorkingAction("");
    }
  };

  const deactivateAccount = async () => {
    const confirmed = window.confirm("Deactivate account?");
    if (!confirmed) return;

    setWorkingAction("deactivate");

    try {
      const cleanup = await deleteAllPostedAds();
      const res = await fetch(`${API_BASE}/account/deactivate`, {
        method: "POST",
        headers: await buildHeaders()
      });

      if (!res.ok) throw new Error("Deactivate failed");

      let successMessage = "Account deactivated successfully.";

      if (cleanup.totalCount > 0) {
        successMessage = `Account deactivated. Deleted ${cleanup.deletedCount}/${cleanup.totalCount} posted ads.`;
      }

      if (cleanup.failedCount > 0) {
        successMessage += ` ${cleanup.failedCount} ad(s) could not be deleted automatically.`;
      }

      if (cleanup.warning) {
        successMessage += ` Cleanup warning: ${cleanup.warning}`;
      }

      showMessage(
        "success",
        successMessage
      );
    } catch (err) {
      console.error(err);
      showMessage("error", err.message || "Failed to deactivate account.");
    } finally {
      setWorkingAction("");
    }
  };

  const deleteAccount = async () => {
    const confirmed = window.confirm("Delete account permanently?");
    if (!confirmed) return;

    setWorkingAction("delete");

    try {
      const cleanup = await deleteAllPostedAds();
      const res = await fetch(`${API_BASE}/account`, {
        method: "DELETE",
        headers: await buildHeaders()
      });

      if (!res.ok) throw new Error("Delete failed");

      let successMessage = "Account deleted successfully.";

      if (cleanup.totalCount > 0) {
        successMessage = `Account deleted. Removed ${cleanup.deletedCount}/${cleanup.totalCount} posted ads.`;
      }

      if (cleanup.failedCount > 0) {
        successMessage += ` ${cleanup.failedCount} ad(s) could not be deleted automatically.`;
      }

      if (cleanup.warning) {
        successMessage += ` Cleanup warning: ${cleanup.warning}`;
      }

      showMessage(
        "success",
        successMessage
      );

      setTimeout(async () => {
        await signOut();
        navigate("/");
      }, 1000);
    } catch (err) {
      console.error(err);
      showMessage("error", err.message || "Failed to delete account.");
    } finally {
      setWorkingAction("");
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingBox}>
        <div style={styles.loadingCard}>
          <Loader2 size={38} style={styles.spinner} />
          <div style={{ fontWeight: 700, color: "#0f172a" }}>
            Loading profile...
          </div>
          <div style={{ color: "#64748b", fontSize: "14px" }}>
            Please wait while we fetch your details
          </div>
        </div>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @media (max-width: 860px) {
            .profile-layout {
              grid-template-columns: 1fr !important;
            }
          }

          input::placeholder,
          textarea::placeholder {
            color: #94a3b8;
          }
        `}</style>
      </div>
    );
  }

  const isBusy = workingAction !== "";

  return (
    <div style={styles.page}>
      <div className="profile-layout" style={styles.wrapper}>
        <div style={styles.sidebarCard}>
          <div style={styles.avatar}>
            <User size={36} />
          </div>

          <h1 style={styles.heading}>{formData.name || "Profile Account"}</h1>
          <p style={styles.subheading}>
            Manage your personal profile information, contact details, and
            account settings from one place.
          </p>

          <div style={styles.profileMeta}>
            <div style={styles.metaItem}>
              <Mail size={16} />
              <span>{formData.email || sessionEmail}</span>
            </div>

            <div style={styles.metaItem}>
              <Phone size={16} />
              <span>{formData.phone || "No phone added"}</span>
            </div>

            <div style={styles.metaItem}>
              <MapPin size={16} />
              <span>{formData.address || "No address added"}</span>
            </div>

            <div style={styles.metaItem}>
              <ShieldCheck size={16} />
              <span>Secure account management</span>
            </div>
          </div>
        </div>

        <div style={styles.mainCard}>
          <div style={styles.topBar}>
            <div style={styles.topBarLeft}>
              <h2 style={styles.formTitle}>Edit Profile</h2>
              <p style={styles.formSubtitle}>
                Keep your account information accurate and up to date.
              </p>
            </div>

            <div style={styles.topBarActions}>
              <button
                onClick={() => navigate("/listings")}
                disabled={isBusy}
                style={{
                  ...styles.secondaryButton,
                  ...(isBusy ? styles.disabled : {})
                }}
              >
                <ArrowLeft size={16} />
                Back to Listings
              </button>

              <button
                onClick={fetchProfile}
                disabled={isBusy}
                style={{
                  ...styles.secondaryButton,
                  ...(isBusy ? styles.disabled : {})
                }}
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>

          {message.text ? (
            <div
              style={
                message.type === "success"
                  ? styles.bannerSuccess
                  : styles.bannerError
              }
            >
              {message.text}
            </div>
          ) : null}

          <div style={styles.formGrid}>
            <InputField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              icon={<User size={18} />}
            />

            <InputField
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              icon={<Mail size={18} />}
              readOnly
            />

            <InputField
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              icon={<Phone size={18} />}
            />

            <InputField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              icon={<MapPin size={18} />}
            />

            <div style={styles.inputGroup}>
              <label style={styles.label}>Profile Description</label>
              <div style={styles.textareaWrapper}>
                <div style={styles.icon}>
                  <FileText size={18} />
                </div>
                <textarea
                  style={styles.textarea}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write something about yourself..."
                />
              </div>
            </div>
          </div>

          <div style={styles.buttonRow}>
            <button
              onClick={updateProfile}
              disabled={isBusy}
              style={{
                ...styles.primaryButton,
                ...(isBusy ? styles.disabled : {})
              }}
            >
              {workingAction === "put" ? (
                <Loader2 size={16} style={styles.spinner} />
              ) : (
                <Save size={16} />
              )}
              Save Changes
            </button>

            <button
              onClick={patchProfile}
              disabled={isBusy}
              style={{
                ...styles.secondaryButton,
                ...(isBusy ? styles.disabled : {})
              }}
            >
              {workingAction === "patch" ? (
                <Loader2 size={16} style={styles.spinner} />
              ) : (
                <SaveAll size={16} />
              )}
              Update
            </button>
          </div>

          <div style={styles.actionSection}>
            <div style={styles.sectionTitle}>Danger Zone</div>
            <div style={styles.buttonRow}>
              <button
                onClick={deactivateAccount}
                disabled={isBusy}
                style={{
                  ...styles.warningButton,
                  ...(isBusy ? styles.disabled : {})
                }}
              >
                {workingAction === "deactivate" ? (
                  <Loader2 size={16} style={styles.spinner} />
                ) : (
                  <UserX size={16} />
                )}
                Deactivate Account
              </button>

              <button
                onClick={deleteAccount}
                disabled={isBusy}
                style={{
                  ...styles.dangerButton,
                  ...(isBusy ? styles.disabled : {})
                }}
              >
                {workingAction === "delete" ? (
                  <Loader2 size={16} style={styles.spinner} />
                ) : (
                  <Trash2 size={16} />
                )}
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 860px) {
          .profile-layout {
            grid-template-columns: 1fr !important;
          }
        }

        input::placeholder,
        textarea::placeholder {
          color: #94a3b8;
        }

        button {
          transition: all 0.2s ease;
        }

        button:hover:not(:disabled) {
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
