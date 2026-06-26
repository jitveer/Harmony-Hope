import { useEffect, useState, useMemo } from "react";
import "./AdminDashboard.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import CustomModal from "../../Components/CustomModal/CustomModal";


const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";
  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "confirm",
    title: "",
    message: "",
    onConfirm: () => { },
    onCancel: () => { },
  });

  const totalDonationsAmount = useMemo(() => {
    return donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  }, [donations]);

  // 🔹 State for filters
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [dateFilter, setDateFilter] = useState("");

  const handleApprove = (status, id) => {
    setModalConfig({
      isOpen: true,
      type: "confirm",
      title: "Confirm Action",
      message: `Are you sure you want to ${status} this request?`,
      onConfirm: async () => {
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
        try {
          const res = await fetch(`${import.meta.env.VITE_MY_DOMAIN_IP}/api/admin/status/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status }),
          });

          const data = await res.json();

          if (res.ok) {
            setRequests((prev) =>
              prev.map((req) => (req._id === id ? { ...req, status: data.request?.status || status } : req))
            );
          } else {
            setModalConfig({
              isOpen: true,
              type: "error",
              title: "Error",
              message: data.message || "Failed to update request status.",
              onConfirm: () => setModalConfig((prev) => ({ ...prev, isOpen: false }))
            });
          }
        } catch (error) {
          setModalConfig({
            isOpen: true,
            type: "error",
            title: "Server Error",
            message: "Something went wrong on the server.",
            onConfirm: () => setModalConfig((prev) => ({ ...prev, isOpen: false }))
          });
        }
      },
      onCancel: () => {
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };


  // 🔹 Export filtered table data as CSV
  const exportTableData = () => {
    if (!filteredRequests || filteredRequests.length === 0) {
      alert("No data available to export!");
      return;
    }

    // Define headers
    const headers = [
      "Request ID",
      "Beneficiary Name",
      "Beneficiary Email",
      "Amount",
      "Category",
      "Status",
      "Date",
    ];

    // Convert filtered rows into CSV format
    const rows = filteredRequests.map((req) => [
      req._id,
      req.user?.name || "",
      req.user?.email || "",
      `₹${req.amount}`,
      req.requestCategorie || "",
      req.status,
      new Date(req.createdAt).toLocaleDateString(),
    ]);

    // CSV String
    const csvContent =
      "\uFEFF" +
      [headers, ...rows]
        .map((row) =>
          row
            .map((val) => `"${String(val).replace(/"/g, '""')}"`)
            .join(",")
        )
        .join("\n");

    // Create file & download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    link.href = url;
    link.download = `donation-requests-${stamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 🔹 Effect to apply filters whenever requests or filter criteria change
  useEffect(() => {
    let filtered = requests;

    // Search query filter (searches by ID, Name, or Email)
    if (searchQuery) {
      filtered = filtered.filter(
        (req) =>
          req._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (req.user?.name &&
            req.user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (req.user?.email &&
            req.user.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== "All Status") {
      filtered = filtered.filter((req) => req.status === statusFilter.toLowerCase());
    }

    // Category filter
    if (categoryFilter !== "All Categories") {
      filtered = filtered.filter((req) => req.requestCategorie === categoryFilter);
    }

    // Date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter).toLocaleDateString();
      filtered = filtered.filter(
        (req) => new Date(req.createdAt).toLocaleDateString() === filterDate
      );
    }

    setFilteredRequests(filtered);
  }, [requests, searchQuery, statusFilter, categoryFilter, dateFilter]);


  // 🔹 Clear all active filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All Status");
    setCategoryFilter("All Categories");
    setDateFilter("");
  };

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

    const fetchAllUserRequest = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_MY_DOMAIN_IP}/api/admin/admin`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setRequests(data.requests || []);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    const fetchAllDonations = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_MY_DOMAIN_IP}/api/admin/admin/donations`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setDonations(data.donations || []);
        }
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    const checkPathByRole = () => {
      if (decodedUser.role === "user") {
        navigate("/user-dashboard");
      } else if (decodedUser.role === "admin" || decodedUser.role === "superadmin") {
        // Already on admin-dashboard
      } else {
        navigate("/login");
      }
    };

    fetchAllUserRequest();
    fetchAllDonations();
    checkPathByRole();
  }, [navigate, token]);

  return (
    <>
      <div className="admin-layout">
        {/* Toggle Hamburger Button for Mobile */}
        <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <i className={isSidebarOpen ? "ri-close-line" : "ri-menu-line"}></i>
        </button>

        {/* Sidebar */}
        <aside className={`admin-sidebar ${isSidebarOpen ? "open" : ""}`}>
          <div className="sidebar-brand">
            <h2>HarmonyHope</h2>
            <p>Admin Portal</p>
          </div>
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => { setActiveTab("dashboard"); setIsSidebarOpen(false); }}
            >
              <i className="ri-dashboard-line"></i>
              <span>Dashboard</span>
            </button>
            <button
              className={`nav-item ${activeTab === "donations" ? "active" : ""}`}
              onClick={() => { setActiveTab("donations"); setIsSidebarOpen(false); }}
            >
              <i className="ri-hand-heart-line"></i>
              <span>Donations</span>
            </button>
            <button
              className={`nav-item ${activeTab === "requests" ? "active" : ""}`}
              onClick={() => { setActiveTab("requests"); setIsSidebarOpen(false); }}
            >
              <i className="ri-file-list-3-line"></i>
              <span>Requests</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="admin-main-content">
          {activeTab === "dashboard" && (
            <div className="tabContainer">
              {/* Stat Cards */}
              <div className="totalDonation top-cards" onClick={() => setActiveTab("donations")}>
                <div className="textpart">
                  <p>Total Donations</p>
                  <h2>₹{totalDonationsAmount}</h2>
                  <p>All time donations</p>
                </div>
                <div className="logopart">
                  <i className="ri-money-dollar-circle-line logo "></i>
                </div>
              </div>

              <div className="pendingRequests top-cards" onClick={() => setActiveTab("requests")}>
                <div className="textpart">
                  <p>Pending Requests</p>
                  <h2>{requests.filter((r) => r.status === "pending").length}</h2>
                  <p>Require review</p>
                </div>
                <div className="logopart">
                  <i className="ri-time-line text-yellow-600 logo "></i>
                </div>
              </div>

              <div className="approvedRequests top-cards" onClick={() => setActiveTab("requests")}>
                <div className="textpart">
                  <p>Approved Requests</p>
                  <h2>
                    {requests.filter((r) => r.status === "approved").length}
                  </h2>
                  <p>Approved so far</p>
                </div>
                <div className="logopart">
                  <i className="ri-check-line text-green-600 logo"></i>
                </div>
              </div>

              <div className="totalBeneficiaries top-cards" onClick={() => setActiveTab("requests")}>
                <div className="textpart">
                  <p>Total Beneficiaries</p>
                  <h2>{requests.length}</h2>
                  <p>Total requests made</p>
                </div>
                <div className="logopart">
                  <i className="ri-group-line text-purple-600 logo "></i>
                </div>
              </div>
            </div>
          )}

          {activeTab === "donations" && (
            <div className="donation-card">
              <div className="donation-header">
                <div className="donation-header-top">
                  <h3 className="donation-title">Donation Details</h3>
                </div>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Donation ID</th>
                      <th>Donor Name</th>
                      <th>Donor Email</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Transaction ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.length > 0 ? (
                      donations.map((don) => (
                        <tr key={don._id}>
                          <td>{don._id}</td>
                          <td>{don.userId?.name || "N/A"}</td>
                          <td>{don.userId?.email || "N/A"}</td>
                          <td>₹{don.amount}</td>
                          <td>
                            <span className={`status success`}>
                              {don.status || "success"}
                            </span>
                          </td>
                          <td>{new Date(don.createdAt).toLocaleDateString()}</td>
                          <td><code>{don.transactionId}</code></td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ textAlign: "center" }}>
                          No Donations Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "requests" && (
            <div className="donation-card">
              {/* Header Section */}
              <div className="donation-header">
                <div className="donation-header-top">
                  <h3 className="donation-title">Requests</h3>
                  <button className="btn btn-primary" onClick={exportTableData}>
                    <div className="btn-content">
                      <i className="ri-download-line"></i>
                      <span>Export Data</span>
                    </div>
                  </button>
                </div>

                {/* Filters */}
                <div className="donation-filters">
                  <div className="search-box">
                    <input
                      type="text"
                      placeholder="Search requests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <i className="ri-search-line"></i>
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option>All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option>All Categories</option>
                    <option value="Medical">Medical</option>
                    <option value="Education">Education</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Food">Food</option>
                  </select>

                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                  <button className="btn-clear" onClick={handleClearFilters}>
                    Clear Filters
                  </button>
                </div>
              </div>

              {/* Table Section */}
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>
                        <input type="checkbox" />
                      </th>
                      <th>Request ID</th>
                      <th>Beneficiary</th>
                      <th>Amount</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.length > 0 ? (
                      filteredRequests.map((req) => (
                        <tr key={req._id}>
                          <td>
                            <input type="checkbox" />
                          </td>
                          <td>{req._id}</td>
                          <td>
                            <div className="beneficiary">
                              <img
                                src={`https://ui-avatars.com/api/?name=${req.user?.name}`}
                                alt={req.user?.name}
                              />
                              <div>
                                <div className="name">{req.user?.name}</div>
                                <div className="email">{req.user?.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>₹{req.amount}</td>
                          <td>{req.requestCategorie}</td>
                          <td>
                            <span className={`status ${req.status}`}>
                              {req.status}
                            </span>
                          </td>
                          <td>
                            {new Date(req.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <button
                              className="btn btn-green"
                              onClick={() => handleApprove("approved", req._id)}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-red"
                              onClick={() => handleApprove("rejected", req._id)}
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" style={{ textAlign: "center" }}>
                          No Requests Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
      <CustomModal {...modalConfig} />
    </>
  );
};

export default AdminDashboard;
