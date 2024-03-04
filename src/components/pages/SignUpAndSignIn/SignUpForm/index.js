import React, { useContext, useRef, useState } from "react";
import {
  setUsername,
  setEmail,
  setPassword,
  setBio,
  setAvatarInput,
} from "../../../../store/actions";
import { appContext } from "../../../../context";
import "./SignUpForm.scss";
import Verification from "./Verification";

function SignUpForm({ setIsUserCreatedSucc, handleClickUCS}) {
  const contextt = useContext(appContext);
  let socket = contextt.socket;

  const charactersLimitationForBio = 100;

  const avatarinputRef = useRef(null);
  const avatarreviewRef = useRef(null);
  
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [showOtherHalfOfTheForm, setShowOtherHalfOfTheForm] = useState(false);
  const [showVerWindow, setshowVerWindow] = useState(false);
  
  const onInputFileChange = () => {
    let reader = new FileReader();
    reader.readAsDataURL(avatarinputRef.current.files[0]);
    reader.onload = ()=> {
      contextt.dispatch(setAvatarInput((reader.result)));
    };
  }

  const signUpProcess = async (e) => {
    e.preventDefault();
    socket.emit("send_ver_code", {username: contextt.state.usernameForm, email: contextt.state.emailForm});
    setshowVerWindow(true);
  };

  const onNextBtnClick = () => {
    if(usernameRef.current.value.trim() && emailRef.current.value.trim() && passwordRef.current.value.trim()){
    setShowOtherHalfOfTheForm(true);
    }
  }

  return (
    // form part 1 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    showVerWindow? <Verification setIsUserCreatedSucc={setIsUserCreatedSucc} handleClickUCS={handleClickUCS}/> :
      <div className="sign-up">
      <p className="center-elements color-purple sign-up-word">Sign up</p>
      <form onSubmit={signUpProcess}>
        { !showOtherHalfOfTheForm? 
        <>
          <div className="form-group">
            <label htmlFor="signupUserAme">Username</label>
            <input
              type="text"
              className="form-control"
              id="signupUserAme"
              ref={usernameRef}
              required
              onChange={(e) => {
                contextt.dispatch(setUsername(e.target.value));
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="signupemial">Email address</label>
            <input
              type="email"
              className="form-control"
              id="signupemial"
              ref={emailRef}
              required
              onChange={(e) => {
                contextt.dispatch(setEmail(e.target.value));
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="signuppassword">Password</label>
            <input
              type="password"
              className="form-control"
              id="signuppassword"
              ref={passwordRef}
              required
              onChange={(e) => {
                contextt.dispatch(setPassword(e.target.value));
              }}
            />
          </div>

          <div className="center-elements action-buttons-flex">
          <div
              className="cursor-pointer"
              onClick={() => {
                setIsUserCreatedSucc(true);
              }}
            >
              <small><u className="su-link">Sign in</u> instead</small>
            </div>
            <button
            className="btn btn-primary bk-purple"
            onClick={()=>onNextBtnClick()}
          >
            Next
          </button>
          </div>

          <div className="progress-bar-50">
                <div className="per-50">1/2</div>
                <div className="progress-bar">
                  <div className="first-50"></div>
                  <div className="other-50"></div>
                </div>
          </div>
        </>
            :
        // form part 2 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        <>
        <div className="form-group form-avatar">
          <div className="avatar-su-ph">
            <img
              src={ contextt.state.avatarInput ||
                "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"
              }
              className="avatar-ph"
              alt="avatar"
              ref={avatarreviewRef}
            />
            <label htmlFor="upload">Ulpoad avatar</label>
            <input type="file" id="upload" accept="image/*" ref={avatarinputRef} style={{ display: "none" }} onChange={onInputFileChange}/>
          </div>
        </div>
        <div className="form-group">
          <div className="bio-flex">
            <label htmlFor="signupBio">Bio</label>
            <small>{`${contextt.state.bioForm.length}/${charactersLimitationForBio}`}</small>
          </div>
          <textarea
            type="type"
            className="form-control"
            id="signupBio"
            onChange={(e) => {
              if(charactersLimitationForBio - e.target.value.length >= 0){
                contextt.dispatch(setBio(e.target.value));
              }
            }}
          ></textarea>
        </div>
        <div className="center-elements action-buttons-flex">
          <button
            className="btn back-btn"
            onClick={()=>setShowOtherHalfOfTheForm(false)}
          >
            back
          </button>
          <button
            type="submit"
            className="btn bk-purple"
          >Sign up
          </button>
        </div>

        <div className="progress-bar-100">
          <div className="per-100">2/2</div>
          <div className="progress-bar"></div>
        </div>
      </> }
      </form>
    </div>

  );
}

export default SignUpForm;
