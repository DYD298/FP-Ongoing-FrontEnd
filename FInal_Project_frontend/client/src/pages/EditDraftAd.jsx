import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Spinner, Badge } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Save, Send, ArrowLeft, MapPinHouse, X } from "lucide-react";
import { useAuthContext } from "@asgardeo/auth-react";
import {
  fetchAdById,
  updateDraftAd,
  publishDraftAd,
  normalizeFacilities
} from "../api/adsApi";

const facilityOptions = [
  "Attached Bathroom",
  "Kitchen",
  "WiFi",
  "Parking",
  "Laundry",
  "Air Conditioning"
];

const EditDraftAd = () => {
  const { adId } = useParams();
  const navigate = useNavigate();
  const { state, getAccessToken } = useAuthContext();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    address: "",
    province: "",
    district: "",
    type: "",
    beds: "",
    baths: "",
    facilities: [],
    images: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getSessionAuth = useCallback(async () => {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      throw new Error("No access token available. Please log in again.");
    }

    if (!state?.email) {
      throw new Error("No user email found in the current session.");
    }

    return { accessToken, email: state.email };
  }, [getAccessToken, state?.email]);

  useEffect(() => {
    const loadAd = async () => {
      if (!state?.isAuthenticated) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const { accessToken, email } = await getSessionAuth();
        const data = await fetchAdById(accessToken, adId, email);

        setFormData({
          title: data?.title || "",
          description: data?.description || "",
          price: data?.price ?? "",
          address: data?.address || "",
          province: data?.province || "",
          district: data?.district || "",
          type: data?.type || "",
          beds: data?.beds ?? "",
          baths: data?.baths ?? "",
          facilities: normalizeFacilities(data?.facilities),
          images: Array.isArray(data?.images) ? data.images : []
        });
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load draft ad");
      } finally {
        setLoading(false);
      }
    };

    loadAd();
  }, [adId, getSessionAuth, state?.isAuthenticated]);

  const canPublish = useMemo(() => {
    return (
      formData.title &&
      formData.description &&
      formData.price !== "" &&
      formData.address &&
      formData.province &&
      formData.district &&
      formData.type &&
      formData.beds !== "" &&
      formData.baths !== "" &&
      formData.images.length > 0
    );
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSuccess("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleFacility = (facility) => {
    setSuccess("");
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((item) => item !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const removeExistingImage = (indexToRemove) => {
    setSuccess("");
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSaveDraft = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const { accessToken, email } = await getSessionAuth();
      await updateDraftAd(accessToken, adId, email, {
        ...formData,
        price: formData.price === "" ? null : Number(formData.price),
        beds: formData.beds === "" ? null : Number(formData.beds),
        baths: formData.baths === "" ? null : Number(formData.baths),
        images: formData.images
      });

      setSuccess("Draft updated successfully.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update draft");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    setError("");
    setSuccess("");

    try {
      const { accessToken, email } = await getSessionAuth();

      if (!formData.images.length) {
        throw new Error("Add at least one image before publishing.");
      }

      await updateDraftAd(accessToken, adId, email, {
        ...formData,
        price: formData.price === "" ? null : Number(formData.price),
        beds: formData.beds === "" ? null : Number(formData.beds),
        baths: formData.baths === "" ? null : Number(formData.baths),
        images: formData.images
      });

      await publishDraftAd(accessToken, adId, email);

      setSuccess("Draft published successfully.");

      setTimeout(() => {
        navigate("/my-ads");
      }, 900);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to publish draft");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5" style={{ paddingTop: "100px" }}>
      <Container>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div>
            <h2 className="fw-bold mb-1">Edit Draft Ad</h2>
            <p className="text-muted mb-0">Update your draft and publish when ready.</p>
          </div>

          <Button variant="light" className="rounded-pill fw-semibold" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} className="me-2" />
            Back
          </Button>
        </div>

        <Row className="g-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-4 p-md-5">
                {error && <div className="alert alert-danger rounded-4">{error}</div>}
                {success && <div className="alert alert-success rounded-4">{success}</div>}

                <Form onSubmit={handleSaveDraft}>
                  <Row className="g-4">
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Title</Form.Label>
                        <Form.Control
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          className="rounded-3"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          className="rounded-3"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Price</Form.Label>
                        <Form.Control
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          className="rounded-3"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Type</Form.Label>
                        <Form.Control
                          name="type"
                          value={formData.type}
                          onChange={handleChange}
                          className="rounded-3"
                          placeholder="Room / Boarding / Annex"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Province</Form.Label>
                        <Form.Control
                          name="province"
                          value={formData.province}
                          onChange={handleChange}
                          className="rounded-3"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">District</Form.Label>
                        <Form.Control
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                          className="rounded-3"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Address</Form.Label>
                        <Form.Control
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="rounded-3"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Beds</Form.Label>
                        <Form.Control
                          type="number"
                          name="beds"
                          value={formData.beds}
                          onChange={handleChange}
                          className="rounded-3"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Baths</Form.Label>
                        <Form.Control
                          type="number"
                          name="baths"
                          value={formData.baths}
                          onChange={handleChange}
                          className="rounded-3"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Label className="fw-semibold">Facilities</Form.Label>
                      <div className="d-flex flex-wrap gap-2">
                        {facilityOptions.map((facility) => {
                          const selected = formData.facilities.includes(facility);
                          return (
                            <Button
                              key={facility}
                              type="button"
                              variant={selected ? "success" : "outline-secondary"}
                              className="rounded-pill"
                              onClick={() => toggleFacility(facility)}
                            >
                              {facility}
                            </Button>
                          );
                        })}
                      </div>
                    </Col>

                    {formData.images.length > 0 && (
                      <Col md={12}>
                        <div className="small text-muted mb-2">Existing Draft Images</div>
                        <div className="d-flex flex-wrap gap-2">
                          {formData.images.map((imageName, index) => (
                            <div
                              key={`${imageName}-${index}`}
                              className="d-flex align-items-center gap-2 border rounded-3 px-2 py-1 bg-light"
                            >
                              <span className="small text-truncate" style={{ maxWidth: "280px" }}>
                                {String(imageName)}
                              </span>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline-danger"
                                className="rounded-pill px-2 py-0"
                                onClick={() => removeExistingImage(index)}
                              >
                                <X size={12} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </Col>
                    )}

                    <Col md={12}>
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        <Button
                          type="submit"
                          variant="success"
                          className="rounded-pill px-4 fw-semibold"
                          disabled={saving}
                        >
                          <Save size={16} className="me-2" />
                          {saving ? "Saving..." : "Save Draft"}
                        </Button>

                        <Button
                          type="button"
                          variant="dark"
                          className="rounded-pill px-4 fw-semibold"
                          onClick={handlePublish}
                          disabled={publishing || !canPublish}
                        >
                          <Send size={16} className="me-2" />
                          {publishing ? "Publishing..." : "Publish Draft"}
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <MapPinHouse size={18} className="text-success" />
                  <h5 className="fw-bold mb-0">Draft Summary</h5>
                </div>

                <div className="mb-3">
                  <div className="text-muted small">Title</div>
                  <div className="fw-semibold">{formData.title || "Not set"}</div>
                </div>

                <div className="mb-3">
                  <div className="text-muted small">Price</div>
                  <div className="fw-semibold">
                    {formData.price ? `Rs. ${Number(formData.price).toLocaleString()}` : "Not set"}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-muted small">Location</div>
                  <div className="fw-semibold">
                    {[formData.district, formData.province].filter(Boolean).join(", ") || "Not set"}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-muted small">Facilities</div>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {formData.facilities.length ? (
                      formData.facilities.map((item) => (
                        <Badge bg="success" pill key={item}>
                          {item}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted">No facilities selected</span>
                    )}
                  </div>
                </div>

                <hr />

                <p className="small text-muted mb-0">
                  Publish is enabled once the essential fields are filled.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EditDraftAd;
