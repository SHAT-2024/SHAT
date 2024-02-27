import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import CircularProgress from '@mui/material/CircularProgress';

const style = {
  position: "absolute",
  top: "23%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#333333",
  border: "none",
  boxShadow: 24,
  p: 4,
  textAlign: "center",
};

export default function LogOutModal({ contextt }) {
  const [open, setOpen] = React.useState(false);
  const [loggedOut, setLoggedOut] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <div
        onClick={() => {
          handleOpen();
        }}
      >
        <MeetingRoomRoundedIcon className="navbar-element" />
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to log-out?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <div className="toast-buttons">
              <button className="no-button" onClick={()=>{handleClose(); setLoggedOut(false);}}>No</button>
              <button className="btn yes-button" onClick={() => {contextt.logOut(); setLoggedOut(true)}} disabled={loggedOut}>
               {!loggedOut? 'Yes' : <CircularProgress style={{color:'#e7e7e7', width:'30px', height: '30px'}}/>}
              </button>
            </div>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
