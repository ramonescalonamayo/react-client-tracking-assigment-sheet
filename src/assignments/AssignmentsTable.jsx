import { useState, useEffect } from "react";
import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "../api/assignments";

import AssignmentsHeader from "./AssignmentsHeader";
import AssignmentDialog from "./AssignmentDialog";
import AssignmentsList from "./AssignmentsList";

import {
  Box,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

function AssignmentsTable() {
  const statusOptions = ["Not Started", "In Progress", "Completed"];
  const assignmentOptions = ["30-day", "Triennial", "Annual Review Plan"];

  const [assignments, setAssignments] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Cargar datos y re-cargar cuando cambie el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      loadAssignments();
    });

    // initial load
    loadAssignments();

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setFilteredRows(
      assignments.filter((row) =>
        tabValue === 0 ? row.status !== "Completed" : row.status === "Completed"
      )
    );
  }, [assignments, tabValue]);

  async function loadAssignments() {
    try {
      const data = await getAssignments();
      data.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      // If a user is logged in, only show assignments created by that user
      const user = auth.currentUser;
      if (user) {
        const own = data.filter(
          (d) =>
            d.createdBy === user.uid ||
            d.userId === user.uid ||
            d.owner === user.uid
        );
        setAssignments(own);
      } else {
        // no user -> empty list
        setAssignments([]);
      }
    } catch (error) {
      console.error("❌ Error loading assignments:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const handleOpen = (row = null) => {
    setEditRow(row);
    setFormData(
      row || {
        dueDate: "",
        name: "",
        schoolSite: "",
        status: "",
        assignment: "",
        appSigned: "",
        dateSigned: "",
        iepSigned: "",
        iepDateSigned: "",
      }
    );
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    const user = auth.currentUser;
    try {
      if (editRow) {
        if (!validateForm()) return;
        const updated = await updateAssignment(editRow._id, {
          ...formData,
          createdBy: user ? user.uid : "",
        });
        setAssignments((prev) =>
          prev.map((a) => (a._id === editRow._id ? updated : a))
        );
        console.log("Updated assignment:", updated);
      } else {
        if (!validateForm()) return;
        // Attach current user's UID so assignments are per-user

        const payload = { ...formData, createdBy: user ? user.uid : undefined };
        console.log("Creating assignment with payload:", payload);
        const newAssignment = await createAssignment(payload);
        setAssignments((prev) => [...prev, newAssignment]);
      }

      handleClose();
      setEditRow(null);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleDelete = async (id) => {
    setConfirmDeleteId(id);
    setConfirmOpen(true);
  };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const cancelDelete = () => {
    setConfirmOpen(false);
    setConfirmDeleteId(null);
  };

  const performDelete = async () => {
    const id = confirmDeleteId;
    try {
      await deleteAssignment(id);
      setAssignments((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      cancelDelete();
    }
  };

  const handleStatusChange = async (id, value) => {
    try {
      await updateAssignment(id, { status: value });
      setAssignments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: value } : a))
      );
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  const togglePriority = (id) => {
    setAssignments((prev) =>
      prev.map((a) => (a._id === id ? { ...a, priority: !a.priority } : a))
    );
  };

  const handleCheckboxChange = async (id, field) => {
    try {
      let newValue;
      console.log("Toggling checkbox for", id, field);
      setAssignments((prev) =>
        prev.map((a) => {
          if (a._id !== id) return a;
          newValue = !Boolean(a[field]);
          return { ...a, [field]: newValue };
        })
      );

      // persist change to backend
      await updateAssignment(id, { [field]: newValue });
    } catch (error) {
      console.error("Checkbox update error:", error);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(assignments);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Assignments");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      }),
      "assignments.xlsx"
    );
  };

  const handleTabChange = (e, v) => setTabValue(v);

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};

    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    if (!formData.name.trim()) newErrors.name = "Name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>ASSIGNMENTS</h1>

      <AssignmentsHeader
        tabValue={tabValue}
        handleTabChange={handleTabChange}
        handleOpen={handleOpen}
        exportToExcel={exportToExcel}
        handleLogout={handleLogout}
      />

      <Box mt={2}>
        {loading ? (
          <>
            <Skeleton variant="rectangular" height={100} />
            <Skeleton variant="rectangular" height={100} />
            <Skeleton variant="rectangular" height={100} />
            <Skeleton variant="rectangular" height={100} />
          </>
        ) : (
          <AssignmentsList
            rows={filteredRows}
            statusOptions={statusOptions}
            handleStatusChange={handleStatusChange}
            togglePriority={togglePriority}
            handleCheckboxChange={handleCheckboxChange}
            handleOpen={handleOpen}
            handleDelete={handleDelete}
          />
        )}
        <AssignmentDialog
          open={open}
          handleClose={handleClose}
          editRow={editRow}
          formData={formData}
          setFormData={setFormData}
          statusOptions={statusOptions}
          assignmentOptions={assignmentOptions}
          handleSave={handleSave}
          errors={errors}
          setErrors={setErrors}
        />
        <Dialog open={confirmOpen} onClose={cancelDelete}>
          <DialogTitle>Confirm delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this assignment? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelDelete}>Cancel</Button>
            <Button color="error" onClick={performDelete} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
}

export default AssignmentsTable;
