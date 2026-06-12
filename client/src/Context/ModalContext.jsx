import React, { createContext, useContext, useState } from "react";
import CustomModal from "../Components/CustomModal/CustomModal";

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
  });

  const showAlert = ({
    type = "info",
    title = "",
    message = "",
    onConfirm = null,
    onCancel = null,
  }) => {
    setModalConfig({
      isOpen: true,
      type,
      title: title || type.toUpperCase(),
      message,
      onConfirm: () => {
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
        if (onConfirm) onConfirm();
      },
      onCancel: () => {
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
        if (onCancel) onCancel();
      },
    });
  };

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <ModalContext.Provider value={{ showAlert, closeModal }}>
      {children}
      <CustomModal
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onCancel={modalConfig.onCancel}
      />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
