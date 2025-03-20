import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react'
import Loading from '../Loading';
import ResponseMessages from '../ResponseMessages';
import Pusher from 'pusher-js';

export default function Notification() {

  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);
  const [loading, setLoading] = useState(true);

  const [token, setToken] = useState(sessionStorage.getItem("token") || "");
  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));

  const [isUnreadNotifications, setIsUnreadNotifications] = useState(true);
  const [isAllNotifications, setIsAllNotifications] = useState(false);

  const [notificationsAll, setNotificationsAll] = useState([]);
  const [notificationsUnread, setNotificationsUnread] = useState([]);


  const handleUnread = ()=>{
    setIsUnreadNotifications(true);
    setIsAllNotifications(false);
  }

  const handleAll = ()=>{
    setIsAllNotifications(true);
    setIsUnreadNotifications(false);
  }

  // 

  const notifications = async()=>{

    try{

      const response = await axios.get(`http://localhost:8000/api/notifications/${userInfo.id}`,{
        headers: { Authorization: `Bearer ${token}` }
      });

      setLoading(false);
      setNotificationsAll(response.data);

      const unreadNotifications = response.data.filter(notification => notification.is_read == false);
      setNotificationsUnread(unreadNotifications);
      
    }
    catch(error){
      setLoading(false);
      console.error(error);
    }
  }

  useEffect(()=>{
    notifications();

  },[userInfo.id])



  const [expandedId, setExpandedId] = useState("");
  const toggleDescription = (notificationId)=>{
    setExpandedId(notificationId);
  }


 const statusChange = async(notificationId) =>{

  try{
    
    const response = await axios.put(`http://127.0.0.1:8000/api/update-notification-status/${notificationId}`,
      { is_read: true },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          Accept: "application/json",
        }
      }
    )
    notifications();

    setSuccessMessage.current("Notification Status updated!");

    }catch(error){
      setErrorMessage.current(error);
    }

  }

    // pusher event 

    useEffect(() => {
      const pusher = new Pusher("cbaba30792373a5ebca9", {
        cluster: "ap1",
        encrypted: true, 
      });
  
      const channel = pusher.subscribe(`notification.${userInfo.id}`); 
  
      channel.bind("App\\Events\\NotificationSent", function (data) {
       
        setNotificationsUnread((prevNotifications) => [
          data.message, 
          ...prevNotifications, 
        ]);

        setNotificationsAll((prevNotifications) => [
          data.message, 
          ...prevNotifications, 
        ]);

       
      });
  
      return () => {
        channel.unbind("App\\Events\\NotificationSent");
        pusher.unsubscribe(`notification.${userInfo.id}`);
      };
    }, [userInfo.id]);
  

  if (loading) {
    return (
        <Loading />
    );
}



  return (
   
   <div className='p-2  max-h-full rounded-lg  text-black bg-white '>

    <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>

    <div className='grid grid-cols-2 mb-2 bg-gray-100 rounded-lg  '> 

      <div onClick={handleUnread} className={`col-span-1 cursor-pointer hover:bg-gray-200 p-2 ${isUnreadNotifications ? "bg-gray-300 font-bold" : "" }`}>
        <span className='flex items-center justify-center' > 

          <h3 className='text-center'> Unread </h3>
          <h3 className='ml-2 flex items-center text-sm justify-center px-1 text-white bg-red-500 rounded-full '>{notificationsUnread? notificationsUnread.length : null} </h3>
           
        </span>
      </div>

      <div onClick={handleAll} className={`col-span-1 cursor-pointer hover:bg-gray-200 p-2 ${isAllNotifications ? "bg-gray-300 font-bold" : "" }`}>
        <h3 className='text-center'> All </h3>
      </div>

    </div>


    {
      isUnreadNotifications && (
        <div className=' max-h-[80vh] overflow-y-auto mb-2 bg-white mt-2'> 

          { notificationsUnread.map((notification)=>(
            <div key={notification.id}  className={`border border-violet-400  mb-2 p-2 rounded-lg felx flex-col ${notification.is_read ? 'bg-white' : 'bg-violet-100'}`}>
    
              <button onClick={() => statusChange(notification.id)} className='relative  flex justify-end w-full items-end' >  <svg xmlns="http://www.w3.org/2000/svg" className='' height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M80-80v-720q0-33 23.5-56.5T160-880h404q-4 20-4 40t4 40H160v525l46-45h594v-324q23-5 43-13.5t37-22.5v360q0 33-23.5 56.5T800-240H240L80-80Zm80-720v480-480Zm600 80q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Z"/></svg> </button>
              
              <h2 className='text-center font-bold'>{notification.title}</h2>
    
              <p onClick={() => toggleDescription(notification.id)} className='text-center cursor-pointer'>
                {
                  expandedId === notification.id ? notification.description : notification.description.length > 40 ? notification.description.substring(0,40) : notification.description
                }
              </p>
                
              <p className='text-right text-xs mt-1'>{notification.created_at.substring(0, 10)} {notification.created_at.substring(11, 19)}</p> 
            </div>  ))
          }

        </div>
      )
    }

    {
      isAllNotifications && (

        <div className=' max-h-[80vh] overflow-y-auto mb-2 bg-white mt-2'> 

          { notificationsAll.map((notification)=>(
            <div key={notification.id}  className={`border border-violet-400  mb-2 p-2 rounded-lg felx flex-col ${notification.is_read ? 'bg-white' : 'bg-violet-100'}`}>
    
              <button className='relative  flex justify-end w-full items-end' >  <svg xmlns="http://www.w3.org/2000/svg" className='' height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M80-80v-720q0-33 23.5-56.5T160-880h404q-4 20-4 40t4 40H160v525l46-45h594v-324q23-5 43-13.5t37-22.5v360q0 33-23.5 56.5T800-240H240L80-80Zm80-720v480-480Zm600 80q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Z"/></svg> </button>
              
              <h2 className='text-center font-bold'>{notification.title}</h2>
    
              <p onClick={() => toggleDescription(notification.id)} className='text-center cursor-pointer'>
                {
                  expandedId === notification.id ? notification.description : notification.description.length > 40 ? notification.description.substring(0,40) : notification.description
                }
              </p>
                
              <p className='text-right text-xs mt-1'>{notification.created_at.substring(0, 10)} {notification.created_at.substring(11, 19)}</p> 
            </div>  ))
          }

        </div>
        
      )
    }
       
   </div>
  )
}

