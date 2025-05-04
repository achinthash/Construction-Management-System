import React from 'react';

import NavigationBar from '../NavigationBar';
import Sidebar from '../Sidebar';
import WeatherView from '../Weather/WeatherView';
import AnnouncementsProjects from '../Announcements/AnnouncementsProjects';
import ProjectProgressChart from './ProjectProgressChart';
import LaborRoleTaskChart from '../Project Resources/UsersUsage/LaborRoleTaskChart';
import MaterialUsageChart from '../Materials/MaterialUsageChart';
import TaskStatusChart from '../Tasks/TaskStatusChart';
import  EstimationSummaryAngleChart from '../Accountings/EstimationSummaryAngleChart';
import TaskDurationSummary from '../Tasks/TaskDurationSummary';


export default function Dashboard() {
  return (
    <div className='overflow-x-hidden'>

    <Sidebar />
    <NavigationBar />

    <div id="header" className="bg-[#ddd6fee2] sidebar-ml  dark:bg-gray-900  rounded flex md:flex-row flex-col p-2  my-0 mt-1 mx-1 justify-between ">
      <h1 className="text-left sm:text-xl font-bold text p-1.5 text-[#5c3c8f] dark:text-white "> Dashboard </h1> 
    </div>

    <div className='sidebar-ml grid grid-cols-4 gap-2  max-h-[80vh] overflow-y-auto '>
      <div className='col-span-4'>
        <AnnouncementsProjects />
      </div>
      
      <div className='col-span-4  md:col-span-2 lg:col-span-1 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl'>
        <WeatherView />
      </div>

      <div className='col-span-4  md:col-span-2 lg:col-span-1 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl'>
        <ProjectProgressChart />
      </div>

      <div className='col-span-4  md:col-span-2 lg:col-span-1 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl'>
        <TaskStatusChart />
      </div>
      <div className='col-span-4  md:col-span-2 lg:col-span-1 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl'>
        <EstimationSummaryAngleChart />
      </div> 

      <div className='col-span-4  md:col-span-2 lg:col-span-2 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl'>
        <LaborRoleTaskChart />
      </div>

      <div className='col-span-4  md:col-span-2 lg:col-span-2 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl'>
        <MaterialUsageChart />
      </div>

      <div className='col-span-4  md:col-span-2 lg:col-span-4 '>
        <TaskDurationSummary />
      </div>

    </div>


  </div>
  )
}
