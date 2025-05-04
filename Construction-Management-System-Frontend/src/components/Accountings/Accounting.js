import React, { useState } from 'react';

import Sidebar from '../Sidebar';
import NavigationBar from '../NavigationBar';
import Dashboard from './Dashboard';
import PurchaseOrders from './PurchaseOrders/PurchaseOrders';
import ActualVsEstimationProjectTable from '../Actual Cost/ActualVsEstimationProjectTable';
import PayRollProjectTable from '../Payroll/PayRollProjectTable';
import Bills from '../Bills/Bills'

export default function Accounting() {

  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuOpen = () =>{
    setIsMenuOpen(!isMenuOpen);
  }
 
  
return (
  <div className='overflow-y-hidden h-screen '>

    {
      isMenuOpen && (
        <div className='absolute right-2 top-32  bg-white p-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md md:hidden block'>
          <ul className='space-y-1 text-center'>
            <li  onClick={() => { setActiveSection('dashboard'); setIsMenuOpen(false); }} className={`py-2 px-3  text-sm font-bold rounded-md   ${activeSection === 'dashboard' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#dcd8e2] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`}> Dashboard  </li>
            
            <li  onClick={() => { setActiveSection('purchase-orders'); setIsMenuOpen(false); }} className={`py-2 px-3  text-sm font-bold rounded-md  focus:ring-blue-300 ${activeSection === 'purchase-orders' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#dcd8e2] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`}> Purchase Orders  </li>
          
            <li onClick={() => { setActiveSection('pay-roll'); setIsMenuOpen(false); }}  className={`py-2 px-3  text-sm font-bold rounded-md  focus:ring-blue-300 ${  activeSection === 'pay-roll' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#dcd8e2] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`} > Pay Roll  </li>

            <li onClick={() => { setActiveSection('bills'); setIsMenuOpen(false); }} className={`py-2 px-3  text-sm font-bold rounded-md  focus:ring-blue-300 ${activeSection === 'bills' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#dcd8e2] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`}> Bills  </li>

            <li onClick={() => { setActiveSection('change-cost'); setIsMenuOpen(false); }} className={`py-2 px-3  text-sm font-bold rounded-md  focus:ring-blue-300 ${  activeSection === 'change-cost' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#dcd8e2] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`} > Change Cost  </li>
          </ul>

        </div>
      )
    }
        
      <Sidebar />
      <NavigationBar />


      <div className="bg-[#ddd6fee2] sidebar-ml  dark:bg-gray-900  rounded p-2 mt-1 mr-1 ">
        
        <div className='flex justify-between items-center '>
          <h1 className="text-left sm:text-xl font-bold text p-1 text-[#5c3c8f] dark:text-white ">Accounting</h1>

          <button  onClick={handleMenuOpen} className="md:hidden block py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>  </button>
        </div>


        <div className='flex items-center  justify-between'> 

          <div className='flex flex-row'>
            <button  onClick={() => setActiveSection('dashboard')} className={`py-1 px-3 ms-2 text-sm font-bold rounded-md  focus:ring-blue-300 hidden md:block ${activeSection === 'dashboard' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#c5b6de] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`}> Dashboard  </button>
            
            <button  onClick={() => setActiveSection('purchase-orders')} className={`py-1 px-3 ms-2 text-sm font-bold rounded-md  focus:ring-blue-300 hidden md:block ${activeSection === 'purchase-orders' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#c5b6de] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`}> Purchase Orders  </button>
          
            <button onClick={() => setActiveSection('pay-roll')}  className={`py-1 px-3 ms-2 text-sm font-bold rounded-md  focus:ring-blue-300 hidden md:block ${  activeSection === 'pay-roll' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#c5b6de] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`} > Pay Roll  </button>

            <button onClick={() => setActiveSection('bills')} className={`py-1 px-3 ms-2 text-sm font-bold rounded-md  focus:ring-blue-300 hidden md:block ${activeSection === 'bills' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#c5b6de] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`}> Bills  </button>

            <button onClick={() => setActiveSection('change-cost')}  className={`py-1 px-3 ms-2 text-sm font-bold rounded-md  focus:ring-blue-300 hidden md:block ${  activeSection === 'change-cost' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#c5b6de] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`} > Change Cost  </button>

          </div>
          
        </div>

      </div>

      {/* Display Selected Section */}
      <div className='sidebar-ml '> 
        {activeSection === 'dashboard' && <Dashboard />}
        {activeSection === 'purchase-orders' && <PurchaseOrders />}
        {activeSection === 'bills' && <Bills  />}
        {activeSection === 'pay-roll' && <PayRollProjectTable />} 
        {activeSection === 'change-cost' && <ActualVsEstimationProjectTable />} 
      </div>



      

        
 



    </div>
  )
}








