import React, { useState, useEffect, useRef } from "react";
import styles from './OtpVerify.module.css';
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useUserTokenValidation } from '../../Components/UserTokenVerification/UserTokenVerification';



const OtpVerify = () => {

    const location = useLocation();
    const navigation = useNavigate();
    const { email } = location.state || {};

    const [otp, setOtp] = useState(Array(6).fill(""));
    const [timer, setTimer] = useState(60);
    const [resendVisible, setResendVisible] = useState(false);
    const inputsRef = useRef([]);
    const { isValidToken, userId, setIsValidToken, setUserId } = useUserTokenValidation();


    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
            return () => clearInterval(interval);
        } else {
            setResendVisible(true);
        }
    }, [timer]);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (!/^[0-9]$/.test(value) && value !== "") return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        console.log(otp);

        if (value !== "" && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleResend = async () => {
        setOtp(Array(6).fill(""));
        setTimer(60);
        setResendVisible(false);
        inputsRef.current[0]?.focus();
        //API call to resend OTP
        try {
            const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    otp: otpCode
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setIsValidToken(true);
                setUserId(data.user.userId);
                console.log(" OTP Verified Successfully: ", data);
                alert("You are succesfully register");
                localStorage.setItem("token", data.token);
                navigation("/user-dashboard", { state: { email: email } });
            } else {
                console.error("OTP Verification Failed:", data.message);
            }
        } catch (err) {
            console.error("Error verifying OTP:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpCode = otp.join("");
        console.log("Entered OTP:", otp);
        // Call backend to verify this OTP

        try {
            const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    otp: otpCode
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setUserId(data.user.userId);
                setIsValidToken(true);

                alert("You are succesfully register");
                localStorage.setItem("token", data.token);
                navigation("/user-dashboard", { state: { email: email } });
            } else {
                console.error("OTP Verification Failed:", data.message);
            }
        } catch (err) {
            console.error("Error verifying OTP:", err);
        }

    };


    return (
        <div className={styles["otp-container"]}   >
            <div className={styles["otp-card"]}   >
                <form className={styles["register-form"]} autoComplete="off" onSubmit={handleSubmit}>
                    <div className={styles["otp-header"]}   >
                        <label>Email Verification</label>
                    </div>

                    <div className={styles["otp-inputs"]}   >
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                className={styles["otp-input"]}
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => (inputsRef.current[index] = el)}
                                inputMode="numeric"
                            />
                        ))}
                    </div>

                    {/* RESEND OTP BUTTON & TIMER */}

                    <div className={styles["otp-resend"]} styles={{ marginTop: '10px' }}>
                        {!resendVisible ? (
                            <span id="countdown">Resend OTP in ({timer}s)</span>
                        ) : (
                            <button
                                type="button"
                                id="resendOtpBtn"
                                className={styles["otp-btn"]}
                                onClick={handleResend}
                            >
                                Resend OTP
                            </button>
                        )}
                    </div>

                    {/* SUBMIT OTP */}
                    <button
                        type="submit"
                        className={styles["submit-btn"]}
                        styles={{ marginTop: '20px' }}
                        disabled={otp.includes("")}
                    >
                        <span>Verify OTP</span>
                    </button>
                </form>

            </div>
        </div>
    );
};

export default OtpVerify;
