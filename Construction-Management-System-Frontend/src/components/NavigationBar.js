import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

import DarkTheme from './DarkTheme';
import NotificationIcon from './Notifications/NotificationIcon';
import ChatIcon from './Chats/ChatIcon';
import BackgroundImage from "../assets/Background-image.png";
import DefaultUser from '../assets/DefaultUser.png'

export default function NavigationBar() {

    const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
    const [isProfileSection , setProfileSection] = useState(false);

    const navigate = useNavigate();
    
    // profile click
    const handleProfileClick = () =>{
        setProfileSection(!isProfileSection);
    }

    // logout
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
          // console.error("Logout error:", error.response?.data || error.message);
          alert("Logout failed");
        }
      };
  return (
    
    <>
        <nav  className='  flex overflow-hidden justify-between items-center bg-[#e5e7eb] text-white dark:bg-[#070408] p-1 '>

            <div className=' flex '>
                <img className="  w-[55px]  h-auto  hidden md:block " alt='backgrond image  object-fill' src={BackgroundImage}  />


                <div className={`grid grid-cols-${userInfo?.role === 'labor' ? 1 : userInfo?.role === 'admin' ? 5 : 2  } gap-2 p-2`}>


                    {
                        userInfo?.role !== 'labor'  && (
                            <Link to={'/projects'} className='  w-10 h-10 rounded-full  md:w-auto md:h-auto  hover:dark:bg-slate-600  hover:bg-slate-400 flex justify-center md:rounded-lg  items-center '>

                                <button className='py-2 px-4 rounded-md bg-violet-700 dark:bg-gray-600 dark:hover:bg-slate-500 text-sm hover:bg-violet-800 hidden md:block w-full ' >Projects</button>
                                <svg   className='md:hidden block dark:fill-white ' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M80-160v-160h160v160H80Zm240 0v-160h560v160H320ZM80-400v-160h160v160H80Zm240 0v-160h560v160H320ZM80-640v-160h160v160H80Zm240 0v-160h560v160H320Z"/></svg>

                            </Link>
                        )
                    }
        
                    
                    {
                        userInfo?.role === 'admin'  && (
                            <Link to={'/equipments'} className='  w-10 h-10 rounded-full  md:w-auto md:h-auto  hover:dark:bg-slate-600  hover:bg-slate-400 flex justify-center md:rounded-lg  items-center '>

                                <button  className='py-2 px-4 rounded-md bg-violet-700 dark:bg-gray-600 dark:hover:bg-slate-500 text-sm hover:bg-violet-800 hidden md:block w-full '  >Equipments</button>
                                <svg className='md:hidden block dark:fill-white ' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M756-120 537-339l84-84 219 219-84 84Zm-552 0-84-84 276-276-68-68-28 28-51-51v82l-28 28-121-121 28-28h82l-50-50 142-142q20-20 43-29t47-9q24 0 47 9t43 29l-92 92 50 50-28 28 68 68 90-90q-4-11-6.5-23t-2.5-24q0-59 40.5-99.5T701-841q15 0 28.5 3t27.5 9l-99 99 72 72 99-99q7 14 9.5 27.5T841-701q0 59-40.5 99.5T701-561q-12 0-24-2t-23-7L204-120Z"/></svg>
                            </Link>
                        )
                    }

                    {
                        userInfo?.role === 'admin'  && (
                            <Link to={'/users'}  className='  w-10 h-10 rounded-full md:w-auto md:h-auto  hover:dark:bg-slate-600  hover:bg-slate-400 flex justify-center md:rounded-lg  items-center '>
                                <button  className='py-2 px-4 rounded-md bg-violet-700 dark:bg-gray-600 dark:hover:bg-slate-500 text-sm hover:bg-violet-800 hidden md:block w-full '  >Users</button>
                                <svg className='md:hidden block dark:fill-white'  xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>
                            </Link>
                        )
                    }

                    {
                        userInfo?.role === 'admin'  && (
                            <Link to={'/admin-dashboard'} className='  w-10 h-10 rounded-full md:rounded-lg md:w-auto md:h-auto  hover:dark:bg-slate-600  hover:bg-slate-400 flex justify-center items-center '>
                            <button className='py-2 px-4 rounded-md bg-violet-700 dark:bg-gray-600 dark:hover:bg-slate-500 text-sm hover:bg-violet-800 hidden md:block w-full '  >Dashboard</button>  
                            <svg className='md:hidden block dark:fill-white ' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z"/></svg>
                        </Link>

                        )
                    }


                    <Link to={'/my-tasks'} className='  w-10 h-10 rounded-full md:rounded-lg md:w-auto md:h-auto  hover:dark:bg-slate-600  hover:bg-slate-400 flex justify-center items-center '>
                        <button className='py-2 px-4 rounded-md bg-violet-700 dark:bg-gray-600 dark:hover:bg-slate-500 text-sm hover:bg-violet-800 hidden md:block w-full '  >My Tasks</button>  

                        <svg className='md:hidden block dark:fill-white ' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00000"><path d="m438-240 226-226-58-58-169 169-84-84-57 57 142 142ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/></svg>
                    </Link>

                </div>


            </div>
            

            {/* rght side */}
            <div className='grid md:grid-cols-4 grid-cols-3  gap-2 ml-2 items-center  ' >
                
                <div className=' hidden md:block '>
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

                <button   onClick={handleProfileClick}>

                    {
                        userInfo.profile_picture ? 
                        <img className="rounded-full w-8 h-8 " alt='backgrond image' src={`http://127.0.0.1:8000/storage/${userInfo.profile_picture}`} />
                        : 
                        <img className="rounded-full w-8 h-8 " alt='backgrond image' src={DefaultUser} />
                    }
                  
                </button>
            
            </div>
        </nav>

        {
            isProfileSection && (
                <div className=' bg-red-50 text-black  dark:bg-gray-800 dark:text-white  absolute right-2 top-16 p-2 shadow-[0_3px_10px_rgb(0,0,0,0.4)]  rounded-lg z-10'>
                    <ul className='flex flex-col justify-center text-center  '>
                        <li className='py-2 flex flex-wrap  px-6 border-black border-b-[1px] mb-1'>{userInfo.name}</li>
                        <Link to={'/user/profile'} className='py-2  hover:bg-violet-300 px-6 rounded-lg dark:hover:text-black' >Profile</Link>
                        <Link to={'/user/calendar'}className='py-2  hover:bg-violet-300 px-6  rounded-lg dark:hover:text-black '>Calendar</Link>
                        <li className='py-2  hover:bg-violet-300 px-6 rounded-lg dark:hover:text-black md:hidden flex justify-center items-center'>  <DarkTheme /> DarkTheme </li>
                        <li onClick={logOut} className='py-2  hover:bg-violet-300 px-6 items-center justify-center rounded-lg dark:hover:text-black ' >Sign out</li>
                    </ul>
                </div>
            )
        }
    </>
  )
}
