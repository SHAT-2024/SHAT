import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useContext, useEffect, useState } from "react";
import { appContext } from "../../../../../context";
import { setNewUserConversation, setSelectedConversation, setSelectedUserConversation } from "../../../../../store/actions";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import noMatchesImage from '../../../../../Assets/noMatchs.png';
import CircularProgress from '@mui/material/CircularProgress';

function MConversations({ isCurrentUserHasConversations, conversations, setConversations, navigate, IsnewUserConversation, newUSerConv, setToggleConMes, conversationsLoading, handleClickCS }) {
  
    const contextt = useContext(appContext);
    const [arrayForSearch, setArrayForSearch] = useState([]);
  
    let socket = contextt.socket;
    
    let currentUser = contextt.state.loggedInUSer;

    function onSearchConvs(e) {
        if(e.target.value.length>0){
          const ffilteredArray = conversations.filter(conv => {
            if(e.target.value){
            return conv.receiverName.toLowerCase().includes(e.target.value.trim().toLowerCase())
            }
          });
            return ffilteredArray;
          }else{
            return conversations;
        }
      }

    const deleteCoversation = async (convId, receiverName) => {
    try{
        let deleteReq = await axios.delete(`http://localhost:3001/DeleteConversationForACeratinUser/${currentUser.id}/${convId}`);

        if(deleteReq.status===200){

        if(contextt.state.selectedConversation === convId) contextt.dispatch(setSelectedConversation(0));
        if(contextt.state.selectedUserConversation.receiverName === receiverName) contextt.dispatch(setSelectedUserConversation({})); 
        if(contextt.state.newUserConversation.receiverName === receiverName) contextt.dispatch(setNewUserConversation({})); 

        try{
            let updateConversationsReq = await axios.get(`http://localhost:3001/getCurrentUserConversations/${currentUser.id}`);
            let currentUserConversations = updateConversationsReq.data;
            setConversations(currentUserConversations);
            handleClickCS();
        }catch(err){
            console.error('error when updating the conversations after deleting one');
        }
        }

    }catch(err){
        console.error('error when trying to delete a conversation');
    }
    }  
     
    useEffect(()=>{
        setArrayForSearch(conversations);
    },[conversations]);
    
  
    return (
    <div className="m-conversations-container">
        <div className="m-conversation-container-secetion1">
            <div className="m-secetion1-searchbar">
                <SearchRoundedIcon sx={{ fontSize: 30 }} />
                <input placeholder="search..." onChange={(e)=> setArrayForSearch(onSearchConvs(e))}/>
            </div>
        </div>
        

        <div className="m-conversation-container-secetion2">
        {isCurrentUserHasConversations || Object.keys(contextt.state.newUserConversation).length !== 0 ?
            <>
                {IsnewUserConversation && 
                <div className={`m-each-conversation ${contextt.state.selectedConversation===0}`} onClick={()=>{contextt.dispatch(setSelectedUserConversation({})); contextt.dispatch(setSelectedConversation(0)); setToggleConMes(true);}}>
                <div className="m-avatar-username-lastmessage">
                    <img
                    src={newUSerConv.photoURL || "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"}
                    alt="avatar"
                    />
                    <div className="username-lastmessage">
                    <p>{newUSerConv.username}</p>
                    </div>
                </div>
                </div>
                }


                { !conversationsLoading ? <div style={{width:'100%', height:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}><CircularProgress style={{ color: '#e7e7e7', width:'6vmax', height: '6vmax'}}/> </div> :
                arrayForSearch.map(conv=> 
                    { return <div className={`m-each-conversation ${contextt.state.selectedConversation===conv.conversationId}`} onClick={()=>{contextt.dispatch(setSelectedUserConversation({receiverName :conv.receiverName, receiverAvatar:conv.receiverAvatar})); contextt.dispatch(setSelectedConversation(conv.conversationId)); socket.emit("join_room", {username: currentUser.username, convId: conv.conversationId}); setToggleConMes(true)}} key={conv.conversationId}>
                    <div className="m-avatar-username-lastmessage">
                        <img
                        src={conv.receiverAvatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"}
                        alt="avatar"
                        />
                        <div className="m-username-lastmessage">
                        <p>{conv.receiverName}</p>
                        <small className="last-message">{conv.lastSender===currentUser.id? 'you' : conv.receiverName}{`: ${conv.lastMessage}`}</small>
                        </div>
                    </div>
                    <div className="conv-time">
                        <small>{conv.timestamp}</small>
                        <DeleteIcon className="c-delete-button" onClick={(e)=>{e.stopPropagation(); deleteCoversation(conv.conversationId, conv.receiverName);}}/>
                    </div>
                </div>})}   

                { arrayForSearch.length===0 && conversations.length!==0 &&
                <div className="no-matchs">
                <p>No maching results</p>
                <img src={noMatchesImage} alt="no matches"/>
                </div>
                }

                <div className="end-of-conv">
                <p>°</p>
                </div> 
            </>  
            :
            <div className="no-coversations">
                <span>You still have no conversations, how about start one? <u onClick={()=>navigate(`/searchpage`)}>Search page</u></span>
            </div> 
            }
        </div>

    </div>
  )
}

export default MConversations