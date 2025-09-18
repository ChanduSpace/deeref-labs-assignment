import { useEffect } from "react";

const DeleteConfirmation = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item?",
  confirmText = "Delete",
  cancelText = "Cancel",
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Close popup if clicked outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="delete-confirmation-backdrop"
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        className="delete-confirmation-modal"
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          maxWidth: "400px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <h3 style={{ margin: "0 0 1rem 0", color: "#2c3e50" }}>{title}</h3>

        <p
          style={{ margin: "0 0 2rem 0", color: "#7f8c8d", lineHeight: "1.5" }}
        >
          {message}
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "0.75rem 1.5rem",
              border: "1px solid #bdc3c7",
              borderRadius: "4px",
              background: "white",
              color: "#7f8c8d",
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.target.style.background = "#f8f9fa";
              e.target.style.borderColor = "#95a5a6";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "white";
              e.target.style.borderColor = "#bdc3c7";
            }}
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            style={{
              padding: "0.75rem 1.5rem",
              border: "none",
              borderRadius: "4px",
              background: "#e74c3c",
              color: "white",
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.target.style.background = "#c0392b";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "#e74c3c";
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
