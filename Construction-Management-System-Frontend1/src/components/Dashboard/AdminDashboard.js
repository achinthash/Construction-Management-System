import React, { useState } from 'react';
import Company_icon from '../Company_icon';
import NavigationBar from '../NavigationBar';
import NewNotification from '../Notifications/NewNotification';

export default function AdminDashboard() {


    const [isCustNotification, setIsCustNotification] = useState(false);

    const custNotification =()=>{
        setIsCustNotification(!isCustNotification);
    }

  return (
    <>


         {/* new Notification */}
        {   isCustNotification && (
          <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
            <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] '>
                    
              <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
                <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  New Notification </h1>
                <button  onClick={custNotification} type='reset'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
                
                <NewNotification />
                
            </div>
          </div>
        )
      }



    <Company_icon />
    <NavigationBar />


    <div id="header" className="bg-[#ddd6fee2]   dark:bg-gray-900  rounded flex md:flex-row flex-col p-2  my-1 mx-1 justify-between ">
        <h1 className="text-left sm:text-xl font-bold text p-2 text-[#5c3c8f] dark:text-white ">Admin Dashboard</h1>

        <div className='flex '> 
            <button onClick={custNotification} className="py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 hidden md:block"> Custom Notification  </button>

            <button  className="py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 hidden md:block"> New Announcement  </button>


        </div>            
    </div>



    </>
  )
}


