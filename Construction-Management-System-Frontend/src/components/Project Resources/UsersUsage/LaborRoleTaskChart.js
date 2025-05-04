

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import Loading from "../../Loading";

import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);


const LaborRoleTaskChart = () => {

  const { projectId, taskId } = useParams(); 
  const [loading, setLoading] = useState(true);
  const [users, setData] = useState([]);

    useEffect(()=>{

        const fetchData = async() =>{

            try{
        
                const response = await axios.get(`http://localhost:8000/api/user-logs-projects/${projectId}`,{
                    headers: {Authorization: `Bearer ${sessionStorage.getItem('token')}` },
                });
        
                setData(response.data);

                setLoading(false);
        
            }catch(error){
                console.error(error);
                setLoading(false);
            }
          }


          fetchData();
    },[projectId]);


   

   
    const positionCounts = {};
    users.forEach(user => {
      const position = user.user_position || "Unknown";
      positionCounts[position] = (positionCounts[position] || 0) + 1;
    });
    
    const labels = Object.keys(positionCounts);
    const counts = Object.values(positionCounts);
    


    if (loading) {
        return <Loading />;
    }

    const data = {
        labels: labels,
        datasets: [
          {
            label: 'Labor Positions',
            data: counts,
            backgroundColor: ['#f59e0b', '#ef4444', '#10b981'],
          },
        ],
      };
    
      const options = {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Task Assigned',
            color: '#000000',
            font: { size: 18 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };

    
  return (
    <div className="min-h-[300px] p-2" >
      
      <Bar data={data} options={options} />
    </div>
  );
};

export default LaborRoleTaskChart;
