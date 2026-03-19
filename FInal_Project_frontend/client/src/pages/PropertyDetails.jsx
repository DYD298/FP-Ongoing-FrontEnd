import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Carousel,
  Card,
  Button,
  Spinner,
  Badge,
  Modal,
  Form
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthContext } from "@asgardeo/auth-react";
import {
  MapPin,
  Bed,
  Bath,
  Sofa,
  CheckCircle,
  Phone,
  Mail,
  ShieldAlert,
  Clock,
  ImageOff,
  Send
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import Toast from "../components/Toast";
import { fetchAdById, getImageUrl, normalizeFacilities } from "../api/adsApi";
import { fetchPublicAdById } from "../api/searchApi";
import ProtectedImage from "../components/ProtectedImage";

const USER_SERVICE_BASE_URL =
  "https://a88642b8-2b68-4d73-b038-49eb67884ca4-prod.e1-us-east-azure.bijiraapis.dev/default/ceylonstay-user-service/v1.0";

const pickFirstValidText = (...values) => {
  for (const value of values) {
    const text = String(value ?? "").trim();
    if (!text) continue;
    if (text.toLowerCase() === "null" || text.toLowerCase() === "undefined") continue;
    return text;
  }

  return "";
};

const normalizeWhatsAppNumber = (phone) => {
  const digits = String(phone || "").replace(/\D+/g, "");
  if (!digits) return "";

  if (digits.startsWith("94")) {
    return digits;
  }

  if (digits.length === 10 && digits.startsWith("0")) {
    return `94${digits.slice(1)}`;
  }

  return digits;
};

const buildWhatsAppLink = (phone, propertyTitle) => {
  const normalized = normalizeWhatsAppNumber(phone);
  if (!normalized) return "";

  const text = encodeURIComponent(
    `Hi, I'm interested in ${propertyTitle || "your property"}. Is it still available?`
  );
  return `https://wa.me/${normalized}?text=${text}`;
};

const PropertyDetails = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const { state, getAccessToken } = useAuthContext();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPhone, setShowPhone] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [usePublicData, setUsePublicData] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError("");

      try {
        const token = state?.isAuthenticated ? await getAccessToken() : "";
        const email = state?.email || "";
        let sourceIsPublic = !state?.isAuthenticated;
        let data = null;

        if (state?.isAuthenticated) {
          try {
            data = await fetchAdById(token, id, email);
          } catch (protectedError) {
            const errText = String(protectedError?.message || "").toLowerCase();
            const shouldFallbackToPublic =
              !token ||
              errText.includes("401") ||
              errText.includes("403") ||
              errText.includes("invalid_token") ||
              errText.includes("unauthorized") ||
              errText.includes("forbidden");

            if (!shouldFallbackToPublic) {
              throw protectedError;
            }

            data = await fetchPublicAdById(id);
            sourceIsPublic = true;
          }
        } else {
          data = await fetchPublicAdById(id);
          sourceIsPublic = true;
        }

        if (!data) {
          throw new Error("Property not found");
        }

        setUsePublicData(sourceIsPublic);
        setAccessToken(sourceIsPublic ? "" : token || "");

        const facilities = normalizeFacilities(data?.facilities);
        const imageList = Array.isArray(data?.images) ? data.images : [];
        const imageNames = imageList.length ? imageList : [null];

        const ownerEmail = pickFirstValidText(
          data?.owner_email,
          data?.user_email,
          data?.owner?.email,
          data?.contact?.email
        );

        const ownerPhone = pickFirstValidText(
          data?.phone,
          data?.owner_phone,
          data?.user_phone,
          data?.contact_phone,
          data?.contact_number,
          data?.mobile,
          data?.owner?.phone,
          data?.owner?.mobile,
          data?.contact?.phone
        );

        const ownerName = pickFirstValidText(
          data?.owner_name,
          data?.user_name,
          data?.owner?.name,
          ownerEmail ? ownerEmail.split("@")[0] : ""
        );

        setProperty({
          ...data,
          facilities,
          imageNames,
          owner: {
            name: ownerName || "Property Owner",
            since: "2024",
            phone: ownerPhone || null,
            email: ownerEmail || ""
          }
        });
      } catch (err) {
        console.error("Failed to fetch property:", err);
        setError(err.message || "Property not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [getAccessToken, id, state?.email, state?.isAuthenticated]);

  const isPending = useMemo(() => {
    return String(property?.status || "").toUpperCase() === "PENDING";
  }, [property]);

  const furnishedLabel = useMemo(() => {
    if (!property?.facilities?.length) return "Not Furnished";
    const joined = property.facilities.join(" ").toLowerCase();

    if (joined.includes("fully furnished") || joined.includes("furnished")) {
      return "Furnished";
    }

    if (joined.includes("semi-furnished")) {
      return "Semi-Furnished";
    }

    return "Not Furnished";
  }, [property]);

  const ownerWhatsAppLink = useMemo(() => {
    return buildWhatsAppLink(property?.owner?.phone, property?.title);
  }, [property?.owner?.phone, property?.title]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!property?.owner?.email) return;

    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setShowMessageModal(false);
      setShowToast(true);

      const subject = encodeURIComponent(`Inquiry for ${property.title}`);
      const body = encodeURIComponent(messageText);

      window.location.href = `mailto:${property.owner.email}?subject=${subject}&body=${body}`;
      setMessageText("");
    }, 700);
  };

  const fetchPhoneFromUserService = async (ownerEmail) => {
    const normalizedEmail = pickFirstValidText(ownerEmail);
    if (!normalizedEmail) return "";

    const token = accessToken || (state?.isAuthenticated ? await getAccessToken() : "");
    if (!token) return "";

    const response = await fetch(`${USER_SERVICE_BASE_URL}/profile`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-User-Email": normalizedEmail
      }
    });

    if (!response.ok) {
      return "";
    }

    const profile = await response.json();
    return pickFirstValidText(profile?.phone, profile?.mobile, profile?.contact_phone);
  };

  const handleShowPhoneClick = async () => {
    if (showPhone && property?.owner?.phone && ownerWhatsAppLink) {
      window.open(ownerWhatsAppLink, "_blank", "noopener,noreferrer");
      return;
    }

    if (property?.owner?.phone) {
      setShowPhone(true);
      return;
    }

    if (!property?.owner?.email) {
      setShowPhone(true);
      return;
    }

    try {
      setPhoneLoading(true);
      const fetchedPhone = await fetchPhoneFromUserService(property.owner.email);

      if (fetchedPhone) {
        setProperty((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            owner: {
              ...prev.owner,
              phone: fetchedPhone
            }
          };
        });
      }
    } catch (lookupError) {
      console.error("Failed to fetch owner phone by email:", lookupError);
    } finally {
      setPhoneLoading(false);
      setShowPhone(true);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="text-center">
          <Spinner animation="border" variant="success" />
          <p className="mt-3 text-muted fw-semibold mb-0">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <Container className="py-5 mt-5 text-center">
        <div className="py-5">
          <ImageOff size={64} className="text-muted mb-3 opacity-25" />
          <h2 className="text-muted fw-bold">Property not found</h2>
          <p className="text-secondary">
            This listing may be unavailable, removed, or still under review.
          </p>
          <Link to="/listings" className="btn btn-success mt-3 rounded-pill px-4">
            Back to Listings
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <div
      style={{
        paddingTop: "100px",
        paddingBottom: "60px",
        background: "linear-gradient(180deg, #fcfcfd 0%, #f8fafc 100%)",
        minHeight: "100vh"
      }}
    >
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        title="Message Ready"
        message="Your email app is opening with the message."
      />

      <Container>
        {isPending && (
          <Badge
            bg="warning"
            text="dark"
            className="mb-3 px-3 py-2 rounded-pill d-inline-flex align-items-center gap-2 shadow-sm"
          >
            <Clock size={16} />
            {t("property.pendingVerification") || "Under Review"}
          </Badge>
        )}

        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-success">
                {t("property.breadcrumb.home") || "Home"}
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/listings" className="text-decoration-none text-success">
                {t("property.breadcrumb.find") || "Listings"}
              </Link>
            </li>
            <li
              className="breadcrumb-item active text-truncate"
              style={{ maxWidth: "260px" }}
              aria-current="page"
            >
              {property.title || "Property"}
            </li>
          </ol>
        </nav>

        <Row className="g-4">
          <Col lg={8}>
            <motion.div
              className="mb-4 rounded-4 overflow-hidden shadow-sm bg-white border"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Carousel
                indicators={property.imageNames.length > 1}
                interval={4500}
                pause="hover"
              >
                {property.imageNames.map((imageName, index) => (
                  <Carousel.Item key={index}>
                    <ProtectedImage
                      className="d-block w-100"
                      imageUrl={imageName ? getImageUrl(imageName, { usePublic: usePublicData }) : null}
                      token={accessToken}
                      alt={`Property view ${index + 1}`}
                      style={{ height: "500px", objectFit: "cover" }}
                      fallbackSrc="https://placehold.co/1000x650?text=Image+Unavailable"
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </motion.div>

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
              <div>
                <h1 className="fw-bold text-dark h2 mb-2">
                  {property.title || "Untitled Property"}
                </h1>
                <p className="text-muted d-flex align-items-center gap-2 mb-0">
                  <MapPin size={18} className="text-success" />
                  {[property.address, property.district, property.province]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>

              <div className="text-md-end">
                <h2 className="text-success fw-bold mb-1">
                  Rs. {Number(property.price || 0).toLocaleString()}
                </h2>
                <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                  {t("property.perMonth") || "Per Month"}
                </span>
              </div>
            </div>

            <Row className="g-3 mb-5">
              {[
                { icon: <Bed size={20} />, label: `${property.beds ?? 0} Beds` },
                { icon: <Bath size={20} />, label: `${property.baths ?? 0} Baths` },
                { icon: <MapPin size={20} />, label: property.type || "Room" },
                { icon: <Sofa size={20} />, label: furnishedLabel }
              ].map((item, idx) => (
                <Col xs={6} md={3} key={idx}>
                  <div className="p-3 bg-white rounded-4 text-center border shadow-sm h-100">
                    <div className="text-success mb-2 d-flex justify-content-center">
                      {item.icon}
                    </div>
                    <p className="mb-0 fw-bold small text-dark">{item.label}</p>
                  </div>
                </Col>
              ))}
            </Row>

            <Card className="border-0 shadow-sm rounded-4 mb-4">
              <Card.Body className="p-4 p-md-5">
                <h4 className="fw-bold mb-3">
                  {t("property.description") || "Description"}
                </h4>
                <p
                  className="text-muted lh-lg mb-0"
                  style={{ whiteSpace: "pre-wrap", fontSize: "1.02rem" }}
                >
                  {property.description || "No description available."}
                </p>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-4 p-md-5">
                <h4 className="fw-bold mb-3">
                  {t("property.facilities") || "Facilities"}
                </h4>

                {property.facilities?.length ? (
                  <Row className="g-3">
                    {property.facilities.map((fac, idx) => (
                      <Col md={6} key={idx}>
                        <div className="d-flex align-items-center gap-3 p-2 rounded-3">
                          <CheckCircle size={20} className="text-success flex-shrink-0" />
                          <span className="text-secondary fw-medium">{fac}</span>
                        </div>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <p className="text-muted mb-0">No facilities listed.</p>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <div style={{ position: "sticky", top: "120px" }}>
              <Card className="shadow-lg border-0 rounded-4 mb-4 overflow-hidden">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4">
                    {t("property.contactOwner") || "Contact Owner"}
                  </h5>

                  <div className="d-flex align-items-center mb-4">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        property.owner.name
                      )}&background=198754&color=fff&bold=true`}
                      className="rounded-circle me-3 border shadow-sm"
                      width="64"
                      height="64"
                      alt="Owner Avatar"
                    />
                    <div>
                      <h6 className="mb-0 fw-bold fs-5">{property.owner.name}</h6>
                      <small className="text-muted">
                        {t("property.memberSince") || "Member since"} {property.owner.since}
                      </small>
                    </div>
                  </div>

                  <div className="d-grid gap-3">
                    <Button
                      variant={showPhone ? "light" : "success"}
                      onClick={handleShowPhoneClick}
                      className={`py-2 fw-bold d-flex align-items-center justify-content-center gap-2 rounded-pill border-0 shadow-sm ${
                        showPhone ? "text-dark" : ""
                      }`}
                      disabled={phoneLoading}
                    >
                      <Phone size={18} />
                      {phoneLoading
                        ? "Loading phone..."
                        : showPhone
                        ? property.owner.phone
                          ? `${property.owner.phone} (Tap for WhatsApp)`
                          : "Phone not available"
                        : t("property.showPhone") || "SHOW PHONE NUMBER"}
                    </Button>

                    <Button
                      variant="outline-success"
                      onClick={() => setShowMessageModal(true)}
                      className="py-2 fw-bold d-flex align-items-center justify-content-center gap-2 rounded-pill"
                      disabled={!property.owner.email}
                    >
                      <Mail size={18} />
                      {t("property.sendMessage") || "SEND MESSAGE"}
                    </Button>
                  </div>

                  <div className="mt-4 p-3 bg-light rounded-4 border-start border-success border-4 shadow-sm">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <ShieldAlert size={18} className="text-success" />
                      <h6 className="mb-0 fw-bold small text-uppercase">
                        {t("property.safety") || "Safety Tips"}
                      </h6>
                    </div>
                    <ul
                      className="text-muted ps-3 mb-0"
                      style={{ fontSize: "0.88rem", lineHeight: "1.7" }}
                    >
                      <li>Never send money before visiting the property.</li>
                      <li>Inspect the place and confirm the owner details in person.</li>
                      <li>Meet in a safe location when arranging the first visit.</li>
                    </ul>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>

      <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">
            Send Message to {property.owner.name}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4">
          <Form onSubmit={handleSendMessage}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted text-uppercase">
                Your Message
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                required
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="I'm interested in this property. Is it still available?"
                className="bg-light border-0 p-3 rounded-3"
              />
            </Form.Group>

            <Button
              variant="success"
              type="submit"
              disabled={isSending}
              className="w-100 py-3 fw-bold rounded-pill d-flex align-items-center justify-content-center gap-2"
            >
              {isSending ? <Spinner size="sm" /> : <Send size={18} />}
              {isSending ? "Preparing..." : "Send via Email"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PropertyDetails;
