import { Button, Tabs, Tab, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

function AssignmentsHeader({
  tabValue,
  handleTabChange,
  handleOpen,
  exportToExcel,
  handleLogout,
  handleResetPassword,
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
          marginRight: "10px",
        }}
      >
        Logout
      </button>

      <button
        onClick={handleResetPassword}
        style={{
          position: "absolute",
          top: "20px",
          right: "140px",
          padding: "10px 20px",
          backgroundColor: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Reset Password
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