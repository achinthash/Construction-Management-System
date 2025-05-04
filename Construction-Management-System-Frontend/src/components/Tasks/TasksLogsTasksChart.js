
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../Loading';

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const TasksLogsTasksChart = () => {

  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [rawTasks, setTasks] = useState([]);

  
  useEffect(()=>{
    const tasks = async() =>{

    try{
        const response = await axios.get(`http://127.0.0.1:8000/api/tasks-dates-project/${projectId}`,{
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

  // Labels and data for the pie chart
  const labels = rawTasks.map((task) => task.name);
  const logCounts = rawTasks.map((task) => task.dates?.length || 0);

  // Generate background colors
  const backgroundColors = [
    "rgba(255, 99, 132, 0.6)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(255, 206, 86, 0.6)",
    "rgba(75, 192, 192, 0.6)",
    "rgba(153, 102, 255, 0.6)",
  ];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Task Log Count",
        data: logCounts,
        backgroundColor: backgroundColors,
        borderColor: "rgba(255,255,255,0.9)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Log Entries per Task",
        font: { size: 18 },
        color: '#000',
      },
      legend: {
        position: "bottom",
      },
    },
  };

  
  if (loading) {
    return (
        <Loading />
    );
  }

  
  return (
    <div className="max-h-[350px] flex items-center justify-center">
      <Pie data={data} options={options} />
    </div>
  );
};

export default TasksLogsTasksChart;

