import React, { useContext, useState } from "react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import './SignUpAndSignIn.scss';
import { appContext } from "../../../context";
import Snackbar from '@mui/material/Snackbar';

function SignUpAndSignIn() {

  const contextt = useContext(appContext);
 
  const setIsUserCreatedSucc = contextt.setIsUserCreatedSucc;
  const isUserCreatedSucc = contextt.isUserCreatedSucc;

    //user created successfully SnackBar
    const [openUCS, setOpenUCS] = useState(false);
    const handleClickUCS = () => {
      setOpenUCS(true);
    };
    const handleCloseUCS = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpenUCS(false);
    };

    //code verififed successfuly SnackBar
    const [openCVS, setOpenCVS] = useState(false);
    const handleClickCVS = () => {
      setOpenCVS(true);
    };
    const handleCloseCVS = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpenCVS(false);
    };

  return (
    <div className="SignUpAndSignIn">
      
      {!isUserCreatedSucc ? (
        <SignUpForm setIsUserCreatedSucc={setIsUserCreatedSucc} handleClickUCS={handleClickUCS} handleClickCVS={handleClickCVS}/>
      ) : (
        <SignInForm setIsUserCreatedSucc={setIsUserCreatedSucc}/>
      )}

      <Snackbar
        style={{backgroundColor:'#af8cfb', borderRadius:'5px'}}
        open={openUCS}
        autoHideDuration={5000}
        onClose={handleCloseUCS}
        message="User has been created Successfully"
      />

      <Snackbar
        style={{backgroundColor:'#af8cfb', borderRadius:'5px'}}
        open={openCVS}
        autoHideDuration={5000}
        onClose={handleCloseCVS}
        message="Code is verified, you can sign in Now"
      />

    </div>
  );
}

export default SignUpAndSignIn;
