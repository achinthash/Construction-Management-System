import React from 'react';

import TaskStatusProgressChart from './TaskStatusProgressChart';
import TasksLogsTasksChart from './TasksLogsTasksChart'
import PendingTaskSummary from './PendingTaskSummary';
import TaskStatusChart from './TaskStatusChart';
 
export default function TasksDashboard() {

  return (
    <div className="grid grid-cols-4 gap-2 p-2  max-h-[70vh] overflow-y-auto  ">
      <div className=" col-span-4  md:col-span-2 lg:col-span-1 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl p-2 max-h-[350px] flex items-center justify-center ">
        <TaskStatusChart />
      </div>
    
      <div className=" col-span-4  md:col-span-2 lg:col-span-1 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl p-2 max-h-[350px] ">
        <TasksLogsTasksChart />
      </div>

      <div className=" col-span-4  md:col-span-2 lg:col-span-2 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl p-2 max-h-[350px]">
        <PendingTaskSummary />
      </div>

      <div className=" col-span-4  md:col-span-2 lg:col-span-4 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl p-2 max-h-[350px]">
        <TaskStatusProgressChart />
      </div>
    </div>
  )
}










