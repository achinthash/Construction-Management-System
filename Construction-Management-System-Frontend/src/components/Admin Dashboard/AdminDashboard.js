
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loading from "../Loading";

import NavigationBar from '../NavigationBar';
import NewNotification from '../Notifications/NewNotification';
import ProjectGrantChart from './ProjectGrantChart';
import ProjectsProgressChart from './ProjectsProgressChart';
import AnnouncementsSummary from '../Announcements/AnnouncementsSummary';
import EquipmentSummary from '../Equipments/EquipmentSummary';
import UserSummary from '../Users/UserSummary';

export default function AdminDashboard() {

  const [activeSection, setActiveSection] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/projects-all`, {
          headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}`, },
        });

        setProjects(response.data);

      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);


  // project summary
  const categories  = [...new Set(projects.map(item => item.type))];
  const statustypes  = [...new Set(projects.map(item => item.status))]
  const activeprojects = projects.filter(item => item.status === 'In Progress').length;

  if (loading) {
    return (
        <Loading />
    );
  }

  return (
    <>

      {/* Display Selected Section */}

      {
        activeSection &&  (
          <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
            <div className={`bg-white border border-violet-950 rounded-lg min-w-[80%] 'w-full h-screen' } `}>  
              <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
                <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  {activeSection} </h1>
                <button onClick={() => setActiveSection('')} type='reset'  className='ml-auto items-center col-span-1'><svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg> </button>
              </div>
              {activeSection === 'Custom-Notification' && <NewNotification />} 
            </div>
          </div>
        )
      }

    <NavigationBar />

      <div className="bg-[#ddd6fee2]  dark:bg-gray-900  rounded p-2 mt-1 mr-1 ">
        <h1 className="text-left sm:text-xl font-bold text p-1 text-[#5c3c8f] dark:text-white ">Admin Dashboard</h1>
        <div className='flex items-center  justify-between'> 

          <div className='flex  w-full items-end justify-end'>
            <button  onClick={() => setActiveSection('Custom-Notification')} className={`py-1 px-3 ms-2 text-sm font-bold rounded-md  focus:ring-blue-300 hidden md:block ${activeSection === 'Custom-Notification' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#c5b6de] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`} >  Custom Notification   </button>
          </div>
        </div>
      </div>

      <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6  overflow-y-auto bg-gray-100">

        <UserSummary />

        <div className="bg-white shadow-lg rounded-xl p-4 space-y-2">
          <div className="flex flex-col  gap-2 ">
            <h2 className='text-center text-lg font-semibold'> 📁 Project Settings </h2>
            <p className='text-sm'>Active Projects: {activeprojects}</p>
      
            <span className='text-sm flex'>
              Types:
              {categories.map((category, index) => (
                <p key={index} className="mr-1">
                  {category}
                  {index < categories.length - 1 && ','}
                </p>
              ))}
            </span>

            <span className='text-sm flex'>  Status:
              {statustypes.map((status, index) => (
                <p key={index} className="mr-1">
                  {status}
                  {index < status.length - 1 && ','}
                </p>
              ))}
            </span>
          </div>
          <Link to={'/projects'} className="w-full mt-2 px-4 py-2 border rounded hover:bg-gray-100 bg-violet-100 block text-center"> Manage Project </Link>
        </div>

        <EquipmentSummary />

        <AnnouncementsSummary />

      </div>

      <div className=' mx-2 grid grid-cols-4 gap-2   '>

        <div className='col-span-4 '>
          <ProjectsProgressChart projects={projects} />
        </div>

        <div className='col-span-4   '>
          <ProjectGrantChart />
        </div>

      </div>



    </>
  )
}


