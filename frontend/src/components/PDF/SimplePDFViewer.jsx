// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { pdfAPI, highlightsAPI } from "../../services/pdf";

// const SimplePDFViewer = () => {
//   const { uuid } = useParams();
//   const navigate = useNavigate();

//   const [pdf, setPdf] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchPDF();
//   }, [uuid]);

//   const fetchPDF = async () => {
//     try {
//       const response = await pdfAPI.getOne(uuid);
//       setPdf(response.data);
//       setError("");
//     } catch (error) {
//       setError("Failed to load PDF");
//       console.error("PDF loading error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div className="text-center">Loading PDF...</div>;
//   }

//   if (error) {
//     return (
//       <div>
//         <div className="error">{error}</div>
//         <button
//           onClick={() => navigate("/")}
//           className="btn btn-secondary mt-2"
//         >
//           Back to Library
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="viewer-header">
//         <h2>{pdf?.originalName}</h2>
//         <button onClick={() => navigate("/")} className="btn btn-secondary">
//           Back to Library
//         </button>
//       </div>

//       <div className="pdf-container">
//         <iframe
//           src={`http://localhost:5000/uploads/${pdf?.filename}`}
//           width="100%"
//           height="600px"
//           style={{ border: "1px solid #ddd", borderRadius: "8px" }}
//           title={pdf?.originalName}
//         >
//           <p>
//             Your browser does not support iframes.
//             <a
//               href={`http://localhost:5000/uploads/${pdf?.filename}`}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               Download the PDF
//             </a>
//           </p>
//         </iframe>
//       </div>

//       <div className="mt-3">
//         <h3>Note: Basic PDF Viewer</h3>
//         <p>
//           This is a basic PDF viewer using browser's built-in PDF support. For
//           text highlighting features, we need to fix the react-pdf
//           configuration.
//         </p>
//         <a
//           href={`http://localhost:5000/uploads/${pdf?.filename}`}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="btn btn-primary"
//         >
//           Open PDF in New Tab
//         </a>
//       </div>
//     </div>
//   );
// };

// export default SimplePDFViewer;
