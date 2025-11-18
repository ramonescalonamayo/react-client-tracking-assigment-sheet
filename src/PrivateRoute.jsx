import { Navigate } from "react-router-dom";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function PrivateRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) return <h2>Loading...</h2>;

  // si no hay usuario → enviar al login
  if (!user) return <Navigate to="/login" replace />;

  return children;
}