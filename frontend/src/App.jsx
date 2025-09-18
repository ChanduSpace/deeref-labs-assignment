import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import Navbar from "./components/Common/Navbar";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import PDFLibrary from "./components/PDF/PDFLibrary";
import PDFViewer from "./components/PDF/PDFViewer";
// import PDFViewer from "./components/PDF/SimplePDFViewer";

import "./App.css";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <PDFLibrary />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pdf/:uuid"
                element={
                  <ProtectedRoute>
                    <PDFViewer />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
