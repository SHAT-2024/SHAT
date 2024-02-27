import React, { useContext, useEffect, useState } from "react";
import { appContext } from "../../../../context";
import LoggedInWarning from "../../warningPages/LoggedInWarning";
import "./ChatPage.scss";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Conversations from "./Conversations";
import Chats from "./Chats";
import MobileCon from "./mobile";
import Snackbar from '@mui/material/Snackbar';

function ChatPage() {

  const contextt = useContext(appContext);
  let flag = contextt.isLoggedInCookie;

  //coversaton deleted Snackbar
  const [openCS, setOpenCS] = useState(false);
  const handleClickCS = () => {
    setOpenCS(true);
  };
  const handleCloseCS = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenCS(false);
  };

  //message deleted Snackbar
  const [openMDS, setOpenMDS] = useState(false);
  const handleClickMDS = () => {
    setOpenMDS(true);
  };
  const handleCloseMDS = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenMDS(false);
  };

  //message edited Snackbar
  const [openMES, setOpenMES] = useState(false);
  const handleClickMES = () => {
    setOpenMES(true);
  };
  const handleCloseMES = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenMES(false);
  };

  let currentUser = contextt.state.loggedInUSer;

  let navigate = contextt.navigate;
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const IsnewUserConversationParam = params.get('n_user');

  const [isWidth672, setIsWidth672] = useState(window.innerWidth >= 672);

  const [IsnewUserConversation, setIsnewUserConversation] = useState(IsnewUserConversationParam);
  const [isCurrentUserHasConversations, setIsCurrentUserHasConversations] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setconversationsLoading] = useState(false);

  const [newUSerConv, setNewUSerConv] = useState({});

  const checkIfTheCurrentUserHasConversations = async () => {
    try{
      let checkReq = await axios.get(`https://shat-server.onrender.com/IsCurrentUserHasAnyConversations/${currentUser.id}`);
      let doesCurrentUserHasConversations = checkReq.data;
      setIsCurrentUserHasConversations(doesCurrentUserHasConversations);
    }catch(err){
      console.error('error when check if the user has conversations');
    }
  }
  
  const getCurrentUserConversations = async () =>{
    try{
      setconversationsLoading(false);
      let checkReq = await axios.get(`https://shat-server.onrender.com/getCurrentUserConversations/${currentUser.id}`);
      let currentUserConversations = checkReq.data;
      setConversations(currentUserConversations);
      setconversationsLoading(true);
    }catch(err){
      console.error('error when check if the user has conversations');
    }
  }

  useEffect(() => {
    if (Object.keys(contextt.state.loggedInUSer).length !== 0) {
      console.error('refreshed!', contextt.state.parsedToken.username);
      checkIfTheCurrentUserHasConversations();
      getCurrentUserConversations();
    }
  }, [contextt.state.loggedInUSer]);


  useEffect(()=>{
    async function fetchData() {
      if(IsnewUserConversation && contextt.state.newUserConversation){
        const fetchUserDataRequest = await axios.get(`https://shat-server.onrender.com/fetchUserData?username=${contextt.state.newUserConversation.receiverName}`);
        const data = fetchUserDataRequest.data;
        setNewUSerConv(data);
      }
    }
    fetchData();
  },[IsnewUserConversation, contextt.state.newUserConversation]);

  useEffect(() => {
    const handleResize = () => {
      setIsWidth672(window.innerWidth >= 672);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      {!flag ? (
        <LoggedInWarning />
      ) : (
        <div className="chatPage">
          
        {isWidth672 ?
          <div className="chats-and-conversations-container">
            <Conversations isCurrentUserHasConversations={isCurrentUserHasConversations} conversations={conversations} navigate={navigate} setConversations={setConversations} IsnewUserConversation={IsnewUserConversation} newUSerConv={newUSerConv} conversationsLoading={conversationsLoading} handleClickCS={handleClickCS}/>

            <Chats isCurrentUserHasConversations={isCurrentUserHasConversations} navigate={navigate} IsnewUserConversation={IsnewUserConversation} newUSerConv={newUSerConv} setConversations={setConversations} setIsnewUserConversation={setIsnewUserConversation} handleClickMDS={handleClickMDS} handleClickMES={handleClickMES}/>
          </div> 
          :
          // mobile
          <MobileCon isCurrentUserHasConversations={isCurrentUserHasConversations} conversations={conversations} navigate={navigate} setConversations={setConversations} IsnewUserConversation={IsnewUserConversation} newUSerConv={newUSerConv}setIsnewUserConversation={setIsnewUserConversation} conversationsLoading={conversationsLoading} handleClickCS={handleClickCS} handleClickMDS={handleClickMDS} handleClickMES={handleClickMES}/>
        }
        </div>
      )}

      <Snackbar
        style={{backgroundColor:'#af8cfb', borderRadius:'5px'}}
        open={openCS}
        autoHideDuration={5000}
        onClose={handleCloseCS}
        message="Conversation deleted"
      />
      <Snackbar
        style={{backgroundColor:'#af8cfb', borderRadius:'5px'}}
        open={openMDS}
        autoHideDuration={5000}
        onClose={handleCloseMDS}
        message="Your message is deleted"
      />
      <Snackbar
        style={{backgroundColor:'#af8cfb', borderRadius:'5px'}}
        open={openMES}
        autoHideDuration={5000}
        onClose={handleCloseMES}
        message="Your message has been updated"
      />
    </div>
  );
}

export default ChatPage;
