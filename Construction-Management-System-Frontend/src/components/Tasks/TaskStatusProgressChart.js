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

export default function TaskStatusProgressChart() {

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
  
  
  
  // --- Bar Chart: Task Progress ---
  const barData = {
    labels: tasks.map(task => task.name),
    datasets: [
      {
        label: 'Progress (%)',
        data: tasks.map(task => parseFloat(task.progress)),
        backgroundColor: '#3b82f6',
      },
    ],
  };
  
  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Task Progress by Task',
        font: { size: 18 },
        color: '#000',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: value => `${value}%`
        }
      },
    },
  };
  
  if (loading) {
    return (
        <Loading />
    );
  }


  return (
    <div className='max-h-[450px] '>
      <Bar data={barData} options={barOptions} />
    </div>
  )
}
