import React, { useCallback, useContext, useEffect, useState } from 'react';
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import axios from 'axios';
import { appContext } from '../../../../context';
import { setSelectedConversation, setSelectedUserConversation } from '../../../../store/actions';
import ScrollToBottom from 'react-scroll-to-bottom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CircularProgress from '@mui/material/CircularProgress';


function Chats({isCurrentUserHasConversations, navigate, IsnewUserConversation, newUSerConv, setConversations, setIsnewUserConversation, handleClickMDS, handleClickMES}) {
    
  const contextt = useContext(appContext);
  let currentUser = contextt.state.loggedInUSer;

  const [messages, setMesages] = useState([]);
  const [userInputMessage, setUserInputMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editMessageInput, setEditMessageInput] = useState('');
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [isUserTyping, setisUserTyping] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [theUserWhoIsTyping, setTheUserWhoIsTyping] = useState('');
  const [sentRoomId, setTheSentRoomId] = useState(0);

  let socket = contextt.socket;

  const getSelectedConversationMessages = useCallback(async () =>{
    if(contextt.state.selectedConversation){
      try{
        setMessagesLoading(false);
        let checkReq = await axios.get(`https://shat-server.onrender.com/getAllMessagesInConversation/${contextt.state.selectedConversation}`);
        let currentUserMessages = checkReq.data.messages;
        setMesages(currentUserMessages);
        setMessagesLoading(true);
      }catch(err){
        console.error('error when getting the conversations messages');
      }
    }else{
      console.log('selectedConversation not truthy', contextt.state.selectedConversation);
    }
  },[contextt.state.selectedConversation])


  const onSendingMessage= async ()=> {
    try{
      if(userInputMessage !== ''){
       
        let currentUserId = currentUser.id;

        const messgDetails = {
          senderID: currentUserId,
          conversationID: contextt.state.selectedConversation,
          content: userInputMessage
        }
      
      setIsMessageSent(true);
      await axios.post(`https://shat-server.onrender.com/api/v1/messages`, messgDetails);
      
      socket.emit("send_message", {username: currentUser.username, room: contextt.state.selectedConversation});
            
      getSelectedConversationMessages();

      let checkReq = await axios.get(`https://shat-server.onrender.com/getCurrentUserConversations/${currentUser.id}`);
      let currentUserConversations = checkReq.data;
      setConversations(currentUserConversations);


      setUserInputMessage('');
      setIsMessageSent(false);
    }
  }catch(err){
    console.error('error while sending message')
  }
  }

  const onSendingMessageNewConversation= async ()=> {
    try{
    if(userInputMessage !== ''){
      const getRecieveruserId = await axios.get(`https://shat-server.onrender.com/fetchUserData?username=${contextt.state.newUserConversation.receiverName}`);
      let recieverUserData = getRecieveruserId.data;
      let currentUserId = currentUser.id;
      
      const createConversation = await axios.post(`https://shat-server.onrender.com/createConversation/${currentUserId}/${recieverUserData.id}`);

      let newConversationId = createConversation.data.id;
      
      const messgDetails = {
        senderID: currentUserId,
        conversationID: newConversationId,
        content: userInputMessage
      }
      
      setIsMessageSent(true);
      await axios.post(`https://shat-server.onrender.com/api/v1/messages`, messgDetails);

      let checkReq = await axios.get(`https://shat-server.onrender.com/getCurrentUserConversations/${currentUserId}`);
      let currentUserConversations = checkReq.data;
      setConversations(currentUserConversations);

      contextt.dispatch(setSelectedUserConversation({receiverName: recieverUserData.username, receiverAvatar: recieverUserData.photoURL})); contextt.dispatch(setSelectedConversation(newConversationId));
      setIsnewUserConversation(false);
      setUserInputMessage('');
      setIsMessageSent(false);
    }
    }catch(err){
      console.error('error while sending message')
    }
  }

  const formatDateFun = (date) =>{
    const dateTS = new Date(date);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const day = dateTS.getDate();
    const month = months[dateTS.getMonth()];
    const year = dateTS.getFullYear();
    const hours = dateTS.getHours() % 12 || 12;
    const minutes = dateTS.getMinutes();
    const period = dateTS.getHours() >= 12 ? 'PM' : 'AM';
    
    const formattedDate = `${day} ${month} ${year} ${hours}:${minutes}${period}`;
    return formattedDate;
  }

  const deleteMessage = async (id) =>{
    try{
      let deleteReq = await axios.delete(`https://shat-server.onrender.com/api/v1/messages/${id}`);

      if(deleteReq.status===204){
        getSelectedConversationMessages();
        socket.emit("send_message", {username: currentUser.username, room: contextt.state.selectedConversation});

        let checkReq = await axios.get(`https://shat-server.onrender.com/getCurrentUserConversations/${currentUser.id}`);
        let currentUserConversations = checkReq.data;
        setConversations(currentUserConversations);
        handleClickMDS();
      }else{
        console.error('error while trying to delete a message')
      }
    }catch(err){
      console.error('error while trying to delete a message');
    }
  }

  const editMessage = async (id) =>{
    try{

      let obj = {
        content: editMessageInput
      };

      if(editingMessageId && editMessageInput!==''){
        let editReq = await axios.patch(`https://shat-server.onrender.com/api/v1/messages/${id}`, obj);
        if(editReq.status === 203){
          setEditingMessageId(null);

          getSelectedConversationMessages();
          socket.emit("send_message", {username: currentUser.username, room: contextt.state.selectedConversation});
  
          let checkReq = await axios.get(`https://shat-server.onrender.com/getCurrentUserConversations/${currentUser.id}`);
          let currentUserConversations = checkReq.data;
          setConversations(currentUserConversations);
          handleClickMES();
        }else{
          console.error('error while trying to edit a message')
        }
      }
    }catch(err){
      console.error('error while trying to edit a message');
    }
  }

  useEffect(()=>{
    socket.on("receive_message", async (payload) => {
      const covid =  payload.room;
      setTheSentRoomId(covid);
      
      let checkReq = await axios.get(`https://shat-server.onrender.com/getCurrentUserConversations/${currentUser.id}`);
      let currentUserConversations = checkReq.data;
      setConversations(currentUserConversations);
      
      setisUserTyping(false);
      setTheSentRoomId(0);
      
      //sol 1
      // the problem is contextt.state.selectedConversation always has the same value of the sent room in the following line:
      // const flag = parseInt(contextt.state.selectedConversation)===parseInt(payload.room);
      // console.log('slected conversation: ', payload.room, '- conversation from socket server: ', payload.room);
      // console.log('chat opened? ', flag);
      // if(flag) {
      //   getSelectedConversationMessages();
      // }
      
    });

    socket.on("received_is_typing", async (payload) => {
      setisUserTyping(true);
      setTheUserWhoIsTyping(payload.username);
    });

    socket.on("received_stopped_typing", async (payload) => {
      setisUserTyping(false);
      setTheUserWhoIsTyping(payload.username);
    });

  },[socket,currentUser,setConversations]);

  //sol 2
  useEffect(()=>{
    if(sentRoomId === contextt.state.selectedConversation) getSelectedConversationMessages();
  },[socket, sentRoomId, contextt.state.selectedConversation, getSelectedConversationMessages]);  

  useEffect(()=>{
    getSelectedConversationMessages();
  },[contextt.state.selectedConversation, getSelectedConversationMessages]);  


  return (
    <div className="chat-container">
    
    { isCurrentUserHasConversations || Object.keys(contextt.state.newUserConversation).length !== 0 ?
    
    <>
    {/*frist condition //////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
    {contextt.state.selectedConversation && contextt.state.selectedUserConversation? 
    <>
      <div className="chat-head">
        <div className='head-username-avatar' onClick={()=>navigate(`/userProfilepage?username=${contextt.state.selectedUserConversation.receiverName}`)}>
        <img
          src={contextt.state.selectedUserConversation.receiverAvatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"}
          alt="avavtar"
        />
        <p>{contextt.state.selectedUserConversation.receiverName}</p>
        </div>
      </div>

      <div className="chat-body">
        {!messagesLoading? <div style={{width:'100%', height:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}><CircularProgress style={{ color: '#e7e7e7', width:'4vmax', height: '4vmax'}}/> </div> : 

        <ScrollToBottom className='scrollerdown'>
          { messages &&
              messages.map(message => {
                
                const isEditing = editingMessageId === message.id;
                  
                  if(message.senderID === currentUser.id){
                      return <div className="sender-message" key={message.id}>
                      <div className='message-edit-flex'>
                        <div className="sender"> 
                            { !isEditing? <p>{message.content}</p> :
                            <div className='edit-form-cont'>
                              <input type='text' value={editMessageInput} onChange={(e)=>setEditMessageInput(e.target.value)}/>
                              <div className='e-buttons'>
                                <button className='e-ok-button' onClick={()=>{editMessage(message.id);}}>OK</button>
                                <button className='e-cancel-button' onClick={()=>{setEditingMessageId(null); setEditMessageInput('');}}>Cancel</button>
                              </div>
                            </div>}
                        </div>
                        {!isEditing && <div className='message-edit'>
                          <EditIcon className='m-edit-button' onClick={()=>{setEditingMessageId(message.id); setEditMessageInput(message.content);}}/>
                          <DeleteIcon className='m-delete-button' onClick={()=>{deleteMessage(message.id)}}/>
                        </div>}
                      </div>
                        <div className="chat-time">
                          <small>{formatDateFun(message.createdAt)}</small>
                        </div>
                    </div>
                  }else{
                      return <div className="receiver-message" key={message.id}>
                      <div className="receiver">
                          <p>{message.content}</p>
                      </div>
                      <div className="chat-time">
                      <small>{formatDateFun(message.createdAt)}</small>
                      </div>
                  </div>
                  }
              })
          }
          {isUserTyping && theUserWhoIsTyping===contextt.state.selectedUserConversation.receiverName && 
          <div className="receiver-message">
            <div className="receiver">
                <div class="typingIndicatorBubble">
                  <div class="typingIndicatorBubbleDot"></div>
                  <div class="typingIndicatorBubbleDot"></div>
                  <div class="typingIndicatorBubbleDot"></div>
                </div>
            </div>
          </div>
          }
          
        </ScrollToBottom>}
      </div>

      <div className="chat-input-bar">
        <div className="send-bar-input-button">
          <input placeholder="type..." value={userInputMessage} onChange={(e)=>{setUserInputMessage(e.target.value); if(e.target.value!=='')socket.emit("is_typing", {username: currentUser.username, room: contextt.state.selectedConversation}); if(e.target.value==='')socket.emit("stopped_typing", {username: currentUser.username, room: contextt.state.selectedConversation});}} onKeyPress={(e)=>{if(e.key === 'Enter')onSendingMessage()}} />
          { isMessageSent? 
          <CircularProgress style={{ color: '#af8cfb', width:'2vmax', height: '2vmax'}}/> 
          :
          <button onClick={onSendingMessage}>
            <SendRoundedIcon sx={{ fontSize:'2.5vmax' }} />
          </button>}
        </div>
      </div>
      
      {/*second condition //////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
      </>
      : Object.keys(contextt.state.newUserConversation).length !== 0? 
      <>
      <div className="chat-head">
        <div className='head-username-avatar' onClick={()=>navigate(`/userProfilepage?username=${contextt.state.newUserConversation.receiverName}`)}>
        <img
          src={contextt.state.newUserConversation.receiverAvatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"}
          alt="avavtar"
        />
        <p>{contextt.state.newUserConversation.receiverName}</p>
        </div>
      </div>

      <div className="chat-body-for-newCon">
        <small>You are starting a new conversation with {contextt.state.newUserConversation.receiverName}</small>
      </div>

      <div className="chat-input-bar">
        <div className="send-bar-input-button">
          <input placeholder="type..." value={userInputMessage} onChange={(e)=>setUserInputMessage(e.target.value)} onKeyPress={(e)=>{if(e.key === 'Enter')onSendingMessageNewConversation()}}/>
          { isMessageSent? 
          <CircularProgress style={{ color: '#af8cfb', width:'2vmax', height: '2vmax'}}/> 
          :
          <button onClick={onSendingMessageNewConversation}>
            <SendRoundedIcon sx={{ fontSize:'2.5vmax' }} />
          </button>}
        </div>
      </div>
      </>
      :
      <>
        <div className="chat-head-no-co-selc">
        </div>
        <div className="chat-body-no-co-selc">
          <p>No conversation selected</p>
        </div>
      </> 
    }
      </>
    :
    <>
      <div className="chat-head-no-co-selc">
      </div>
      <div className="chat-body-no-co-selc">
        <p>No conversation selected</p>
      </div>
    </> 
    }
  </div>
  )
}

export default Chats;