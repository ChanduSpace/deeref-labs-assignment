import { useState } from "react";

const HighlightPopup = ({ position, text, onSave, onCancel }) => {
  const [comment, setComment] = useState("");

  const handleSave = () => {
    onSave(comment);
    setComment("");
  };

  return (
    <div
      className="highlight-popup"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div style={{ marginBottom: "0.5rem" }}>
        <strong>Selected text:</strong>
        <p style={{ fontSize: "0.9rem", margin: "0.3rem 0" }}>"{text}"</p>
      </div>
      <textarea
        placeholder="Add a comment (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />
      <div className="highlight-popup-actions">
        <button
          onClick={onCancel}
          className="btn btn-secondary"
          style={{ fontSize: "0.8rem", padding: "0.3rem 0.6rem" }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="btn btn-primary"
          style={{ fontSize: "0.8rem", padding: "0.3rem 0.6rem" }}
        >
          Save Highlight
        </button>
      </div>
    </div>
  );
};

export default HighlightPopup;
