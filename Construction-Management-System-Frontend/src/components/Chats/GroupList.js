import axios from 'axios'
import React, { useEffect, useState } from 'react';
import NewGroup from './NewGroup';
import moment from 'moment';
import Pusher from 'pusher-js';

import DefaultUser from '../../assets/DefaultUser.png';

export default function GroupList({setSelectedChat,setSelectedChatType}) {

    const userInfo = JSON.parse(sessionStorage.getItem('user-info'));

    const [groupList , setGroupsList] = useState([]);
    const [subscribedChannels, setSubscribedChannels] = useState([]);
    const [latestMessage , setLatestMessage] = useState([]);
    const [latestMessageFile , setLatestMessageFile] = useState([]);
       
    const groupLists = async () => {
       
        try{
            const token = sessionStorage.getItem("token");
            const response = await axios.get(`http://localhost:8000/api/groups/${userInfo.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

          
            setGroupsList(response.data);
        }
        catch(error){
            console.error("Error fetching user data:", error);
        }
    
    };

    useEffect(()=>{
        groupLists();
    },[])


    const SelectedGroup = (groupId) =>{
       
        if(groupId){
            setSelectedChat(groupId);
            setSelectedChatType("group");
        }
     
    }

    const [isNewGroup , setIsNewGroup] = useState(false);

    const newGroup = () =>{
        setIsNewGroup(!isNewGroup);
    }


    useEffect(()=>{

        const pusher = new Pusher('cbaba30792373a5ebca9', {
            cluster: 'ap1'
        });

        const newSubscribedChannels = [];

        groupList.forEach((chat)=>{

            if (!newSubscribedChannels.includes(chat.id)) {
                let channel = pusher.subscribe(`chat.${chat.id}`);
    
                channel.bind("App\\Events\\MessageSent", function (data) {
                 
                 
                  setLatestMessage(data.message);
                  setLatestMessageFile(data.file)
                });
    
               
                newSubscribedChannels.push(chat.id);
            }
            
        })

        setSubscribedChannels(newSubscribedChannels); 


        return () => {
            groupList.forEach((chat) => {
                let channel = pusher.subscribe(`chat.${chat.id}`);
                channel.unbind("App\\Events\\MessageSent");
                pusher.unsubscribe(`chat.${chat.id}`);
            });
        };

    },[groupList])


  return (
    <div>


        <div className="flex justify-between p-4 bg-gray-100"> 
            <h1 className="text-sm font-semibold  text-black"> Group Chats</h1>
            <svg onClick={newGroup} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
        </div>



        {
            groupList.map((chat)=>(

                <div key={chat.id} onClick={()=>SelectedGroup(chat.id)} className='p-3 bg-white mb-1 hover:bg-gray-200 cursor-pointer flex w-full rounded-md'>
                    <div className=' flex  items-center justify-center' >

                        {
                            chat.avatar ? 
                            <img src={`http://127.0.0.1:8000/storage/${chat.avatar}`} className="w-8 h-8 rounded-full mr-2" alt="User" /> 
                            :
                            <img src={DefaultUser} className="w-8 h-8 rounded-full mr-2" alt="User" />
                        }
                        
                    </div> 
                    <div className=' w-full ml-2'>
                    
                        <div className='flex justify-between items-center'> 
                            <span    className="text-base font-bold">
                                {chat.name}
                            </span>
                            
                        </div>
                        
                        <div className='flex justify-between items-center '> 
                        
                            <p className=' text-xs' >{latestMessage.chat_id === chat.id ? 
                            
                            latestMessageFile?.file_name || latestMessage?.message  || null 
                            : chat.latest_message?.message || "" }</p> 

                            {latestMessage.chat_id === chat.id ? 
                            <p className=' text-xs'> {moment(latestMessage.created_at).format("h:mm A")} </p> 
                            : chat.latest_message ?
                            <p className=' text-xs'> {moment(chat.latest_message.created_at).format("h:mm A")} </p> : ""
                            }

                        </div>


                        

                    </div> 
                </div>

            ))
            } 



            
        {isNewGroup && (
            <div className='flex absolute inset-0 items-center justify-center  z-10 bg-black bg-opacity-75 '> 

                <div className=' bg-violet-100 shadow-md p-4  min-w-[200px] rounded-lg  border border-slate-950 '> 
                    <div className='flex justify-between mb-2 items-center '> 
                        <h2 className='font-bold text-base'>Create New Group</h2>
                        <svg onClick={newGroup} xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#000000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                    </div>  
                    <NewGroup />
                </div>
            </div>
            
        )}
    </div>
  )
}
