import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  LinearProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRe.test(email)) errors.email = "Invalid email";
    if (password.length < 6)
      errors.password = "Password must be at least 6 characters";
    if (confirmPassword !== password)
      errors.confirmPassword = "Passwords do not match";
    return errors;
  };

  const passwordStrength = (pw) => {
    if (!pw) return { score: 0, label: "", color: "#e0e0e0" };
    let score = 0;
    // length
    if (pw.length >= 8) score += 30;
    else if (pw.length >= 6) score += 15;
    // variety
    if (/[a-z]/.test(pw)) score += 15;
    if (/[A-Z]/.test(pw)) score += 20;
    if (/[0-9]/.test(pw)) score += 20;
    if (/[^A-Za-z0-9]/.test(pw)) score += 20;
    if (score > 100) score = 100;

    let label = "Weak";
    let color = "#d32f2f"; // red
    if (score >= 80) {
      label = "Strong";
      color = "#2e7d32"; // green
    } else if (score >= 50) {
      label = "Good";
      color = "#ed6c02"; // orange
    } else {
      label = "Weak";
      color = "#d32f2f";
    }

    return { score, label, color };
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitted(true);
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setError(Object.values(errs).join(" — "));
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send verification email and sign the user out so they verify before logging in
      try {
        await sendEmailVerification(user);
      } catch (sendErr) {
        console.warn("Failed to send verification email:", sendErr);
      }

      // Sign out immediately to require verification before using the app
      try {
        await signOut(auth);
      } catch (sErr) {
        console.warn("Failed to sign out after registration:", sErr);
      }

      // Redirect to login and indicate a verification email was sent
      navigate("/login", { state: { verificationSent: email } });
    } catch (err) {
      // Firebase returns codes like 'auth/email-already-in-use'
      setError(err.message || "Error creating account");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset errors/touched when component mounts
    setError("");
    setTouched({});
    setSubmitted(false);
  }, []);

  const fieldErrors = validate();

  return (
    <Box sx={{ maxWidth: 420, mx: "auto", mt: 6, px: 2 }}>
      <Paper
        component="form"
        onSubmit={handleRegister}
        elevation={3}
        sx={{
          p: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Create account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 1 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((p) => ({ ...p, email: true }))}
          fullWidth
          margin="normal"
          required
          error={(submitted || touched.email) && !!fieldErrors.email}
          helperText={(submitted || touched.email) ? fieldErrors.email : ""}
          autoComplete="email"
          variant="outlined"
        />

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setTouched((p) => ({ ...p, password: true }))}
          fullWidth
          margin="normal"
          required
          error={(submitted || touched.password) && !!fieldErrors.password}
          helperText={(submitted || touched.password) ? fieldErrors.password : ""}
          autoComplete="new-password"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Password strength meter */}
        {password ? (
          (() => {
            const s = passwordStrength(password);
            return (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                <Box sx={{ flex: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={s.score}
                    sx={{
                      height: 8,
                      borderRadius: 2,
                      [`& .MuiLinearProgress-bar`]: {
                        backgroundColor: s.color,
                      },
                      backgroundColor: "#f5f5f5",
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ minWidth: 56 }}>
                  {s.label}
                </Typography>
              </Box>
            );
          })()
        ) : null}

        <TextField
          label="Confirm password"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => setTouched((p) => ({ ...p, confirmPassword: true }))}
          fullWidth
          margin="normal"
          required
          error={(submitted || touched.confirmPassword) && !!fieldErrors.confirmPassword}
          helperText={(submitted || touched.confirmPassword) ? fieldErrors.confirmPassword : ""}
          autoComplete="new-password"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={20} color="inherit" /> : "Sign up"}
          </Button>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2">Already have an account?</Typography>
            <Button
              type="button"
              onClick={() => navigate("/login")}
              sx={{ p: 0 }}
              variant="text"
            >
              Log in
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default Register;
