import React, { useState , useEffect } from 'react'
import axios from 'axios';
import Notification from './Notification';
import Pusher from 'pusher-js';

export default function NotificationIcon() {

  const [token, setToken] = useState(sessionStorage.getItem("token") || "");
  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));

  const [notificationCount, setNotificationCount] = useState("")

  const [isNotification, setIsNotification] = useState(false);
  


    const notification = ()=>{
     setIsNotification(!isNotification);
      
    }

    useEffect(()=>{
      
      const notifications = async()=>{
        try{
    
          const response = await axios.get(`http://localhost:8000/api/notifications/${userInfo.id}`,{
            headers: { Authorization: `Bearer ${token}` }
          });
    
          const unreadNotifications = response.data.filter(notification => notification.is_read == false);
          setNotificationCount(unreadNotifications.length)
    
        }
        catch(error){
          
          console.error(error);
        }
      }

      notifications();
    },[])



  
    



  return (
    <>

    {
      isNotification && (
        <div className=" fixed  right-0  top-0 bottom-0 h-[100vh] md:w-1/4 w-1/2 bg-white   border border-violet-950 rounded-lg " > 

          <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
            <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">   Notifications </h1>
            <button  onClick={notification} type='reset'  className='ml-auto items-center col-span-1'>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 24 24" stroke="black" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
          </div>
          <Notification />
        </div>
       
      )
    }

      <div className=' w-10 h-10 rounded-full  flex justify-center items-center bg-none hover:dark:bg-slate-600  hover:bg-slate-400'>

        {
          notificationCount > 0 ?
          <svg onClick={notification} xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 -960 960 960" width="26px" fill="#00000"><path d="M480-80q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80Zm0-420ZM160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v13q-11 22-16 45t-4 47q-10-2-19.5-3.5T480-720q-66 0-113 47t-47 113v280h320v-257q18 8 38.5 12.5T720-520v240h80v80H160Zm560-400q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Z"/></svg>  :

          <svg onClick={notification} xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 -960 960 960" width="26px" fill="#000000"><path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/></svg>

          
        }
        
      </div>


    </>
  )
}
