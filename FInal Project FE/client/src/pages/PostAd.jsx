import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Home, 
  DollarSign, 
  CheckCircle,
  Upload,
  X
} from 'lucide-react';
import { useAuthContext } from "@asgardeo/auth-react";
import Toast from '../components/Toast';

// --- Sub-components (Step Views) ---

const DetailsStep = ({ formData, updateFormData, errors }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
    <h3 className="h4 fw-bold mb-4 text-dark">Property Details</h3>
    <div className="mb-3">
      <label className="form-label fw-bold small text-uppercase text-muted">Title</label>
      <div className="input-group">
        <span className="input-group-text bg-light border-0"><Home size={18} /></span>
        <input 
          type="text" 
          className={`form-control bg-light border-0 py-3 ${errors.title ? 'is-invalid' : ''}`} 
          placeholder="e.g. Modern Room near University" 
          value={formData.title} 
          onChange={(e) => updateFormData('title', e.target.value)} 
        />
      </div>
      {errors.title && <div className="text-danger small mt-2">{errors.title}</div>}
    </div>
    <div className="row">
      <div className="col-md-6 mb-3">
        <label className="form-label fw-bold small text-uppercase text-muted">Category</label>
        <select 
          className="form-select bg-light border-0 py-3" 
          value={formData.category} 
          onChange={(e) => updateFormData('category', e.target.value)}
        >
          <option value="boarding-house">Boarding House</option>
          <option value="apartment">Apartment</option>
          <option value="room">Single Room</option>
          <option value="annex">Annex</option>
        </select>
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label fw-bold small text-uppercase text-muted">Price (LKR / Month)</label>
        <div className="input-group">
          <span className="input-group-text bg-light border-0"><DollarSign size={18} /></span>
          <input 
            type="number" 
            className={`form-control bg-light border-0 py-3 ${errors.price ? 'is-invalid' : ''}`} 
            placeholder="e.g. 15000" 
            value={formData.price} 
            onChange={(e) => updateFormData('price', e.target.value)} 
          />
        </div>
        {errors.price && <div className="text-danger small mt-2">{errors.price}</div>}
      </div>
    </div>
    <div className="mb-3">
      <label className="form-label fw-bold small text-uppercase text-muted">Description</label>
      <textarea 
        className={`form-control bg-light border-0 ${errors.description ? 'is-invalid' : ''}`} 
        rows="5" 
        placeholder="Describe facilities, rules, etc..." 
        value={formData.description} 
        onChange={(e) => updateFormData('description', e.target.value)}
      ></textarea>
      {errors.description && <div className="text-danger small mt-2">{errors.description}</div>}
    </div>
  </motion.div>
);

const LocationStep = ({ formData, updateFormData, errors }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
    <h3 className="h4 fw-bold mb-4 text-dark">Location</h3>
    <div className="mb-3">
      <label className="form-label fw-bold small text-uppercase text-muted">Address</label>
      <div className="input-group">
        <span className="input-group-text bg-light border-0"><MapPin size={18} /></span>
        <input 
          type="text" 
          className={`form-control bg-light border-0 py-3 ${errors.address ? 'is-invalid' : ''}`} 
          placeholder="Full Address" 
          value={formData.address} 
          onChange={(e) => updateFormData('address', e.target.value)} 
        />
      </div>
      {errors.address && <div className="text-danger small mt-2">{errors.address}</div>}
    </div>
    <div className="row">
        <div className="col-md-6 mb-4">
            <label className="form-label fw-bold small text-uppercase text-muted">District / City</label>
            <input 
                type="text" 
                className={`form-control bg-light border-0 py-3 ${errors.city ? 'is-invalid' : ''}`} 
                placeholder="e.g. Colombo" 
                value={formData.city} 
                onChange={(e) => updateFormData('city', e.target.value)} 
            />
            {errors.city && <div className="text-danger small mt-2">{errors.city}</div>}
        </div>
        <div className="col-md-6 mb-4">
            <label className="form-label fw-bold small text-uppercase text-muted">Province</label>
            <select 
                className="form-select bg-light border-0 py-3" 
                value={formData.province} 
                onChange={(e) => updateFormData('province', e.target.value)}
            >
                <option value="Western">Western</option>
                <option value="Central">Central</option>
                <option value="Southern">Southern</option>
                <option value="North Western">North Western</option>
                <option value="Sabaragamuwa">Sabaragamuwa</option>
            </select>
        </div>
    </div>
  </motion.div>
);

const PhotosStep = ({ formData, updateFormData }) => {
  const handleFileChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImages = files.map(file => ({
        file: file,
        preview: URL.createObjectURL(file)
      }));
      updateFormData('imageFiles', [...formData.imageFiles, ...newImages]);
    }
  };

  const removeImage = (index) => {
    const updated = formData.imageFiles.filter((_, i) => i !== index);
    updateFormData('imageFiles', updated);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h3 className="h4 fw-bold mb-4 text-dark">Upload Photos</h3>
      <label htmlFor="file-upload" className="rounded-4 bg-light d-flex flex-column align-items-center justify-content-center p-5 text-center cursor-pointer w-100" style={{ border: '2px dashed #198754' }}>
        <div className="bg-white p-3 rounded-circle shadow-sm mb-3 text-success"><Upload size={32} /></div>
        <h5 className="fw-bold text-dark">Upload Property Images</h5>
        <input id="file-upload" type="file" multiple accept="image/*" className="d-none" onChange={handleFileChange} />
      </label>
      <div className="row mt-4 g-3">
         {formData.imageFiles.map((img, index) => (
            <div className="col-4" key={index}>
              <div className="ratio ratio-1x1 rounded-3 overflow-hidden shadow-sm position-relative">
                <img src={img.preview} alt="preview" className="w-100 h-100 object-fit-cover" />
                <button type="button" onClick={() => removeImage(index)} className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle p-1"><X size={14}/></button>
              </div>
            </div>
         ))}
      </div>
    </motion.div>
  );
};

// --- Main PostAd Component ---

const PostAd = () => {
  const navigate = useNavigate();
  const { getAccessToken } = useAuthContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'boarding-house',
    price: '',
    description: '',
    address: '',
    city: '',
    province: 'Western',
    imageFiles: []
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const err = {};
    if (currentStep === 1) {
      if (!formData.title) err.title = "Title required";
      if (!formData.price) err.price = "Price required";
      if (!formData.description) err.description = "Description required";
    } else if (currentStep === 2) {
      if (!formData.address) err.address = "Address required";
      if (!formData.city) err.city = "City / District required";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.imageFiles.length === 0) return alert("Upload at least one image");
    
    setIsSubmitting(true);
    try {
      const token = await getAccessToken();
      
      const data = new FormData();
      // Appending fields to match FastAPI backend (app/main.py)
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("address", formData.address);
      data.append("province", formData.province);
      data.append("district", formData.city);
      data.append("type", formData.category);
      data.append("beds", 1); // Defaulting as example
      data.append("baths", 1); // Defaulting as example
      data.append("facilities", JSON.stringify(["Wifi", "Parking"])); // Example static facilities

      // Backend expects 'images' field name
      formData.imageFiles.forEach((imgObj) => {
        data.append("images", imgObj.file);
      });

      const response = await fetch("http://localhost:8001/ads", {
        method: "POST",
        headers: { 
            "Authorization": `Bearer ${token}` 
            // Note: browser sets Content-Type for FormData automatically
        },
        body: data
      });

      if (response.ok) {
          setShowToast(true);
          // Wait for 3 seconds to let the user see the toast before navigating
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
      } else {
          const errorData = await response.json();
          alert(`Failed to post ad: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light py-5 mt-5">
      <Toast 
        show={showToast} 
        onClose={() => setShowToast(false)} 
        title="Ad Posted Successfully" 
        message="Your ad has been submitted and will appear once verified."
      />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            
            {/* Steps Indicator */}
            <div className="d-flex justify-content-between mb-5 px-5 text-center">
              {[1, 2, 3].map(s => (
                <div key={s} className={`fw-bold ${currentStep >= s ? 'text-success' : 'text-muted'}`}>
                  <div className={`rounded-circle mx-auto mb-1 d-flex align-items-center justify-content-center border ${currentStep >= s ? 'bg-success text-white border-success' : 'bg-white'}`} style={{width: 35, height: 35}}>
                    {currentStep > s ? <CheckCircle size={20}/> : s}
                  </div>
                  <small>{s === 1 ? 'Info' : s === 2 ? 'Place' : 'Photos'}</small>
                </div>
              ))}
            </div>

            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-4 p-md-5">
                <AnimatePresence mode='wait'>
                  {currentStep === 1 && <DetailsStep key="s1" formData={formData} updateFormData={updateFormData} errors={errors} />}
                  {currentStep === 2 && <LocationStep key="s2" formData={formData} updateFormData={updateFormData} errors={errors} />}
                  {currentStep === 3 && <PhotosStep key="s3" formData={formData} updateFormData={updateFormData} />}
                </AnimatePresence>

                <div className="d-flex justify-content-between mt-5">
                  {currentStep > 1 && (
                    <button type="button" onClick={() => setCurrentStep(c => c - 1)} className="btn btn-light rounded-pill px-4">Back</button>
                  )}
                  {currentStep < 3 ? (
                    <button type="button" onClick={() => validate() && setCurrentStep(c => c + 1)} className="btn btn-success ms-auto rounded-pill px-5">Next</button>
                  ) : (
                    <button type="button" disabled={isSubmitting} onClick={handleSubmit} className="btn btn-success ms-auto rounded-pill px-5">
                      {isSubmitting ? "Submitting..." : "Post Ad"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostAd;