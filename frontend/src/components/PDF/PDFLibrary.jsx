import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { pdfAPI } from "../../services/pdf";
import PDFUploader from "./PDFUploader";
import DeleteConfirmation from "../Common/DeleteConfirmation"; // Import the popup

const PDFLibrary = () => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [renamingPdf, setRenamingPdf] = useState(null);
  const [newName, setNewName] = useState("");

  // Delete confirmation state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pdfToDelete, setPdfToDelete] = useState(null);

  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
    try {
      setLoading(true);
      const response = await pdfAPI.getAll();
      setPdfs(response.data);
    } catch (error) {
      setError("Failed to fetch PDFs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (newPdf) => {
    setPdfs([newPdf, ...pdfs]);
  };

  const openDeleteModal = (pdf) => {
    setPdfToDelete(pdf);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setPdfToDelete(null);
  };

  const handleDelete = async () => {
    if (!pdfToDelete) return;

    try {
      await pdfAPI.delete(pdfToDelete.uuid);
      setPdfs(pdfs.filter((pdf) => pdf.uuid !== pdfToDelete.uuid));
      setError("");
    } catch (error) {
      setError("Failed to delete PDF", error);
    } finally {
      closeDeleteModal();
    }
  };

  const startRename = (pdf) => {
    setRenamingPdf(pdf);
    setNewName(pdf.originalName);
  };

  const cancelRename = () => {
    setRenamingPdf(null);
    setNewName("");
  };

  const handleRename = async () => {
    if (!newName.trim()) return;

    try {
      const response = await pdfAPI.rename(renamingPdf.uuid, newName.trim());
      setPdfs(
        pdfs.map((pdf) => (pdf.uuid === renamingPdf.uuid ? response.data : pdf))
      );
      cancelRename();
    } catch (error) {
      setError("Failed to rename PDF", error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="body-container">
      <div className="library-header">
        <h1>My PDF Library</h1>
      </div>

      <PDFUploader onUpload={handleUpload} />

      {error && <div className="error">{error}</div>}

      <div className="pdf-grid mt-3">
        {pdfs.map((pdf) => (
          <div key={pdf.uuid} className="pdf-card">
            {renamingPdf && renamingPdf.uuid === pdf.uuid ? (
              <>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{
                    width: "100%",
                    marginBottom: "10px",
                    padding: "5px",
                  }}
                />
                <div className="pdf-actions">
                  <button
                    onClick={handleRename}
                    className="btn btn-primary"
                    style={{ fontSize: "0.8rem", padding: "0.3rem 0.6rem" }}
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelRename}
                    className="btn btn-secondary"
                    style={{ fontSize: "0.8rem", padding: "0.3rem 0.6rem" }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3>{pdf.originalName}</h3>
                <p>Uploaded: {new Date(pdf.uploadDate).toLocaleDateString()}</p>
                <div className="pdf-actions">
                  <Link
                    to={`/pdf/${pdf.uuid}`}
                    className="btn btn-primary"
                    style={{ fontSize: "0.8rem", padding: "0.3rem 0.6rem" }}
                  >
                    View
                  </Link>
                  <button
                    onClick={() => startRename(pdf)}
                    className="btn btn-secondary"
                    style={{ fontSize: "0.8rem", padding: "0.3rem 0.6rem" }}
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => openDeleteModal(pdf)}
                    className="btn btn-danger"
                    style={{ fontSize: "0.8rem", padding: "0.3rem 0.6rem" }}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {pdfs.length === 0 && (
        <div className="text-center mt-3">
          <p>No PDFs uploaded yet. Upload your first PDF to get started!</p>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      <DeleteConfirmation
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete PDF"
        message={`Are you sure you want to delete "${pdfToDelete?.originalName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default PDFLibrary;
