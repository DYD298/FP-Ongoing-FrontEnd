import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Spinner, Badge } from "react-bootstrap";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import {
  MapPin,
  Bed,
  Bath,
  Search,
  RefreshCcw,
  CameraOff,
  SlidersHorizontal
} from "lucide-react";
import {
  fetchActiveAds,
  getImageUrl,
  normalizeFacilities
} from "../api/adsApi";
import { searchPublicAds } from "../api/searchApi";
import ProtectedImage from "../components/ProtectedImage";

const toOptionalNumber = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const Listings = () => {
  const { state, getAccessToken } = useAuthContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const queryString = searchParams.toString();
  const queryFilters = useMemo(() => {
    const params = new URLSearchParams(queryString);

    return {
      province: params.get("province") || "",
      district: params.get("district") || "",
      propertyType: params.get("propertyType") || "",
      maxPrice: params.get("maxPrice") || "",
      attachedBathroom: params.get("attachedBathroom") === "true",
      kitchen: params.get("kitchen") === "true"
    };
  }, [queryString]);

  const [filters, setFilters] = useState({
    maxPrice: searchParams.get("maxPrice") || "",
    attachedBathroom: searchParams.get("attachedBathroom") === "true",
    kitchen: searchParams.get("kitchen") === "true"
  });

  useEffect(() => {
    const loadAds = async () => {
      setLoading(true);
      setError("");

      try {
        if (state?.isAuthenticated) {
          const token = await getAccessToken();
          setAccessToken(token || "");
          const data = await fetchActiveAds(token);
          setProperties(Array.isArray(data) ? data : []);
        } else {
          setAccessToken("");
          const data = await searchPublicAds({
            district: queryFilters.district || undefined,
            type: queryFilters.propertyType || undefined,
            max_price: toOptionalNumber(queryFilters.maxPrice)
          });
          setProperties(Array.isArray(data?.items) ? data.items : []);
        }
      } catch (err) {
        console.error(err);
        if (!state?.isAuthenticated) {
          setError(err.message || "Failed to fetch public listings.");
        } else {
          setError(err.message || "Failed to fetch listings");
        }
      } finally {
        setLoading(false);
      }
    };

    loadAds();
  }, [
    getAccessToken,
    queryFilters.district,
    queryFilters.maxPrice,
    queryFilters.propertyType,
    state?.isAuthenticated
  ]);

  const filteredProperties = useMemo(() => {
    const {
      province,
      district,
      propertyType,
      maxPrice,
      attachedBathroom,
      kitchen
    } = queryFilters;

    return properties.filter((prop) => {
      const facilities = normalizeFacilities(prop.facilities);
      const normalizedFacilities = facilities.map((item) => item.toLowerCase());
      const districtValue = String(prop.district || "").toLowerCase();
      const provinceValue = String(prop.province || "").toLowerCase();
      const typeValue = String(prop.type || "").toLowerCase();

      if (maxPrice && Number(prop.price || 0) > Number(maxPrice)) return false;
      if (district && districtValue !== district.toLowerCase()) return false;
      if (province && provinceValue !== province.toLowerCase()) return false;
      if (propertyType && typeValue !== propertyType.toLowerCase()) return false;
      if (attachedBathroom && !normalizedFacilities.includes("attached bathroom")) return false;
      if (kitchen && !normalizedFacilities.includes("kitchen")) return false;

      return true;
    });
  }, [properties, queryFilters]);

  const handleApplyFilters = (e) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    else params.delete("maxPrice");
    if (filters.attachedBathroom) params.set("attachedBathroom", "true");
    else params.delete("attachedBathroom");
    if (filters.kitchen) params.set("kitchen", "true");
    else params.delete("kitchen");

    setSearchParams(params);
  };

  const handleReset = () => {
    setFilters({
      maxPrice: "",
      attachedBathroom: false,
      kitchen: false
    });
    setSearchParams({});
  };

  return (
    <div className="bg-light min-vh-100 py-5" style={{ paddingTop: "100px" }}>
      <Container>
        <div className="mb-4">
          <h2 className="fw-bold mb-1">Browse Listings</h2>
          <p className="text-muted mb-0">
            Discover available properties with modern filters and quick access.
          </p>
        </div>

        <Row className="g-4">
          <Col lg={3}>
            <Card className="border-0 shadow-sm rounded-4 sticky-top" style={{ top: "110px" }}>
              <Card.Body className="p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <SlidersHorizontal size={18} className="text-success" />
                  <h6 className="fw-bold mb-0">Filters</h6>
                </div>

                <Form onSubmit={handleApplyFilters}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-semibold text-muted">
                      Max Price (LKR)
                    </Form.Label>
                    <Form.Control
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
                      }
                      placeholder="25000"
                      className="rounded-3"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Attached Bathroom"
                      checked={filters.attachedBathroom}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          attachedBathroom: e.target.checked
                        }))
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      label="Kitchen"
                      checked={filters.kitchen}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          kitchen: e.target.checked
                        }))
                      }
                    />
                  </Form.Group>

                  <Button type="submit" variant="success" className="w-100 rounded-pill fw-semibold">
                    <Search size={16} className="me-2" />
                    Apply Filters
                  </Button>

                  <Button
                    type="button"
                    variant="link"
                    className="w-100 mt-2 text-decoration-none text-muted"
                    onClick={handleReset}
                  >
                    <RefreshCcw size={14} className="me-1" />
                    Reset All
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={9}>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="success" />
              </div>
            ) : error ? (
              <div className="alert alert-danger rounded-4">{error}</div>
            ) : filteredProperties.length === 0 ? (
              <Card className="border-0 shadow-sm rounded-4 text-center p-5">
                <CameraOff size={42} className="mx-auto text-muted opacity-50 mb-3" />
                <h4 className="fw-bold text-muted">No listings found</h4>
                <p className="text-secondary mb-0">
                  Try changing your filters to see more properties.
                </p>
              </Card>
            ) : (
              <Row className="g-4">
                {filteredProperties.map((prop, idx) => (
                  <Col md={6} key={prop.id || idx}>
                    <motion.div
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      whileHover={{ y: -6 }}
                      className="h-100"
                    >
                      <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                        <div style={{ height: "230px", background: "#eef2f7" }}>
                          <ProtectedImage
                            imageUrl={getImageUrl(prop.images?.[0], {
                              usePublic: !state?.isAuthenticated
                            })}
                            token={accessToken}
                            alt={prop.title || "Property"}
                            className="w-100 h-100 object-fit-cover"
                            fallbackSrc="https://placehold.co/800x500?text=Image+Unavailable"
                          />
                        </div>

                        <Card.Body className="p-4">
                          <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                            <h5 className="fw-bold mb-0 text-truncate">
                              {prop.title || "Untitled Property"}
                            </h5>
                            <Badge bg="success" pill className="px-3 py-2">
                              Rs. {Number(prop.price || 0).toLocaleString()}
                            </Badge>
                          </div>

                          <p className="text-muted small d-flex align-items-center gap-1 mb-3">
                            <MapPin size={14} className="text-success" />
                            {prop.district || "Unknown location"}
                          </p>

                          <div className="d-flex gap-4 text-muted small border-top pt-3 mb-3">
                            <span className="d-flex align-items-center gap-1">
                              <Bed size={16} className="text-success" />
                              {prop.beds ?? 0} Beds
                            </span>
                            <span className="d-flex align-items-center gap-1">
                              <Bath size={16} className="text-success" />
                              {prop.baths ?? 0} Baths
                            </span>
                          </div>

                          <Link
                            to={`/property/${prop.id}`}
                            className="btn btn-outline-success w-100 rounded-pill fw-semibold"
                          >
                            View Details
                          </Link>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Listings;
