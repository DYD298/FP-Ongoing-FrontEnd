import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Badge,
  Table,
  Alert,
  Form
} from "react-bootstrap";
import { useAuthContext } from "@asgardeo/auth-react";
import { Megaphone, Bell, MousePointerClick, RefreshCw } from "lucide-react";
import {
  getAdminHealth,
  getAdminKpis,
  getAdminOverview,
  getAdminAds
} from "../api/adminApi";

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
};

const normalizeAds = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.ads)) return payload.ads;
  return [];
};

const getStatusBadge = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "active") return "success";
  if (normalized === "pending") return "warning";
  if (normalized === "rejected") return "danger";
  if (normalized === "draft") return "secondary";
  return "dark";
};

const AdminDashboard = () => {
  const { state, getAccessToken } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [adsLoading, setAdsLoading] = useState(false);
  const [error, setError] = useState("");

  const [health, setHealth] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [overview, setOverview] = useState(null);
  const [ads, setAds] = useState([]);
  const [adsMeta, setAdsMeta] = useState({ total: null, skip: 0, limit: 100 });

  const [statusFilter, setStatusFilter] = useState("");
  const [limitFilter, setLimitFilter] = useState(100);

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

  const loadDashboard = useCallback(
    async (manualRefresh = false) => {
      if (manualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const { accessToken, email } = await getSessionAuth();
        const [healthResult, kpiResult, overviewResult] = await Promise.allSettled([
          getAdminHealth(accessToken, email),
          getAdminKpis(accessToken, email),
          getAdminOverview(accessToken, email)
        ]);

        if (healthResult.status === "fulfilled") {
          setHealth(healthResult.value || null);
        } else {
          setHealth(null);
        }

        if (kpiResult.status !== "fulfilled") {
          throw kpiResult.reason;
        }

        if (overviewResult.status !== "fulfilled") {
          throw overviewResult.reason;
        }

        setKpis(kpiResult.value || null);
        setOverview(overviewResult.value || null);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load admin dashboard.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [getSessionAuth]
  );

  const loadAds = useCallback(
    async ({ skip = 0, limit = limitFilter, status = statusFilter } = {}) => {
      setAdsLoading(true);
      setError("");

      try {
        const { accessToken, email } = await getSessionAuth();
        const filters = { skip, limit };
        if (status) {
          filters.status = status;
        }

        const payload = await getAdminAds(accessToken, email, filters);
        const items = normalizeAds(payload);
        const total = Number.isFinite(payload?.total) ? payload.total : items.length;

        setAds(items);
        setAdsMeta({ total, skip, limit });
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load ads.");
      } finally {
        setAdsLoading(false);
      }
    },
    [getSessionAuth, limitFilter, statusFilter]
  );

  useEffect(() => {
    if (!state?.isAuthenticated) {
      setLoading(false);
      return;
    }

    loadDashboard();
    loadAds();
  }, [loadAds, loadDashboard, state?.isAuthenticated]);

  const kpiCards = useMemo(() => {
    if (!kpis) return [];

    return [
      { label: "Total Ads", value: kpis.total_ads, icon: <Megaphone size={18} /> },
      { label: "Active Ads", value: kpis.active_ads, icon: <Megaphone size={18} /> },
      { label: "Pending Ads", value: kpis.pending_ads, icon: <Megaphone size={18} /> },
      { label: "Rejected Ads", value: kpis.rejected_ads, icon: <Megaphone size={18} /> },
      { label: "Draft Ads", value: kpis.draft_ads, icon: <Megaphone size={18} /> },
      { label: "Total Clicks", value: kpis.total_clicks, icon: <MousePointerClick size={18} /> },
      {
        label: "Total Notifications",
        value: kpis.total_notifications,
        icon: <Bell size={18} />
      },
      {
        label: "Unread Notifications",
        value: kpis.unread_notifications,
        icon: <Bell size={18} />
      }
    ];
  }, [kpis]);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="text-center">
          <Spinner animation="border" variant="success" />
          <p className="text-muted mt-3 mb-0">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5" style={{ paddingTop: "100px" }}>
      <Container>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div>
            <h2 className="fw-bold mb-1">Admin Dashboard</h2>
            <p className="text-muted mb-0">Track moderation activity and manage ads quickly.</p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Badge bg={health ? "success" : "secondary"} className="px-3 py-2">
              {health ? "Service Online" : "Health Unknown"}
            </Badge>
            <Button
              variant="outline-success"
              className="rounded-pill fw-semibold"
              onClick={() => {
                loadDashboard(true);
                loadAds({ skip: 0 });
              }}
              disabled={refreshing || adsLoading}
            >
              <RefreshCw size={16} className="me-2" />
              {refreshing || adsLoading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Row className="g-3 mb-4">
          {kpiCards.map((item) => (
            <Col md={6} lg={3} key={item.label}>
              <Card className="border-0 shadow-sm rounded-4 h-100">
                <Card.Body className="p-4 d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted small mb-1">{item.label}</p>
                    <h4 className="fw-bold mb-0">{Number(item.value || 0).toLocaleString()}</h4>
                  </div>
                  <div className="text-success">{item.icon}</div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="g-4 mb-4">
          <Col lg={12}>
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                  <h5 className="fw-bold mb-0">Recent Ads</h5>
                  <Badge bg="light" text="dark" className="px-3 py-2">
                    {Array.isArray(overview?.recent_ads) ? overview.recent_ads.length : 0} items
                  </Badge>
                </div>

                {Array.isArray(overview?.recent_ads) && overview.recent_ads.length > 0 ? (
                  <div className="table-responsive">
                    <Table hover className="align-middle mb-0">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Email</th>
                          <th>Status</th>
                          <th>Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {overview.recent_ads.map((ad, index) => (
                          <tr key={`${ad.id || "ad"}-${index}`}>
                            <td>{ad.id ?? "-"}</td>
                            <td>{ad.title || "-"}</td>
                            <td>{ad.user_email || ad.email || "-"}</td>
                            <td>
                              <Badge bg={getStatusBadge(ad.status)}>
                                {ad.status || "unknown"}
                              </Badge>
                            </td>
                            <td>{formatDateTime(ad.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-muted">No recent ads found.</div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          <Col lg={12}>
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
                  <h5 className="fw-bold mb-0">Ads</h5>

                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <Form.Select
                      className="rounded-3"
                      style={{ minWidth: "170px" }}
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                      <option value="draft">Draft</option>
                    </Form.Select>

                    <Form.Select
                      className="rounded-3"
                      style={{ minWidth: "130px" }}
                      value={limitFilter}
                      onChange={(e) => setLimitFilter(Number(e.target.value) || 100)}
                    >
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                      <option value={250}>250</option>
                    </Form.Select>

                    <Button
                      variant="success"
                      className="rounded-pill fw-semibold"
                      onClick={() => loadAds({ skip: 0 })}
                      disabled={adsLoading}
                    >
                      {adsLoading ? "Loading..." : "Apply"}
                    </Button>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <small className="text-muted">
                    Showing {ads.length} ads{Number.isFinite(adsMeta.total) ? ` of ${adsMeta.total}` : ""}
                  </small>
                  <small className="text-muted">Skip: {adsMeta.skip}</small>
                </div>

                {adsLoading ? (
                  <div className="text-muted">Loading ads...</div>
                ) : ads.length === 0 ? (
                  <div className="text-muted">No ads found for this filter.</div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="align-middle mb-0">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Email</th>
                          <th>Status</th>
                          <th>Price</th>
                          <th>Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ads.map((ad, index) => (
                          <tr key={`${ad.id || "ad-row"}-${index}`}>
                            <td>{ad.id ?? "-"}</td>
                            <td>{ad.title || "-"}</td>
                            <td>{ad.user_email || ad.email || "-"}</td>
                            <td>
                              <Badge bg={getStatusBadge(ad.status)}>
                                {ad.status || "unknown"}
                              </Badge>
                            </td>
                            <td>
                              {ad.price !== undefined && ad.price !== null
                                ? `LKR ${Number(ad.price).toLocaleString()}`
                                : "-"}
                            </td>
                            <td>{formatDateTime(ad.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;

