import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserTokenValidation } from "../../Components/UserTokenVerification/UserTokenVerification";
import style from './OtpLogin.module.css'


const OtpLogin = ({ onLogin }) => {
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");

  const { isValidToken, userId, setIsValidToken, setUserId } = useUserTokenValidation();


  // Handle Input Change
  const handleChange = (e) => {
    setInputValue(e.target.value);
    setError("");
  };

  // Validate Email or Mobile
  const validateInput = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (emailRegex.test(inputValue)) return "email";
    if (phoneRegex.test(inputValue)) return "phone";

    return null;
  };

  // Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    const type = validateInput();

    if (!type) {
      setError("Please enter a valid email or 10-digit mobile number");
      return;
    }

    try {
      // Call API to Generate opt
      const response = await fetch("http://localhost:5000/api/user/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [type]: inputValue }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setTimer(60); // 1 min timer
        setError("");
        alert("OTP Sent Successfully!");
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };


  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otp.length !== 8) {
      setError("Please enter a valid digit OTP");
      return;
    }

    try {
      // Call API to verify OTP

      const response = await fetch("http://localhost:5000/api/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputValue, otp }),
      });

      const data = await response.json();


      if (response.ok) {
        setIsValidToken(true);
        setUserId(data.user.userId);

        localStorage.setItem('token', data.token);
        alert("OTP Verified Successfully!");
        if (onLogin) onLogin(data.token);

        navigate("/user-dashboard");

      } else {
        setError(data.message || 'Invalid credentials');
      }



    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  // Timer Countdown
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className={style["LoginContainer"]}>
      <div className={style["login-card"]}>
        <div className={style["login-header"]}>
          <h1>OTP Login</h1>
          <p>Enter your Email or Mobile number to receive OTP</p>
        </div>

        <form className={style["login-form"]} onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
          {error && <div className={style["error-message"]}>{error}</div>}

          <div className={style["form-group"]}>
            <label htmlFor="inputValue">Email or Mobile</label>
            <input
              id="inputValue"
              type="text"
              placeholder="Enter email or 10-digit mobile"
              value={inputValue}
              onChange={handleChange}
              required
            />
          </div>

          {otpSent && (
            <div className={style["form-group"]}>
              <label htmlFor="otp">Enter OTP</label>
              <input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                maxLength={8}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <p className={style["timer-text"]}>
                {timer > 0 ? `Resend OTP in ${timer}s` : "You can resend OTP"}
              </p>
            </div>
          )}

          <button type="submit" className={style["login-button"]}>
            {otpSent ? "Verify OTP" : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpLogin;
