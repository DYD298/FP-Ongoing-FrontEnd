import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut, Mail, Phone, MapPin, FileText, Save, ArrowLeft } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  // State for form fields
  const [formData, setFormData] = useState({
    name: 'John Doe', 
    email: 'john.doe@example.com',
    phone: '',
    address: '',
    description: ''
  });

  // State for errors
  const [errors, setErrors] = useState({});

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Validate Form
  const validate = () => {
    const newErrors = {};
    
    // Phone Validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Address Validation
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Save
  const handleSave = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form Data Saved:", formData);
      alert("Profile updated successfully!");
    }
  };

  return (
    <div className="min-vh-100 bg-light py-5 mt-5">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="row justify-content-center"
        >
          <div className="col-lg-8 col-xl-7">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              
              {/* Profile Header Background */}
              <div className="bg-success p-4 position-relative" style={{ background: 'var(--primary-gradient)', height: '150px' }}>
                <div className="position-absolute top-0 start-0 m-4">
                  <button 
                    onClick={() => navigate(-1)} 
                    className="btn btn-light btn-sm d-flex align-items-center gap-2 fw-bold shadow-sm"
                  >
                    <ArrowLeft size={16} />
                    BACK
                  </button>
                </div>
                <div className="position-absolute top-0 end-0 m-4">
                  <button 
                    onClick={handleLogout} 
                    className="btn btn-outline-light btn-sm d-flex align-items-center gap-2 fw-bold shadow-sm bg-white text-danger border-0"
                  >
                    <LogOut size={16} />
                    LOG OUT
                  </button>
                </div>
              </div>

              <div className="card-body p-4 p-md-5 pt-0">
                
                {/* Profile Icon - Overlapping Header */}
                <div className="d-flex justify-content-between align-items-end mb-5" style={{ marginTop: '-75px' }}>
                  <div className="position-relative">
                   <div 
                      className="rounded-circle bg-white d-flex justify-content-center align-items-center shadow-lg border border-4 border-white"
                      style={{ width: '150px', height: '150px' }}
                    >
                      <User size={64} className="text-secondary opacity-50" />
                    </div>
                  </div>
                </div>

                <div className="text-center text-md-start mb-5">
                   <h2 className="fw-bold text-dark mb-1">{formData.name}</h2>
                   <p className="text-muted">{formData.email}</p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSave}>
                  <div className="row g-4">
                    
                    {/* Name */}
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control bg-light border-0"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Name"
                        />
                        <label htmlFor="name" className="text-muted"><User size={14} className="me-2"/>Name</label>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="email"
                          className="form-control bg-light border-0"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Email"
                          readOnly
                        />
                         <label htmlFor="email" className="text-muted"><Mail size={14} className="me-2"/>Email</label>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="tel"
                          className={`form-control bg-light border-0 ${errors.phone ? 'is-invalid' : ''}`}
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Phone"
                        />
                        <label htmlFor="phone" className="text-muted"><Phone size={14} className="me-2"/>Phone Number</label>
                         {errors.phone && <div className="invalid-feedback ms-2">{errors.phone}</div>}
                      </div>
                    </div>

                    {/* Address */}
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="text"
                          className={`form-control bg-light border-0 ${errors.address ? 'is-invalid' : ''}`}
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Address"
                        />
                        <label htmlFor="address" className="text-muted"><MapPin size={14} className="me-2"/>Address</label>
                        {errors.address && <div className="invalid-feedback ms-2">{errors.address}</div>}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="description" className="form-label fw-bold small text-uppercase text-muted mb-2">
                            <FileText size={16} className="me-2"/>Description
                        </label>
                        <textarea
                          className="form-control bg-light border-0"
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows="5"
                          placeholder="Write something about yourself..."
                          style={{ resize: 'none' }}
                        ></textarea>
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="col-12 mt-4">
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        className="btn btn-success w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                        style={{ background: 'var(--primary-gradient)', border: 'none' }}
                      >
                        <Save size={20} />
                        SAVE PROFILE
                      </motion.button>
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

export default Profile;
