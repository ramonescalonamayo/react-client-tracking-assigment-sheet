const API_URL = "https://tu-backend.onrender.com/api/assignments";

export async function getAssignments() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener los assignments");
  return res.json();
}

export async function createAssignment(data) {
  console.log(data)  
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear el assignment");
  return res.json();
}

export async function updateAssignment(id, data) {
  const { _id, ...noIDData } = data;
  console.log(noIDData)
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(noIDData),
  });
  if (!res.ok) throw new Error("Error al actualizar el assignment");
  return res.json();
}

export async function deleteAssignment(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar el assignment");
  return res.json();
}
