import React, { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner, Badge, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Bed,
  Bath,
  RefreshCw,
  Trash2,
  FileText,
  PlusCircle,
  Pencil
} from "lucide-react";
import { useAuthContext } from "@asgardeo/auth-react";
import { fetchMyAds, deleteAdById, getImageUrl } from "../api/adsApi";
import ProtectedImage from "../components/ProtectedImage";

const getStatusBadgeConfig = (ad) => {
  const rawStatus = String(
    ad?.status ?? (ad?.is_active === true ? "ACTIVE" : ad?.is_active === false ? "DRAFT" : "")
  )
    .trim()
    .toUpperCase();

  if (rawStatus === "ACTIVE") {
    return { label: "Active", bg: "success" };
  }

  if (rawStatus === "REJECTED") {
    return { label: "Rejected", bg: "danger" };
  }

  if (rawStatus === "PENDING") {
    return { label: "Pending", bg: "warning", text: "dark" };
  }

  if (rawStatus === "DRAFT") {
    return { label: "Draft", bg: "secondary" };
  }

  if (rawStatus) {
    return {
      label: rawStatus.charAt(0) + rawStatus.slice(1).toLowerCase(),
      bg: "secondary"
    };
  }

  return { label: "Unknown", bg: "secondary" };
};

const MyAds = () => {
  const { state, getAccessToken } = useAuthContext();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [accessToken, setAccessToken] = useState("");

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

  const loadMyAds = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { accessToken, email } = await getSessionAuth();
      setAccessToken(accessToken);
      const data = await fetchMyAds(accessToken, email);
      setAds(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load your ads");
    } finally {
      setLoading(false);
    }
  }, [getSessionAuth]);

  useEffect(() => {
    if (!state?.isAuthenticated) {
      setLoading(false);
      return;
    }

    loadMyAds();
  }, [loadMyAds, state?.isAuthenticated]);

  const openDeleteModal = (ad) => {
    setSelectedAd(ad);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedAd?.id) return;

    setDeletingId(selectedAd.id);

    try {
      const { accessToken, email } = await getSessionAuth();
      await deleteAdById(accessToken, selectedAd.id, email);
      setAds((prev) => prev.filter((item) => item.id !== selectedAd.id));
      setShowDeleteModal(false);
      setSelectedAd(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5" style={{ paddingTop: "100px" }}>
      <Container>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div>
            <h2 className="fw-bold mb-1">My Ads</h2>
            <p className="text-muted mb-0">Manage your ads, drafts, and published listings.</p>
          </div>

          <Link to="/post-ad" className="btn btn-success rounded-pill fw-semibold px-4">
            <PlusCircle size={16} className="me-2" />
            Create New Ad
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" />
          </div>
        ) : error ? (
          <div className="alert alert-danger rounded-4">{error}</div>
        ) : ads.length === 0 ? (
          <Card className="border-0 shadow-sm rounded-4 text-center p-5">
            <FileText size={40} className="mx-auto text-muted opacity-50 mb-3" />
            <h4 className="fw-bold text-muted">You do not have any ads yet</h4>
            <p className="text-secondary">Create your first listing to get started.</p>
          </Card>
        ) : (
          <Row className="g-4">
            {ads.map((ad, idx) => {
              const statusBadge = getStatusBadgeConfig(ad);

              return (
                <Col md={6} xl={4} key={ad.id || idx}>
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="h-100"
                  >
                    <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                      <div style={{ height: "220px", background: "#eef2f7" }}>
                        <ProtectedImage
                          imageUrl={getImageUrl(ad.images?.[0])}
                          token={accessToken}
                          alt={ad.title || "Ad"}
                          className="w-100 h-100 object-fit-cover"
                          fallbackSrc="https://placehold.co/800x500?text=No+Image"
                        />
                      </div>

                      <Card.Body className="p-4 d-flex flex-column">
                        <div className="d-flex justify-content-between gap-2 mb-2">
                          <h5 className="fw-bold mb-0 text-truncate">
                            {ad.title || "Untitled Ad"}
                          </h5>
                          <div className="d-flex flex-column align-items-end gap-2">
                            <Badge bg="success" pill>
                              Rs. {Number(ad.price || 0).toLocaleString()}
                            </Badge>
                            <Badge bg={statusBadge.bg} text={statusBadge.text} pill>
                              {statusBadge.label}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-muted small d-flex align-items-center gap-1 mb-3">
                          <MapPin size={14} className="text-success" />
                          {ad.district || "Unknown location"}
                        </p>

                        <div className="d-flex gap-3 text-muted small mb-4">
                          <span className="d-flex align-items-center gap-1">
                            <Bed size={15} className="text-success" />
                            {ad.beds ?? 0}
                          </span>
                          <span className="d-flex align-items-center gap-1">
                            <Bath size={15} className="text-success" />
                            {ad.baths ?? 0}
                          </span>
                        </div>

                        <div className="mt-auto d-grid gap-2">
                          <Link
                            to={`/ads/edit-draft/${ad.id}`}
                            className="btn btn-outline-success rounded-pill fw-semibold"
                          >
                            <Pencil size={15} className="me-2" />
                            Edit Draft
                          </Link>

                          <Button
                            variant="outline-danger"
                            className="rounded-pill fw-semibold"
                            onClick={() => openDeleteModal(ad)}
                          >
                            <Trash2 size={15} className="me-2" />
                            Delete Ad
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              );
            })}
          </Row>
        )}

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Delete Ad</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete <strong>{selectedAd?.title || "this ad"}</strong>?
            This action cannot be undone.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={!!deletingId}>
              {deletingId ? "Deleting..." : "Delete"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default MyAds;
