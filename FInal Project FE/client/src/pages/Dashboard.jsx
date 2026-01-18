import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut, Mail, Phone, MapPin, FileText, Save, Loader2 } from 'lucide-react';
import { useAuthContext } from "@asgardeo/auth-react";

const Dashboard = () => {
  const navigate = useNavigate();
  // 1. Added getAccessToken to interact with FastAPI
  const { state, signOut, getAccessToken } = useAuthContext();

  const [formData, setFormData] = useState({
    name: '', 
    email: '',
    phone: '',
    address: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 2. GET Profile from FastAPI on Load
  useEffect(() => {
    const fetchProfileData = async () => {
      if (state.isAuthenticated) {
        try {
          const token = await getAccessToken();
          const response = await fetch("http://127.0.0.1:8000/profile", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            // Merge Google data with our database data
            setFormData({
              name: data.name || state.displayName || '',
              email: data.email || state.email || '',
              phone: data.phone || '',
              address: data.address || '',
              description: data.description || ''
            });
          }
        } catch (err) {
          console.error("Failed to fetch profile from backend:", err);
          // Fallback to Google data only if backend fails
          setFormData(prev => ({
            ...prev,
            name: state.displayName || '',
            email: state.email || ''
          }));
        } finally {
          setIsInitialLoading(false);
        }
      }
    };

    fetchProfileData();
  }, [state.isAuthenticated, getAccessToken, state.displayName, state.email]);

  const handleLogout = () => {
    signOut();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // 3. PUT Profile to FastAPI on Save
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const token = await getAccessToken();
      const response = await fetch("http://127.0.0.1:8000/profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          description: formData.description
        })
      });

      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail || "Failed to save"}`);
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Network error. Is the backend running?");
    } finally {
      setIsSaving(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    const phoneRegex = /^\?[\d\s-]{10,}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (state.isLoading || isInitialLoading) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <Loader2 className="animate-spin text-success mb-2" size={40} />
        <p className="fw-bold text-muted">Loading Your Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light py-5 mt-5">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="row justify-content-center"
        >
          <div className="col-lg-8 col-xl-7">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              
              <div className="p-4" style={{ background: 'linear-gradient(45deg, #198754, #20c997)', height: '150px' }}>
                <div className="position-absolute top-0 end-0 m-4">
                  <div className="d-flex gap-2">
                    <button onClick={() => navigate('/listings')} className="btn btn-light btn-sm d-flex align-items-center gap-2 fw-bold shadow-sm">
                      <MapPin size={16} /> VIEW LISTINGS
                    </button>
                    <button onClick={handleLogout} className="btn btn-outline-light btn-sm d-flex align-items-center gap-2 fw-bold shadow-sm bg-white text-danger border-0">
                      <LogOut size={16} /> LOG OUT
                    </button>
                  </div>
                </div>
              </div>

              <div className="card-body p-4 p-md-5 pt-0">
                <div className="d-flex justify-content-between align-items-end mb-5" style={{ marginTop: '-75px' }}>
                  <div className="rounded-circle bg-white d-flex justify-content-center align-items-center shadow-lg border border-4 border-white overflow-hidden" style={{ width: '150px', height: '150px' }}>
                    {state.picture ? (
                      <img src={state.picture} alt="Profile" className="w-100 h-100 object-fit-cover" />
                    ) : (
                      <User size={64} className="text-secondary opacity-50" />
                    )}
                  </div>
                </div>

                <div className="text-center text-md-start mb-5 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                   <div>
                     <h2 className="fw-bold text-dark mb-1">{formData.name || "User"}</h2>
                     <p className="text-muted">{formData.email}</p>
                   </div>
                   <button onClick={() => navigate('/post-ad')} className="btn btn-success rounded-pill px-4 py-2 shadow-sm fw-bold border-0" style={{ background: 'linear-gradient(45deg, #198754, #20c997)' }}>
                      <span className="me-2">+</span> Post New Ad
                   </button>
                </div>

                <form onSubmit={handleSave}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input type="text" className="form-control bg-light border-0" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                        <label htmlFor="name"><User size={14} className="me-2"/>Full Name</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input type="email" className="form-control bg-light border-0" value={formData.email} readOnly disabled />
                         <label><Mail size={14} className="me-2"/>Email (Verified)</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <input type="tel" className={`form-control bg-light border-0 ${errors.phone ? 'is-invalid' : ''}`} id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
                        <label htmlFor="phone"><Phone size={14} className="me-2"/>Phone Number</label>
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <input type="text" className={`form-control bg-light border-0 ${errors.address ? 'is-invalid' : ''}`} id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
                        <label htmlFor="address"><MapPin size={14} className="me-2"/>Address</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label className="form-label fw-bold small text-uppercase text-muted mb-2"><FileText size={16} className="me-2"/>Bio / Description</label>
                        <textarea className="form-control bg-light border-0" name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Tell other users about yourself..." style={{ resize: 'none' }}></textarea>
                      </div>
                    </div>
                    <div className="col-12 mt-4">
                      <button type="submit" disabled={isSaving} className="btn btn-success w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 border-0" style={{ background: 'linear-gradient(45deg, #198754, #20c997)' }}>
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {isSaving ? "SAVING..." : "SAVE PROFILE"}
                      </button>
                    </div>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;