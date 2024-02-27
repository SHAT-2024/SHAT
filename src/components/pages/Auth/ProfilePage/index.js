import React, { useContext, useEffect, useRef, useState } from "react";
import { appContext } from "../../../../context";
import LoggedInWarning from "../../warningPages/LoggedInWarning";
import "./ProfilePage.scss";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import { setAvatarInput, setBio, setLoggedInUsers, setUsername } from "../../../../store/actions";
import Snackbar from '@mui/material/Snackbar';

function ProfilePage() {
  const contextt = useContext(appContext);

  let flag = contextt.isLoggedInCookie;
  
  let currentUser = contextt.state.loggedInUSer;

  let socket = contextt.socket;

  const [showEditForm, setShowEditForm] = useState(false);
  const [editColor, setEditColor] = useState('');

  const avatarinputRef = useRef(null);
  const avatarreviewRef = useRef(null);

  const charactersLimitationForBio = 100;

  const [updatesentFlag, setUpdatesentFlag] = useState(false);

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

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

  const onSubmitFunction = async (e) => {
    setUpdatesentFlag(true);
    e.preventDefault();
    
    const obj = {
      username: contextt.state.usernameForm,
      photoURL: await uploadToCloud(),
      bio: contextt.state.bioForm,
      favColor: editColor
    }

    try {
      const editUserReq = await axios.put(`https://shat-server.onrender.com/api/v1/users/${currentUser.id}`, obj);
      if(editUserReq.status === 203){

        socket.emit("update_profile", contextt.state.usernameForm);

        setUpdatesentFlag(false);
        setShowEditForm(false);
        handleClick();
      }
    } catch (error) {
      console.error("Error editing user profile:", error);
    }
  }

  const onInputFileChange = () => {
    let reader = new FileReader();
    reader.readAsDataURL(avatarinputRef.current.files[0]);
    reader.onload = ()=> {
      contextt.dispatch(setAvatarInput((reader.result)));
    };
  }

  useEffect(() => {
    if (currentUser) {
      contextt.dispatch(setAvatarInput(currentUser.photoURL || ''));
      contextt.dispatch(setUsername(currentUser.username || ''));
      setEditColor(currentUser.favColor || '');
      contextt.dispatch(setBio(currentUser.bio || ''));
    }
  }, [currentUser]);

  useEffect(()=>{
    socket.on("refresh_profile", async () => {
      try{
        if(currentUser){
          const fetchUserDataRequest = await axios.get(
            `https://shat-server.onrender.com/api/v1/users/${currentUser.id}`
          );
          contextt.dispatch(setLoggedInUsers(fetchUserDataRequest.data));
        }
      }catch(err){
        console.error('error when trying to refresh profile after updating it' ,err);
      }
    });
  },[socket, currentUser]);

  return (
    <div>
      {!flag ? (
        <LoggedInWarning />
      ) : (
        // section 1: profile <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        <div className="profilePage">
          {!showEditForm ? (
            <>
              <div className="profile-container">
                { currentUser? 
                <div className="profile-flex-content">
                  <div className="avatar-container">
                    <img
                      src={
                        currentUser.photoURL ||
                        "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"
                      }
                      alt="avatar"
                      width={200}
                      style={{boxShadow:`0 0 10px 10px ${currentUser.favColor}`}}
                    />
                    <button
                      className="edit-button"
                      onClick={() => setShowEditForm(true)}
                    >
                      <EditRoundedIcon className="ui-edit" />
                    </button>
                  </div>
                  <div className="pr-username">
                    <p>{currentUser.username}</p>
                  </div>
                  <div className="pr-bio">
                    <p>{currentUser.bio}</p>
                  </div>
                </div> : <CircularProgress style={{ color: '#af8cfb', width:'4vmax', height: '4vmax'}}/>
                }
              </div>
            </>
          ) : (
            // section 2: edit form <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            <>
              <div className="edit-form">
                <form onSubmit={onSubmitFunction}>
                  <div className="form-group form-avatar">
                    <div className="avatar-profile-ph">
                      <img
                        src={ contextt.state.avatarInput ||
                          "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"
                        }
                        className="prof-img"
                        alt="avatar"
                        ref={avatarreviewRef}
                        style={{boxShadow:`0 0 10px 10px ${editColor}`}}
                      />
                      <label htmlFor="upload">Change avatar</label>
                      <input type="file" id="upload" accept="image/*" ref={avatarinputRef} style={{ display: "none" }} onChange={onInputFileChange}/>
                    </div>
                  </div>
                  <div className="two-inputs-flex">
                    <div className="form-group username-input">
                      <label className="pr-form-label" htmlFor="profileUsername">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        id="profileUsername"
                        value={contextt.state.usernameForm}
                        onChange={(e) => {
                          contextt.dispatch(setUsername(e.target.value));
                        }}
                      />
                    </div>
                    <div className="form-group form-color">
                      <label className="pr-form-label" htmlFor="haloColor">Halo color</label>
                      <input
                        type="color"
                        className="form-control"
                        id="haloColor"
                        value={editColor}
                        required
                        onChange={(e) => {
                          setEditColor(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="bio-flex">
                    <label className="pr-form-label" htmlFor="profileBIO">Bio</label>
                    <small>{`${contextt.state.bioForm.length}/${charactersLimitationForBio}`}</small>
                    </div>
                    <textarea
                      type="password"
                      className="form-control"
                      id="profileBIO"
                      value={contextt.state.bioForm}
                      required
                      onChange={(e) => {
                        if(charactersLimitationForBio - e.target.value.length >= 0)contextt.dispatch(setBio(e.target.value));
                      }}
                    ></textarea>
                  </div>
                  <div className="center-elements action-buttons-flex">
                    <button
                      className="btn cancel-btn"
                      onClick={()=>setShowEditForm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn submit-btn"
                      disabled={updatesentFlag}
                    >
                      {!updatesentFlag?
                        'Save' :
                       <CircularProgress style={{color:'#e7e7e7', width:'1.2vmax', height: '1.2vmax'}}/>
                      }
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      )}
      <Snackbar
        style={{backgroundColor:'#af8cfb', borderRadius:'5px'}}
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message="Profile updated successfully"
      />
    </div>
  );
}

export default ProfilePage;
