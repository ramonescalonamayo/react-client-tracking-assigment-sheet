import React, { useState } from "react";
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
  Tab,
  Tabs,
  Box
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

function App() {
  const statusOptions = ["Not Started", "In Progress", "Completed"];
  const [rows, setRows] = useState([
    {
      id: 1,
      dueDate: "2025/11/05",
      name: "Michelle Mullen",
      schoolSite: "San Francisco",
      status: "Not Started",
      assignment: "Annual Review Plan",
      appSigned: "Yes",
      dateSigned: "2025/11/14",
      iepSigned: "Yes",
      iepDateSigned:"2025/11/14"
    },
    {
      id: 2,
      dueDate: "2025/11/10",
      name: "Ramon Escalona Mayo",
      schoolSite: "San Francisco",
      status: "Completed",
      assignment: "Triennial",
      appSigned: "No",
      dateSigned: "2025/11/14",
      iepSigned: "Yes",
      iepDateSigned:"2025/11/14"
    },
    {
      id: 3,
      dueDate: "2025/11/8",
      name: "Esther Escalona Mayo",
      schoolSite: "San Francisco",
      status: "Not Started",
      assignment: "Assesment",
      appSigned: "No",
      dateSigned: "2025/11/14",
      iepSigned: "Yes",
      iepDateSigned:"2025/11/14"
    },
    {
      id: 4,
      dueDate: "2025/11/13",
      name: "Diala Mayo Chacon",
      schoolSite: "San Francisco",
      status: "Not Started",
      assignment: "Assesment",
      appSigned: "No",
      dateSigned: "2025/11/14",
      iepSigned: "Yes",
      iepDateSigned:"2025/11/14"
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [formData, setFormData] = useState({
    dueDate: "",
    name: "",
    schoolSite: "",
    status: "",
    assignment: "",
    appSigned: "",
  });

  const [tabValue, setTabValue] = useState(0);

  const handleOpen = (row = null) => {
    if (row) {
      setEditRow(row.id);
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
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = () => {
    let updatedRows;
    if (editRow) {
      updatedRows = rows.map((r) => (r.id === editRow ? formData : r));
    } else {
      updatedRows = [...rows, { ...formData, id: Date.now() }];
    }
    // Ordenamos las filas por fecha antes de actualizar el estado
    setRows(sortByDate(updatedRows));
    setOpen(false);
  };

  const handleDelete = (id) => {
    const updatedRows = rows.filter((r) => r.id !== id);
    setRows(sortByDate(updatedRows));
  };

  const sortByDate = (data) => {
    return data.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  };

  const handleStatusChange = (id, value) => {
    const updatedRows = rows.map((r) =>
      r.id === id ? { ...r, status: value } : r
    );
    setRows(sortByDate(updatedRows));
  };
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredRows = rows.filter(row => {
    if (tabValue === 0) return row.status !== 'Completed'; // Pendientes o In Progress
    else return row.status === 'Completed'; // Completadas
  });

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>ASSIGMENTS</h1>
       <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="TRACKING ASSIGMENTS" />
        <Tab label="ASSIGMENTS COMPLETED" />
      </Tabs>
      <br></br>
      <Box m="2">
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpen()}
        style={{ marginBottom: "20px" }}
      >
        Add New Assigment
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><h3>Due Date</h3></TableCell>
              <TableCell><h3>Name</h3></TableCell>
              <TableCell><h3>School Site</h3></TableCell>
              <TableCell><h3>Status</h3></TableCell>
              <TableCell><h3>Assignment</h3></TableCell>
              <TableCell><h3>App Signed</h3></TableCell>
              <TableCell><h3>Date Signed</h3></TableCell>
              <TableCell><h3>IEP Signed</h3></TableCell>
              <TableCell><h3>Date Signed</h3></TableCell>
              <TableCell><h3>Edit</h3></TableCell>
              <TableCell><h3>Delete</h3></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.dueDate}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.schoolSite}</TableCell>
                <TableCell>
                  <Select
                    value={row.status}
                    onChange={(e) => handleStatusChange(row.id, e.target.value)}
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
                <TableCell>{row.appSigned}</TableCell>
                <TableCell>{row.dateSigned}</TableCell>
                <TableCell>{row.iepSigned}</TableCell>
                <TableCell>{row.iepDateSigned}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(row)}>
                    <Edit />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDelete(row.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialogo para añadir/editar */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editRow ? "Edit Assigment" : "Add New Assigment"}
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
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="School Site"
            value={formData.schoolSite}
            onChange={(e) =>
              setFormData({ ...formData, schoolSite: e.target.value })
            }
          />
          <TextField
            label="Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          />
          <TextField
            label="Assignment"
            value={formData.assignment}
            onChange={(e) =>
              setFormData({ ...formData, assignment: e.target.value })
            }
          />
          <TextField
            label="App Signed"
            value={formData.appSigned}
            onChange={(e) =>
              setFormData({ ...formData, appSigned: e.target.value })
            }
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
