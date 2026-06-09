import { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔹 State for filters
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [dateFilter, setDateFilter] = useState("");

  const handleApprove = async (status, id) => {

    try {
      const res = await fetch(`${import.meta.env.VITE_MY_DOMAIN_IP}/api/requests/status/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        setRequests((prev) =>
          prev.map((req) => (req._id === id ? data.request : req))
        );
      }
    } catch (error) {
      alert("Server error");
    }
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
        const res = await fetch(`${import.meta.env.VITE_MY_DOMAIN_IP}/api/requests/admin`, {
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

    const checkPathByRole = () => {
      if (decodedUser.role === "user") {
        navigate("/user-dashboard");
      } else if (decodedUser.role === "admin") {
        // Already on admin-dashboard
      } else {
        navigate("/login");
      }
    };

    fetchAllUserRequest();
    checkPathByRole();
  }, [navigate, token]);

  return (
    <>
      <div className="dashboardContainer">
        <div className="rightSide">
          <div className="tabContainer">
            <div className="totalDonation top-cards">
              <div className="textpart">
                <p>Total Donations</p>
                <h2>0</h2>
                <p>12.5% vs last month</p>
              </div>
              <div className="logopart">
                <i className="ri-money-dollar-circle-line logo "></i>
              </div>
            </div>

            <div className="pendingRequests top-cards">
              <div className="textpart">
                <p>Pending Requests</p>
                <h2>{requests.filter((r) => r.status === "pending").length}</h2>
                <p>= new today</p>
              </div>
              <div className="logopart">
                <i className="ri-time-line text-yellow-600 logo "></i>
              </div>
            </div>

            <div className="approvedRequests top-cards">
              <div className="textpart">
                <p>Approved Requests</p>
                <h2>
                  {requests.filter((r) => r.status === "approved").length}
                </h2>
                <p>+ this week</p>
              </div>
              <div className="logopart">
                <i className="ri-check-line text-green-600 logo"></i>
              </div>
            </div>

            <div className="totalBeneficiaries top-cards">
              <div className="textpart">
                <p>Total Beneficiaries</p>
                <h2>{requests.length}</h2>
                <p>Total requests</p>
              </div>
              <div className="logopart">
                <i className="ri-group-line text-purple-600 logo "></i>
              </div>
            </div>
          </div>

          <div className="donation-card">
            {/* Header Section */}
            <div className="donation-header">
              <div className="donation-header-top">
                <h3 className="donation-title">Donation Requests</h3>
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
                  <option>Medical</option>
                  <option>Education</option>
                  <option>Emergency</option>
                  <option>Food</option>
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
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
