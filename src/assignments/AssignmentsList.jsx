import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import AssignmentRow from "./AssignmentRow";

function AssignmentsList({
  rows,
  statusOptions,
  handleStatusChange,
  togglePriority,
  handleCheckboxChange,
  handleOpen,
  handleDelete,
}) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {[
              "Priority",
              "Due Date",
              "Name",
              "School Site",
              "Status",
              "Assignment",
              "AP Signed",
              "Date Signed",
              "IEP Affirmed",
              "Date Affirmed",
              "Edit",
              "Delete",
            ].map((title) => (
              <TableCell key={title}>
                <h3>{title}</h3>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <AssignmentRow
              key={row._id}
              row={row}
              statusOptions={statusOptions}
              handleStatusChange={handleStatusChange}
              togglePriority={togglePriority}
              handleCheckboxChange={handleCheckboxChange}
              handleOpen={handleOpen}
              handleDelete={handleDelete}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AssignmentsList;