import React, { useState, useEffect, useRef } from 'react';

import axios from 'axios';
import Loading from '../Loading';
import { Link,useParams,useNavigate } from 'react-router-dom';
import ResponseMessages from '../ResponseMessages';

export default function AvailableTasks({setWorkStart}) {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
  const { projectId, taskId } = useParams();
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);

  const [work, setWork] = useState([]);
  const [error, setError] = useState(null);


  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);

  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];

  const Navigate = useNavigate();

    useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/work/${projectId}/${formattedDate}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setWork(response.data);
        setError(null); 
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("No task details available for this date.");
          setWork([]); 
        } else {
          console.error("Error fetching tasks:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId, token,formattedDate]);


  const startWork = async(id) => {
   // e.preventDefault();
   
    
    try {
        const response = await axios.put(`http://127.0.0.1:8000/api/update-task-date/${id}`,
        {
            status: 'In progress',
            start_time: currentTime,
        },
        {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        }
        );
  
        setWorkStart(id);
    } catch (error) {
        setLoading(false);
        setErrorMessage.current('Failed to update the task date');
    }
  };

  const continueWork = (id) => {
   setWorkStart(id);
  };


  
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-center text-gray-500">{error}</div>;
  }


  return (



    <div>
      <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>
      
      {
        work.map((work)=>(

          <div key={work.id} className="rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-4 mb-2  bg-white hover:bg-violet-50  dark:bg-gray-800 sidebar-ml">
  
            <div className="flex justify-between items-center p-1 text-sm">
              <p className="text-gray-600 dark:text-gray-300">{work.date || "No Date Available"}</p>
              <p className="text-green-500 font-medium">{work.status}</p> 
            </div>

            <h2 className="text-center text-xl font-bold text-gray-800 dark:text-white"> {work.task_name}</h2>

            <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-2"> {work.task_description}</p>

            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mt-3">
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-md dark:bg-red-700 dark:text-white"> Priority: {work.task_priority} </span>
              <span className="font-medium">Progress: {work.task_progress}%</span>
            </div>
        
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gray-800 dark:text-white">Date:</span> {work.date_position} →
              <span className="font-semibold text-gray-800 dark:text-white"> Total Dates:</span> {work.total_dates}
            </div>

            <div className="flex justify-between items-center mt-3 text-xs text-gray-500 dark:text-gray-400">
              <div>
                <span className="font-semibold text-gray-800 dark:text-white">Start:</span> {work.task_start_date} →
                <span className="font-semibold text-gray-800 dark:text-white"> End:</span> {work.task_end_date}
              </div>

              {
                work.status === 'Pending' ?
                  <button  onClick={()=>startWork(work.id)} disabled={userInfo?.role === 'client' || userInfo?.role === 'consultant' || userInfo?.role === 'labor' } className="disabled:cursor-not-allowed py-1.5 px-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700   rounded-lg "> Start </button> 
                
                : work.status === 'In progress' ?
                  <button  onClick={()=>continueWork(work.id)} className="py-1.5 px-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700   rounded-lg "> Continue </button> 
                
                :   <button  onClick={()=>continueWork(work.id)} className="py-1.5 px-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700   rounded-lg "> View </button> 
 
              }

    
            </div>

          </div>
        ))
      }

    </div>


    


  )
}
