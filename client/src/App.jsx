import { Routes, Route } from 'react-router-dom';

import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import NoPage from "./Pages/NoPage/NoPage";
import Register from "./Pages/Register/Register";
import OtpVerify from "./Pages/Register/OtpVerify";
import UserDashboard from "./Pages/UserDashboard/UserDashboard";
import UserProfile from './Pages/UserProfile/UserProfile';
import Donate from './Pages/Donate/Donate';
import Request from './Pages/Request/Request';
import AdminDashboard from './Pages/AdminDashboard/AdminDashboard';
// import AdminLogin from './Pages/Login/AdminLogin';
import TermAndCondition from './Pages/TermCondition/TermAndCondition';
import PrivacyPolicy from './Pages/PrivacyPolicy/PrivacyPolicy';
import OtpLogin from './Pages/OtpLogin/OtpLogin';
import Notifications from './Pages/Notifications/Notifications';
import AboutUs from './Pages/AboutUs/AboutUs';
import ContactUs from './Pages/ContactUs/ContactUs';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';

const App = () => {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-otp" element={<OtpVerify />} />
                <Route path="/login" element={<Login />} />
                <Route path="/otp-login" element={<OtpLogin />} />

                <Route 
                    path="/user-dashboard" 
                    element={
                        <ProtectedRoute allowedRoles={["user"]}>
                            <UserDashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/user-profile" 
                    element={
                        <ProtectedRoute allowedRoles={["user"]}>
                            <UserProfile />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/donate" 
                    element={
                        <ProtectedRoute allowedRoles={["user"]}>
                            <Donate />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/notifications" 
                    element={
                        <ProtectedRoute allowedRoles={["user"]}>
                            <Notifications />
                        </ProtectedRoute>
                    } 
                />

                <Route 
                    path="/admin-dashboard" 
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } 
                />
                {/* <Route path="/admin-login" element={<AdminLogin />} /> */}

                <Route path="/about_us" element={<AboutUs />} />
                <Route path="/contact_us" element={<ContactUs />} />
                <Route path="/term_condition" element={<TermAndCondition />} />
                <Route path="/privacypolicy" element={<PrivacyPolicy />} />

                <Route 
                    path="/request" 
                    element={
                        <ProtectedRoute allowedRoles={["user"]}>
                            <Request />
                        </ProtectedRoute>
                    } 
                />
                <Route path="*" element={<NoPage />} />
            </Routes>
            <Footer />
        </>
    )
}


export default App;
