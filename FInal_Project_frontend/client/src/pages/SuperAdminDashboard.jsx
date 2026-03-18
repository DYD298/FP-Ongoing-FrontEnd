import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
  Badge,
  Table,
  Alert
} from "react-bootstrap";
import { useAuthContext } from "@asgardeo/auth-react";
import {
  ShieldCheck,
  Users,
  Megaphone,
  Bell,
  RefreshCw,
  UserPlus,
  UserCheck,
  UserX,
  Trash2
} from "lucide-react";
import {
  getSuperAdminHealth,
  getSuperAdminKpis,
  getAdmins,
  addAdmin,
  activateAdmin,
  deactivateAdmin,
  removeAdmin
} from "../api/superAdminApi";

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
};

const SuperAdminDashboard = () => {
  const { state, getAccessToken } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [health, setHealth] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [actionLoading, setActionLoading] = useState({});
  const [addingAdmin, setAddingAdmin] = useState(false);

  const [newAdmin, setNewAdmin] = useState({
    email: "",
    role: "admin"
  });

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

  const loadData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const { accessToken, email } = await getSessionAuth();

      const [healthResult, kpiResult, adminsResult] = await Promise.allSettled([
        getSuperAdminHealth(accessToken),
        getSuperAdminKpis(accessToken, email),
        getAdmins(accessToken, email)
      ]);

      if (healthResult.status === "fulfilled") {
        setHealth(healthResult.value || null);
      } else {
        setHealth(null);
      }

      if (kpiResult.status !== "fulfilled") {
        throw kpiResult.reason;
      }

      if (adminsResult.status !== "fulfilled") {
        throw adminsResult.reason;
      }

      setKpis(kpiResult.value || null);
      setAdmins(Array.isArray(adminsResult.value) ? adminsResult.value : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load super admin dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getSessionAuth]);

  useEffect(() => {
    if (!state?.isAuthenticated) {
      setLoading(false);
      return;
    }

    loadData();
  }, [loadData, state?.isAuthenticated]);

  const kpiItems = useMemo(() => {
    if (!kpis) return [];

    return [
      { label: "Total Users", value: kpis.total_users, icon: <Users size={18} /> },
      { label: "Total Ads", value: kpis.total_ads, icon: <Megaphone size={18} /> },
      { label: "Active Ads", value: kpis.active_ads, icon: <Megaphone size={18} /> },
      { label: "Pending Ads", value: kpis.pending_ads, icon: <Megaphone size={18} /> },
      { label: "Rejected Ads", value: kpis.rejected_ads, icon: <Megaphone size={18} /> },
      {
        label: "Total Notifications",
        value: kpis.total_notifications,
        icon: <Bell size={18} />
      },
      {
        label: "Unread Notifications",
        value: kpis.unread_notifications,
        icon: <Bell size={18} />
      },
      { label: "Total Admins", value: kpis.total_admins, icon: <ShieldCheck size={18} /> },
      { label: "Active Admins", value: kpis.active_admins, icon: <ShieldCheck size={18} /> }
    ];
  }, [kpis]);

  const setRowLoading = (adminId, value) => {
    setActionLoading((prev) => ({
      ...prev,
      [adminId]: value
    }));
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();

    if (!newAdmin.email.trim()) {
      setError("Admin email is required.");
      return;
    }

    setAddingAdmin(true);
    setError("");
    setMessage("");

    try {
      const { accessToken, email } = await getSessionAuth();
      await addAdmin(accessToken, email, {
        email: newAdmin.email.trim(),
        role: newAdmin.role || "admin"
      });

      setMessage("Admin added successfully.");
      setNewAdmin({ email: "", role: "admin" });
      await loadData(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to add admin.");
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleActivate = async (adminId) => {
    setRowLoading(adminId, true);
    setError("");
    setMessage("");

    try {
      const { accessToken, email } = await getSessionAuth();
      await activateAdmin(accessToken, email, adminId);
      setMessage("Admin activated.");
      await loadData(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to activate admin.");
    } finally {
      setRowLoading(adminId, false);
    }
  };

  const handleDeactivate = async (adminId) => {
    setRowLoading(adminId, true);
    setError("");
    setMessage("");

    try {
      const { accessToken, email } = await getSessionAuth();
      await deactivateAdmin(accessToken, email, adminId);
      setMessage("Admin deactivated.");
      await loadData(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to deactivate admin.");
    } finally {
      setRowLoading(adminId, false);
    }
  };

  const handleRemove = async (adminId) => {
    const confirmed = window.confirm("Remove this admin account?");
    if (!confirmed) return;

    setRowLoading(adminId, true);
    setError("");
    setMessage("");

    try {
      const { accessToken, email } = await getSessionAuth();
      await removeAdmin(accessToken, email, adminId);
      setMessage("Admin removed.");
      await loadData(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to remove admin.");
    } finally {
      setRowLoading(adminId, false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="text-center">
          <Spinner animation="border" variant="success" />
          <p className="text-muted mt-3 mb-0">Loading super admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5" style={{ paddingTop: "100px" }}>
      <Container>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div>
            <h2 className="fw-bold mb-1">Super Admin Dashboard</h2>
            <p className="text-muted mb-0">Monitor platform KPIs and manage admin access.</p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Badge bg={health ? "success" : "secondary"} className="px-3 py-2">
              {health ? "Service Online" : "Health Unknown"}
            </Badge>
            <Button
              variant="outline-success"
              className="rounded-pill fw-semibold"
              onClick={() => loadData(true)}
              disabled={refreshing}
            >
              <RefreshCw size={16} className="me-2" />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}

        <Row className="g-3 mb-4">
          {kpiItems.map((item) => (
            <Col md={6} lg={4} key={item.label}>
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

        <Row className="g-4">
          <Col lg={4}>
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-3">Add Admin</h5>
                <Form onSubmit={handleAddAdmin}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-semibold text-muted">Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={newAdmin.email}
                      onChange={(e) =>
                        setNewAdmin((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="admin@ceylonstay.com"
                      className="rounded-3"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-semibold text-muted">Role</Form.Label>
                    <Form.Select
                      value={newAdmin.role}
                      onChange={(e) =>
                        setNewAdmin((prev) => ({ ...prev, role: e.target.value }))
                      }
                      className="rounded-3"
                    >
                      <option value="admin">admin</option>
                      <option value="super_admin">super_admin</option>
                    </Form.Select>
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="success"
                    className="w-100 rounded-pill fw-semibold"
                    disabled={addingAdmin}
                  >
                    <UserPlus size={16} className="me-2" />
                    {addingAdmin ? "Adding..." : "Add Admin"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8}>
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">Admin Accounts</h5>
                  <Badge bg="light" text="dark" className="px-3 py-2">
                    {admins.length} total
                  </Badge>
                </div>

                {admins.length === 0 ? (
                  <div className="text-muted">No admin accounts found.</div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="align-middle mb-0">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Created At</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {admins.map((admin) => {
                          const busy = !!actionLoading[admin.id];
                          return (
                            <tr key={admin.id}>
                              <td>{admin.id}</td>
                              <td>{admin.email}</td>
                              <td>{admin.role}</td>
                              <td>
                                <Badge bg={admin.is_active ? "success" : "secondary"}>
                                  {admin.is_active ? "Active" : "Inactive"}
                                </Badge>
                              </td>
                              <td>{formatDateTime(admin.created_at)}</td>
                              <td className="text-end">
                                <div className="d-inline-flex gap-2">
                                  {admin.is_active ? (
                                    <Button
                                      size="sm"
                                      variant="outline-warning"
                                      onClick={() => handleDeactivate(admin.id)}
                                      disabled={busy}
                                    >
                                      <UserX size={14} className="me-1" />
                                      Deactivate
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline-success"
                                      onClick={() => handleActivate(admin.id)}
                                      disabled={busy}
                                    >
                                      <UserCheck size={14} className="me-1" />
                                      Activate
                                    </Button>
                                  )}

                                  <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() => handleRemove(admin.id)}
                                    disabled={busy}
                                  >
                                    <Trash2 size={14} className="me-1" />
                                    Remove
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
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

export default SuperAdminDashboard;
