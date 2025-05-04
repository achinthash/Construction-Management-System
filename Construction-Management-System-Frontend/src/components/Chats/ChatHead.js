import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DefaultUser from '../../assets/DefaultUser.png'

export default function ChatHead(props) {

    const [chatName , setChatName] = useState("");
    const [chatAvatar, setChatAvatar] = useState(null)

    const [token, setToken] = useState(sessionStorage.getItem("token") || "");

    const fetchChatHead = async() =>{

        try{
            const response = await axios.get(`http://127.0.0.1:8000/api/chat-head/${props.selectedChat}` ,{
                headers: { Authorization: `Bearer ${token}` }
            });

            // set chat name 
            if (response.data.type === 'private') {
                if (props.userInfo.id === response.data.users[0].id) {
                    setChatName(response.data.users[1].name);
                    setChatAvatar(response.data.users[1].profile_picture);
                } else {
                    setChatName(response.data.users[0].name);
                    setChatAvatar(response.data.users[0].profile_picture);
                }
            }
            

            if(response.data.type == 'group'){

                setChatName(response.data.name);
                setChatAvatar(response.data.avatar);
            }

        }
        catch(error){
            console.error(error);
        }
    }

    useEffect(()=>{

        if(props.selectedChat){
            fetchChatHead();
        }

    },[props.selectedChat])


  return (
    <div className="bg-blue-600 text-white p-3 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4 ml-2">
        
                {
                    chatAvatar ?
                        <img src={`http://127.0.0.1:8000/storage/${chatAvatar}`} className="w-8 h-8 rounded-full ml-2" alt="User" /> : 
                        <img src={DefaultUser} className="w-8 h-8 rounded-full ml-2" alt="User" />
                }
                <h1 className="font-bold"> {chatName}  </h1>
        
            </div>
        
        </div>

    </div>
  )
}
