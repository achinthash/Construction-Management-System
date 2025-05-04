import React, { useState } from 'react';
import NavigationBar from '../NavigationBar';
import Sidebar from '../Sidebar';

import EquipmentsUsage from './EquipmentUsage/EquipmentsUsage';
import UsersLaborsTable from './UsersUsage/UsersLaborsTable';
import UsersManagersTable from './UsersUsage/UsersManagersTable';
import MaterialTaskTable from '../Materials/MaterialTaskTable';
import Dashboard from './Dashboard'

export default function ProjectResource() {

  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuOpen = () =>{
    setIsMenuOpen(!isMenuOpen);
  }


  return (

    <div>

      <Sidebar />
      <NavigationBar />

      {
      isMenuOpen && (
        <div className='absolute right-2 top-32  bg-white p-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md md:hidden block'>
          <ul className='space-y-1 text-center'>
            <li  onClick={() => { setActiveSection('dashboard'); setIsMenuOpen(false); }} className={` cursor-pointer py-2 px-3  text-sm font-bold rounded-md   ${activeSection === 'dashboard' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#dcd8e2] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`}> Dashboard  </li>
            
            <li  onClick={() => { setActiveSection('labors'); setIsMenuOpen(false); }} className={` cursor-pointer  py-2 px-3  text-sm font-bold rounded-md  focus:ring-blue-300 ${activeSection === 'labors' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#dcd8e2] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`}> Labors  </li>
          
            <li onClick={() => { setActiveSection('managers'); setIsMenuOpen(false); }}  className={` cursor-pointer  py-2 px-3  text-sm font-bold rounded-md  focus:ring-blue-300 ${  activeSection === 'managers' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#dcd8e2] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`} > Managers  </li>

            <li onClick={() => { setActiveSection('equipments'); setIsMenuOpen(false); }} className={` cursor-pointer  py-2 px-3  text-sm font-bold rounded-md  focus:ring-blue-300 ${activeSection === 'equipments' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#dcd8e2] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`}> Equipments  </li>

            <li onClick={() => { setActiveSection('materials'); setIsMenuOpen(false); }} className={` cursor-pointer  py-2 px-3  text-sm font-bold rounded-md  focus:ring-blue-300 ${  activeSection === 'materials' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#dcd8e2] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`} > Materials  </li>
          </ul>

        </div>
      )
    }


      <div className="bg-[#ddd6fee2] sidebar-ml  dark:bg-gray-900  rounded p-2 mt-1 mr-1 ">

        <div className='flex justify-between items-center '>
          <h1 className="text-left sm:text-xl font-bold text p-1 text-[#5c3c8f] dark:text-white ">Project Resources</h1>
          <button  onClick={handleMenuOpen} className="md:hidden block py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>  </button>
        </div>
        
        <div className='flex items-center  justify-between'> 

          <div className='flex flex-row'>
            <button  onClick={() => setActiveSection('dashboard')} className={`py-1 px-3 ms-2 text-sm font-bold rounded-md  focus:ring-blue-300 hidden md:block ${activeSection === 'dashboard' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#c5b6de] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`}> Dashboard  </button>
            
            <button  onClick={() => setActiveSection('labors')} className={`py-1 px-3 ms-2 text-sm font-bold rounded-md  focus:ring-blue-300 hidden md:block ${activeSection === 'labors' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#c5b6de] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`}> Labors  </button>

            <button  onClick={() => setActiveSection('managers')} className={`py-1 px-3 ms-2 text-sm font-bold rounded-md  focus:ring-blue-300 hidden md:block ${activeSection === 'managers' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#c5b6de] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`}> Managers  </button>
          
            <button onClick={() => setActiveSection('equipments')}  className={`py-1 px-3 ms-2 text-sm font-bold rounded-md  focus:ring-blue-300 hidden md:block ${  activeSection === 'equipments' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#c5b6de] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`} > Equipments  </button>

            <button onClick={() => setActiveSection('materials')} className={`py-1 px-3 ms-2 text-sm font-bold rounded-md  focus:ring-blue-300 hidden md:block ${activeSection === 'materials' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#c5b6de] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`}> Materials  </button>

          </div>

        </div>

      </div>

      {/* Display Selected Section */}

      <div className='sidebar-ml   max-h-[70vh] overflow-y-auto   '> 
        {activeSection === 'equipments' && <EquipmentsUsage />}
        {activeSection === 'labors' && <UsersLaborsTable />}
        {activeSection === 'managers' && <UsersManagersTable />}
        {activeSection === 'materials' && <MaterialTaskTable />}
        {activeSection === 'dashboard' && <Dashboard />} 

      </div>

    </div>

  )
}
