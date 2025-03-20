import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import moment from 'moment';
import Pusher from 'pusher-js';

export default function ChatIcon() {

      // pusher event 

      const userInfo = JSON.parse(sessionStorage.getItem('user-info'));

      const [subscribedChannels, setSubscribedChannels] = useState([]);
      const [messagesStatusCount , setmessagesStatusCount] = useState([]);

      const [privateChatList , setPrivateChatList] = useState([]);

      const fetchPrivateChatList = async () => {
       
        try{
            const token = sessionStorage.getItem("token");
            const response = await axios.get(`http://localhost:8000/api/messages/${userInfo.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            //setUsers(response.data);
            setPrivateChatList(response.data);
        }
        catch(error){
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(()=>{
        fetchPrivateChatList();
    },[])






      useEffect(() => {
        const pusher = new Pusher('cbaba30792373a5ebca9', {
            cluster: 'ap1'
        });
    
        const newSubscribedChannels = [];
    
        privateChatList.forEach((chat) => {
            if (!newSubscribedChannels.includes(chat.id)) {
                let channel = pusher.subscribe(`chat.${chat.id}`);
    
                channel.bind("App\\Events\\MessageSent", function (data) {
                
                   if (userInfo.id !== data.message.sender_id) {
                    
                    // setLatestMessage(data.message);
                    // setLatestMessageFile(data.file)
    
                    setmessagesStatusCount((prevMessages) => {
                        if (!prevMessages.find(msg => msg.chat_id === data.message.chat_id)) {
                            return [...prevMessages, data.message];
                        }
                        return prevMessages;
                    });
                }
                });
    
               
                newSubscribedChannels.push(chat.id);
            }
        });
    
        setSubscribedChannels(newSubscribedChannels); 
    
    
        return () => {
            privateChatList.forEach((chat) => {
                let channel = pusher.subscribe(`chat.${chat.id}`);
                channel.unbind("App\\Events\\MessageSent");
                pusher.unsubscribe(`chat.${chat.id}`);
            });
        };
        }, [privateChatList]);
    


  return (
    <> 


    {
        messagesStatusCount.length > 0 ?

       <Link to={'/chats'} > <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
        <path d="M240-400h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-4q-37-8-67.5-27.5T600-720H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h404q-4 20-4 40t4 40H160v525l46-45h594v-324q23-5 43-13.5t37-22.5v360q0 33-23.5 56.5T800-240H240L80-80Zm80-720v480-480Zm600 80q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Z"/>
        </svg>  </Link>
        : 

        <Link to={'/chats'} >  <svg className='dark:fill-white ' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M240-400h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/></svg></Link>
    }
   
 
    </>
  )
}
