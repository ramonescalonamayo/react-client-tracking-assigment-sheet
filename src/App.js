import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  Tab,
  Tabs,
  Box,
  FormControl,
  InputLabel, 
} from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Edit, Delete, StarBorder, Star } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "../src/api/assignments";

function App() {
  const statusOptions = ["Not Started", "In Progress", "Completed"];
  const assignmentOptions = ["Assessment", "Triennial", "Annual Review Plan"];
  const [assignments, setAssignments] = useState([]);
  const [open, setOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const [formData, setFormData] = useState({
    dueDate: "",
    name: "",
    schoolSite: "",
    status: "",
    assignment: "",
    appSigned: "",
    dateSigned: "",
    iepSigned: "",
    iepDateSigned: "",
  });

  // 🔹 Cargar asignaciones al iniciar
  useEffect(() => {
    loadAssignments();
  }, []);

  async function loadAssignments() {
    try {
      const data = await getAssignments();
      setAssignments(data);
    } catch (error) {
      console.error("❌ Error al cargar assignments:", error);
    }
  }

  // 🔹 Abrir modal (nuevo o editar)
  const handleOpen = (row = null) => {
    if (row) {
      setEditRow(row);
      console.log(editRow);
      setFormData(row);
    } else {
      setEditRow(null);
      setFormData({
        dueDate: "",
        name: "",
        schoolSite: "",
        status: "",
        assignment: "",
        appSigned: "",
        dateSigned: "",
        iepSigned: "",
        iepDateSigned: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // 🔹 Crear o editar assignment
  const handleSave = async () => {
    try {
      if (editRow) {
        const updated = await updateAssignment(editRow._id, formData);
        setAssignments((prev) =>
          prev.map((a) => (a._id === editRow._id ? updated : a))
        );
        console.log("✏️ Assignment actualizado:", updated);
      } else {
        // Crear
        const newAssignment = await createAssignment(formData);
        setAssignments((prev) => [...prev, newAssignment]);
        console.log("✅ Assignment creado:", newAssignment);
      }

      // Cerrar modal y limpiar
      handleClose();
      setEditRow(null);
      setFormData({
        dueDate: "",
        name: "",
        schoolSite: "",
        status: "",
        assignment: "",
        appSigned: "",
        dateSigned: "",
        iepSigned: "",
        iepDateSigned: "",
      });
    } catch (error) {
      console.error("❌ Error al guardar:", error);
    }
  };

  // 🔹 Eliminar
  const handleDelete = async (id) => {
    try {
      await deleteAssignment(id);
      setAssignments((prev) => prev.filter((a) => a._id !== id));
      console.log(`🗑️ Assignment ID ${id} eliminado`);
    } catch (error) {
      console.error("❌ Error al eliminar:", error);
    }
  };

  // 🔹 Actualizar status automáticamente en el servidor
  const handleStatusChange = async (id, value) => {
    try {
      const updated = await updateAssignment(id, { status: value });
      setAssignments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: value } : a))
      );
      console.log(`✅ Status de ID ${id} actualizado a: ${value}`);
    } catch (error) {
      console.error("❌ Error al actualizar el status:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredRows = assignments.filter((row) =>
    tabValue === 0 ? row.status !== "Completed" : row.status === "Completed"
  );

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(assignments);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Assignments");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, "assignments.xlsx");
  };

  const togglePriority = (id) => {
    setAssignments((prev) =>
      prev.map((a) => (a._id === id ? { ...a, priority: !a.priority } : a))
    );
  };
  const handleCheckboxChange = (id, field) => {
    setAssignments((prev) =>
      prev.map((a) => (a._id === id ? { ...a, [field]: !a[field] } : a))
    );
  };
  const toInputDate = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toISOString("en-US").split("T")[0];
  };

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>ASSIGNMENTS</h1>

      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="TRACKING ASSIGNMENTS" />
        <Tab label="ASSIGNMENTS COMPLETED" />
      </Tabs>

      <br />
      <Box m={2}>
        <Box mb={2} display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpen()}
            startIcon={<AddIcon />}
          >
            Add New Assignment
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={exportToExcel}
            startIcon={<FileDownloadIcon />}
          >
            Export to Excel
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <h3>Priority</h3>
                </TableCell>
                <TableCell>
                  <h3>Due Date</h3>
                </TableCell>
                <TableCell>
                  <h3>Name</h3>
                </TableCell>
                <TableCell>
                  <h3>School Site</h3>
                </TableCell>
                <TableCell>
                  <h3>Status</h3>
                </TableCell>
                <TableCell>
                  <h3>Assignment</h3>
                </TableCell>
                <TableCell>
                  <h3>App Signed</h3>
                </TableCell>
                <TableCell>
                  <h3>Date Signed</h3>
                </TableCell>
                <TableCell>
                  <h3>IEP Signed</h3>
                </TableCell>
                <TableCell>
                  <h3>IEP Date Signed</h3>
                </TableCell>
                <TableCell>
                  <h3>Edit</h3>
                </TableCell>
                <TableCell>
                  <h3>Delete</h3>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRows.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{
                    backgroundColor: row.priority
                      ? "rgba(150, 255, 173, 0.6)"
                      : "inherit",
                    "&:hover": {
                      backgroundColor: row.priority
                        ? "rgba(255, 230, 150, 0.8)"
                        : "rgba(0,0,0,0.04)",
                    },
                  }}
                >
                  <TableCell>
                    <IconButton onClick={() => togglePriority(row._id)}>
                      {row.priority ? <Star color="warning" /> : <StarBorder />}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    {new Date(row.dueDate).toLocaleDateString("en-US")}
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.schoolSite}</TableCell>
                  <TableCell>
                    <Select
                      value={row.status}
                      onChange={(e) =>
                        handleStatusChange(row._id, e.target.value)
                      }
                      size="small"
                    >
                      {statusOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>{row.assignment}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={row.appSigned}
                      onChange={() =>
                        handleCheckboxChange(row._id, "appSigned")
                      }
                      color="success"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(row.dateSigned).toLocaleDateString("en-US")}
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={row.iepSigned}
                      onChange={() =>
                        handleCheckboxChange(row._id, "iepSigned")
                      }
                      color="success"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(row.iepDateSigned).toLocaleDateString("en-US")}
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpen(row)}>
                      <Edit />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDelete(row._id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 🔹 Modal Crear / Editar */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {editRow ? "Edit Assignment" : "Add New Assignment"}
          </DialogTitle>
          <DialogContent
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              marginTop: "10px",
            }}
          >
            <TextField
              label="Due Date"
              type="date"
              value={toInputDate(formData.dueDate)}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: new Date().toISOString().split("T")[0] }}
            />
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <TextField
              label="School Site"
              value={formData.schoolSite}
              onChange={(e) =>
                setFormData({ ...formData, schoolSite: e.target.value })
              }
            />
            <FormControl fullWidth size="small" variant="outlined">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                size="small"
                label="Status"
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small" variant="outlined">
              <InputLabel id="assignment-label">Assignment</InputLabel>
              <Select
                labelId="assignment-label"
                value={formData.assignment}
                onChange={(e) =>
                  setFormData({ ...formData, assignment: e.target.value })
                }
                size="small"
                label="Assignment"
              >
                {assignmentOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="App Signed"
              value={formData.appSigned}
              onChange={(e) =>
                setFormData({ ...formData, appSigned: e.target.value })
              }
            />
            <TextField
              label="Date Signed"
              type="date"
              value={toInputDate(formData.dateSigned)}
              onChange={(e) =>
                setFormData({ ...formData, dateSigned: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="IEP Signed"
              value={formData.iepSigned}
              onChange={(e) =>
                setFormData({ ...formData, iepSigned: e.target.value })
              }
            />
            <TextField
              label="IEP Date Signed"
              type="date"
              value={toInputDate(formData.iepDateSigned)}
              onChange={(e) =>
                setFormData({ ...formData, iepDateSigned: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
}

export default App;
