import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import Pusher from 'pusher-js';

import Loading from '../Loading';

export default function ChatMessages(props) {

    const [token, setToken] = useState(sessionStorage.getItem("token") || "");
    const [messages , setMessages] = useState([]);
    const messageEndRef = useRef(null); 
    const [receiverId ,setReveiverId ] = useState("");
    const [filteredMessages, setFilteredMessages] = useState([]);

    const [newMessages , setNewMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPrivateMessages = async() =>{

        try{

            const response = await axios.get(`http://127.0.0.1:8000/api/private-messages/${props.selectedChat}`,{
                headers: { Authorization: `Bearer ${token}` }
            })

           // setMessages(response.data);
           setLoading(false);
            const groupedMessages = groupMessagesByDate(response.data);
            setMessages(groupedMessages);

            setFilteredMessages(response.data.filter(message => message.status === 'unread'));

        }
        catch(error){
            console.error(error);
            setLoading(false);
        }
    }


    // messages groups by dates
    const groupMessagesByDate = (messages) => {
        return messages.reduce((acc, message) => {
            const messageDate = moment(message.created_at).format('YYYY/MM/DD'); // Format the date to group
            if (!acc[messageDate]) {
                acc[messageDate] = [];
            }
            acc[messageDate].push(message);
            return acc;
        }, {});
    };

   
   
    // pusher event 

   useEffect(() => {
    const pusher = new Pusher('cbaba30792373a5ebca9', { cluster: 'ap1' });

    const channel = pusher.subscribe(`chat.${props.selectedChat}`);
    channel.bind('App\\Events\\MessageSent', function (data) {

        const newMessage = data.message; // Extract the message object
        const messageDate = moment(newMessage.created_at).format('YYYY/MM/DD');
       
         if (data.file) {
            newMessage.file = data.file; // Attach file data to the message
        }

        setMessages((prevMessages) => ({
            ...prevMessages,
            [messageDate]: prevMessages[messageDate]
                ? [...prevMessages[messageDate], newMessage]
                : [newMessage],
        }));

        if (props.userInfo.id !== data.message.sender_id) {
            setNewMessages((prevMessages) => [...prevMessages, data.message]);
        }
        
        });

        return () => {
            channel.unbind_all();
            pusher.unsubscribe(`chat.${props.selectedChat}`);
        };
    }, [props.selectedChat]);


    const isImage = (filePath) => {
        return filePath ? /\.(jpg|jpeg|png|gif|svg)$/i.test(filePath) : false;
    }



    // update chat status 


    const Receiver = async() =>{

        try{
            const response = await axios.get(`http://127.0.0.1:8000/api/chat-head/${props.selectedChat}` ,{
                headers: { Authorization: `Bearer ${token}` }
            });
            // set receiver id
            if(response.data.type == 'private'){
   
                props.userInfo.id == response.data.users[0].id ? 
                setReveiverId(response.data.users[1].id) :
                setReveiverId(response.data.users[0].id)
              
            }
        }
        catch(error){
            console.error(error);
        }
    }

     // if  messagesStatusCount > 0 
     const updateChatStatus = async() =>{
        // e.preventDefault();
 
         try{
 
             const response = await axios.put("http://localhost:8000/api/update-message-status",{
 
                 chat_id: props.selectedChat,
                 receiver_id:receiverId
 
             },{
                headers: { Authorization: `Bearer ${token}` }
             })
 
            
            setFilteredMessages(0);
           // fetchPrivateMessages();
         }
         catch(error){
             console.error('error',error)
         }
     }


    useEffect(() => {
        if (props.selectedChat) {
            fetchPrivateMessages();
            Receiver();
        }
    }, [props.selectedChat]);
    
    
    useEffect(() => {


        if (props.selectedChatType === 'private' && (newMessages.length > 0 || filteredMessages.length > 0)) {
            updateChatStatus();
        }

    }, [newMessages, filteredMessages, props.selectedChatType]);
    


    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }

    }, [messages]);



    if (loading) {
        return (
            <Loading />
        );
    }

  return (
    <div  className="flex-1 p-4 chat-container overflow-y-auto max-h-full chatbox  bg-gradient-to-r from-zinc-300 to-gray-300 ">

        {Object.keys(messages).map((date) => (

            <div key={date}>
                <div className="text-center my-2">
                    <span className="text-gray-500 text-sm bg-gray-200 rounded-full px-4 py-1">{date}</span>
                </div>

                {messages[date].map((message, index) => (
                    <div key={index}  className=" space-y-4">

                            {/*  Receive Message --> */}

                            {message.sender_id === props.userInfo.id ? (

                            <div className="flex items-start justify-end space-x-2">
                                <div className="flex flex-col items-end mb-2">
                                    <div className="bg-green-100 text-black rounded-lg rounded-tr-none p-2 shadow-md max-w-md flex items-center justify-center ">
                                        <div className=" flex flex-col">

                                            

                                            {message.message &&  <span className=' text-base'>{message.message}</span> }

                                            {message.file?.file_path ? (
                                                <> 
                                                    <div className='flex justify-between'>
                                                        <p className='text-xs'> {message.file.file_name}  </p>
                                                        <p className='text-xs'> {((message.file.file_size || 0) / 1024 / 1024).toFixed(2)} MB </p>
                                                    </div>

                                                    {isImage(message.file.file_path) ? 
                                                        <img src={`http://127.0.0.1:8000/storage/${message.file.file_path}`} className="w-40 h-32 rounded-md" alt="Sent file" /> 
                                                        :
                                                        <a  href={`http://127.0.0.1:8000/storage/${message.file.file_path}`}  className="text-blue-500 underline text-xs mt-2 ml-2" 
                                                        download> Download File </a>
                                                    }
                                                        </> ) 
                                                    
                                                :  message.file_path && ( 
                                                <> 
                                                    <div className='flex justify-between mb-1'>
                                                        <p className='text-xs'> { message.file_name.length>20 ? `${message.file_name.substring(0,15)}...`  : message.file_name }  </p>
                                                        <p className='text-xs ml-2'> {((message.file_size || 0) / 1024 / 1024).toFixed(2)} MB </p>

                                                        
                                                    </div>
                                                    
                                                    {isImage(message.file_path) ? 
                                                        <img src={`http://127.0.0.1:8000/storage/${message.file_path}`} className="w-40 h-32 rounded-md" alt="Sent file" /> 
                                                        :
                                                        <a  href={`http://127.0.0.1:8000/storage/${message.file_path}`}  className="text-blue-500 underline text-xs mt-2 ml-2" 
                                                        download> Download File </a>
                                                    }
                                                    
                                                </>
                                                

                                                
                                            )}

                                            <span className="  items-end text-right justify-end text-gray-500 text-xs message-time mr-1 ml-2 flex  ">
                                                <p className='text-xs'>{moment(message.created_at).format("h:mm A")}</p>

                                                {message.status === 'read' && (
                                                    <svg className='ml-2' xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#00">
                                                        <path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z"/>
                                                    </svg>
                                                )}
                                            </span>
                                                    
                                        </div>
                                    </div>
                                </div>
                            </div>
                            ) :  (
                            <div className="flex items-start justify-start space-x-2">
                                <div className="flex flex-col items-start mb-2">
                                    <div className="bg-gray-100 text-black rounded-lg rounded-tl-none p-1 shadow-md max-w-md flex items-center justify-center ">
                                        <div className=" flex flex-col">
                                
                                            {props.selectedChatType === 'group' && message.sender_name ?  <span className=' text-xs mb-2'>-{message.sender_name}-</span> : null }  

                                            {message.message &&  <span className='ml-2 text-base'>{message.message}</span> }

                                            {message.file?.file_path ? (
                                                <> 
                                                    <div className='flex justify-between'>
                                                        <p className='text-xs'> { message.file_name.length>20 ? `${message.file_name.substring(0,15)}...`  : message.file_name }  </p>
                                                        <p className='text-xs'> {((message.file.file_size || 0) / 1024 / 1024).toFixed(2)} MB </p>
                                                    </div>

                                                    {isImage(message.file.file_path) ? 
                                                        <img src={`http://127.0.0.1:8000/storage/${message.file.file_path}`} className="w-36 h-36 rounded-md" alt="Sent file" /> 
                                                        :
                                                        <a  href={`http://127.0.0.1:8000/storage/${message.file.file_path}`}  className="text-blue-500 underline text-xs mt-2 ml-2" 
                                                        download> Download File </a>
                                                    }
                                                    </> ) 
                                                    
                                                :  message.file_path && ( 
                                                <> 
                                                    <div className='flex justify-between mb-1'>
                                                        <p className='text-xs'> { message.file_name.length>20 ? `${message.file_name.substring(0,15)}...`  : message.file_name }  </p>
                                                        <p className='text-xs ml-2'> {((message.file_size || 0) / 1024 / 1024).toFixed(2)} MB </p>

                                                    
                                                    </div>
                                                    
                                                    {isImage(message.file_path) ? 
                                                        <img src={`http://127.0.0.1:8000/storage/${message.file_path}`} className="w-36 h-36 rounded-md" alt="Sent file" /> 
                                                        :
                                                        <a  href={`http://127.0.0.1:8000/storage/${message.file_path}`}  className="text-blue-500 underline text-xs mt-2 ml-2" 
                                                        download> Download File </a>
                                                    }
                                                    
                                                </>
                                                
                                                
                                            )}

                                            <span className="  items-end text-right justify-end text-gray-500 text-xs message-time mr-1 ml-2 flex  ">
                                                <p className='text-xs'>{moment(message.created_at).format("h:mm A")}</p>

                                                
                                            </span>
                                                    
                                        </div>
                                    </div>
                                </div>
                            </div>
                            )
                            


                            }

                        
                    </div>
                ))}


            </div>
        ))}
        <div ref={messageEndRef} />
      
        
        
    </div>
  )
}
