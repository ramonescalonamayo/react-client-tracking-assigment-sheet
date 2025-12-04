import {
  TableRow,
  TableCell,
  IconButton,
  Select,
  MenuItem,
  Checkbox,
} from "@mui/material";
import { Edit, Delete, StarBorder, Star } from "@mui/icons-material";

function AssignmentRow({
  row,
  statusOptions,
  handleStatusChange,
  togglePriority,
  handleCheckboxChange,
  handleOpen,
  handleDelete,
}) {
  return (
    <TableRow
      key={row._id}
      sx={{
        backgroundColor: row.priority ? "rgba(150,255,173,0.6)" : "inherit",
        "&:hover": {
          backgroundColor: row.priority
            ? "rgba(255,230,150,0.8)"
            : "rgba(0,0,0,0.04)",
        },
      }}
    >
      <TableCell>
        <IconButton onClick={() => togglePriority(row._id)}>
          {row.priority ? <Star color="warning" /> : <StarBorder />}
        </IconButton>
      </TableCell>

      <TableCell>{new Date(row.dueDate).toLocaleDateString("en-US")}</TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.schoolSite}</TableCell>

      <TableCell>
        <Select
          value={row.status}
          onChange={(e) => handleStatusChange(row._id, e.target.value)}
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
          checked={Boolean(row.appSigned)}
          onChange={() => handleCheckboxChange(row._id, "appSigned")}
          color="success"
        />
      </TableCell>

      <TableCell>
        {row.dateSigned
          ? new Date(row.dateSigned).toLocaleDateString("en-US")
          : ""}
      </TableCell>

      <TableCell>
        <Checkbox
          checked={Boolean(row.iepSigned)}
          onChange={() => handleCheckboxChange(row._id, "iepSigned")}
          color="success"
        />
      </TableCell>

      <TableCell>
        {row.iepDateSigned
          ? new Date(row.iepDateSigned).toLocaleDateString("en-US")
          : ""}
      </TableCell>

      <TableCell>
        <IconButton color="primary" onClick={() => handleOpen(row)}>
          <Edit />
        </IconButton>
      </TableCell>

      <TableCell>
        <IconButton color="secondary" onClick={() => handleDelete(row._id)}>
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default AssignmentRow;