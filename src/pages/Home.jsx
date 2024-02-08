import React, { useState, useEffect } from 'react'
import Header from '../components/Header';
import { Typography, Box, TextField, Grid } from '@mui/material';
import axios from "axios";
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

          <Box sx={{ mt: 2, padding: 1 }} id="shop">
            <TextField onChange={(e) => setSearchText(e.target.value)} fullWidth placeholder="Search" />
          </Box>
          <Box sx={{mt: 7, p: 1}}>
          <Grid container spacing={3}>
            
          </Grid>
          </Box>
          
        </div>
      </Box>
    </>
  )
}

export default Home