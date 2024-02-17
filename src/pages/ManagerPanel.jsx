import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import axios from "axios";

import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiAlert from "@mui/material/Alert";
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

const ManagerPanel = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [openErrorSnack, setOpenErrorSnack] = useState(false);
  const [errorMsg, setErrorMsg] = useState();

  const [leaveRequests, setLeaveRequests] = useState([]);

  const [attendances, setAttendances] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  

  useEffect(() => {
    if (!token) {
      navigate("/login-register");
    }

    if (role === "ADMIN") {
        navigate("/admin-panel");
      } else if (role === "EMPLOYEE") {
        navigate("/");
      }
  }, [])


  
  const loadAttendances = async () => {
    try {
      const response = await axios({
        method: "get",
        url: BASE_URL + "/attendances",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        }
      });
      if (response.data) {
        setAttendances(response.data)
      }
    } catch (err) {
      console.log(err);
      setOpenErrorSnack(true);
      setErrorMsg("Error occured while loading attendances");
    }
  };


  const loadLeaveRequests = async () => {
    try {
      const response = await axios({
        method: "get",
        url: BASE_URL + "/leaverequests",
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

  const updateLeaveRequest = async (status, leaveRequestData) => {
    const requestBody = {
      reason: leaveRequestData.reason,
      toDate : leaveRequestData.toDate,
      fromDate : leaveRequestData.fromDate,
      status: status
    }
    try {
      const response = await axios({
        method: "put",
        url: BASE_URL + "/leaverequests/"+leaveRequestData.id,
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
        loadLeaveRequests();
      }
    } catch (err) {
      setSnackbarMessage("Error occured while updating leave request");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const approveAttendance = async (id) => {
    try{
        const response = await axios({
            method: "put",
            url: BASE_URL + "/attendances/approve/"+id,
            headers: {
              "content-type": "application/json",
              Authorization: "Bearer " + token,
            },
            data: {}
          });
          if (response.data) {
            setSnackbarMessage("Attendance approved successfully");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
            loadAttendances();
          }

    }catch(err){
      setOpenErrorSnack(true);
      setErrorMsg("Error occured while approving attendance");
    }
  }

  useEffect(() => {
    loadLeaveRequests();
    loadAttendances();
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
                          {row.status}
                        </StyledTableCell>
                            <StyledTableCell align="right">
                                <FormControl fullWidth>
                                    <InputLabel sx={{mt: -1}}>Select</InputLabel>
                                    <Select disabled={row.status!=="PENDING"} onChange={(e) => updateLeaveRequest(e.target.value, row)} size="small" fullWidth >
                                        <MenuItem value="CANCELLED">Cancel</MenuItem>
                                        <MenuItem value="APPROVED">Approve</MenuItem>
                                    </Select>
                                </FormControl>

                            </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
        <Box display="flex" sx={{ mt: 5 }}>
            <Typography variant="h5" color="initial">
              Attendances
            </Typography>
          </Box>
          <Box sx={{ mt: 2, overflowX: "auto" }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Attendance (Id)</StyledTableCell>
                    <StyledTableCell align="right">Attendance Name</StyledTableCell>
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
                  {attendances &&
                    attendances.map((row) => (
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
                          {row.logHours}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.date}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.description}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.approved ?"Approved": "Not Approved"}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                         <Button onClick={()=> approveAttendance(row.id)} disabled={row.approved} variant="outlined" sx={{color: "fff"}}>Approve</Button>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

      </Box>
    </div>
  )
}

export default ManagerPanel;