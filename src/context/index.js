import React, { useEffect, useReducer, useState } from "react";
import { initialState, reducer } from "../store/reducer";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { setLogInStatus, setLoggedInUsers, setParsedToken, setUpdatedUser } from "../store/actions";
import cookie from "react-cookies";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
const socket = io.connect("https://shat-server.onrender.com");

export const appContext = React.createContext();

function ContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const navigate = useNavigate();

  const [tokenCookie, setTokenCookie] = useState(null);
  const [isLoggedInCookie, setIsLoggedInCookie] = useState(null);
  
  const [isUserCreatedSucc, setIsUserCreatedSucc] = useState(false);

  //signed in successfully SnackBar
  const [openSIS, setOpenSIS] = useState(false);
  const handleClickSIS = () => {
    setOpenSIS(true);
  };
  const handleCloseSIS = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSIS(false);
  };

  const signUp = async (userObj) => {
    try {
      const createUser = await axios.post(
        "https://shat-server.onrender.com/signup",
        userObj
      );

      return createUser.status;
    } catch (e) {
      console.error(e);
    }
  };

  const signIn = async (username, password) => {
    try {
      const loginRequest = await axios.post(
        "https://shat-server.onrender.com/signin",
        {},
        {
          headers: {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
          },
        }
      );

      validateToken(loginRequest.data.token);
      return loginRequest.status;
    } catch (e) {
      console.error(e);
    }
  };

  const logOut = () => {
    setLogInStatusfunction(false, null, {});
    dispatch(setParsedToken({}));
    cookie.remove("auth");
    navigate("/");
  };

  const validateToken = (token) => {
    try {
      let validUser = jwtDecode(token);
      setLogInStatusfunction(true, token, validUser);
      cookie.save("auth", token);
      navigate("/");
    } catch (e) {
      console.error("Token Validation Error", e);
    }
  };

  const setLogInStatusfunction = (loggedIn, token, user) => {
    dispatch(setLogInStatus(loggedIn, token, user));
    cookie.save("is_logged_in", loggedIn);
  };

  const setPAredTokenFunction = () => {
    if (tokenCookie) {
      let paredToken = jwtDecode(tokenCookie);
      dispatch(setParsedToken(paredToken));
    } else {
      dispatch(setParsedToken({}));
    }
  };

  const fetchLoggedinUsers = async (id) => {
    try{
      const fetchUserDataRequest = await axios.get(
        `https://shat-server.onrender.com/api/v1/users/${id}`
      );
      dispatch(setLoggedInUsers(fetchUserDataRequest.data));
    }catch(err){
      console.error('getch user info' ,err);
    }
  };

  useEffect(() => {
    const tokenCookieUE = cookie.load("auth");
    const isLoggedInCookieUE = cookie.load("is_logged_in");
    if (tokenCookieUE) setTokenCookie(tokenCookieUE);
    if (isLoggedInCookieUE) setIsLoggedInCookie(JSON.parse(isLoggedInCookieUE));
  }, [cookie.load("auth"), cookie.load("is_logged_in")]);

  useEffect(() => {
    setPAredTokenFunction();
  }, [tokenCookie]);

  useEffect(() => {
    fetchLoggedinUsers(state.parsedToken.id);
    dispatch(setUpdatedUser(!state.userUpdated));
  }, [state.parsedToken]);


  return (
    <appContext.Provider
      value={{
        state,
        dispatch,
        signUp,
        signIn,
        logOut,
        tokenCookie,
        isLoggedInCookie,
        navigate,
        socket,
        isUserCreatedSucc,
        setIsUserCreatedSucc,
        openSIS,
        handleCloseSIS,
        handleClickSIS
      }}
    >
      {props.children}
    </appContext.Provider>
  );
}

export default ContextProvider;
