import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { pdfAPI, highlightsAPI } from "../../services/pdf";
import HighlightPopup from "./HighlightPopup";
import { API_URL } from "../../utils/constants";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

const PDFViewer = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentSelection, setCurrentSelection] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    fetchPDF();
    fetchHighlights();
  }, [uuid]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchPDF = async () => {
    try {
      const response = await pdfAPI.getOne(uuid);
      setPdf(response.data);
      setError("");
    } catch (error) {
      setError("Failed to load PDF metadata");
      console.error("PDF metadata error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHighlights = async () => {
    try {
      const response = await highlightsAPI.getForPDF(uuid);
      setHighlights(response.data);
    } catch (error) {
      console.error("Failed to load highlights:", error);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection.toString().trim() !== "") {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const pageElement = range.startContainer.closest(".react-pdf__Page");
      if (!pageElement) return;
      const pageIndex =
        parseInt(pageElement.getAttribute("data-page-number"), 10) - 1;
      const pageRect = pageElement.getBoundingClientRect();
      const relativeRect = {
        x: (rect.left - pageRect.left) / scale,
        y: (rect.top - pageRect.top) / scale,
        width: rect.width / scale,
        height: rect.height / scale,
        page: pageIndex + 1,
      };
      setCurrentSelection({
        text: selection.toString(),
        position: relativeRect,
        page: pageIndex + 1,
      });
      setPopupPosition({
        x: rect.right,
        y: rect.top,
      });
      setShowPopup(true);
      selection.removeAllRanges();
    }
  }, [scale]);

  const handleAddHighlight = async (comment = "") => {
    if (!currentSelection) return;
    try {
      const highlightData = {
        pdfUuid: uuid,
        text: currentSelection.text,
        page: currentSelection.page,
        position: {
          boundingRect: {
            x1: currentSelection.position.x,
            y1: currentSelection.position.y,
            x2: currentSelection.position.x + currentSelection.position.width,
            y2: currentSelection.position.y + currentSelection.position.height,
            width: currentSelection.position.width,
            height: currentSelection.position.height,
          },
          rects: [
            {
              x1: currentSelection.position.x,
              y1: currentSelection.position.y,
              x2: currentSelection.position.x + currentSelection.position.width,
              y2:
                currentSelection.position.y + currentSelection.position.height,
              width: currentSelection.position.width,
              height: currentSelection.position.height,
            },
          ],
          pageNumber: currentSelection.page,
        },
        comment,
      };
      await highlightsAPI.create(highlightData);
      await fetchHighlights();
      setShowPopup(false);
      setCurrentSelection(null);
    } catch (error) {
      console.error("Failed to create highlight:", error);
      setError("Failed to save highlight");
    }
  };

  const goToPreviousPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  if (loading) return <div className="text-center">Loading PDF...</div>;
  if (error)
    return (
      <div>
        <div className="error">{error}</div>
        <button
          onClick={() => navigate("/")}
          className="btn btn-secondary mt-2"
        >
          Back to Library
        </button>
      </div>
    );

  return (
    <div className="viewer-container">
      <div className="viewer-header">
        <h2>{pdf?.originalName}</h2>
        {/* <button onClick={() => navigate("/")} className="btn btn-secondary">
          Back to Library
        </button> */}
      </div>

      <div className="viewer-controls">
        <button onClick={goToPreviousPage} disabled={pageNumber <= 1}>
          {isMobile ? "◀" : "Previous"}
        </button>
        <span>
          Page {pageNumber} of {numPages}
        </span>
        <button onClick={goToNextPage} disabled={pageNumber >= numPages}>
          {isMobile ? "▶" : "Next"}
        </button>
        {!isMobile && (
          <>
            <button onClick={zoomOut}>Zoom Out</button>
            <span>Scale: {scale.toFixed(1)}x</span>
            <button onClick={zoomIn}>Zoom In</button>
          </>
        )}
      </div>
      {isMobile && (
        <div className="mobile-zoom-controls">
          <button onClick={zoomOut}>-</button>
          <span>Zoom</span>
          <button onClick={zoomIn}>+</button>
        </div>
      )}

      <div className="pdf-container" style={{ position: "relative" }}>
        <div onMouseUp={handleTextSelection}>
          <Document
            file={`${API_URL}/uploads/${pdf?.filename}`}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div>Loading PDF...</div>}
            error={<div className="error">Failed to load PDF file.</div>}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderMode="canvas"
              loading={<div>Loading page...</div>}
              className="pdf-page"
            />
          </Document>
        </div>

        {highlights
          .filter((highlight) => highlight.page === pageNumber)
          .map((highlight) => (
            <div
              key={highlight._id}
              className="highlight"
              style={{
                position: "absolute",
                left: highlight.position.boundingRect.x1 * scale,
                top: highlight.position.boundingRect.y1 * scale,
                width: highlight.position.boundingRect.width * scale,
                height: highlight.position.boundingRect.height * scale,
                background: "yellow",
                opacity: 0.4,
                pointerEvents: "none",
              }}
              title={highlight.comment || "No comment"}
            />
          ))}
      </div>

      {showPopup && (
        <HighlightPopup
          position={popupPosition}
          text={currentSelection.text}
          onSave={handleAddHighlight}
          onCancel={() => {
            setShowPopup(false);
            setCurrentSelection(null);
          }}
        />
      )}

      <div className="mt-3 text-center">
        <p>If the PDF viewer doesn't work, you can:</p>
        <a
          href={`${API_URL}/uploads/${pdf?.filename}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          Open PDF in New Tab
        </a>
      </div>
    </div>
  );
};

export default PDFViewer;
