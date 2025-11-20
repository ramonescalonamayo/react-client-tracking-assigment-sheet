import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { toInputDate } from "./utils";
import { useEffect } from "react";


function AssignmentDialog({
  open,
  handleClose,
  editRow,
  formData,
  setFormData,
  statusOptions,
  assignmentOptions,
  handleSave,
  errors,
  setErrors,
}) {
  useEffect(() => {
    if (open) {
      setErrors({});
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {editRow ? "Edit Assignment" : "Add New Assignment"}
      </DialogTitle>

      <DialogContent
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          paddingTop: "10px",
        }}
      >
        <TextField
          label="Due Date"
          type="date"
          error={!!errors.dueDate}
          helperText={errors.dueDate}
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
          error={!!errors.name} 
          helperText={errors.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <TextField
          label="School Site"
          value={formData.schoolSite}
          onChange={(e) =>
            setFormData({ ...formData, schoolSite: e.target.value })
          }
        />

        {/* STATUS */}
        <FormControl fullWidth size="small" variant="outlined">
          <InputLabel>Status</InputLabel>
          <Select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            label="Status"
          >
            {statusOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* ASSIGNMENT */}
        <FormControl fullWidth size="small" variant="outlined">
          <InputLabel>Assignment</InputLabel>
          <Select
            value={formData.assignment}
            onChange={(e) =>
              setFormData({ ...formData, assignment: e.target.value })
            }
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
          label="AP Signed"
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
          label="IEP Affirmed"
          value={formData.iepSigned}
          onChange={(e) =>
            setFormData({ ...formData, iepSigned: e.target.value })
          }
        />

        <TextField
          label="Date Affirmed"
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
  );
}

export default AssignmentDialog;
