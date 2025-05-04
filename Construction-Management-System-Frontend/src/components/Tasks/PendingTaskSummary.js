
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../Loading';
import dayjs from "dayjs";

const PendingTaskSummary = () => {

  const today = dayjs();
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [taskData, setTasks] = useState([]);

  useEffect(()=>{
    const tasks = async() =>{

    try{
      const response = await axios.get(`http://127.0.0.1:8000/api/tasks-project/${projectId}`,{
          headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}`  }
      });

      setLoading(false);
      const pendingTasks = response.data.filter(item =>item.status === 'Pending');
      setTasks(pendingTasks);
        
    }catch(error){
      setLoading(false);
      console.error(error);
    }}

    tasks();

  },[projectId]);

 

  if (loading) {
    return (
        <Loading />
    );
  }

  return (
    <div className="max-w-lg mx-auto  bg-white p-6 rounded-lg ">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
        Upcoming Pending Tasks
      </h2>
      {taskData.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {taskData.map((task) => (
            <li
              key={task.id}
              className="flex justify-between items-center py-3"
            >
              <div>
                <p className="font-medium text-gray-700">{task.name}</p>
                <p className="text-sm text-gray-500">
                  {dayjs(task.start_date).format("MMM D")} -{" "}
                  {dayjs(task.end_date).format("MMM D")}
                </p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">
                {task.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 ">No upcoming pending tasks.</p>
      )}
    </div>
  );
};

export default PendingTaskSummary;

