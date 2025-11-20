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

import { Box } from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function AssignmentsTable() {
  const statusOptions = ["Not Started", "In Progress", "Completed"];
  const assignmentOptions = ["30-day", "Triennial", "Annual Review Plan"];

  const [assignments, setAssignments] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);

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

  // Cargar datos
  useEffect(() => {
    loadAssignments();
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
      setAssignments(data);
    } catch (error) {
      console.error("❌ Error loading assignments:", error);
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
    try {
      if (editRow) {
        if (!validateForm()) return;
        const updated = await updateAssignment(editRow._id, formData);
        setAssignments((prev) =>
          prev.map((a) => (a._id === editRow._id ? updated : a))
        );
      } else {
        if (!validateForm()) return;
        const newAssignment = await createAssignment(formData);
        setAssignments((prev) => [...prev, newAssignment]);
      }

      handleClose();
      setEditRow(null);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAssignment(id);
      setAssignments((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
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

  const handleCheckboxChange = (id, field) => {
    setAssignments((prev) =>
      prev.map((a) => (a._id === id ? { ...a, [field]: !a[field] } : a))
    );
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
        <AssignmentsList
          rows={filteredRows}
          statusOptions={statusOptions}
          handleStatusChange={handleStatusChange}
          togglePriority={togglePriority}
          handleCheckboxChange={handleCheckboxChange}
          handleOpen={handleOpen}
          handleDelete={handleDelete}
        />

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
      </Box>
    </div>
  );
}

export default AssignmentsTable;
