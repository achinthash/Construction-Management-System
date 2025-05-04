import React, { useState, useEffect, useRef } from 'react';
import { Link,useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../Loading';

export default function TaskDurationSummary() {


    const { projectId } = useParams();
    const [token, setToken] = useState(sessionStorage.getItem("token") || "");
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
  
    
    useEffect(()=>{
      const tasks = async() =>{
  
      try{
          const response = await axios.get(`http://127.0.0.1:8000/api/tasks-project/${projectId}`,{
              headers: { Authorization: `Bearer ${token}` }
          });
  
  
        setLoading(false);
        setTasks(response.data);
  
          
      }catch(error){
        setLoading(false);
        console.error(error);
      }}
  
      tasks();
  
    },[projectId]);
  
  


  return (
    
    <div className='bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl p-4 '>

        <h2 className="text-lg font-semibold mb-6 text-gray-800 text-center">Labor Usage Summary </h2>

        <div className="relative flex items-start justify-between w-full  py-10 overflow-x-auto  ">
       
            <div className="absolute top-[50px] left-0 right-0 h-0.5 bg-gray-300 z-0 w-full min-w-max overflow-x-auto"></div>

                {tasks.map((task, index) => (
                <div key={task.id} className="relative flex flex-col items-center text-center z-10 min-w-[180px] mx-2">
                    
                    <div className={`w-5 h-5 ${task.status === 'Finished' ? 'bg-orange-500': 'bg-green-400'}   rounded-full border-2 border-white shadow-md z-10`}></div>

                    <div className="mt-2 text-sm text-gray-500">
                    {task.start_date} - {task.end_date}
                    </div>

                    <div className="mt-1 text-purple-800 font-bold">
                  
                    <div className="text-sm mt-1 whitespace-normal">{task.name}</div>
                    </div>
                </div>
                ))}
        </div>



    </div>

   
  )
}



