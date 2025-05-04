
import React, { useState, useEffect } from 'react';
import { Calendar, Badge } from 'antd';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import NavigationBar from '../../NavigationBar';
import Loading from '../../Loading';

export default function UserLogsCalender() {

    const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [isTaskDetails, setIsTaskDetails] = useState(false);
    const [selectedTask, setSelectedTask] = useState({});

    useEffect(()=>{
        const tasks = async() =>{
    
        try{
            const response = await axios.get(`http://127.0.0.1:8000/api/my-tasks/${userInfo.id}`,{
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`  }
            });

        setLoading(false);
          setTasks(response.data);
            
        }catch(error){
          setLoading(false);
          console.error(error);
        }}

        tasks();
    
    },[userInfo.id]);

      const dateCellRender = (value) => {
        const formattedDate  = value.format('YYYY-MM-DD');
        const tasksForDate = tasks.filter(task => task.date === formattedDate);
       
          return (
            <div className="events">
              {
                tasksForDate.map(task=>(
                    <div  key={task.id}  onClick={() => handleTaskClick(task.id)}>
                        <Badge  status={task.status === 'Pending' ? 'success' : 'warning'} text={`${task.title}`} />
                    </div>
                )) }
            </div>
          );
    
        return null;
      };


    const handleTaskClick = (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        setSelectedTask(task);
        setIsTaskDetails(!isTaskDetails);
    };
    

    if (loading) {
        return (
            <Loading />
        );
    }
    

  return (
    <div >

        <NavigationBar />

        <div className=' max-h-[75vh] overflow-y-auto ' > 

        {isTaskDetails && (

            <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
                <div className='bg-white  rounded-lg max-w-[80%] min-w-[50%] p-1'>
                        
                <button  onClick={handleTaskClick} type='button'  className='ml-auto flex p-2 items-center col-span-1 w-full justify-end'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                    
                <div className="relative bg-white/80 backdrop-blur-md shadow-xl rounded-xl p-4 transition-transform hover:scale-[1.02] space-y-3">

                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{selectedTask.title}</h3>
                            <p className="text-xs text-gray-500">Project: <span className="font-medium text-gray-700">{selectedTask.project_name}</span></p>
                            <p className="text-xs text-gray-500">Main Task: <span className="font-medium text-gray-700">{selectedTask.task_name}</span></p>
                        </div>

                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                selectedTask.status === "pending"
                                ? "bg-yellow-500/10 text-yellow-600"
                                : "bg-green-500/10 text-green-600"
                            }`}>
                                {selectedTask.status}
                            </span>
                        </div>

                        <p className="text-sm text-gray-700">{selectedTask.description}</p>
    
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold text-gray-800">Work Quality:</span> {selectedTask.work_quality}
                        </p>

                        <div className="text-sm text-gray-600">
                            <span className="font-medium">Date:</span> {selectedTask.date}
                        </div>

                        <div className="text-xs text-gray-500">
                            <span className="font-semibold text-gray-800">Start Time:</span> {selectedTask.start_time || "N/A"} → 
                            <span className="font-semibold text-gray-800 ml-2">End Time:</span> {selectedTask.end_time || "N/A"}
                        </div>
                    </div>
                </div>
            </div>
        )}

        <Calendar dateCellRender={dateCellRender}/>

        </div>

    </div>
  )
}
