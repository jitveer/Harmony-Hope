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

                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path="/user-profile" element={<UserProfile />} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/notifications" element={<Notifications />} />

                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                {/* <Route path="/admin-login" element={<AdminLogin />} /> */}

                <Route path="/about_us" element={<AboutUs />} />
                <Route path="/contact_us" element={<ContactUs />} />
                <Route path="/term_condition" element={<TermAndCondition />} />
                <Route path="/privacypolicy" element={<PrivacyPolicy />} />

                <Route path="/request" element={<Request />} />
                <Route path="*" element={<NoPage />} />
            </Routes>
            <Footer />
        </>
    )
}


export default App;
