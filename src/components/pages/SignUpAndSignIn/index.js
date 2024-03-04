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

  return (
    <div className="SignUpAndSignIn">
      
      {!isUserCreatedSucc ? (
        <SignUpForm setIsUserCreatedSucc={setIsUserCreatedSucc} handleClickUCS={handleClickUCS}/>
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

    </div>
  );
}

export default SignUpAndSignIn;
