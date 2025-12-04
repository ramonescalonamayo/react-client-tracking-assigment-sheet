import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { Snackbar, Alert, Typography } from "@mui/material";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const verificationSent = location?.state?.verificationSent || null;
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (verificationSent) setOpenSnackbar(true);
  }, [verificationSent]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (e) {
      setError("Invalid credentials");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: "350px",
          padding: "40px",
          borderRadius: "20px",
          background: "white",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "25px", fontSize: "24px" }}>LOGIN</h2>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />

        {/* Snackbar handled below */}

        {error && (
          <p style={{ color: "red", marginBottom: "10px", fontSize: "14px" }}>
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#1976d2",
            color: "white",
            fontSize: "18px",
            cursor: "pointer",
            transition: "0.2s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0f4ea3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#1976d2")}
        >
          Login
        </button>
        <div style={{ marginTop: 14 }}>
          <p style={{ margin: 0, fontSize: 14 }}>Don't have an account?</p>
          <button
            type="button"
            onClick={() => navigate("/register")}
            style={{
              marginTop: 8,
              background: "none",
              border: "none",
              color: "#1976d2",
              cursor: "pointer",
              padding: 0,
              fontSize: 16,
              textDecoration: "underline",
            }}
          >
            Sign up
          </button>
        </div>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={8000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          <Typography variant="subtitle1" sx={{ fontSize: 24 }}>
            Verification email sent to {verificationSent}. Please check your inbox and verify before logging in.
          </Typography>
        </Alert>
      </Snackbar>
    </div>
  );
}
