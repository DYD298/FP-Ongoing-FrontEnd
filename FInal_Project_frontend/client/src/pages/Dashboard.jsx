import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  LogOut,
  Mail,
  Phone,
  MapPin,
  FileText,
  Save,
  Loader2,
  ShieldCheck,
  Home,
  PlusCircle,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { useAuthContext } from "@asgardeo/auth-react";


const API_BASE =
  "https://a88642b8-2b68-4d73-b038-49eb67884ca4-prod.e1-us-east-azure.bijiraapis.dev/default/ceylonstay-user-service/v1.0";

// Testing only. Replace with a fresh valid token.
const BIJIRA_TOKEN =
  "eyJ4NXQjUzI1NiI6IktWbUxKc2p3ZzIxNWlabmxEdnNPWkJXMWJSMFdkOVRka0R3ckVvSHVUSnMiLCJraWQiOiJhODg2NDJiOC0yYjY4LTRkNzMtYjAzOC00OWViNjc4ODRjYTQjNDk3MWM0YjMtNWM4ZC00YWIwLWEyMTEtYmRjMDAzMWVjNjczIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI0OG5yUU5DMU91TnRXNDZSZEVLRE9JdmgzTXhKIiwiYXVkIjoiNDhuclFOQzFPdU50VzQ2UmRFS0RPSXZoM014SiIsImF1dCI6IkFQUExJQ0FUSU9OIiwibmJmIjoxNzczMzg1NDA4LCJhenAiOiI0OG5yUU5DMU91TnRXNDZSZEVLRE9JdmgzTXhKIiwib3JnYW5pemF0aW9uIjp7InV1aWQiOiJhODg2NDJiOC0yYjY4LTRkNzMtYjAzOC00OWViNjc4ODRjYTQifSwic2NvcGUiOiIiLCJpc3MiOiJodHRwczovL2E4ODY0MmI4LTJiNjgtNGQ3My1iMDM4LTQ5ZWI2Nzg4NGNhNC1wcm9kLmUxLXVzLWVhc3QtYXp1cmUuY2hvcmVvc3RzLmRldi9vYXV0aDIvdG9rZW4iLCJleHAiOjE3NzM0MDcwMDgsImlhdCI6MTc3MzM4NTQwOCwianRpIjoiOWMzOGUwMTctMDY2Yy00MzhhLTkyZWUtNGRkZGY5NjA1NzFkIn0.q3hruL9cQ6MQbx6JZDlflTrxZi43vSFvo76SICKueMdwgrqlT1PfOmRnPpTZcdM_WJO2H-JHLYfN8biYuDCVOq9pctZuJm_tRKleofHg1qwj6jSZeOInZ_G03ddKQqvbsUuZwc8IbXHCjyYHIGhQPpywWkhAMaL174iatBQBFC6N2YEy5kqnt6pROTgJiI_U0W-gCu82QQsaZWFY3l2YCTAv5pIm38HXfIk7w5RADym9hWX7PHkwowYkomDqM5tnjne4siegAgcAIhYdVOQRZ1Wob6GHs-2q2QT4IQZAfock2T2_SGBq41yYWgFI9-EPJZqKy57M6N9dGUP9sbdz1g";

const Dashboard = () => {
  const navigate = useNavigate();
  const { state, signOut, signIn } = useAuthContext();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: ""
  });

  const [errors, setErrors] = useState({});
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [banner, setBanner] = useState({ type: "", message: "" });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!state.isAuthenticated) {
        setIsInitialLoading(false);
        return;
      }

      if (!state.email) {
        setFormData({
          name: state.displayName || "",
          email: "",
          phone: "",
          address: "",
          description: ""
        });
        setIsInitialLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${BIJIRA_TOKEN}`,
            "X-User-Email": state.email,
            Accept: "application/json"
          }
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Failed to fetch profile: ${response.status} ${text}`);
        }

        const data = await response.json();

        setFormData({
          name: data.name || state.displayName || "",
          email: data.email || state.email || "",
          phone: data.phone || "",
          address: data.address || "",
          description: data.description || ""
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);

        setFormData({
          name: state.displayName || "",
          email: state.email || "",
          phone: "",
          address: "",
          description: ""
        });

        setBanner({
          type: "error",
          message: "Could not load profile from server. Showing basic account info."
        });
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchProfileData();
  }, [state.isAuthenticated, state.displayName, state.email]);

  const handleLogout = async () => {
    await signOut();
  };

  const handleLogin = async () => {
    await signIn();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }

    if (banner.message) {
      setBanner({ type: "", message: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    const phoneRegex = /^\+?[\d\s-]{10,}$/;

    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSave = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  setIsSaving(true);

  try {
    const response = await fetch(`${API_BASE}/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${BIJIRA_TOKEN}`,
        "X-User-Email": state.email,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        description: formData.description
      })
    });

    if (!response.ok) {
      throw new Error("Update failed");
    }

    setBanner({
      type: "success",
      message: "Profile updated successfully."
    });

   
    setTimeout(() => {
      navigate("/");
    }, 1000);

  } catch (err) {
    setBanner({
      type: "error",
      message: err.message
    });
  } finally {
    setIsSaving(false);
  }
};

  if (state.isLoading || isInitialLoading) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center dashboard-bg">
        <div className="glass-loader text-center p-4 rounded-4 shadow-lg">
          <Loader2 className="spin text-success mb-3" size={42} />
          <h5 className="fw-bold mb-1">Loading your profile</h5>
          <p className="text-muted mb-0">Please wait a moment...</p>
        </div>

        <style>{`
          .dashboard-bg {
            background:
              radial-gradient(circle at top left, rgba(25,135,84,0.10), transparent 35%),
              radial-gradient(circle at bottom right, rgba(32,201,151,0.12), transparent 30%),
              linear-gradient(135deg, #f8fafc 0%, #eefaf4 100%);
          }
          .glass-loader {
            background: rgba(255,255,255,0.8);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.7);
          }
          .spin {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!state.isAuthenticated) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center dashboard-bg px-3">
        <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 text-center" style={{ maxWidth: "420px", width: "100%" }}>
          <div
            className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "72px",
              height: "72px",
              background: "linear-gradient(135deg, #198754, #20c997)",
              color: "#fff"
            }}
          >
            <User size={30} />
          </div>
          <h2 className="fw-bold mb-2">Welcome back</h2>
          <p className="text-muted mb-4">Sign in to manage your profile and account details.</p>
          <button
            className="btn btn-success btn-lg rounded-pill px-4 fw-semibold"
            onClick={handleLogin}
            style={{ background: "linear-gradient(135deg, #198754, #20c997)", border: "none" }}
          >
            Login with Google
          </button>
        </div>

        <style>{`
          .dashboard-bg {
            background:
              radial-gradient(circle at top left, rgba(25,135,84,0.10), transparent 35%),
              radial-gradient(circle at bottom right, rgba(32,201,151,0.12), transparent 30%),
              linear-gradient(135deg, #f8fafc 0%, #eefaf4 100%);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-vh-100 dashboard-bg py-5 px-2">
      <div className="container py-3">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="row justify-content-center"
        >
          <div className="col-12 col-xl-10">
            <div className="card border-0 shadow-lg rounded-5 overflow-hidden dashboard-card">
              <div className="profile-hero position-relative">
                <div className="hero-overlay"></div>

                <div className="position-relative z-2 p-4 p-md-5">
                  <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-4">
                    <div className="d-flex align-items-center gap-4 flex-wrap">
                      <div className="profile-avatar shadow-lg">
                        {state.picture ? (
                          <img
                            src={state.picture}
                            alt="Profile"
                            className="w-100 h-100 object-fit-cover"
                          />
                        ) : (
                          <User size={60} className="text-secondary opacity-50" />
                        )}
                      </div>

                      <div className="text-white">
                        <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill hero-badge mb-3">
                          <ShieldCheck size={16} />
                          <span className="fw-semibold small">Verified Account</span>
                        </div>

                        <h2 className="fw-bold mb-1">{formData.name || "User"}</h2>
                        <p className="mb-2 text-white-50">{formData.email}</p>

                        <div className="d-flex flex-wrap gap-2 mt-2">
                          <span className="mini-chip">
                            <Mail size={14} /> Account Email
                          </span>
                          <span className="mini-chip">
                            <Phone size={14} /> Personal Details
                          </span>
                          <span className="mini-chip">
                            <MapPin size={14} /> Address Info
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex flex-wrap gap-2">
                      <button
                        onClick={() => navigate("/listings")}
                        className="btn btn-light rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm"
                      >
                        <Home size={18} />
                        View Listings
                      </button>

                      <button
                        onClick={() => navigate("/post-ad")}
                        className="btn rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm text-white hero-action-btn"
                      >
                        <PlusCircle size={18} />
                        Post New Ad
                      </button>

                      <button
                        onClick={handleLogout}
                        className="btn btn-outline-light rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body p-4 p-md-5">
                <div className="row g-4">
                  <div className="col-lg-4">
                    <div className="info-panel h-100">
                      <h5 className="fw-bold mb-3">Profile Overview</h5>
                      <p className="text-muted mb-4">
                        Update your public and private details to keep your account accurate and professional.
                      </p>

                      <div className="overview-item">
                        <div className="overview-icon">
                          <User size={18} />
                        </div>
                        <div>
                          <div className="overview-label">Full Name</div>
                          <div className="overview-value">{formData.name || "Not added yet"}</div>
                        </div>
                      </div>

                      <div className="overview-item">
                        <div className="overview-icon">
                          <Mail size={18} />
                        </div>
                        <div>
                          <div className="overview-label">Email</div>
                          <div className="overview-value">{formData.email || "Not available"}</div>
                        </div>
                      </div>

                      <div className="overview-item">
                        <div className="overview-icon">
                          <Phone size={18} />
                        </div>
                        <div>
                          <div className="overview-label">Phone</div>
                          <div className="overview-value">{formData.phone || "Not added yet"}</div>
                        </div>
                      </div>

                      <div className="overview-item">
                        <div className="overview-icon">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <div className="overview-label">Address</div>
                          <div className="overview-value">{formData.address || "Not added yet"}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-8">
                    <div className="form-panel">
                      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                        <div>
                          <h4 className="fw-bold mb-1">Edit Profile</h4>
                          <p className="text-muted mb-0">
                            Manage your personal details and public profile information.
                          </p>
                        </div>
                      </div>

                      {banner.message && (
                        <div
                          className={`alert d-flex align-items-start gap-2 rounded-4 border-0 mb-4 ${
                            banner.type === "success" ? "alert-success" : "alert-danger"
                          }`}
                        >
                          {banner.type === "success" ? (
                            <CheckCircle2 size={18} className="mt-1 flex-shrink-0" />
                          ) : (
                            <AlertCircle size={18} className="mt-1 flex-shrink-0" />
                          )}
                          <div>{banner.message}</div>
                        </div>
                      )}

                      <form onSubmit={handleSave}>
                        <div className="row g-4">
                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-dark">Full Name</label>
                            <div className="input-modern">
                              <User size={18} className="input-modern-icon" />
                              <input
                                type="text"
                                className="form-control border-0 shadow-none"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                              />
                            </div>
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-dark">Email Address</label>
                            <div className="input-modern readonly">
                              <Mail size={18} className="input-modern-icon" />
                              <input
                                type="email"
                                className="form-control border-0 shadow-none"
                                value={formData.email}
                                readOnly
                                disabled
                                placeholder="Verified email"
                              />
                            </div>
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-dark">Phone Number</label>
                            <div className={`input-modern ${errors.phone ? "input-error" : ""}`}>
                              <Phone size={18} className="input-modern-icon" />
                              <input
                                type="tel"
                                className="form-control border-0 shadow-none"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                              />
                            </div>
                            {errors.phone && (
                              <div className="text-danger small mt-2">{errors.phone}</div>
                            )}
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-dark">Address</label>
                            <div className="input-modern">
                              <MapPin size={18} className="input-modern-icon" />
                              <input
                                type="text"
                                className="form-control border-0 shadow-none"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your address"
                              />
                            </div>
                          </div>

                          <div className="col-12">
                            <label className="form-label fw-semibold text-dark">Bio / Description</label>
                            <div className="textarea-modern">
                              <FileText size={18} className="input-modern-icon mt-1" />
                              <textarea
                                className="form-control border-0 shadow-none"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                                placeholder="Tell other users a bit about yourself..."
                                style={{ resize: "none" }}
                              />
                            </div>
                          </div>

                          <div className="col-12 pt-2">
                            <button
                              type="submit"
                              disabled={isSaving}
                              className="btn save-btn w-100 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 border-0"
                            >
                              {isSaving ? (
                                <>
                                  <Loader2 className="spin" size={20} />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save size={20} />
                                  Save Profile
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .dashboard-bg {
          background:
            radial-gradient(circle at top left, rgba(25,135,84,0.10), transparent 35%),
            radial-gradient(circle at bottom right, rgba(32,201,151,0.12), transparent 30%),
            linear-gradient(135deg, #f8fafc 0%, #eefaf4 100%);
        }

        .dashboard-card {
          background: rgba(255,255,255,0.94);
          backdrop-filter: blur(10px);
        }

        .profile-hero {
          background: linear-gradient(135deg, #157347 0%, #198754 45%, #20c997 100%);
          min-height: 280px;
          overflow: hidden;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18), transparent 22%),
            radial-gradient(circle at 80% 10%, rgba(255,255,255,0.12), transparent 18%),
            radial-gradient(circle at 85% 80%, rgba(255,255,255,0.10), transparent 20%);
        }

        .profile-avatar {
          width: 132px;
          height: 132px;
          border-radius: 50%;
          overflow: hidden;
          background: rgba(255,255,255,0.95);
          border: 5px solid rgba(255,255,255,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .hero-badge {
          background: rgba(255,255,255,0.16);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.22);
        }

        .mini-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          background: rgba(255,255,255,0.14);
          color: white;
          border: 1px solid rgba(255,255,255,0.18);
        }

        .hero-action-btn {
          background: rgba(255,255,255,0.16);
          backdrop-filter: blur(8px);
        }

        .hero-action-btn:hover {
          background: rgba(255,255,255,0.24);
          color: #fff;
        }

        .info-panel,
        .form-panel {
          background: #ffffff;
          border: 1px solid #eef2f7;
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
          height: 100%;
        }

        .overview-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 14px;
          border-radius: 18px;
          background: #f8fafc;
          border: 1px solid #eef2f7;
          margin-bottom: 14px;
        }

        .overview-icon {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          background: linear-gradient(135deg, #198754, #20c997);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .overview-label {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #6b7280;
          margin-bottom: 2px;
        }

        .overview-value {
          font-size: 15px;
          font-weight: 600;
          color: #111827;
          word-break: break-word;
        }

        .input-modern,
        .textarea-modern {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f8fafc;
          border: 1px solid #e9eef5;
          border-radius: 18px;
          padding: 14px 16px;
          transition: all 0.2s ease;
        }

        .textarea-modern {
          align-items: flex-start;
        }

        .input-modern:focus-within,
        .textarea-modern:focus-within {
          background: #ffffff;
          border-color: #20c997;
          box-shadow: 0 0 0 4px rgba(32, 201, 151, 0.12);
        }

        .input-modern.readonly {
          opacity: 0.85;
          background: #f1f5f9;
        }

        .input-modern.input-error {
          border-color: #dc3545;
          box-shadow: 0 0 0 4px rgba(220, 53, 69, 0.08);
        }

        .input-modern-icon {
          color: #198754;
          flex-shrink: 0;
        }

        .input-modern .form-control,
        .textarea-modern .form-control {
          background: transparent !important;
          padding: 0;
          font-size: 15px;
          color: #111827;
        }

        .input-modern .form-control::placeholder,
        .textarea-modern .form-control::placeholder {
          color: #94a3b8;
        }

        .save-btn {
          background: linear-gradient(135deg, #157347 0%, #198754 45%, #20c997 100%);
          color: white;
          box-shadow: 0 10px 24px rgba(25, 135, 84, 0.25);
          transition: all 0.2s ease;
        }

        .save-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          color: white;
          box-shadow: 0 14px 30px rgba(25, 135, 84, 0.3);
        }

        .save-btn:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 991px) {
          .profile-hero {
            min-height: auto;
          }

          .profile-avatar {
            width: 108px;
            height: 108px;
          }
        }

        @media (max-width: 576px) {
          .profile-avatar {
            width: 92px;
            height: 92px;
          }

          .info-panel,
          .form-panel {
            padding: 18px;
            border-radius: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;