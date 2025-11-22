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
  FormControlLabel,
  Checkbox,
  Grid,
} from "@mui/material";
import { toInputDate } from "./utils";
import { useEffect } from "react";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

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
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {editRow ? "Edit Assignment" : "Add New Assignment"}
      </DialogTitle>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DialogContent>
          <Grid container spacing={2}  sx={{paddingTop:"20px"}}>
            {/* DUE DATE + NAME */}
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Due Date"
                value={formData.dueDate ? dayjs(formData.dueDate) : null}
                onChange={(newValue) =>
                  setFormData({
                    ...formData,
                    dueDate: newValue ? newValue.toISOString() : "",
                  })
                }
                minDate={dayjs()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.dueDate,
                    helperText: errors.dueDate,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>

            {/* SCHOOL SITE + STATUS */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="School Site"
                value={formData.schoolSite}
                onChange={(e) =>
                  setFormData({ ...formData, schoolSite: e.target.value })
                }
                error={!!errors.schoolSite}
                helperText={errors.schoolSite}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel>Status</InputLabel>
                <Select
                  sx={{width:"246px"}}
                  value={formData.status}
                  label="Status"
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* ASSIGNMENT */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.assignment}>
                <InputLabel>Assignment</InputLabel>
                <Select
                  sx={{width:"246px"}}
                  value={formData.assignment}
                  label="Assignment"
                  onChange={(e) =>
                    setFormData({ ...formData, assignment: e.target.value })
                  }
                >
                  {assignmentOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* AP SIGNED + DATE */}
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="success"
                    disabled={formData.assignment !== "Triennial" }
                    checked={!!formData.apSigned}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        apSigned: e.target.checked,
                      })
                    }
                  />
                }
                label="AP Signed"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="AP Date Signed"
                value={
                  formData.apDateSigned ? dayjs(formData.apDateSigned) : null
                }
                onChange={(newValue) =>
                  setFormData({
                    ...formData,
                    apDateSigned: newValue ? newValue.toISOString() : "",
                  })
                }
                disabled={!formData.apSigned}
                minDate={dayjs()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.apDateSigned,
                    helperText: errors.apDateSigned,
                  },
                }}
              />
            </Grid>

            {/* IEP AFFIRMED + DATE */}
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="success"
                    checked={!!formData.iepSigned}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        iepSigned: e.target.checked,
                      })
                    }
                  />
                }
                label="IEP Affirmed"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="IEP Date Affirmed"
                value={
                  formData.iepDateSigned ? dayjs(formData.iepDateSigned) : null
                }
                onChange={(newValue) =>
                  setFormData({
                    ...formData,
                    iepDateSigned: newValue ? newValue.toISOString() : "",
                  })
                }
                disabled={!formData.iepSigned}
                minDate={dayjs()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.iepDateSigned,
                    helperText: errors.iepDateSigned,
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </LocalizationProvider>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AssignmentDialog;
