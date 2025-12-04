import { auth } from "../firebase";

const API_URL = "https://backend-tracking-sheet-1-kcgn.onrender.com/api/assignments";

async function getAuthHeaders() {
  const headers = { "Content-Type": "application/json" };
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn("Could not get auth token:", err);
  }
  return headers;
}

/**
 * Get assignments for current logged user.
 * If `userId` is provided it will be added as a query param.
 */
export async function getAssignments(userId) {
  const url = userId ? `${API_URL}?userId=${encodeURIComponent(userId)}` : API_URL;
  const headers = await getAuthHeaders();
  console.log("HEADERSSSS",headers)
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error("Error fetching assignments");
  return res.json();
}

export async function createAssignment(data) {
  // expects backend to validate the Authorization header and createdBy field server-side
  const headers = await getAuthHeaders();
  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error creating assignment");
  return res.json();
}

export async function updateAssignment(id, data) {
  const { _id, ...noIDData } = data;
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(noIDData),
  });
  if (!res.ok) throw new Error("Error updating assignment");
  return res.json();
}

export async function deleteAssignment(id) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE", headers });
  if (!res.ok) throw new Error("Error deleting assignment");
  return res.json();
}
