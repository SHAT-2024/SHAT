import React, { useContext, useEffect, useState } from "react";
import { appContext } from "../../../../context";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';

function Verification({setIsUserCreatedSucc, handleClickUCS}) {
  
  const contextt = useContext(appContext);
  let socket = contextt.socket;

  const [verCode, setVerCode] = useState(0);
  const [userverCode, setUserverCode] = useState(0);
  const [creatingUser, setCreatingUser] = useState(false);

  const uploadToCloud = async () => {
    const formData = new FormData();
    formData.append("file", contextt.state.avatarInput);
    formData.append("upload_preset", "photopic123");

    try{
      const uploadReq = await axios.post("https://api.cloudinary.com/v1_1/dd4yn2x48/image/upload", formData);
      const imgurl = uploadReq.data.secure_url;
      return imgurl;

    }catch(err){
      console.error('cloudinary error: ', err);
    }
  }

  const VerifyCode = async () => {
    if(parseInt(verCode) === parseInt(userverCode)){

      setCreatingUser(true);   

      const userObj = {
        photoURL : await uploadToCloud(), //should the await remain?
        username: contextt.state.usernameForm,
        email: contextt.state.emailForm,
        bio: contextt.state.bioForm,
        password: contextt.state.passwordForm,
      };

      const signUpStatus = await contextt.signUp(userObj);

      if (signUpStatus === 201) {
        setCreatingUser(false);
        setIsUserCreatedSucc(true);
        handleClickUCS();
          
      }else{
        alert("something went wrong, please try again");
      }


    }else{
      alert('the code you entered is invalid, please make sure you write all the 6 digits, or try ro resend the code again');
    }
  }

  useEffect(()=>{
    socket.on('ver_code_sent', payload => {
      if(payload){
        setVerCode(payload);
      }
    })
  },[socket]);

    return (
    <div className="sign-in">
      <h1 className="center-elements">
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
            onChange={e=>{setUserverCode(e.target.value)}}
            required
          />
        </div>
        <div className="center-elements submit-button">
            <button type="submit" className="form-control btn btn-primary bk-purple" onClick={VerifyCode} disabled={creatingUser}>
                {creatingUser? <CircularProgress style={{color:'#e7e7e7', width:'1.5vmax', height: '1.5vmax'}}/> : 'Continue'}
            </button>
        </div>
        <small className="resend-code">didn't recieve a code? <u className="resend-code-u" onClick={()=>{socket.emit("send_ver_code", {username: contextt.state.usernameForm, email: contextt.state.emailForm});}}>press here to resend it</u></small>
      </div>
    </div>
  );
}

export default Verification;
