import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, login, loadUserFromToken } = useAuth();
  const navigate = useNavigate();

  // This useEffect will redirect when user becomes available
  useEffect(() => {
    if (user) {
      console.log("User detected, redirecting to home...");
      navigate("/", { replace: true }); // Replace the history entry
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return setError("Please fill in all fields");
    }

    try {
      setError("");
      setLoading(true);

      const result = await login(email, password);

      if (result.success) {
        console.log("Login successful, reloading user...");
        await loadUserFromToken();
        // The navigation will be handled by the useEffect above
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Failed to login", error);
    } finally {
      setLoading(false);
    }
  };

  // If user exists, don't render the login form
  if (user) {
    return (
      <div className="auth-container">
        <div className="text-center">
          <p>You are already logged in. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2 className="text-center">Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="text-center mt-2">
        Don't have an account? <Link to="/register">Register here</Link>
      </div>
    </div>
  );
};

export default Login;
