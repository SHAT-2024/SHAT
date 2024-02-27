import React, { useContext, useEffect, useState } from 'react'
import './UserPage.scss';
import axios from 'axios';
import { appContext } from '../../../../../context';
import LoggedInWarning from '../../../warningPages/LoggedInWarning';
import { useLocation } from 'react-router-dom';
import { setNewUserConversation, setSelectedConversation, setSelectedUserConversation } from '../../../../../store/actions';
import CircularProgress from '@mui/material/CircularProgress';

function USerProfilePage() {
  const contextt = useContext(appContext);
  let flag = contextt.isLoggedInCookie;

  let currentUserYou = contextt.state.loggedInUSer;

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const username = params.get('username');

  const [currentUser, setCurrentUSer] = useState('');

  let navigate = contextt.navigate;

  const fetchUserData = async () => {
    const fetchUserDataRequest = await axios.get(`http://localhost:3001/fetchUserData?username=${username}`);
    setCurrentUSer(fetchUserDataRequest.data);
  }

  const onMessageClick = async () =>{
    const getUserConversationId = await axios.get(`http://localhost:3001/getCoversationId/${currentUserYou.id}/${currentUser.id}`);
    const conversationId = getUserConversationId.data.id;
    if(conversationId){
      await contextt.dispatch(setSelectedUserConversation({receiverName :currentUser.username, receiverAvatar:currentUser.photoURL})); 
      await contextt.dispatch(setSelectedConversation(conversationId));
      navigate(`/chatpage?username=${currentUser.username}`);
    }else { //new user
      await contextt.dispatch(setSelectedUserConversation({})); 
      await contextt.dispatch(setSelectedConversation(0));
      await contextt.dispatch(setNewUserConversation({receiverName :currentUser.username, receiverAvatar:currentUser.photoURL})); 
      navigate(`/chatpage?n_user=yes`);
    }
  }

  useEffect(()=>{
    fetchUserData();
  },[]);

  return (
    <div>{ !flag ?
      <LoggedInWarning /> :
      <div className='profilePage'>
        <div className='profile-container'>
        {!currentUser? <CircularProgress style={{ color: '#af8cfb', width:'4vmax', height: '4vmax'}}/> :
          <div className='profile-flex-content'>
            <div className='avatar-container'>
              <img src={currentUser.photoURL ||'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg'} alt='avatar' style={{boxShadow:`0 0 10px 10px ${currentUser.favColor}`}}/>
            </div>
            <div className="pr-username">
              <h1>{currentUser.username}</h1>
            </div>
            <div className="pr-bio">
              <p>
              {currentUser.bio}
              </p>
            </div>
            <div className='message-button'>
              <button onClick={()=>onMessageClick()}>Message</button>
            </div>
          </div>
          }
        </div>
      </div>
      }
    </div>
  )
}

export default USerProfilePage;