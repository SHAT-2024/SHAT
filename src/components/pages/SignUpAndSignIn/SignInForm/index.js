import React, { useContext, useState } from "react";
import {
  setUsername,
  setPassword,
} from "../../../../store/actions";
import { appContext } from "../../../../context";
import './SignInForm.scss';
import CircularProgress from '@mui/material/CircularProgress';

function SignInForm({setIsUserCreatedSucc}) {
  
  const contextt = useContext(appContext);

  const [isSignedInSucc, setIsSignedInSucc] = useState(false);

  const signInProcess = async (e) => {
    e.preventDefault();

    setIsSignedInSucc(true);
    let username = contextt.state.usernameForm;
    let password = contextt.state.passwordForm;

    const loginStatus = await contextt.signIn(username, password);

    if(loginStatus === 200){
        setIsSignedInSucc(false);
        contextt.handleClickSIS();
      }else{
        alert("something went wrong, please try again");
        setIsSignedInSucc(false);
    }
  };

  return (
    <div className="sign-in">
      <h1 className="color-purple center-elements">
        Sign in
      </h1>
      <form onSubmit={signInProcess}>
        <div className="form-group">
          <label htmlFor="signinusername">Username</label>
          <input
            type="text"
            className="form-control"
            id="signinusername"
            required
            onChange={(e) => {
              contextt.dispatch(setUsername(e.target.value));
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="signinpassword">Password</label>
          <input
            type="password"
            className="form-control"
            id="signinpassword"
            required
            onChange={(e) => {
              contextt.dispatch(setPassword(e.target.value));
            }}
          />
        </div>
        <div className="center-elements submit-button">
            <button type="submit" className="form-control btn btn-primary bk-purple" disabled={isSignedInSucc}>
              {!isSignedInSucc? 'Sign in' : <CircularProgress style={{color:'#e7e7e7', width:'1.5vmax', height: '1.5vmax'}}/>}
            </button>
            </div>
      </form>
      <div className="center-elements cursor-pointer"
        onClick={() => {
          setIsUserCreatedSucc(false);
        }}
      >
        <small><u className="color-purple">Sign up</u> instead</small>
      </div>
    </div>
  );
}

export default SignInForm;
