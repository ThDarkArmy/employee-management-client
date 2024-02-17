import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import axios from "axios";

import {
  Box,
  Typography
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

const EmployeePanel = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [openSuccessSnack, setOpenSuccessSnack] = useState(false);
  const [openErrorSnack, setOpenErrorSnack] = useState(false);
  const [salaries, setSalaries] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");


  useEffect(() => {
    if (!token) {
      navigate("/login-register");
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

  return (
    <div>
      <Header />
      <Box sx={{ mt: 9, padding: 1 }}>
        <Box sx={{ mt: 5, mb: 25 }}>
          <Snackbar openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} snackbarMessage={snackbarMessage} snackbarSeverity={snackbarSeverity} />
          <Box display="flex">
            <Typography variant="h5" color="initial">
              My Salaries
            </Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Salary Id (Id)</StyledTableCell>
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
                    <StyledTableCell align="right">Total</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salaries &&
                    salaries.map((row) => (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell component="th" scope="row">
                          {row.id}
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
                          { row.fixedAmount + row.houseRentAllowance + row.specialAllowance - row.professionalTax - row.providentFund - row.incomeTax }
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </div>
  )
}

export default EmployeePanel;