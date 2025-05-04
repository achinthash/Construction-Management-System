import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../Loading';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function TaskStatusChart() {

  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  useEffect(()=>{
    const tasks = async() =>{

    try{
        const response = await axios.get(`http://127.0.0.1:8000/api/tasks-project/${projectId}`,{
            headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}`  }
        });

      setLoading(false);
      setTasks(response.data);

    }catch(error){
      setLoading(false);
      console.error(error);
    }}

    tasks();

  },[projectId]);
  


  // --- Doughnut Chart: Task Status Distribution ---
  const statusCounts = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});
  
    const statusData = {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          data: Object.values(statusCounts),
          backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'],
        },
      ],
    };
    
  const statusOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: {
        display: true,
        text: 'Task Status Distribution',
        font: { size: 18 },
        color: '#000',
      },
    },
  };


  if (loading) {
    return (
        <Loading />
    );
  }



  return (
    <>
      <Doughnut data={statusData} options={statusOptions} />
    </>
  )
}
