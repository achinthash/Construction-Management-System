import React, { useState, useEffect } from "react";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useParams } from "react-router-dom";
import axios from 'axios';

import Loading from "../Loading";

ChartJS.register(ArcElement, Tooltip, Legend);

const ProjectProgressChart = ({ color = '#8e44ad' }) => {

  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [progress, setData] = useState(0);


  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/project/${projectId}`, {
          headers: {Authorization: `Bearer ${sessionStorage.getItem('token')}` },  
        });

        setData(parseFloat(response.data.progress));

      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchData();
      
  }, [projectId]);


    // Doughnut chart

  const data = {
    datasets: [
      {
        data: [progress, 100 - progress],
        backgroundColor: [color, '#f0f0f0'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '70%',
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
  };

  if (loading) {
    return <Loading />;
  }


  return (
   

    <div className="flex flex-col  h-[350px]  ">
        <h2 className="text-2xl font-semibold text-center mt-6  text-black ">project Progress </h2>

        <div className="flex items-center justify-center mt-10  ">

          <div className="relative w-[160px] h-[160px] ">
          <Doughnut data={data} options={options} />

            <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-purple-700">
              {progress}%
            </div>
          </div>
              

        </div>
    </div>
  );
};

export default ProjectProgressChart;
