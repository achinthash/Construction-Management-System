import React, { useState } from 'react'
import { Link } from 'react-router-dom';

import DarkTheme from './DarkTheme';

import axios from "axios";
import { Navigate, useNavigate } from 'react-router-dom';

import NotificationIcon from './Notifications/NotificationIcon';
import ChatIcon from './Chats/ChatIcon';

export default function NavigationBar() {

    
    const [token, setToken] = useState(sessionStorage.getItem("token") || "");
    const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
    const [isProfileSection , setProfileSection] = useState(false);

    const navigate = useNavigate();
    

    const btnclick = () =>{

        setProfileSection(!isProfileSection);

 
    }


    const logOut = async () => {
        
        try {
          await axios.post("http://127.0.0.1:8000/api/logout",{},{
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                   Accept: 'application/json'
            }
        });

          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user-info");

          navigate('/login');

    
          alert("Logged out successfully");
        } catch (error) {
          console.error("Logout error:", error.response?.data || error.message);
          alert("Logout failed");
        }
      };
  return (
    
    <nav>

        <div  className=' md:ml-[55px] md:w-[full-55px] flex  overflow-hidden justify-between items-center bg-[#e5e7eb] text-white dark:bg-[#070408] p-2 '>

            <div className='p-1 grid grid-cols-4 gap-4'>

                <Link to={'/projects'} className='  w-10 h-10 rounded-full  md:w-auto md:h-auto  hover:dark:bg-slate-600  hover:bg-slate-400 flex justify-center md:rounded-lg  items-center '>

                    <button className='py-2 px-4 rounded-md bg-violet-700 dark:bg-gray-600 dark:hover:bg-slate-500 text-sm hover:bg-violet-800 hidden md:block w-full ' >Projects</button>
                      
                    <svg   className='md:hidden block dark:fill-white ' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M80-160v-160h160v160H80Zm240 0v-160h560v160H320ZM80-400v-160h160v160H80Zm240 0v-160h560v160H320ZM80-640v-160h160v160H80Zm240 0v-160h560v160H320Z"/></svg>
 
                </Link>

                <div className='  w-10 h-10 rounded-full  md:w-auto md:h-auto  hover:dark:bg-slate-600  hover:bg-slate-400 flex justify-center md:rounded-lg  items-center '>

                    <Link to={'/equipments'} className='py-2 px-4 rounded-md bg-violet-700 dark:bg-gray-600 dark:hover:bg-slate-500 text-sm hover:bg-violet-800 hidden md:block w-full '  >Equipments</Link>

                    <svg className='md:hidden block dark:fill-white ' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M756-120 537-339l84-84 219 219-84 84Zm-552 0-84-84 276-276-68-68-28 28-51-51v82l-28 28-121-121 28-28h82l-50-50 142-142q20-20 43-29t47-9q24 0 47 9t43 29l-92 92 50 50-28 28 68 68 90-90q-4-11-6.5-23t-2.5-24q0-59 40.5-99.5T701-841q15 0 28.5 3t27.5 9l-99 99 72 72 99-99q7 14 9.5 27.5T841-701q0 59-40.5 99.5T701-561q-12 0-24-2t-23-7L204-120Z"/></svg>

                </div>

                <Link to={'/users'}  className='  w-10 h-10 rounded-full md:w-auto md:h-auto  hover:dark:bg-slate-600  hover:bg-slate-400 flex justify-center md:rounded-lg  items-center '>
                    <button  className='py-2 px-4 rounded-md bg-violet-700 dark:bg-gray-600 dark:hover:bg-slate-500 text-sm hover:bg-violet-800 hidden md:block w-full '  >Users</button>
                    
                    <svg className='md:hidden block dark:fill-white'  xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>
                   
                </Link>

                <Link to={'/admin-dashboard'} className='  w-10 h-10 rounded-full md:rounded-lg md:w-auto md:h-auto  hover:dark:bg-slate-600  hover:bg-slate-400 flex justify-center items-center '>
                    <button className='py-2 px-4 rounded-md bg-violet-700 dark:bg-gray-600 dark:hover:bg-slate-500 text-sm hover:bg-violet-800 hidden md:block w-full '  >Dashboard</button>  

                    <svg className='md:hidden block dark:fill-white ' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z"/></svg>
                </Link>

            </div>

            <div className='grid grid-cols-4 gap-2 ml-2 items-center  ' >
                
                <div className='flex  '>
                    <DarkTheme />
                </div>

                <div className='    '>
                    {/* notification */}
                    
                    <NotificationIcon />
                </div>

                <div className='flex  w-10 h-10 rounded-full   justify-center items-center bg-none hover:dark:bg-slate-600  hover:bg-slate-400  '>
                    {/* chatIcon */}
                    
                    <ChatIcon />
                </div>

                <button  className='   rounded-full  flex justify-center items-center bg-gray-800 mr-2' onClick={btnclick}>
                    <img className="rounded-full w-8 h-8 " alt='backgrond image' src={`http://127.0.0.1:8000/storage/${userInfo.profile_picture}`} />
                </button>
            
            </div>
        </div>

        {
            isProfileSection && (
                <div className=' bg-red-50 text-black  dark:bg-gray-800 dark:text-white  absolute right-2 top-16 p-2 shadow-[0_3px_10px_rgb(0,0,0,0.4)]  rounded-lg '>
                    
                    <ul className='flex flex-col justify-center text-center  '>
                        <li className='py-2 flex flex-wrap  px-6 border-black border-b-[1px] mb-1'>{userInfo.name}</li>
                        <Link to={'/user/profile'} className='py-2  hover:bg-violet-300 px-6 rounded-lg dark:hover:text-black' >Profile</Link>
                        <li className='py-2  hover:bg-violet-300 px-6  rounded-lg dark:hover:text-black '>Calendar</li>
                        <li className='py-2  hover:bg-violet-300 px-6 rounded-lg dark:hover:text-black '>Settings</li>

                        {/* <li className='py-2  hover:bg-violet-300 px-6 rounded-lg dark:hover:text-black md:hidden'>Darkmode</li>
                        <li className='py-2  hover:bg-violet-300 px-6 rounded-lg dark:hover:text-black md:hidden'>Notification</li>
                        <li className='py-2  hover:bg-violet-300 px-6 rounded-lg dark:hover:text-black md:hidden'>Chat</li> */}

                        <li onClick={logOut} className='py-2  hover:bg-violet-300 px-6 items-center justify-center rounded-lg dark:hover:text-black ' >Sign out</li>
                    </ul>
                </div>
            )
        }
    </nav>
  )
}
