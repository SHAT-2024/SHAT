import React, { useContext } from "react";
import { Link } from "react-router-dom";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import MarkunreadIcon from '@mui/icons-material/Markunread';
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import "./NavBarMenu.scss";
import { appContext } from "../../../../context";
import LogOutModal from "./LogOutModal";

function NavBarMenu() {
  const contextt = useContext(appContext);
  let currentUser = contextt.state.loggedInUSer;

  const setIsUserCreatedSucc = contextt.setIsUserCreatedSucc;
  const navigate = contextt.navigate;


  return (
    <div>
      {!contextt.isLoggedInCookie ? (
        <div className="registration">
          <button onClick={()=>{setIsUserCreatedSucc(false); navigate(`/registeration`);}}>Sign up</button>
          <button onClick={()=>{setIsUserCreatedSucc(true); navigate(`/registeration`);}}>Sign in</button>
        </div>
      ) : (
        <div className="navbar-menu">
          <div>
            <Link to={"/"}>
              <HomeRoundedIcon className="navbar-element" />
            </Link>
          </div>
          <div>
            <Link to={"/searchpage"}>
              <SearchRoundedIcon className="navbar-element" />
            </Link>
          </div>
          <div>
            <Link to={"/chatpage"}>
            <MarkunreadIcon className="navbar-element" />
            </Link>
          </div>          
          <div>
            <Link to={"/profilepage"}>
            <img src={currentUser.photoURL || "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"} alt="avatar" />
            </Link>
          </div>
          <LogOutModal contextt={contextt}/>
        </div>
      )}
    </div>
  );
}

export default NavBarMenu;
