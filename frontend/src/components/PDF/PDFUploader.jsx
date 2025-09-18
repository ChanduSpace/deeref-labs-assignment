import { useState } from "react";
import { pdfAPI } from "../../services/pdf";

const PDFUploader = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please select a PDF file");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("pdf", file);

      const response = await pdfAPI.upload(formData);
      onUpload(response.data);
      setFile(null);
      document.getElementById("file-input").value = "";
    } catch (error) {
      setError(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h3>Upload PDF</h3>
      {error && <div className="error">{error}</div>}
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <input
          id="file-input"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className="btn btn-primary"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
      {file && <p style={{ marginTop: "10px" }}>Selected: {file.name}</p>}
    </div>
  );
};

export default PDFUploader;
