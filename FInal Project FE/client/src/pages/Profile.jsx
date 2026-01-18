import React, { useState, useEffect } from 'react';
import { useAuthContext } from "@asgardeo/auth-react";
import { User, Mail, Phone, MapPin, FileText, Save, Loader2 } from 'lucide-react';
import Toast from '../components/Toast';

const Profile = () => {
  const { state, getAccessToken } = useAuthContext();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    description: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
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
          setFormData({
            name: data.name || state.displayName || '',
            email: data.email || state.email || '',
            phone: data.phone || '',
            address: data.address || '',
            description: data.description || ''
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (state.isAuthenticated) {
      fetchProfile();
    }
  }, [state.isAuthenticated, getAccessToken, state.displayName, state.email]);

  
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

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
        setShowToast(true);
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Something went wrong. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-5 text-center"><Loader2 className="animate-spin" /> Loading...</div>;

  return (
    <div className="container py-5 mt-5">
      <Toast 
        show={showToast} 
        onClose={() => setShowToast(false)} 
        title="Profile Updated" 
        message="Your profile information has been saved successfully."
      />
      <div className="card shadow border-0 p-4">
        <h2 className="mb-4 fw-bold">Edit Profile</h2>
        <form onSubmit={handleSave}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-bold">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0"><User size={18}/></span>
                <input type="text" name="name" className="form-control bg-light border-0" value={formData.name} onChange={handleChange} />
              </div>
            </div>
            
            <div className="col-md-6">
              <label className="form-label small fw-bold">Email (Read Only)</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0"><Mail size={18}/></span>
                <input type="email" className="form-control bg-light border-0" value={formData.email} readOnly disabled />
              </div>
            </div>

            <div className="col-md-12">
              <label className="form-label small fw-bold">Phone Number</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0"><Phone size={18}/></span>
                <input type="text" name="phone" className="form-control bg-light border-0" value={formData.phone} onChange={handleChange} placeholder="0771234567" />
              </div>
            </div>

            <div className="col-md-12">
              <label className="form-label small fw-bold">Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0"><MapPin size={18}/></span>
                <input type="text" name="address" className="form-control bg-light border-0" value={formData.address} onChange={handleChange} placeholder="Colombo" />
              </div>
            </div>

            <div className="col-12">
              <label className="form-label small fw-bold">Description</label>
              <textarea name="description" className="form-control bg-light border-0" rows="4" value={formData.description} onChange={handleChange} placeholder="Tell us about yourself..."></textarea>
            </div>

            <div className="col-12 mt-4">
              <button type="submit" className="btn btn-success w-100 py-3 fw-bold rounded-pill" disabled={saving}>
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;