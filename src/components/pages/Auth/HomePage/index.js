import React, { useContext } from "react";
import "./HomePage.scss";
import { appContext } from "../../../../context";
import Snackbar from '@mui/material/Snackbar';

function HomePage() {

  const contextt = useContext(appContext);
  let navigate = contextt.navigate;
  let openSIS = contextt.openSIS;
  let handleCloseSIS = contextt.handleCloseSIS;


  return (
    <div className="homepage">
      <div className="homepage-flex">
        <p id="heading">Welcome {contextt.state.parsedToken.username}</p>

        <div className="features-container">
          <div className="feature" onClick={()=>navigate('/searchpage')}>
            <div className="words-container">
              <p id="subHeading">Search</p>
              <p id="text">Search for uers or browse the suggested users</p>
            </div>
          </div>

          <div className="feature" onClick={()=>navigate('/chatpage')}>
            <div className="words-container">
              <p id="subHeading">Messages</p>
              <p id="text">See your conversations and talk with other users</p>
            </div>
          </div>

          <div className="feature" onClick={()=>navigate('/profilepage')}>
            <div className="words-container">
              <p id="subHeading">Profile</p>
              <p id="text">Check your profile and edit your information</p>
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        style={{backgroundColor:'#af8cfb', borderRadius:'5px'}}
        open={openSIS}
        autoHideDuration={5000}
        onClose={handleCloseSIS}
        message="Signed in Successfully"
      />
    </div>
  );
}

export default HomePage;
