import React, { useEffect, useState } from "react";
import styles from "./Notification.module.css";
import {
  FaPlaneDeparture,
  FaGift,
  FaCarSide,
  FaHotel,
  FaTag,
  FaInfoCircle,
} from "react-icons/fa";
import { useUserTokenValidation } from "../../Components/UserTokenVerification/UserTokenVerification";
import { useNavigate } from "react-router-dom";

const iconMap = {
  success: <FaGift className={styles.iconGreen} />,
  warning: <FaTag className={styles.iconOrange} />,
  error: <FaCarSide className={styles.iconRed} />,
  info: <FaInfoCircle className={styles.iconBlue} />,
};

const Notifications = () => {
  const { isValidToken, userId } = useUserTokenValidation();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) {
        alert("Login first to see your notifications");
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/notifications/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // token send
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch notifications");
        }

        setNotifications(data.notifications || []);
      } catch (error) {
        console.error("Error fetching notifications:", error.message);
        setNotifications([]); // empty array fallback
      } finally {
        setLoading(false);
      }
    };

    if (isValidToken) fetchNotifications();
  }, [isValidToken, userId, navigate]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Notifications</h2>

      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : notifications.length === 0 ? (
        <p className={styles.empty}>No notifications found.</p>
      ) : (
        <div className={styles.list}>
          {notifications.map((notif) => (
            <div key={notif._id} className={styles.notificationItem}>
              <div className={styles.iconWrapper}>
                {iconMap[notif.type] || iconMap.info}
              </div>
              <div className={styles.textWrapper}>
                <p className={styles.text}>
                  <strong>{notif.title}</strong> - {notif.message}
                </p>
                <span className={styles.time}>
                  {new Date(notif.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
