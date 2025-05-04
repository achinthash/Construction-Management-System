

import React, { useState, useEffect } from 'react';
import { Calendar, Badge } from 'antd';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Loading from '../Loading';
import SelectedTask from './SelectedTask';

export default function TasksCalender() {

    const { projectId } = useParams();
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState([]);

    const [isTaskDetails, setIsTaskDetails] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState("");



    useEffect(()=>{
        const tasks = async() =>{
    
        try{
            const response = await axios.get(`http://127.0.0.1:8000/api/tasksDates/${projectId}`,{
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`  }
            });

          setLoading(false);
          setTasks(response.data);
            
        }catch(error){
          setLoading(false);
          console.error(error);
        }}
    
        tasks();
    
    },[projectId]);


      const dateCellRender = (value) => {
        const formattedDate  = value.format('YYYY-MM-DD');
        const tasksForDate = tasks.filter(task => task.date === formattedDate);
       
          return (
            <div className="events">
              {
                tasksForDate.map(task=>(
                    <div  key={task.id}  onClick={() => handleTaskClick(task.id)}>
                        <Badge  status={task.status === 'pending' ? 'success' : 'warning'} text={`${task.name}`} />
                    </div>
                )) }
            </div>
          );
    
        return null;
      };

    const handleTaskClick = (taskId) =>{
      setSelectedTaskId(taskId);
      setIsTaskDetails(!isTaskDetails);
    }



    if (loading) {
      return (
          <Loading />
      );
    }
    

  return (
    <div className=' max-h-[75vh] overflow-y-auto '>


        {isTaskDetails && (

            <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
                <div className='bg-white  rounded-lg max-w-[80%] min-w-[50%] p-1'>
                        
                <button  onClick={handleTaskClick} type='button'  className='ml-auto flex p-2 items-center col-span-1 w-full justify-end'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                    
                <SelectedTask selectedTaskId={selectedTaskId}/>
                    
                </div>
            </div>
        )}

        <Calendar dateCellRender={dateCellRender}/>
    </div>
  )
}
