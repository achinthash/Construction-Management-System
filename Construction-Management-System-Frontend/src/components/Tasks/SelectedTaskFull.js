import React, { useState, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt, FaFlag, FaTasks } from 'react-icons/fa';

import Sidebar from '../Sidebar';
import NavigationBar from '../NavigationBar';
import Loading from '../Loading';

import TaskAssignedUsers from '../User Log/TaskAssignedUsers';
import TaskAssignedEquipments from '../Equipment Log/TaskAssignedEquipments';
import MaterialsTasks from '../Materials/MaterialsTasks';
import QualityControl from '../QualityContol/QualityControl';
import PurchaseOrders from '../Accountings/PurchaseOrders/PurchaseOrders';
import EstimationTableTask from '../Estimations/EstimationTableTask';
import DailyLogTasks from '../Daily Logs/DailyLogTasks';
import TaskImages from './TaskImages';
import TaskFiles from './TaskFiles';
import ActualVsEstimationTaskTable from '../Actual Cost/ActualVsEstimationTaskTable';

export default function SelectedTaskFull() {

    const { taskId } = useParams();

    const [token, setToken] = useState(sessionStorage.getItem("token") || "");
    const [loading, setLoading] = useState(true);
    const Navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('daily-logs');
  
    // fetch tasks
  const [task, setTask] = useState([]);

  useEffect(()=>{
      const task = async() =>{
  
      try{
          const response = await axios.get(`http://127.0.0.1:8000/api/task/${taskId}`,{
              headers: { Authorization: `Bearer ${token}` }
          });
  
        setLoading(false);
        setTask(response.data);

        console.log(response.data)
          
      }catch(error){
        setLoading(false);
        console.error(error);
      }}
  
      task();
  
  },[taskId]);



  if (loading) {
    return (
        <Loading />
    );
  }

 

return (

  <> 
         
     
    <Sidebar />
    <NavigationBar />


      <div className="bg-[#ddd6fee2] sidebar-ml  dark:bg-gray-900  rounded p-1.5 mt-1 mr-1 ">
        <h1 className="text-left sm:text-xl font-bold text p-1 text-[#5c3c8f] dark:text-white ">Task Details</h1>
      </div>

        <div className='max-h-[80vh] overflow-y-auto'>  

          <div className='sidebar-ml p-3'>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center"><FaTasks className="mr-2" /> #{task.id} - {task.name}</h2>

            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{task.description}</p>


            <div className='grid grid-cols-3 gap-2 mt-1'>

              <div className="bg-gray-200 p-4 rounded-lg dark:bg-gray-700">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center"><FaCalendarAlt className="mr-2" /> Duration</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{task.start_date} - {task.end_date}</p>
              </div>

              <div className="bg-yellow-100 p-4 rounded-lg dark:bg-gray-700">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center"><FaFlag className="mr-2" /> Priority</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{task.priority}</p>
              </div>

              <div className="bg-green-100 p-4 rounded-lg dark:bg-gray-700">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Progress</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{task.progress}%</p>
              </div>

            </div>

        

          </div>

          <div className="bg-[#ddd6fee2] sidebar-ml  dark:bg-gray-900  rounded p-2 mt-1 mr-1 ">
            <div className='grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2'>

              <button onClick={() => setActiveSection('daily-logs')} className={`py-1 px-3 text-sm font-bold rounded-md  focus:ring-blue-300  ${  activeSection === 'daily-logs' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#c5b6de] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`}> Daily Logs  </button>

              <button  onClick={() => setActiveSection('assignee')} className={`py-1 px-3 text-sm font-bold rounded-md  focus:ring-blue-300  ${activeSection === 'assignee' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#c5b6de] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`}> Assignee  </button>

              <button  onClick={() => setActiveSection('equipments')} className={`py-1 px-3 text-sm font-bold rounded-md  focus:ring-blue-300  ${activeSection === 'equipments' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#c5b6de] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`}> Equipments  </button>
              
              <button onClick={() => setActiveSection('materials')} className={`py-1 px-3 text-sm font-bold rounded-md  focus:ring-blue-300  ${ activeSection === 'materials' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#c5b6de] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`}> Materials  </button>
            
              <button onClick={() => setActiveSection('quality-control')}  className={`py-1 px-3 text-sm font-bold rounded-md  focus:ring-blue-300  ${ activeSection === 'quality-control' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#c5b6de] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`} > Quality Control  </button>

              <button onClick={() => setActiveSection('purchase-order')}  className={`py-1 px-3 text-sm font-bold rounded-md  focus:ring-blue-300  ${ activeSection === 'purchase-order' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#c5b6de] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`} > Purchase Order  </button>

              <button onClick={() => setActiveSection('image')} className={`py-1 px-3 text-sm font-bold rounded-md  focus:ring-blue-300  ${activeSection === 'image' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#c5b6de] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`}> Images  </button>    

              <button onClick={() => setActiveSection('file')} className={`py-1 px-3 text-sm font-bold rounded-md  focus:ring-blue-300  ${activeSection === 'file' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#c5b6de] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`}> Documents  </button>    

              <button onClick={() => setActiveSection('estimations')} className={`py-1 px-3 text-sm font-bold rounded-md  focus:ring-blue-300  ${activeSection === 'estimations' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#c5b6de] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`}> Estimations  </button>    

              <button onClick={() => setActiveSection('change-cost')} className={`py-1 px-3 ms-2 text-sm font-bold rounded-md  focus:ring-blue-300  ${  activeSection === 'change-cost' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#c5b6de] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`}> Change Cost  </button>
                            
            </div>
        </div>

        {/* Display Selected Section */}

        <div className='sidebar-ml'> 

          {activeSection === 'daily-logs' && <DailyLogTasks />}
          {activeSection === 'assignee' && <TaskAssignedUsers />}
          {activeSection === 'equipments' && <TaskAssignedEquipments />}
          {activeSection === 'materials' && <MaterialsTasks />}
          {activeSection === 'quality-control' && <QualityControl />} 
          {activeSection === 'purchase-order' && <PurchaseOrders />}
          {activeSection === 'image' &&  <TaskImages />  } 
          {activeSection === 'file' && <TaskFiles />  } 
          {activeSection === 'estimations' && <EstimationTableTask />} 
          {activeSection === 'change-cost' && <ActualVsEstimationTaskTable task_id={taskId} />} 
          
        </div>

      </div>

        
    </>
)}




