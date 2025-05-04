import React, { useEffect, useState } from 'react'
import NavigationBar from '../NavigationBar';
import DefaultChatBox from './DefaultChatBox';

import PrivateChatList from './PrivateChatList';
import GroupList from './GroupList';

import ChatHead from './ChatHead';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

export default function Chat() {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));

  const [selectedChat, setSelectedChat] = useState("");
  const [selectedChatType, setSelectedChatType] = useState("");
  const [showChatBox, setShowChatBox] = useState(false);
  const [showUserList, setShowUserList] = useState(true);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);


  const handleSelectedChat = (user) => {
    setSelectedChat(user);
    setShowChatBox(true);
    setShowUserList(false); 
  };

  const handleChatType = (type) => {
    setSelectedChatType(type);
  };

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setScreenWidth(newWidth);

      if (newWidth > 800) {
        setShowChatBox(true);
        setShowUserList(true);
      } else {
        setShowUserList(!selectedChat); 
        setShowChatBox(!!selectedChat); 
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); 

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [selectedChat]);

  

  // go back to user list
  const handleBackToList = () => {
    setShowUserList(true);
    setShowChatBox(false); 
    setSelectedChat("")
    
  };
 

  return (
    <>
        <NavigationBar />

        <div className='grid grid-cols-5  '> 

          { /* back button */ }

          {screenWidth <= 800 && selectedChat && (
           <div className='relative '> 
                 <svg className=' z-10 absolute top-4 left-1 ' onClick={handleBackToList} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/></svg>
            </div>
          )}


          {
            showUserList && (
             <div className={`bg-slate-200 h-full ${screenWidth < 800 ? "col-span-5" : "col-span-1" }`  } >
              
             
              <PrivateChatList setSelectedChat={handleSelectedChat} setSelectedChatType={handleChatType} />
              
              <GroupList setSelectedChat={handleSelectedChat} setSelectedChatType={handleChatType} />
            </div>  
            )
          }

          {
            showChatBox && (
              <div className={`${screenWidth > 800 ? "col-span-4": selectedChat? "col-span-5" : "hidden"}`} >
                  
                  {
                    selectedChat ? 

                    <div className="flex flex-col h-[90vh]" > 

                      <ChatHead  selectedChat={selectedChat} userInfo={userInfo} selectedChatType={selectedChatType} />

                      <ChatMessages selectedChat={selectedChat} userInfo={userInfo} selectedChatType={selectedChatType}/>

                      <ChatInput selectedChat={selectedChat} userInfo={userInfo} selectedChatType={selectedChatType}/>
                    </div>
                    :

                    <div className={` ` }> 
                      <DefaultChatBox />
                    </div>
                  
                  }
                </div>
            )
          }

          

        </div>
        

       
    </>
  )
}



