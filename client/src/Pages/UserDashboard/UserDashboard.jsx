import { useLocation, useNavigate } from "react-router-dom";
import "./UserDashboard.css";
import { useEffect, useState, useMemo } from "react";
import { jwtDecode } from "jwt-decode";



const UserDashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token"); // JWT token
  const location = useLocation();

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    amount: "",
    requestCategorie: "",
    reasonForRequest: "",
    daysToReturn: ""
  });

  const handleViewDetails = (req) => {
    setSelectedRequest(req);
    setIsDetailsOpen(true);
  };

  const handleEditClick = (req) => {
    setSelectedRequest(req);
    setEditFormData({
      amount: req.amount,
      requestCategorie: req.requestCategorie,
      reasonForRequest: req.reasonForRequest,
      daysToReturn: req.daysToReturn
    });
    setIsEditOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_MY_DOMAIN_IP}/api/user/requests/${selectedRequest._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editFormData),
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("Request updated successfully!");
        setRequests((prev) =>
          prev.map((r) => (r._id === selectedRequest._id ? data.request : r))
        );
        setIsEditOpen(false);
      } else {
        alert(data.message || "Failed to update request");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // DELETE USER REQUEST
  const requestDelete = async (id) => {
    if (confirm("Are you sure to delete this request?")) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_MY_DOMAIN_IP}/api/user/requests/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();

        if (res.ok) {
          alert("Request deleted successfully");
          setRequests((prev) => prev.filter((req) => req._id !== id));
        } else {
          alert(data.message || "Error deleting request");
        }
      } catch (err) {
        console.error(err);
        alert("Server error");
      }
    }
  };

  // FETCH REQUESTS + CHECK USER ROLE
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    let decodedUser;
    try {
      decodedUser = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedUser.exp && decodedUser.exp < currentTime) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    const fetchRequests = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_MY_DOMAIN_IP}/api/user/requests`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();
        setRequests(data.requests || []);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchDonations = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_MY_DOMAIN_IP}/api/user/donation-status`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();
        setDonations(data.donations || []);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    const checkPathByRole = () => {
      if (decodedUser.role === "user") {
        // Already on user-dashboard
      } else if (decodedUser.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/login");
      }
    };

    fetchRequests();
    fetchDonations();
    checkPathByRole();
  }, [token, navigate]);

  // CALCULATED DASHBOARD STATS (Dynamic Data)

  const dashboardData = useMemo(() => {
    const totalAmount = requests
      .filter((r) => r.status === "approved" || r.status === "completed")
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    const totalRequests = requests.length;
    const activeRequests = requests.filter(
      (r) => r.status === "pending",
    ).length;

    return {
      totalAmount,
      totalRequests,
      activeRequests,
    };
  }, [requests]);

  return (
    <div className="donation-container">
      <div className="dashboard-container">
        {/* Top Stat Cards */}
        <div className="stats-cards">
          <div className="card balance-card">
            <div className="icon">
              <i className="ri-heart-3-line"></i>
            </div>
            <div className="value">₹{dashboardData.totalAmount}</div>
            <div className="label">Total Amount Received</div>
          </div>
          <div className="card donations-card">
            <div className="icon">
              <i className="ri-heart-3-line"></i>
            </div>
            <div className="value">{dashboardData.totalRequests}</div>
            <div className="label">Total Requests Made</div>
          </div>
          <div className="card requests-card">
            <div className="icon">
              <i className="ri-hand-heart-line"></i>
            </div>
            <div className="value">{dashboardData.activeRequests}</div>
            <div className="label">Active Requests</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="donate-btn" onClick={() => navigate("/donate")}>
            Donate Now
          </button>
          <button className="request-btn" onClick={() => navigate("/request")}>
            Request Help
          </button>
        </div>

        {/* Main Content Section */}
        <div className="main-section">
          {/* Recent Donations */}
          <div className="donations-section">
            <div className="section-header">
              <h3>Recent Donations</h3>
              <div className="search-export">
                <input type="text" placeholder="Search donations..." />
                <button className="export-btn">Export</button>
              </div>
            </div>

            <ul className="donation-list">
              {donations.length > 0 ? (
                donations.map((don) => (
                  <li key={don._id}>
                    <div className="donation-item">
                      <div>
                        <strong>Donation Support</strong>
                        <p>{new Date(don.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="amount">₹{don.amount}</span>
                        <span className={`status ${don.status || 'success'}`}>{don.status || 'success'}</span>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li>No donations found</li>
              )}
            </ul>

            <a href="#" className="view-all">
              View All Donations
            </a>
          </div>

          {/* Request Status */}
          <div className="requests-section">
            <div className="section-header">
              <h3>Request Status</h3>
              <div className="badge-summary">
                <span className="badge blue">
                  Active: {dashboardData.activeRequests}
                </span>
                <span className="badge grey">
                  Total: {dashboardData.totalRequests}
                </span>
              </div>
            </div>

            {loading ? (
              <div>Loading....</div>
            ) : (
              <ul className="request-list">
                {requests.map((req) => (
                  <li className="request-card" key={req._id}>
                    <div>
                      <div className="forDays">
                        <strong>{req.requestCategorie}</strong>
                        <strong>
                          For{" "}
                          <span style={{ color: "#3b82f6" }}>
                            {req.daysToReturn}
                          </span>{" "}
                          Days
                        </strong>
                      </div>
                      <p>Submitted {new Date(req.createdAt).toDateString()}</p>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress filled"
                        style={{ width: "56%" }}
                      ></div>
                    </div>
                    <div className="request-footer">
                      <span>₹{req.amount}</span>
                      <span className={`status ${req.status}`}>
                        {req.status}
                      </span>
                    </div>
                    <div className="request-actions">
                      <a href="#" onClick={(e) => { e.preventDefault(); handleViewDetails(req); }}>View Details</a>
                      {req.status === "pending" && (
                        <a href="#" onClick={(e) => { e.preventDefault(); handleEditClick(req); }}>Edit</a>
                      )}
                      {req.status === "pending" && (
                        <button onClick={() => requestDelete(req._id)}>
                          Delete Request
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {isDetailsOpen && selectedRequest && (
        <div className="modal-overlay" onClick={() => setIsDetailsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Support Request Details</h2>
              <button className="close-btn" onClick={() => setIsDetailsOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Request ID:</span>
                <span className="detail-value">{selectedRequest._id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Category:</span>
                <span className="detail-value">{selectedRequest.requestCategorie}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Amount:</span>
                <span className="detail-value">₹{selectedRequest.amount}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Return Period:</span>
                <span className="detail-value">{selectedRequest.daysToReturn} Days</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`status ${selectedRequest.status}`}>{selectedRequest.status}</span>
              </div>
              <div className="detail-row" style={{ flexDirection: "column", alignItems: "flex-start", marginTop: "16px" }}>
                <span className="detail-label" style={{ marginBottom: "6px" }}>Reason for Request:</span>
                <span className="detail-value" style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", width: "100%", boxSizing: "border-box" }}>{selectedRequest.reasonForRequest}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setIsDetailsOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Request Modal */}
      {isEditOpen && selectedRequest && (
        <div className="modal-overlay" onClick={() => setIsEditOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Support Request</h2>
              <button className="close-btn" onClick={() => setIsEditOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={editFormData.amount}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Request Category</label>
                  <select
                    name="requestCategorie"
                    value={editFormData.requestCategorie}
                    onChange={handleEditChange}
                    required
                  >
                    <option value="Medical">Medical</option>
                    <option value="Education">Education</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Food">Food</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Days to return</label>
                  <select
                    name="daysToReturn"
                    value={editFormData.daysToReturn}
                    onChange={handleEditChange}
                    required
                  >
                    <option value="5">5 Days</option>
                    <option value="10">10 Days</option>
                    <option value="15">15 Days</option>
                    <option value="20">20 Days</option>
                    <option value="30">30 Days</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Reason for request</label>
                  <textarea
                    name="reasonForRequest"
                    rows="4"
                    value={editFormData.reasonForRequest}
                    onChange={handleEditChange}
                    required
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="modal-btn secondary" onClick={() => setIsEditOpen(false)}>Cancel</button>
                <button type="submit" className="modal-btn primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
