import React, { useContext, useEffect, useState } from "react";
import { appContext } from "../../../../context";

function Verification({setIsUserCreatedSucc, handleClickCVS}) {
  
  const contextt = useContext(appContext);
  let socket = contextt.socket;

  const [verCode, setVerCode] = useState(0);
  const [userverCode, setUserverCode] = useState(0);

  const VerifyCode = () => {
    if(parseInt(verCode) === parseInt(userverCode)){
      setIsUserCreatedSucc(true);
      handleClickCVS();
    }else{
      alert('the code you entered is invalid, please make sure you write all the 6 digits, or try ro resend the code again');
    }
  }

  useEffect(()=>{
    socket.on('ver_code_sent', payload => {
      console.log('the code is sent ok? ', payload);
      if(payload){
        console.log('your code is: ', payload);
        setVerCode(payload);
      }
    })
  },[socket]);

    return (
    <div className="sign-in">
      <h1 className="center-elements" onClick={()=>console.log(verCode, userverCode)}>
        Check your Email
      </h1>
      <p className="ver-text">A verification code has been sent to you to verify your email address, please check it and enter the code below</p>
      <div className="ver-content">
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            id="signinusername"
            placeholder="code..."
            onChange={e=>{setUserverCode(e.target.value); console.log();}}
            required
          />
        </div>
        <div className="center-elements submit-button">
            <button type="submit" className="form-control btn btn-primary bk-purple" onClick={VerifyCode}>
                Continue
            </button>
        </div>
        <small className="resend-code">didn't recieve a code? <u className="resend-code-u" onClick={()=>{socket.emit("send_ver_code", {username: contextt.state.usernameForm, email: contextt.state.emailForm});}}>press here to resend it</u></small>
      </div>
    </div>
  );
}

export default Verification;
