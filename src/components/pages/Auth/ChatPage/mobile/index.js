import React, { useState } from "react";
import "./mobileChat.scss";
import MConversations from "./MConversations";
import MChats from "./MChats";

function MobileCon({ isCurrentUserHasConversations, conversations, setConversations, navigate, IsnewUserConversation, newUSerConv, setIsnewUserConversation, conversationsLoading, handleClickCS, handleClickMDS, handleClickMES}) {

  const [toggleConMes, setToggleConMes] = useState(false);

  return (
    <div className="m-chats-and-conversations-container">
        {!toggleConMes?
            <MConversations isCurrentUserHasConversations={isCurrentUserHasConversations} conversations={conversations} navigate={navigate} setConversations={setConversations} IsnewUserConversation={IsnewUserConversation} newUSerConv={newUSerConv} setToggleConMes={setToggleConMes} conversationsLoading={conversationsLoading} handleClickCS={handleClickCS}/>

            :

            <MChats isCurrentUserHasConversations={isCurrentUserHasConversations} navigate={navigate} IsnewUserConversation={IsnewUserConversation} newUSerConv={newUSerConv} setConversations={setConversations} setIsnewUserConversation={setIsnewUserConversation} setToggleConMes={setToggleConMes} handleClickMDS={handleClickMDS} handleClickMES={handleClickMES}/>
        }
    </div>
  );
}

export default MobileCon;
