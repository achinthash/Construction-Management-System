import axios from 'axios'
import React, { useEffect, useState } from 'react'

import moment from 'moment';
import Pusher from 'pusher-js';

import DefaultUser from '../../assets/DefaultUser.png';


export default function PrivateChatList({setSelectedChat,setSelectedChatType}) {


    const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
    const [users , setUsers] = useState([]);
    const [isPrivateChat , setIsPrivateChat] = useState(false);
    const [searchUser , setSearchQuery] = useState("");
    const [privateChatList , setPrivateChatList] = useState([]);

    const [latestMessage , setLatestMessage] = useState([]);
    const [messagesStatusCount , setmessagesStatusCount] = useState([]);
    const [subscribedChannels, setSubscribedChannels] = useState([]);
    const [latestMessageFile , setLatestMessageFile] = useState([]);
    

    const newPrivateChat = async(e) =>{
      // e.preventDefault();
        try{
            const response = await axios.post("http://localhost:8000/api/new-chat", {

                type: "private",
                name: "",
                created_by: userInfo.id,
                user_id: [e.id , userInfo.id]           
            },
            {     
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
            });

            setSelectedChat(response.data.data.id);
            setSelectedChatType("private")

            if(isPrivateChat){
                setIsPrivateChat(!isPrivateChat);
            }

        }
        catch(error){
            console.error("Error fetching user data:", error);
        }
    }

    const fetchUserData = async () => {
       
        try{
            const token = sessionStorage.getItem("token");
            const response = await axios.get("http://localhost:8000/api/users-all", {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
            });

            setUsers(response.data);
        }
        catch(error){
            console.error("Error fetching user data:", error);
        }
    
    };

    useEffect(()=>{
        fetchUserData();
    },[])

    const newPrivateConversation = () =>{
        setIsPrivateChat(!isPrivateChat);
    }

  
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchUser.toLowerCase())
    );

     // fetch private chats 
       
    const fetchPrivateChatList = async () => {
       
        try{
         
            const response = await axios.get(`http://localhost:8000/api/messages/${userInfo.id}`, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
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


    // count the unread chat status 
    const unreadChatCount = (count, chat_id) => {
        const unreadMessages = messagesStatusCount.filter(status => status.chat_id === chat_id);
        return count + unreadMessages.length;
    };
    
    
  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
        cluster: 'ap1'
    });

    const newSubscribedChannels = [];

    privateChatList.forEach((chat) => {
        if (!newSubscribedChannels.includes(chat.id)) {
            let channel = pusher.subscribe(`chat.${chat.id}`);

            channel.bind("App\\Events\\MessageSent", function (data) {
            
               if (userInfo.id !== data.message.sender_id) {
                
                setLatestMessage(data.message);
                setLatestMessageFile(data.file)

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
    }, [privateChatList, userInfo.id]);


  return (
    <div>
         <div className="flex justify-between p-4 bg-gray-100"> 
            <h1 className="text-sm font-semibold  text-black"> Latest Chats</h1>
            <svg onClick={newPrivateConversation} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
        </div>

        {
            isPrivateChat && (
                <div className='absolute flex w-full h-full justify-center items-center  z-10 bg-black bg-opacity-75  inset-0  '> 
                    
                    <div className='bg-gray-100 shadow-md p-2  min-w-[200px] rounded-lg  border border-slate-950 '> 
                       
                       <div className='flex  justify-between p-3 border-b-1 mb-2'> 
                            
                            <h2>New conversation</h2>
                            <svg onClick={newPrivateConversation} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                       
                       </div>

                        <input value={searchUser} onChange={(e)=> setSearchQuery(e.target.value)}  type="text"   placeholder="Search for Contacts "  className="py-1 px-2 border-1  rounded-lg w-full bg-white"/>

                        <div className='max-h-[60vh] overflow-y-auto min-w-20'> 
                            {
                                filteredUsers.map((user)=>(
                                    <div key={user.id} onClick={ () => newPrivateChat(user)}  className="flex items-center justify-between cursor-pointer   bg-slate-300 hover:bg-slate-400  py-2 mb-2 rounded-lg mt-3 ">
                                        <div  className="flex items-center ">  
                                            {    user.profile_picture ? 
                                                <img src={`http://127.0.0.1:8000/storage/${user.profile_picture}`} className="w-8 h-8 rounded-full ml-2" alt="User" /> : 

                                                <img src={DefaultUser} className="w-8 h-8 rounded-full ml-2" alt="User" />
                                            }
                                            <h2 className="text-base font-bold ml-2 mr-2"> {user.name}  </h2>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                    </div>
                </div>
            )
        }

        {
            privateChatList.map((chat)=>(

                <div key={chat.id}  className='p-3 bg-white mb-1 hover:bg-gray-200 cursor-pointer flex w-full rounded-md'>
                    <div className=' flex  items-center justify-center' >
                        
                        {
                            chat.other_member.profile_picture ?
                            <img src={`http://127.0.0.1:8000/storage/${chat.other_member.profile_picture}`} className="w-8 h-8 rounded-full mr-2" alt="User" /> :
                            <img src={DefaultUser} className="w-8 h-8 rounded-full mr-2" alt="User" />
                        }
                       
                    </div> 
                    <div className=' w-full ml-2'>
                    
                        <div className='flex justify-between items-center'> 
                            <span onClick={ () => newPrivateChat(chat.other_member)}   className="text-base font-bold">
                                {chat.other_member.name} 
                            </span>
                       

                            <span> 
                                {chat.unread_count > 0 || messagesStatusCount.length>0?
                                    <span className="flex items-center text-sm justify-center w-5 h-5 text-white bg-red-500 rounded-full">  {unreadChatCount(chat.unread_count,chat.id)}  </span> : null
                                }
                            </span> 

                           
                        </div>
                        
                        {/* shows the latest message  */}
                        <div className='flex justify-between items-center '> 
                        
                            <div className=' text-xs ' >{latestMessage.chat_id === chat.id ? 
                            
                            latestMessage.message?

                            <span> {latestMessage.message} </span> :

                             
                            <span className='flex items-center '> <svg className='mr-2' xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"/></svg>  {latestMessageFile.file_name} </span> :
                            
                            chat.last_message.message? 
                            
                            <span> {chat.last_message.message} </span> :
                            <span className='flex items-center '> <svg className='mr-2' xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"/></svg>  {chat.latest_message_file.file_name } </span> 

                            }</div> 
                          
                            {latestMessage.chat_id === chat.id ? 
                            <p className=' text-xs'> {moment(latestMessage.created_at).format("h:mm A")} </p>  :
                            <p className=' text-xs'> {moment(chat.last_message.created_at).format("h:mm A")} </p> }
                        
                        </div> 
                    </div> 
                </div>

            ))
        } 

    </div>
  )
}
