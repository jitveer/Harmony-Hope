import React from "react";
import styles from "./CustomModal.module.css";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaQuestionCircle,
} from "react-icons/fa";

const CustomModal = ({
  isOpen,
  type = "info", // success, error, warning, info, confirm
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  // Select icon based on type
  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheckCircle className={`${styles.icon} ${styles.successIcon}`} />;
      case "error":
        return <FaTimesCircle className={`${styles.icon} ${styles.errorIcon}`} />;
      case "warning":
        return <FaExclamationTriangle className={`${styles.icon} ${styles.warningIcon}`} />;
      case "confirm":
        return <FaQuestionCircle className={`${styles.icon} ${styles.confirmIcon}`} />;
      case "info":
      default:
        return <FaInfoCircle className={`${styles.icon} ${styles.infoIcon}`} />;
    }
  };

  return (
    <div className={styles.overlay} onClick={onCancel}>
      {/* Appending styles[type] to apply type-specific backgrounds and color theme */}
      <div className={`${styles.modalCard} ${styles[type]}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          {getIcon()}
          <h2 className={styles.title}>{title || type}</h2>
        </div>
        <div className={styles.body}>
          <p className={styles.message}>{message}</p>
        </div>
        <div className={styles.footer}>
          {type === "confirm" ? (
            <>
              <button className={`${styles.btn} ${styles.cancelBtn}`} onClick={onCancel}>
                Cancel
              </button>
              <button className={`${styles.btn} ${styles.confirmBtn}`} onClick={onConfirm}>
                Yes, Proceed
              </button>
            </>
          ) : (
            <button className={`${styles.btn} ${styles.okBtn}`} onClick={onConfirm || onCancel}>
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
