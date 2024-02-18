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
import PaidTwoToneIcon from '@mui/icons-material/PaidTwoTone';


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

const Attendances = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [openErrorSnack, setOpenErrorSnack] = useState(false);
  const [errorMsg, setErrorMsg] = useState();

  const [openAddForm, setOpenAddForm] = useState(false);

  const [attendances, setAttendances] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const [attendanceId, setAttendanceId] = useState();

  const [description, setDescription] = useState("");
  const [logHours, setLogHours] = useState("");
  const [date, setDate] = useState("");

  const [showValidationError, setshowValidationError] = useState(false);

  const validateInput = () => {
    const isNumeric = (value) => {
      return !isNaN(parseFloat(value)) && isFinite(value);
    };
  
    if (!description ||
        !date ||
        !isNumeric(logHours)) {
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

  const deleteAttendance = async (id) => {
    try {
      const response = await axios({
        method: "delete",
        url: BASE_URL + "/attendances/" + id,
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        }
      });
      if (response) {
        setSnackbarMessage("Attendance deleted successfully");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        loadAttendances();
      }
    } catch (err) {
      setSnackbarMessage("Error occured while deleting attendances");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const updateAttendance = async () => {
    const requestBody = {
      description,
      date,
      logHours
    }
    try {
      if(!validateInput()){
        return;
      }
      const response = await axios({
        method: "put",
        url: BASE_URL + "/attendances/"+attendanceId,
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
        data: requestBody
      });
      if (response.data) {
        setSnackbarMessage("Attendance updated successfully");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setOpenAddForm(false);
        loadAttendances();
        resetForm();
      }
    } catch (err) {
      setSnackbarMessage("Error occured while updating attendance");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const submitAttendance = async () => {
    const requestBody = {
      description,
      date,
      logHours
    }
    try {
      if(!validateInput()){
        return;
      }
      const response = await axios({
        method: "post",
        url: BASE_URL + "/attendances",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
        data: requestBody
      });
      if (response.data) {
        setSnackbarMessage("Attendance Submitted successfully");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setOpenAddForm(false);
        loadAttendances();
        resetForm();
      }
    } catch (err) {
      setSnackbarMessage("Error occured while making attendance");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const resetForm = () => {
    setLogHours();
    setDescription("")
    setAttendanceId("")
    setDate("")
  }

  useEffect(() => {
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
              Attendances
            </Typography>
            <Button onClick={()=> setOpenAddForm(true)} variant="outlined" sx={{ml: "auto", textTransform: "none"}}>Make Attendance</Button>
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
                          <EditIcon titleAccess="Pay Salary"
                            sx={{ cursor: "pointer", ml: 2 }}
                            onClick={() => {
                              setAttendanceId(row.id)
                              setDescription(row.description)
                              setLogHours(row.logHours)
                              setDate(row.date)
                              setOpenAddForm(true)}} />
                          <DeleteIcon
                            titleAccess="Delete"
                            sx={{ cursor: "pointer", ml: 2 }}
                            onClick={() => deleteAttendance(row.id)}
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
        <DialogTitle>{attendanceId ?"Update Attendance": "Make Attendance"}</DialogTitle>
        <DialogContent>
          {showValidationError && (
            <Alert severity="error">All the fields are mandatory</Alert>
          )}
          
          <TextField
            size="small"
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => {
              setshowValidationError(false);
              setDescription(e.target.value);
            }}
            sx={{ mt: 2 }}
          />

          <TextField
            size="small"
            label="Log Hours"
            fullWidth
            value={logHours}
            type="number"
            onChange={(e) => {
              setshowValidationError(false);
              setLogHours(e.target.value);
            }}
            sx={{ mt: 2 }}
          />

          <TextField
            size="small"
            label="Date"
            fullWidth
            value={date}
            type="date"
            onChange={(e) => {
              setshowValidationError(false);
              setDate(e.target.value);
            }}
            sx={{ mt: 2 }}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            resetForm();
            setOpenAddForm(false)}}>Cancel</Button>
          <Button onClick={() => attendanceId? updateAttendance() : submitAttendance()}>{attendanceId ?"Update Attendance": "Submit Attendance"}</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Attendances;