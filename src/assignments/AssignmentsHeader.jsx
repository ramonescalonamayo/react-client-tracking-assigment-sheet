// src/components/assignments/AssignmentsHeader.jsx

import { Button, Tabs, Tab, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

function AssignmentsHeader({
  tabValue,
  handleTabChange,
  handleOpen,
  exportToExcel,
  handleLogout,
}) {
  return (
    <>
      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="UPCOMING ASSIGNMENTS" />
        <Tab label="ASSIGNMENTS COMPLETED" />
      </Tabs>

      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "#d32f2f",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Logout
      </button>

      <Box mb={2} display="flex" justifyContent="center" gap={2} mt={2}>
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
    </>
  );
}

export default AssignmentsHeader;