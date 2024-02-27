import React, { useContext, useEffect, useState } from "react";
import LoggedInWarning from "../../warningPages/LoggedInWarning";
import { appContext } from "../../../../context";
import "./SearchPage.scss";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import AutosuggestExample from "./AutosuggestExample";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';

function SearchPage() {
  const contextt = useContext(appContext);
  let flag = contextt.isLoggedInCookie;
  let navigate = contextt.navigate;

  const [RandomUsers, setRandomUsers] = useState([]);
  const [allusers, setAllUsers] = useState([]);
  const [showLoading, setShowLoading] = useState(false);

  const getRandomUsers = async (currentUserUsername) => {
    try {
      setShowLoading(true);
      const getRandomUsersReq = await axios.get("http://localhost:3001/getRandomUsers");
      const fetchedData = getRandomUsersReq.data;
      if(getRandomUsersReq.status === 200){
        const allRandomUsers = fetchedData.filter((users) => {
          if (users && users.username) {
            return users.username.toLowerCase() !== currentUserUsername.toLowerCase();
          }
          return false;
        });
        
        if (allRandomUsers.length === 5) allRandomUsers.pop();
        setRandomUsers(allRandomUsers);
        setShowLoading(false);
      }else console.error("Error fetching random users in seach page");
    } catch (error) {
      console.error("Error fetching random users in seach page :", error);
    }
  };

  const getAllUsers = async (currentUserUsername) => {
    try {
      const getAllUsersReq = await axios.get("http://localhost:3001/api/v1/users");
      const fetchedData = getAllUsersReq.data;
  
      const allUsersFiltered = fetchedData.filter((users) => {
        if (users && users.username) {
          return users.username.toLowerCase() !== currentUserUsername.toLowerCase();
        }
        return false;
      });
  
      setAllUsers(allUsersFiltered);

    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  };


  useEffect(() => {
    getRandomUsers(contextt.state.parsedToken.username);
    getAllUsers(contextt.state.parsedToken.username);
  }, []);
  
  useEffect(() => {
    if (contextt.state.parsedToken.username !== undefined) {
      getRandomUsers(contextt.state.parsedToken.username);
      getAllUsers(contextt.state.parsedToken.username);
    }
  }, [contextt.state.parsedToken.username]);

  return (
    <div>
      {!flag ? (
        <LoggedInWarning />
      ) : (
        <div className="searchPage">
          <div className="search-content-container">
            <div className="searchPage-flex">
              <div className="sp-section-1">
                <p id="heading">Search for users</p>
                <div className="search-bar">
                  <SearchRoundedIcon sx={{ fontSize: '2.3vmax' }} />
                  <AutosuggestExample allusers={allusers} navigate={navigate}/>
                </div>
              </div>
              <div className="sp-section-2">
                <div className="browse-user-flex">
                  <p id="heading">Suggested users</p>
                  <button onClick={() => getRandomUsers(contextt.state.parsedToken.username)}>
                    <RefreshRoundedIcon sx={{ fontSize: '3vmax' }}/>
                  </button>
                </div>
                <div className="browse-user-users">
                  {showLoading ? <CircularProgress style={{color:'#af8cfb', width:'3vmax', height: '3vmax'}}/> :                  
                  RandomUsers.map((user) => (
                    <div className="bu-element" onClick={()=>navigate(`/userProfilepage?username=${user.username}`)} key={user.id}>
                      <img
                        src={
                          user.photoURL ||
                          "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"
                        }
                        alt="avatar"
                      />
                      <p>{user.username}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
