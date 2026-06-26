import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminLogin.module.css";
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

  const { isValidToken, userId, setIsValidToken, setUserId } =
    useUserTokenValidation();

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
      const response = await fetch(
        `${import.meta.env.VITE_MY_DOMAIN_IP}/api/auth/admin-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        // alert('Successful login', data.user.userId);

        localStorage.setItem("token", data.token);
        setUserId(data.user.userId);
        setIsValidToken(true);

        console.log("Login submit hone par = ", isValidToken);

        navigate("/admin-dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className={styles.adminLoginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1>HarmonyHope</h1>
          <p>Welcome back! Please sign in to your account.</p>
        </div>

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}

          <div className={styles.formGroup}>
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

          <div className={styles.formGroup}>
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

          <button type="submit" className={styles.loginButton} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className={styles.loginFooter}>
          <div className={styles.helpLinks}>
            <a href="/forgot-password">Forgot Password?</a>
            <a href="/register">Don't have an account? Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
