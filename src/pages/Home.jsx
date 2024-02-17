import React, { useState, useEffect } from 'react'
import Header from '../components/Header';
import { Typography, Box, TextField, Grid } from '@mui/material';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8000/api/v1";

const Home = () => {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [searchText, setSearchText] = useState("");

  useEffect(() => {

  }, [])


  return (
    <>
      <Header />
      <Box sx={{ mt: -2, maxWidth: "100%" }}>
        <video width="100%" id="HomeV" muted loop autoPlay>
          <source src={require('../video/background.mp4')} type="video/mp4" ></source>
        </video>
        <div style={{ marginTop: 10, padding: 20 }}>
          <Box sx={{mt: 7, pl: 3}}>
            <Typography style={{color: "red"}}>Our Services</Typography>
            <Box display="flex" alignItems="center" sx={{mt: 2}}>
              <DoubleArrowIcon sx={{mr: 1}}/>
              <Typography style={{fontSize: "20px", ml: 4}}>Leave Request Management</Typography>
            </Box>

            <Box display="flex" alignItems="center" sx={{mt: 2}}>
              <DoubleArrowIcon sx={{mr: 1}}/>
              <Typography style={{fontSize: "20px", ml: 4}}>Attendance management</Typography>
            </Box>

            <Box display="flex" alignItems="center" sx={{mt: 2}}>
              <DoubleArrowIcon sx={{mr: 1}}/>
              <Typography style={{fontSize: "20px", ml: 4}}>Salary Management</Typography>
            </Box>

            <Box display="flex" alignItems="center" sx={{mt: 2}}>
              <DoubleArrowIcon sx={{mr: 1}}/>
              <Typography style={{fontSize: "20px", ml: 4}}>Admin Panel</Typography>
            </Box>

            <Box display="flex" alignItems="center" sx={{mt: 2}}>
              <DoubleArrowIcon sx={{mr: 1}}/>
              <Typography style={{fontSize: "20px", ml: 4}}>Manager Panel</Typography>
            </Box>
          </Box>
          
        </div>
      </Box>
    </>
  )
}

export default Home