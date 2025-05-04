import React, { useState } from 'react';
import 'chartjs-adapter-date-fns';

import Sidebar from '../Sidebar';
import NavigationBar from '../NavigationBar';
import NewTask from './NewTask';
import TasksDashboard from './TasksDashboard';
import TasksChart from './TasksChart';
import TasksList from './TasksList';
import TasksCalender from './TasksCalender';

export default function Tasks() {
 
  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
  const [isNewTask, setIsNewTask] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard'); 

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuOpen = () =>{
    setIsMenuOpen(!isMenuOpen);
  }


  return (
    <div className='max-h-[100vh] overflow-y-hidden'>
      
     {/* new task */}
     {
        isNewTask && (
          <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
            <div className='bg-white border border-violet-950 rounded-lg  '>
                    
              <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
                <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  New Task </h1>
                <button  onClick={()=>setIsNewTask(false)} type='reset'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
                
                <NewTask  />
            </div>
          </div>
        )
      }

    {
      isMenuOpen && (
        <div className='absolute right-2 top-32  bg-white p-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md md:hidden block'>
          <ul className='space-y-1 text-center'>
            <li  onClick={() => { setActiveSection('dashboard'); setIsMenuOpen(false); }} className={`py-2 px-3  text-sm font-bold rounded-md   ${activeSection === 'dashboard' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#dcd8e2] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`}> Dashboard  </li>
            
            <li  onClick={() => { setActiveSection('grantt'); setIsMenuOpen(false); }} className={`py-2 px-3  text-sm font-bold rounded-md  focus:ring-blue-300 ${activeSection === 'grantt' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#dcd8e2] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`}> Grantt  </li>
          
            <li onClick={() => { setActiveSection('tasks'); setIsMenuOpen(false); }}  className={`py-2 px-3  text-sm font-bold rounded-md  focus:ring-blue-300 ${  activeSection === 'tasks' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#dcd8e2] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`} > Tasks  </li>

            <li onClick={() => { setActiveSection('calendar'); setIsMenuOpen(false); }} className={`py-2 px-3  text-sm font-bold rounded-md  focus:ring-blue-300 ${activeSection === 'calendar' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#dcd8e2] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`}> Calendar  </li>

           
          </ul>

        </div>
      )
    }

    
        <Sidebar />
        <NavigationBar />

        <div className="bg-[#ddd6fee2] sidebar-ml  dark:bg-gray-900  rounded p-2 mt-1 mr-1 ">
    
          <div className='flex justify-between items-center '>
            <h1 className="text-left sm:text-xl font-bold text p-1 text-[#5c3c8f] dark:text-white ">Schedule</h1>

            {
              ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                <div>
                  <button  onClick={()=>setIsNewTask(true)}  className="py-1.5 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-md   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 hidden md:block"> New Task  </button>
                  <button  onClick={()=>setIsNewTask(true)} className="md:hidden block py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>  </button>
                </div>  
              )
            }
            
            <button  onClick={handleMenuOpen} className="md:hidden block py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>  </button>
           
          </div>

          <div className='flex items-center  justify-between'> 

            <div className='flex flex-row'>
              <button  onClick={() => setActiveSection('dashboard')} className={`py-1 px-3 ms-2 text-sm font-bold rounded-md  focus:ring-blue-300 hidden md:block ${activeSection === 'dashboard' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#c5b6de] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`}> Dashboard  </button>

              <button  onClick={() => setActiveSection('grantt')} className={`py-1 px-3 ms-2 text-sm font-bold rounded-md  focus:ring-blue-300 hidden md:block ${activeSection === 'grantt' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#c5b6de] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`}> Grantt  </button>

              <button onClick={() => setActiveSection('tasks')} className={`py-1 px-3 ms-2 text-sm font-bold rounded-md  focus:ring-blue-300 hidden md:block ${ activeSection === 'tasks' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#c5b6de] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`}> Tasks  </button>
            
              <button onClick={() => setActiveSection('calendar')}  className={`py-1 px-3 ms-2 text-sm font-bold rounded-md  focus:ring-blue-300 hidden md:block ${activeSection === 'calendar' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#c5b6de] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`} > Calendar  </button>
            </div>
           
          </div>
        </div>

      {/* Display Selected Section */}

      <div className='sidebar-ml'> 
        {activeSection === 'dashboard' && <TasksDashboard />}
        {activeSection === 'grantt' && <TasksChart />}
        {activeSection === 'tasks' && <TasksList />}
        {activeSection === 'calendar' && <TasksCalender />}

      </div>

    </div>
  )
}
