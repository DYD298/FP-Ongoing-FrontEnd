import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Home,
  DollarSign,
  CheckCircle,
  X,
  Bed,
  Bath,
  Tv,
  Wifi,
  Car,
  Wind,
  Refrigerator,
  Zap,
  FileText,
  Send
} from "lucide-react";
import { useAuthContext } from "@asgardeo/auth-react";
import Toast from "../components/Toast";
import { getAuthHeaders, parseApiResponse } from "../api/adsApi";

const BIJIRA_BASE_URL =
  "https://a88642b8-2b68-4d73-b038-49eb67884ca4-prod.e1-us-east-azure.bijiraapis.dev/default/ceylonstay-ads-service/v1.0";

const facilityOptions = [
  { id: "wifi", label: "Wifi", icon: <Wifi size={16} /> },
  { id: "parking", label: "Parking", icon: <Car size={16} /> },
  { id: "ac", label: "A/C", icon: <Wind size={16} /> },
  { id: "tv", label: "TV", icon: <Tv size={16} /> },
  { id: "fridge", label: "Fridge", icon: <Refrigerator size={16} /> },
  { id: "power", label: "Back-up Power", icon: <Zap size={16} /> }
];

const DetailsStep = ({ formData, updateFormData, errors }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
  >
    <h3 className="h4 fw-bold mb-4 text-dark">Property Details</h3>

    <div className="mb-3">
      <label className="form-label fw-bold small text-uppercase text-muted">Title</label>
      <div className="input-group">
        <span className="input-group-text bg-light border-0">
          <Home size={18} />
        </span>
        <input
          type="text"
          className={`form-control bg-light border-0 py-3 ${errors.title ? "is-invalid" : ""}`}
          placeholder="e.g. Modern Room near University"
          value={formData.title}
          onChange={(e) => updateFormData("title", e.target.value)}
        />
      </div>
      {errors.title && <div className="text-danger small mt-2">{errors.title}</div>}
    </div>

    <div className="row">
      <div className="col-md-6 mb-3">
        <label className="form-label fw-bold small text-uppercase text-muted">Category</label>
        <select
          className="form-select bg-light border-0 py-3"
          value={formData.type}
          onChange={(e) => updateFormData("type", e.target.value)}
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
          <span className="input-group-text bg-light border-0">
            <DollarSign size={18} />
          </span>
          <input
            type="number"
            className={`form-control bg-light border-0 py-3 ${errors.price ? "is-invalid" : ""}`}
            placeholder="e.g. 15000"
            value={formData.price}
            onChange={(e) => updateFormData("price", e.target.value)}
          />
        </div>
        {errors.price && <div className="text-danger small mt-2">{errors.price}</div>}
      </div>
    </div>

    <div className="row">
      <div className="col-md-6 mb-3">
        <label className="form-label fw-bold small text-uppercase text-muted">Beds</label>
        <div className="input-group">
          <span className="input-group-text bg-light border-0">
            <Bed size={18} />
          </span>
          <input
            type="number"
            className={`form-control bg-light border-0 py-3 ${errors.beds ? "is-invalid" : ""}`}
            placeholder="e.g. 2"
            value={formData.beds}
            onChange={(e) => updateFormData("beds", e.target.value)}
          />
        </div>
        {errors.beds && <div className="text-danger small mt-2">{errors.beds}</div>}
      </div>

      <div className="col-md-6 mb-3">
        <label className="form-label fw-bold small text-uppercase text-muted">Baths</label>
        <div className="input-group">
          <span className="input-group-text bg-light border-0">
            <Bath size={18} />
          </span>
          <input
            type="number"
            className={`form-control bg-light border-0 py-3 ${errors.baths ? "is-invalid" : ""}`}
            placeholder="e.g. 1"
            value={formData.baths}
            onChange={(e) => updateFormData("baths", e.target.value)}
          />
        </div>
        {errors.baths && <div className="text-danger small mt-2">{errors.baths}</div>}
      </div>
    </div>

    <div className="mb-3">
      <label className="form-label fw-bold small text-uppercase text-muted">Furniture</label>
      <select
        className="form-select bg-light border-0 py-3"
        value={formData.furniture}
        onChange={(e) => updateFormData("furniture", e.target.value)}
      >
        <option value="Unfurnished">Unfurnished</option>
        <option value="Semi-Furnished">Semi-Furnished</option>
        <option value="Furnished">Fully Furnished</option>
      </select>
    </div>

    <div className="mb-3">
      <label className="form-label fw-bold small text-uppercase text-muted">Facilities</label>
      <div className="row g-2 mt-1">
        {facilityOptions.map((fac) => (
          <div className="col-6 col-md-4" key={fac.id}>
            <div
              className={`p-3 rounded-3 border d-flex align-items-center gap-2 ${
                formData.facilities.includes(fac.label)
                  ? "border-success bg-success bg-opacity-10 text-success"
                  : "bg-light border-transparent text-muted"
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => {
                const updated = formData.facilities.includes(fac.label)
                  ? formData.facilities.filter((f) => f !== fac.label)
                  : [...formData.facilities, fac.label];

                updateFormData("facilities", updated);
              }}
            >
              {fac.icon}
              <span className="small fw-bold">{fac.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="mb-3">
      <label className="form-label fw-bold small text-uppercase text-muted">Description</label>
      <textarea
        className={`form-control bg-light border-0 ${errors.description ? "is-invalid" : ""}`}
        rows="5"
        placeholder="Describe facilities, rules, nearby places..."
        value={formData.description}
        onChange={(e) => updateFormData("description", e.target.value)}
      />
      {errors.description && <div className="text-danger small mt-2">{errors.description}</div>}
    </div>
  </motion.div>
);

const LocationStep = ({ formData, updateFormData, errors }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
  >
    <h3 className="h4 fw-bold mb-4 text-dark">Location</h3>

    <div className="mb-3">
      <label className="form-label fw-bold small text-uppercase text-muted">Address</label>
      <div className="input-group">
        <span className="input-group-text bg-light border-0">
          <MapPin size={18} />
        </span>
        <input
          type="text"
          className={`form-control bg-light border-0 py-3 ${errors.address ? "is-invalid" : ""}`}
          placeholder="Full address"
          value={formData.address}
          onChange={(e) => updateFormData("address", e.target.value)}
        />
      </div>
      {errors.address && <div className="text-danger small mt-2">{errors.address}</div>}
    </div>

    <div className="row">
      <div className="col-md-6 mb-4">
        <label className="form-label fw-bold small text-uppercase text-muted">District / City</label>
        <input
          type="text"
          className={`form-control bg-light border-0 py-3 ${errors.district ? "is-invalid" : ""}`}
          placeholder="e.g. Colombo"
          value={formData.district}
          onChange={(e) => updateFormData("district", e.target.value)}
        />
        {errors.district && <div className="text-danger small mt-2">{errors.district}</div>}
      </div>

      <div className="col-md-6 mb-4">
        <label className="form-label fw-bold small text-uppercase text-muted">Province</label>
        <select
          className="form-select bg-light border-0 py-3"
          value={formData.province}
          onChange={(e) => updateFormData("province", e.target.value)}
        >
          <option value="Western">Western</option>
          <option value="Central">Central</option>
          <option value="Southern">Southern</option>
          <option value="North Western">North Western</option>
          <option value="Sabaragamuwa">Sabaragamuwa</option>
          <option value="Northern">Northern</option>
          <option value="Eastern">Eastern</option>
          <option value="North Central">North Central</option>
          <option value="Uva">Uva</option>
        </select>
      </div>
    </div>
  </motion.div>
);

const ReviewStep = ({ formData, imageFiles, onImageSelect, onImageRemove, errors }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
  >
    <h3 className="h4 fw-bold mb-4 text-dark">Review & Photos</h3>

    <div className="card border-0 bg-light rounded-4">
      <div className="card-body p-4">
        <div className="mb-3">
          <div className="small text-muted">Title</div>
          <div className="fw-semibold">{formData.title || "Not set"}</div>
        </div>

        <div className="mb-3">
          <div className="small text-muted">Price</div>
          <div className="fw-semibold">
            {formData.price ? `Rs. ${Number(formData.price).toLocaleString()}` : "Not set"}
          </div>
        </div>

        <div className="mb-3">
          <div className="small text-muted">Location</div>
          <div className="fw-semibold">
            {[formData.district, formData.province].filter(Boolean).join(", ") || "Not set"}
          </div>
        </div>

        <div className="mb-3">
          <div className="small text-muted">Facilities</div>
          <div className="fw-semibold">
            {formData.facilities.length
              ? [...formData.facilities, formData.furniture].join(", ")
              : formData.furniture}
          </div>
        </div>

        <div className="mb-0">
          <div className="small text-muted">Description</div>
          <div className="fw-semibold">{formData.description || "Not set"}</div>
        </div>

        <hr className="my-4" />

        <div className="mb-3">
          <label className="form-label fw-bold small text-uppercase text-muted">
            Upload Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            className={`form-control ${errors.images ? "is-invalid" : ""}`}
            onChange={onImageSelect}
          />
          {errors.images && <div className="text-danger small mt-2">{errors.images}</div>}
          <div className="small text-muted mt-2">
            Add at least one photo to publish your ad.
          </div>
        </div>

        {imageFiles.length > 0 ? (
          <div className="row g-2 mt-1">
            {imageFiles.map((file, index) => (
              <div className="col-12 col-md-6" key={`${file.name}-${index}`}>
                <div className="d-flex align-items-center justify-content-between gap-2 p-2 rounded-3 border bg-white">
                  <div className="text-truncate small fw-semibold">{file.name}</div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger rounded-pill"
                    onClick={() => onImageRemove(index)}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  </motion.div>
);

const PostAd = () => {
  const navigate = useNavigate();
  const { state, signIn, getAccessToken } = useAuthContext();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    show: false,
    title: "",
    message: ""
  });

  const [formData, setFormData] = useState({
    title: "",
    type: "boarding-house",
    price: "",
    description: "",
    address: "",
    district: "",
    province: "Western",
    beds: "1",
    baths: "1",
    furniture: "Unfurnished",
    facilities: []
  });
  const [imageFiles, setImageFiles] = useState([]);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageSelect = (e) => {
    const selected = Array.from(e.target.files || []);

    if (!selected.length) return;

    setImageFiles((prev) => [...prev, ...selected]);

    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }

    e.target.value = "";
  };

  const handleImageRemove = (indexToRemove) => {
    setImageFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const validate = () => {
    const err = {};

    if (currentStep === 1) {
      if (!formData.title.trim()) err.title = "Title required";
      if (!formData.price) err.price = "Price required";
      if (!formData.description.trim()) err.description = "Description required";
      if (!formData.beds || Number(formData.beds) < 1) err.beds = "At least 1 bed required";
      if (!formData.baths || Number(formData.baths) < 0) err.baths = "Bath count is invalid";
    }

    if (currentStep === 2) {
      if (!formData.address.trim()) err.address = "Address required";
      if (!formData.district.trim()) err.district = "District required";
      if (!formData.province.trim()) err.province = "Province required";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const payload = useMemo(() => ({
    title: formData.title.trim(),
    description: formData.description.trim(),
    price: formData.price === "" ? null : Number(formData.price),
    address: formData.address.trim(),
    province: formData.province.trim(),
    district: formData.district.trim(),
    type: formData.type,
    beds: formData.beds === "" ? null : Number(formData.beds),
    baths: formData.baths === "" ? null : Number(formData.baths),
    facilities: [...formData.facilities, formData.furniture]
  }), [formData]);

  const getSessionHeaders = async (json = true) => {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      throw new Error("No access token available. Please log in again.");
    }

    if (!state?.email) {
      throw new Error("No user email found in the current session.");
    }

    return getAuthHeaders(accessToken, state.email, json);
  };

  const saveDraft = async () => {
    if (!state?.isAuthenticated) {
      signIn();
      return;
    }

    setIsSavingDraft(true);

    try {
      const response = await fetch(`${BIJIRA_BASE_URL}/ads/draft`, {
        method: "POST",
        headers: await getSessionHeaders(true),
        body: JSON.stringify(payload)
      });

      const result = await parseApiResponse(response);

      setToast({
        show: true,
        title: "Draft Saved",
        message: "Your draft ad has been saved successfully."
      });

      setTimeout(() => {
        navigate("/my-ads");
      }, 1200);

      return result;
    } catch (err) {
      console.error(err);
      setToast({
        show: true,
        title: "Save Failed",
        message: err.message || "Failed to save draft."
      });
      return null;
    } finally {
      setIsSavingDraft(false);
    }
  };

  const publishNow = async () => {
    if (!state?.isAuthenticated) {
      signIn();
      return;
    }

    setIsPublishing(true);

    try {
      if (!imageFiles.length) {
        setErrors((prev) => ({
          ...prev,
          images: "At least one image is required to publish."
        }));
        return;
      }

      const multipartBody = new FormData();
      multipartBody.append("title", payload.title);
      multipartBody.append("description", payload.description);
      multipartBody.append("price", String(payload.price));
      multipartBody.append("address", payload.address);
      multipartBody.append("province", payload.province);
      multipartBody.append("district", payload.district);
      multipartBody.append("type", payload.type);
      multipartBody.append("beds", String(payload.beds));
      multipartBody.append("baths", String(payload.baths));
      multipartBody.append("facilities", payload.facilities.join(", "));

      imageFiles.forEach((file) => {
        multipartBody.append("images", file);
      });

      const publishResponse = await fetch(`${BIJIRA_BASE_URL}/ads`, {
        method: "POST",
        headers: await getSessionHeaders(false),
        body: multipartBody
      });

      await parseApiResponse(publishResponse);

      setToast({
        show: true,
        title: "Ad Published",
        message: "Your ad has been published successfully."
      });

      setTimeout(() => {
        navigate("/my-ads");
      }, 1200);
    } catch (err) {
      console.error(err);
      setToast({
        show: true,
        title: "Publish Failed",
        message: err.message || "Failed to publish ad."
      });
    } finally {
      setIsPublishing(false);
    }
  };

  if (!state?.isAuthenticated) {
    return (
      <div className="min-vh-100 bg-light py-5 mt-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body p-5 text-center">
                  <h3 className="fw-bold mb-3">Please sign in</h3>
                  <p className="text-muted mb-4">You need to login before creating an ad.</p>
                  <button className="btn btn-success rounded-pill px-5" onClick={() => signIn()}>
                    Login with Google
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Toast
          show={toast.show}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
          title={toast.title}
          message={toast.message}
        />
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light py-5 mt-5">
      <Toast
        show={toast.show}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        title={toast.title}
        message={toast.message}
      />

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="d-flex justify-content-between mb-5 px-2 px-md-5 text-center">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`fw-bold ${currentStep >= s ? "text-success" : "text-muted"}`}
                >
                  <div
                    className={`rounded-circle mx-auto mb-1 d-flex align-items-center justify-content-center border ${
                      currentStep >= s ? "bg-success text-white border-success" : "bg-white"
                    }`}
                    style={{ width: 38, height: 38 }}
                  >
                    {currentStep > s ? <CheckCircle size={20} /> : s}
                  </div>
                  <small>{s === 1 ? "Info" : s === 2 ? "Place" : "Review"}</small>
                </div>
              ))}
            </div>

            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-4 p-md-5">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <DetailsStep
                      key="details"
                      formData={formData}
                      updateFormData={updateFormData}
                      errors={errors}
                    />
                  )}

                  {currentStep === 2 && (
                    <LocationStep
                      key="location"
                      formData={formData}
                      updateFormData={updateFormData}
                      errors={errors}
                    />
                  )}

                  {currentStep === 3 && (
                    <ReviewStep
                      key="review"
                      formData={formData}
                      imageFiles={imageFiles}
                      onImageSelect={handleImageSelect}
                      onImageRemove={handleImageRemove}
                      errors={errors}
                    />
                  )}
                </AnimatePresence>

                <div className="d-flex justify-content-between flex-wrap gap-2 mt-5">
                  <div>
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={() => setCurrentStep((prev) => prev - 1)}
                        className="btn btn-light rounded-pill px-4"
                      >
                        Back
                      </button>
                    )}
                  </div>

                  <div className="d-flex flex-wrap gap-2 ms-auto">
                    {currentStep < 3 ? (
                      <button
                        type="button"
                        onClick={() => validate() && setCurrentStep((prev) => prev + 1)}
                        className="btn btn-success rounded-pill px-5"
                      >
                        Next
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          disabled={isSavingDraft || isPublishing}
                          onClick={saveDraft}
                          className="btn btn-outline-success rounded-pill px-4 fw-semibold"
                        >
                          <FileText size={16} className="me-2" />
                          {isSavingDraft ? "Saving..." : "Save Draft"}
                        </button>

                        <button
                          type="button"
                          disabled={isSavingDraft || isPublishing}
                          onClick={publishNow}
                          className="btn btn-success rounded-pill px-4 fw-semibold"
                        >
                          <Send size={16} className="me-2" />
                          {isPublishing ? "Publishing..." : "Publish Now"}
                        </button>
                      </>
                    )}
                  </div>
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
