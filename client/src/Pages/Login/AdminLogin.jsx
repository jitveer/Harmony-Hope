import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';
import { useUserTokenValidation } from "../../Components/UserTokenVerification/UserTokenVerification";


const AdminLogin = ({ onLogin }) => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { isValidToken, userId, setIsValidToken, setUserId } = useUserTokenValidation();

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }



    // useEffect(() => {

    //     const checkToken = () => {

    //     }

    //     checkToken();

    // }, (isValidToken))





    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // alert('Successful login', data.user._id);

                localStorage.setItem('userId', data.user._id);
                setUserId(data.user._id);
                setIsValidToken(True);

                console.log("Login submit hone par = ", isValidToken);

                if (data.user.role === "admin") navigate("/admin-dashboard");
                else navigate("/user-dashboard");

            } else {
                setError(data.message || 'Invalid credentials');
            }

        } catch (error) {
            setError('Network error. Please try again.');
        }

        setIsLoading(false);
    }



    return (

        <div className="adminLoginContainer">
            <div className="login-card">
                <div className="login-header">
                    <h1>HarmonyHope</h1>
                    <p>Welcome back! Please sign in to your account.</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="login-footer">
                    <div className="help-links">
                        <a href="/forgot-password">Forgot Password?</a>
                        <a href="/register">Don't have an account? Sign up</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
