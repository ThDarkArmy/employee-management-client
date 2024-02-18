import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import axios from "axios";

import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
  DialogContent
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiAlert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Snackbar from "../components/Snackbar";


import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8000/api/v1";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const LeaveRequests = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [openErrorSnack, setOpenErrorSnack] = useState(false);
  const [errorMsg, setErrorMsg] = useState();

  const [openAddForm, setOpenAddForm] = useState(false);

  const [leaveRequests, setLeaveRequests] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const [leaveRequestId, setLeaveRequestId] = useState();

  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [showValidationError, setshowValidationError] = useState(false);

  const validateInput = () => {
  
    if (!reason ||
        !toDate ||
        !fromDate) {
          setshowValidationError(true);
      return false; // Validation failed
    }
  
    return true; // Validation passed
  };
  

  useEffect(() => {
    if (!token) {
      navigate("/login-register");
    }
  }, [])



  const loadLeaveRequests = async () => {
    try {
      const response = await axios({
        method: "get",
        url: BASE_URL + "/leaverequests/my-leave-requests",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        }
      });
      if (response.data) {
        setLeaveRequests(response.data)
      }
    } catch (err) {
      console.log(err);
      setOpenErrorSnack(true);
      setErrorMsg("Error occured while loading leave requests");
    }
  };

  const deleteLeaveRequest = async (id) => {
    try {
      const response = await axios({
        method: "delete",
        url: BASE_URL + "/leaverequests/" + id,
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        }
      });
      if (response) {
        setSnackbarMessage("Leave Request deleted successfully");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        loadLeaveRequests();
      }
    } catch (err) {
      setSnackbarMessage("Error occured while deleting leave requests");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const updateLeaveRequest = async () => {
    const requestBody = {
      reason,
      toDate,
      fromDate
    }
    try {
      if(!validateInput()){
        return;
      }
      const response = await axios({
        method: "put",
        url: BASE_URL + "/leaverequests/"+leaveRequestId,
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
        data: requestBody
      });
      if (response.data) {
        setSnackbarMessage("Leave Request updated successfully");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setOpenAddForm(false);
        loadLeaveRequests();
        resetForm();
      }
    } catch (err) {
      setSnackbarMessage("Error occured while updating leave request");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const createLeaveRequest = async () => {
    const requestBody = {
      reason,
      toDate,
      fromDate
    }
    try {
      if(!validateInput()){
        return;
      }
      const response = await axios({
        method: "post",
        url: BASE_URL + "/leaverequests",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
        data: requestBody
      });
      if (response.data) {
        setSnackbarMessage("Leave Request Submitted successfully");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setOpenAddForm(false);
        loadLeaveRequests();
        resetForm();
      }
    } catch (err) {
      setSnackbarMessage("Error occured while creating leave request");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const resetForm = () => {
    setFromDate();
    setReason("")
    setLeaveRequestId("")
    setToDate("")
  }

  useEffect(() => {
    loadLeaveRequests();
  }, []);

  return (
    <div>
      <Header />
      <Box sx={{ mt: 9, padding: 1 }}>
        <Box sx={{ mt: 5, mb: 1 }}>
          <Snackbar openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} snackbarMessage={snackbarMessage} snackbarSeverity={snackbarSeverity} />

          <Box display="flex" sx={{ mt: 5 }}>
            <Typography variant="h5" color="initial">
              Leave Requests
            </Typography>
            <Button onClick={()=> setOpenAddForm(true)} variant="outlined" sx={{ml: "auto", textTransform: "none"}}>Create Leave Request</Button>
          </Box>
          <Box sx={{ mt: 2, overflowX: "auto" }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Leave Request (Id)</StyledTableCell>
                    <StyledTableCell align="right">Leave Request Name</StyledTableCell>
                    <StyledTableCell align="right">Log Hours</StyledTableCell>
                    <StyledTableCell align="right">
                      Date
                    </StyledTableCell>
                    <StyledTableCell align="right">Description</StyledTableCell>
                    <StyledTableCell align="right">Approved</StyledTableCell>
                    <StyledTableCell align="right">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaveRequests &&
                    leaveRequests.map((row) => (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell component="th" scope="row">
                          {row.id}
                        </StyledTableCell>
                        <StyledTableCell
                          align="right"
                          component="th"
                          scope="row"
                        >
                          {row?.user?.name}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.fromDate}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.toDate}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.reason}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.approved ?"Approved": "Not Approved"}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <EditIcon titleAccess="Pay Salary"
                            sx={{ cursor: "pointer", ml: 2 }}
                            onClick={() => {
                              setLeaveRequestId(row.id)
                              setReason(row.reason)
                              setFromDate(row.fromDate)
                              setToDate(row.toDate)
                              setOpenAddForm(true)}} />
                          <DeleteIcon
                            titleAccess="Delete"
                            sx={{ cursor: "pointer", ml: 2 }}
                            onClick={() => deleteLeaveRequest(row.id)}
                          />
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>

      <Dialog open={openAddForm} onClose={() => setOpenAddForm(false)}>
        <DialogTitle>{leaveRequestId ?"Update Leave Request": "Make Leave Request"}</DialogTitle>
        <DialogContent>
          {showValidationError && (
            <Alert severity="error">All the fields are mandatory</Alert>
          )}
          
          <TextField
            size="small"
            label="Reason"
            fullWidth
            value={reason}
            onChange={(e) => {
              setshowValidationError(false);
              setReason(e.target.value);
            }}
            sx={{ mt: 2 }}
          />

          <TextField
            size="small"
            label="From Date"
            fullWidth
            value={fromDate}
            type="date"
            onChange={(e) => {
              setshowValidationError(false);
              setFromDate(e.target.value);
            }}
            sx={{ mt: 2 }}
          />

          <TextField
            size="small"
            label="To Date"
            fullWidth
            value={toDate}
            type="date"
            onChange={(e) => {
              setshowValidationError(false);
              setToDate(e.target.value);
            }}
            sx={{ mt: 2 }}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            resetForm();
            setOpenAddForm(false)}}>Cancel</Button>
          <Button onClick={() => leaveRequestId? updateLeaveRequest() : createLeaveRequest()}>{leaveRequestId ?"Update Leave Request": "Submit Leave Request"}</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default LeaveRequests;