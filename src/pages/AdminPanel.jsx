import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import axios from "axios";

import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  MenuItem,
  DialogTitle,
  Select,
  TextField,
  DialogContent
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiAlert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
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

const AdminPanel = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [openSuccessSnack, setOpenSuccessSnack] = useState(false);
  const [openErrorSnack, setOpenErrorSnack] = useState(false);
  const [successMsg, setSuccessMsg] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [salaries, setSalaries] = useState([]);

  const [openAddForm, setOpenAddForm] = useState(false);

  const [employees, setEmployees] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const [employeeId, setEmployeeId] = useState();
  const [fixedAmount, setFixedAmount] = useState("");

  const [houseRentAllowance, setHouseRentAllowance] = useState("");
  const [specialAllowance, setSpecialAllowance] = useState("");
  const [providentFund, setProvidentFund] = useState("");
  const [professionalTax, setProfessionalTax] = useState();
  const [incomeTax, setIncomeTax] = useState();
  const [month, setMonth] = useState("");
  const [year, setYear] = useState();

  const [showValidationError, setshowValidationError] = useState(false);

  const validateInput = () => {
    const isNumeric = (value) => {
      return !isNaN(parseFloat(value)) && isFinite(value);
    };
  
    if (!isNumeric(houseRentAllowance) ||
        !isNumeric(fixedAmount) ||
        !isNumeric(providentFund) ||
        !isNumeric(professionalTax) ||
        !isNumeric(incomeTax) ||
        !isNumeric(specialAllowance) ||
        !month ||
        !isNumeric(year)) {
          setshowValidationError(true);
      return false; // Validation failed
    }
  
    return true; // Validation passed
  };
  

  useEffect(() => {
    if (!token) {
      navigate("/login-register");
    }
    if (role === "MANAGER") {
      navigate("/manager-panel");
    } else if (role === "EMPLOYEE") {
      navigate("/");
    }
  }, [])

  useEffect(() => {
    loadSalaries();
  }, [])


  const loadSalaries = async () => {
    try {
      const response = await axios({
        method: "get",
        url: `${BASE_URL}/salaries`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data) {
        setSalaries(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const loadEmployees = async () => {
    try {
      const response = await axios({
        method: "get",
        url: BASE_URL + "/users/all",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        }
      });
      if (response.data) {
        setEmployees(response.data)
      }
    } catch (err) {
      console.log(err);
      setOpenErrorSnack(true);
      setErrorMsg("Error occured while loading employees");
    }
  };

  const deleteEmployee = async (id) => {
    try {
      const response = await axios({
        method: "delete",
        url: BASE_URL + "/users/" + id,
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        }
      });
      if (response.data) {
        setSnackbarMessage("Employee deleted successfully");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        loadEmployees();
      }
    } catch (err) {
      setSnackbarMessage("Error occured while deleting employees");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const paySalary = async () => {
    const requestBody = {
      houseRentAllowance,
      fixedAmount,
      professionalTax,
      providentFund,
      specialAllowance,
      month,
      year,
      incomeTax
    }
    try {
      if(!validateInput()){
        return;
      }
      const response = await axios({
        method: "post",
        url: BASE_URL + "/salaries/" + employeeId,
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
        data: requestBody
      });
      if (response.data) {
        setSnackbarMessage("Payment successful");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        loadSalaries();
        setOpenAddForm(false);
      }
    } catch (err) {
      setSnackbarMessage("Error occured while paying salary");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };


  useEffect(() => {
    loadEmployees();
  }, []);

  const deleteSalary = async (id) => {
    try {
      const response = await axios({
        method: "delete",
        url: `${BASE_URL}/salaries/${id}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response) {
        setSnackbarMessage("Salary data deleted successfully");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        loadSalaries()
      }
    } catch (error) {
      setSnackbarMessage("Salary data couldn't deleted");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  }

  return (
    <div>
      <Header />
      <Box sx={{ mt: 9, padding: 1 }}>
        <Box sx={{ mt: 5, mb: 1 }}>
          <Snackbar openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} snackbarMessage={snackbarMessage} snackbarSeverity={snackbarSeverity} />
          <Box display="flex">
            <Typography variant="h5" color="initial">
              Salaries
            </Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Salary Id (Id)</StyledTableCell>
                    <StyledTableCell align="right">Employee Name</StyledTableCell>
                    <StyledTableCell align="right">Fixed Amount</StyledTableCell>
                    <StyledTableCell align="right">HRA</StyledTableCell>
                    <StyledTableCell align="right">Special Allowance</StyledTableCell>
                    <StyledTableCell align="right">PF</StyledTableCell>
                    <StyledTableCell align="right">Income Tax</StyledTableCell>
                    <StyledTableCell align="right">Professional Tax</StyledTableCell>
                    <StyledTableCell align="right">Month</StyledTableCell>
                    <StyledTableCell align="right">
                      Year
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      Date of Payment
                    </StyledTableCell>
                    <StyledTableCell align="right">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salaries &&
                    salaries.map((row) => (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell component="th" scope="row">
                          {row.id}
                        </StyledTableCell>
                        <StyledTableCell
                          align="right"
                          component="th"
                          scope="row"
                        >
                          {row.user?.name}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.fixedAmount}
                        </StyledTableCell>
                        <StyledTableCell align="right">{row.houseRentAllowance}</StyledTableCell>
                        <StyledTableCell align="right">{row.specialAllowance}</StyledTableCell>
                        <StyledTableCell align="right">{row.providentFund}</StyledTableCell>
                        <StyledTableCell align="right">{row.incomeTax}</StyledTableCell>
                        <StyledTableCell align="right">{row.professionalTax}</StyledTableCell>
                        <StyledTableCell align="right">{row.month}</StyledTableCell>
                        <StyledTableCell align="right">{row.year}</StyledTableCell>
                        <StyledTableCell align="right">{row.dateOfPayment}</StyledTableCell>
                        <StyledTableCell align="right">
                          <DeleteIcon
                            sx={{ cursor: "pointer", ml: 2 }}
                            onClick={() => deleteSalary(row.id)}
                          />
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box display="flex" sx={{ mt: 5 }}>
            <Typography variant="h5" color="initial">
              Employees
            </Typography>
          </Box>
          <Box sx={{ mt: 2, overflowX: "auto" }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Employee (Id)</StyledTableCell>
                    <StyledTableCell align="right">Name</StyledTableCell>
                    <StyledTableCell align="right">Contact No.</StyledTableCell>
                    <StyledTableCell align="right">
                      Email
                    </StyledTableCell>
                    <StyledTableCell align="right">Role</StyledTableCell>
                    <StyledTableCell align="right">Address</StyledTableCell>
                    <StyledTableCell align="right">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees &&
                    employees.map((row) => (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell component="th" scope="row">
                          {row.id}
                        </StyledTableCell>
                        <StyledTableCell
                          align="right"
                          component="th"
                          scope="row"
                        >
                          {row.name}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.contactNumber}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.email}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.role}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.address}
                        </StyledTableCell>

                        <StyledTableCell align="right">
                          <PaidTwoToneIcon titleAccess="Pay Salary"
                            sx={{ cursor: "pointer", ml: 2 }}
                            onClick={() => {
                              setEmployeeId(row.id)
                              setOpenAddForm(true)}} />
                          <DeleteIcon
                            titleAccess="Delete"
                            sx={{ cursor: "pointer", ml: 2 }}
                            onClick={() => deleteEmployee(row.id)}
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
        <DialogTitle>Add Flat</DialogTitle>
        <DialogContent>
          {showValidationError && (
            <Alert severity="error">All the fields are mandatory</Alert>
          )}
          
          <TextField
            size="small"
            label="House Rent Allowance"
            fullWidth
            value={houseRentAllowance}
            onChange={(e) => {
              setshowValidationError(false);
              setHouseRentAllowance(e.target.value);
            }}
            sx={{ mt: 2 }}
          />

          <TextField
            size="small"
            label="Fixed Amount"
            fullWidth
            value={fixedAmount}
            onChange={(e) => {
              setshowValidationError(false);
              setFixedAmount(e.target.value);
            }}
            sx={{ mt: 2 }}
          />

          <TextField
            size="small"
            label="Provident Fund"
            fullWidth
            value={providentFund}
            onChange={(e) => {
              setshowValidationError(false);
              setProvidentFund(e.target.value);
            }}
            sx={{ mt: 2 }}
          />

          <TextField
            size="small"
            label="Professional Tax"
            fullWidth
            value={professionalTax}
            onChange={(e) => {
              setshowValidationError(false);
              setProfessionalTax(e.target.value);
            }}
            sx={{ mt: 2 }}
          />

          <TextField
            size="small"
            label="Income Tax"
            fullWidth
            value={incomeTax}
            onChange={(e) => {
              setshowValidationError(false);
              setIncomeTax(e.target.value);
            }}
            sx={{ mt: 2 }}
          />

          <TextField
            size="small"
            label="Special Allowance"
            fullWidth
            value={specialAllowance}
            onChange={(e) => {
              setshowValidationError(false);
              setSpecialAllowance(e.target.value);
            }}
            sx={{ mt: 2 }}
          />
          <TextField
            size="small"
            label="Month"
            fullWidth
            value={month}
            onChange={(e) => {
              setshowValidationError(false);
              setMonth(e.target.value);
            }}
            sx={{ mt: 2 }}
          />

          <TextField
            size="small"
            label="Year"
            fullWidth
            value={year}
            onChange={(e) => {
              setshowValidationError(false);
              setYear(e.target.value);
            }}
            sx={{ mt: 2 }}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddForm(false)}>Cancel</Button>
          <Button onClick={() => paySalary()}>Pay Salary</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default AdminPanel;