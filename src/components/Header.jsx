import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TitleLogo from "../images/logo.png";
import { useNavigate } from "react-router-dom";
import CallIcon from '@mui/icons-material/Call';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Menu,
  MenuItem,
  Drawer,
  Divider
} from "@mui/material";
import NotificationIcon from "@mui/icons-material/Notifications";
import axios from "axios";


const BASE_URL = "http://localhost:8000/api/v1";

export default function Header() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [logOutAnchorEl, setLogOutAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const openLogout = Boolean(logOutAnchorEl);

  const navigate = useNavigate();


  const showSnackbar = (msg, severity) => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  }

  const loadNotifications = async () => {
    try {
      const response = await axios({
        method: "get",
        url: BASE_URL + "/notifications",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        }
      });

      if (response.data) {
        setNotifications(response.data);
      }
    } catch (err) {
      showSnackbar("Some error occured while loading event", "error");
    }
  }

  useEffect(()=> {
    loadNotifications();
  },[])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ background: `linear-gradient(to right, #12c2e9, #c471ed, #f64f59);` }}>
        <Toolbar>
          <IconButton
            onClick={() => navigate("/")}
            disableRipple
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ ml: 3 }}
          >
            <Box
              component="img"
              sx={{
                height: 17,
              }}
              alt="Employee Management System"
              src={TitleLogo}
            />
          </IconButton>
          <Button onClick={()=> navigate("/")} sx={{ml: 1, color: "#fff", fontSize: 15, textTransform: 'none'}}>Home</Button>
          <Button onClick={()=> navigate("/leave-requests")} sx={{ml: 0.5, color: "#fff", fontSize: 15, textTransform: 'none'}}>Leave Requests</Button>
          <Button onClick={()=> navigate("/attendances")} sx={{ml: 0.5, color: "#fff", fontSize: 15, textTransform: 'none'}}><a style={{textDecoration: "none", color: "#fff"}}>Attendances</a></Button>
          <Box sx={{flexGrow: 1}}></Box>
          {role && role.toUpperCase() === "MANAGER" && (
            <IconButton
              title="Manager Panel"
              onClick={() => navigate("/manager-panel")}
              color="inherit"
              sx={{ marginLeft: 0 }}
            >
             <AdminPanelSettingsIcon sx={{color: "green"}}/>
            </IconButton>
          )}

          {role && role.toUpperCase() === "EMPLOYEE" && (
            <IconButton
              title="Employee Panel"
              onClick={() => navigate("/employee-panel")}
              color="inherit"
              sx={{ marginLeft: 0 }}
            >
             <MedicalServicesIcon sx={{color: "green"}}/>
            </IconButton>
          )}

            <IconButton
              title="Notifications"
              onClick={() => setShowNotification(true)}
              color="inherit"
              sx={{ marginLeft: 1 }}
            >
              <NotificationIcon sx={{color: "white"}}/>
            </IconButton>

          <IconButton
             title="Contact Us"
            onClick={() => setContactDialogOpen(true)}
            color="inherit"
            sx={{ marginLeft: 3 }}
          >
           <CallIcon sx={{color: ""}}/>
          </IconButton>

          <Box sx={{ flexGrow: 0, marginTop: -5, float: "right" }}>
            {loggedInUser ? (
              <Box
                onClick={(event) => setLogOutAnchorEl(event.currentTarget)}
                title="Profile"
                sx={{
                  background: `linear-gradient(to right, #373b44, #4286f4);`,
                  paddingRight: 2,
                  paddingBottom: 0.3,
                  paddingLeft: 2,
                  borderRadius: 3,
                  marginLeft: 4,
                  cursor: "pointer"
                }}
              >
                {" "}
                <Typography
                  variant="h6"
                  sx={{ color: "ThreeDFace", marginTop: 5 }}
                >
                  {" "}
                  {loggedInUser}
                </Typography>
              </Box>
            ) : (
              <Button
                onClick={() => navigate("/login-register")}
                sx={{ color: "blue", marginTop: 5 }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Dialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Contact Us</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Phone Number : +91 6756437890
            <br />
            Phone Number : +91 6756437891
          </DialogContentText>
          <br />
          <br />
          <DialogContentText id="alert-dialog-description">
            Email : helpdesk@employeemanagementsystem.com
            <br />
            Email : employeemanagementsystem@hotmail.com
          </DialogContentText>
          <br />
          <br />
          <DialogContentText id="alert-dialog-description">
            Address: Sarkar nagar, Pune
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Menu
        id="basic-menu"
        anchorEl={logOutAnchorEl}
        open={openLogout}
        onClose={() => setLogOutAnchorEl(null)}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            navigate("/profile");
          }}
        >
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            localStorage.clear();
            setLogOutAnchorEl(null);
            navigate("/login-register");
          }}
        >
          Log Out
        </MenuItem>

      </Menu>

      <Drawer
        anchor={"right"}
        open={showNotification}
        onClose={()=>setShowNotification(false)}
        PaperProps={{
          sx: { width: "300px" },
        }}
      >
        <Box sx={{p: 1}}>
          <Box sx={{mt: 1, textAlign: "center", width: "100%"}}>
            <Typography style={{fontSize: 20}}>Notifications</Typography>
          </Box>
        {/* {
          notifications && notifications.map(notification => 
          <Box sx={{p: 1, mt: 1, border: "1px solid grey", borderRadius: 4}}>
            <Typography variant="h7">
            {notification.title}
            </Typography>
            <Divider sx={{height: "0.5px", color: "grey", mt: 0.5}}/>
            <Typography>
              {notification.detail.substring(1, notification.detail.length)}
              {console.log("not::", notification.detail.substring(0, notification.detail.length))}
            </Typography>
           
          </Box>)

        } */}
        </Box>
        
      </Drawer>
    </Box>
  );
}
