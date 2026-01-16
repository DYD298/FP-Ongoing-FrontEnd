import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Home, 
  DollarSign, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle,
  Upload,
  Save
} from 'lucide-react';

// Step 1: Basic Details
const DetailsStep = ({ formData, updateFormData, errors }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-4"
  >
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
          className={`form-select bg-light border-0 py-3 ${errors.category ? 'is-invalid' : ''}`}
          value={formData.category}
          onChange={(e) => updateFormData('category', e.target.value)}
        >
          <option value="boarding-house">Boarding House</option>
          <option value="apartment">Apartment</option>
          <option value="room">Single Room</option>
          <option value="annex">Annex</option>
        </select>
        {errors.category && <div className="text-danger small mt-2">{errors.category}</div>}
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label fw-bold small text-uppercase text-muted">Price (LKR)</label>
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
        placeholder="Describe your property..."
        value={formData.description}
        onChange={(e) => updateFormData('description', e.target.value)}
      ></textarea>
      {errors.description && <div className="text-danger small mt-2">{errors.description}</div>}
    </div>
  </motion.div>
);

// Step 2: Location & Map
const LocationStep = ({ formData, updateFormData, errors }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
  >
    <h3 className="h4 fw-bold mb-4 text-dark">Location & Map</h3>
    
    <div className="mb-3">
      <label className="form-label fw-bold small text-uppercase text-muted">Address</label>
      <div className="input-group">
        <span className="input-group-text bg-light border-0"><MapPin size={18} /></span>
        <input 
          type="text" 
          className={`form-control bg-light border-0 py-3 ${errors.address ? 'is-invalid' : ''}`}
          placeholder="Property Address"
          value={formData.address}
          onChange={(e) => updateFormData('address', e.target.value)}
        />
      </div>
      {errors.address && <div className="text-danger small mt-2">{errors.address}</div>}
    </div>

    <div className="mb-4">
      <label className="form-label fw-bold small text-uppercase text-muted">City</label>
      <input 
        type="text" 
        className={`form-control bg-light border-0 py-3 ${errors.city ? 'is-invalid' : ''}`}
        placeholder="e.g. Colombo"
        value={formData.city}
        onChange={(e) => updateFormData('city', e.target.value)}
      />
      {errors.city && <div className="text-danger small mt-2">{errors.city}</div>}
    </div>

    {/* Map Placeholder */}
    <div className="rounded-4 overflow-hidden position-relative bg-light d-flex align-items-center justify-content-center" style={{ height: '300px', border: '2px dashed #cbd5e1' }}>
      <div className="text-center text-muted">
        <MapPin size={48} className="mb-2 mx-auto opacity-50" />
        <p className="fw-bold">Select Location on Map</p>
        <small>(Map integration would appear here)</small>
      </div>
    </div>
  </motion.div>
);

// Step 3: Photos
const PhotosStep = ({ formData, updateFormData }) => {
  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
      // Append new images to existing ones, limit to 5 if needed, or just replace/add.
      // For simplicity, we'll just append.
      updateFormData('images', [...formData.images, ...filesArray]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h3 className="h4 fw-bold mb-4 text-dark">Upload Photos</h3>
      
      <label 
        htmlFor="file-upload"
        className="rounded-4 bg-light d-flex flex-column align-items-center justify-content-center p-5 text-center cursor-pointer hover-bg-light-dark w-100" 
        style={{ border: '2px dashed var(--primary-color)' }}
      >
        <div className="bg-white p-3 rounded-circle shadow-sm mb-3">
          <Upload size={32} className="text-success" />
        </div>
        <h5 className="fw-bold text-dark">Click or Drag photos here</h5>
        <p className="text-muted small mb-0">Up to 5 photos (JPG, PNG)</p>
        <input 
          id="file-upload" 
          type="file" 
          multiple 
          accept="image/*" 
          className="d-none"
          onChange={handleFileChange}
        />
      </label>

      <div className="row mt-4 g-3">
         {formData.images.length > 0 ? (
            formData.images.map((img, index) => (
              <div className="col-4" key={index}>
                  <div className="ratio ratio-1x1 rounded-3 overflow-hidden shadow-sm position-relative">
                    <img src={img} alt={`Preview ${index}`} className="w-100 h-100 object-fit-cover" />
                  </div>
              </div>
            ))
         ) : (
           <div className="col-12 text-center text-muted mt-2">
             <small>No photos uploaded yet</small>
           </div>
         )}
      </div>
    </motion.div>
  );
};

const PostAd = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    category: 'boarding-house',
    price: '',
    period: 'monthly',
    description: '',
    address: '',
    city: '',
    images: [] 
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validation functions
  const validateDetailsStep = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (parseInt(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLocationStep = () => {
    const newErrors = {};

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 5) {
      newErrors.address = 'Address must be at least 5 characters';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    } else if (formData.city.trim().length < 2) {
      newErrors.city = 'City must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setErrors({});
  };

  const handleNext = (e) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      if (validateDetailsStep()) {
        nextStep();
      }
    } else if (currentStep === 2) {
      if (validateLocationStep()) {
        nextStep();
      }
    } else {
      nextStep();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      alert("Please upload at least one photo before submitting.");
      return;
    }
    console.log("Submitting Ad:", formData);
    // Simulate API call
    setTimeout(() => {
      alert("Ad submitted successfully!");
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-vh-100 bg-light py-5 mt-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-7">
            
            {/* Progress Bar */}
            <div className="d-flex justify-content-between mb-4 px-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="d-flex flex-column align-items-center">
                  <div 
                    className={`rounded-circle d-flex align-items-center justify-content-center fw-bold transition-all ${
                      currentStep >= step ? 'bg-success text-white' : 'bg-white text-muted border'
                    }`}
                    style={{ width: '40px', height: '40px' }}
                  >
                    {currentStep > step ? <CheckCircle size={20} /> : step}
                  </div>
                  <span className={`small mt-2 fw-bold ${currentStep >= step ? 'text-success' : 'text-muted'}`}>
                    {step === 1 ? 'Details' : step === 2 ? 'Location' : 'Photos'}
                  </span>
                </div>
              ))}
            </div>

            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="card-body p-4 p-md-5">
                
                <form>
                  <AnimatePresence mode='wait'>
                    {currentStep === 1 && <DetailsStep key="step1" formData={formData} updateFormData={updateFormData} errors={errors} />}
                    {currentStep === 2 && <LocationStep key="step2" formData={formData} updateFormData={updateFormData} errors={errors} />}
                    {currentStep === 3 && <PhotosStep key="step3" formData={formData} updateFormData={updateFormData} />}
                  </AnimatePresence>

                  <hr className="my-5 opacity-10" />

                  <div className="d-flex justify-content-between align-items-center">
                    {currentStep > 1 ? (
                      <button 
                        type="button" 
                        onClick={prevStep}
                        className="btn btn-outline-secondary rounded-pill px-4 fw-bold"
                      >
                        <ChevronLeft size={18} className="me-1" /> Back
                      </button>
                    ) : (
                      // Placeholder for alignment
                      <div></div> 
                    )}

                    {currentStep < 3 ? (
                      <button 
                        type="button" 
                        onClick={handleNext}
                        className="btn btn-success rounded-pill px-5 py-3 fw-bold d-flex align-items-center shadow-sm"
                        style={{ background: 'var(--primary-gradient)', border: 'none' }}
                      >
                        Next <ChevronRight size={18} className="ms-1" />
                      </button>
                    ) : (
                      <button 
                        type="button"
                        onClick={handleSubmit}
                        className="btn btn-success rounded-pill px-5 py-3 fw-bold d-flex align-items-center shadow-lg hover-scale"
                        style={{ background: 'var(--primary-gradient)', border: 'none' }}
                      >
                         <Save size={18} className="me-2" /> Submit Ad
                      </button>
                    )}
                  </div>
                </form>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PostAd;
