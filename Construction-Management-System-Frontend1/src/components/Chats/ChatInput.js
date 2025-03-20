import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function ChatInput(props) {


    const [token, setToken] = useState(sessionStorage.getItem("token") || "");

    const [files , setFiles] = useState(null);

    const [newMessage , setNewMessage] = useState("")


  
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFiles(file);
        }
    };
    


    const sendMessage = async(e) =>{
        e.preventDefault();

        if (!files && !newMessage) {
            alert("Please enter a message or select a file!!");
            return;
        }
        
        const formData = new FormData();

        formData.append('chat_id', props.selectedChat);
        formData.append('sender_id', props.userInfo.id);
        formData.append('status', 'unread');
        formData.append('message', newMessage);
        formData.append('type', files ? "file" : "text");

        if (files) {
            formData.append("file_path", files);
        }

          // Log FormData content to check if the file is correctly appended
        // for (let pair of formData.entries()) {
        //     console.log(pair[0], pair[1]);
        // }
    
        try{
            
            const response = await axios.post("http://127.0.0.1:8000/api/new-message", formData,{
              
                headers: { Authorization: `Bearer ${token}` }
            });

            setNewMessage("");
            setFiles(null);

        }
        catch(error){
            console.error(error);
        }
    }


  return (
    
    <div className="bg-white border-t p-4 sticky bottom-0 w-full">
        
        <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex items-center space-x-4">

            <label className="p-2 text-gray-500 hover:text-gray-700 transition cursor-pointer relative inline-flex items-center"> 
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                </svg>
                <input onChange={handleFileChange}  type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </label>

            <input value={newMessage} onChange={(e)=>setNewMessage(e.target.value)} type="text"  placeholder="Type your message..."  className="flex-1 p-2 border rounded-full focus:outline-none focus:border-blue-500" name='message'/>
        
            <button type="submit" className="p-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"  strokeWidth="2"  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"  />
                </svg>
            </button>
        </form>

    </div>
  )
}
