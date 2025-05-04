import React, { useState,useEffect,useRef } from 'react';
import axios from 'axios';
import Loading from '../../Loading'

import PayrPayrollUserTable from '../../Payroll/PayrollUserTable';
import WorkHistory from '../WorkHistory';
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

// start chart
const StarRating = ({ rating }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        style={{
          color: i <= rating ? '#ffc107' : '#e4e5e9',
          fontSize: '3rem',
          margin: '0 2px',
        }}
      >
        &#9733;
      </span>
    );
  }

  return <div>{stars}</div>;
};

export default function UserProgress({systemUser}) {

  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(()=>{

    const projectsList = async() =>{ 
      try{
        const response = await axios.get(`http://localhost:8000/api/my-tasks/${systemUser}`,{
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        });

        setData(response.data);
        setLoading(false);

      }catch(error){
        setLoading(false);
        console.error(error);
      }
    }
    projectsList();

  },[systemUser]);


  // work quality
  const totalWorkQuality = data.reduce((acc, item) => {
    if (item.work_quality) {
      return acc + parseInt(item.work_quality, 10);
    }
    return acc; 
  }, 0);


  // task summary
  const totalTasks = data.length;
  const workQuality = (totalWorkQuality/totalTasks) ;
  const pendingTasks = data.filter(item => item.status.toLowerCase() === 'pending').length;

  const totalEarned = data.reduce((acc, item) => {
    if (item.work_quality) {
      return acc + parseInt(item.work_quality, 10); 
    }
    return acc;
  }, 0);

 // Calculate Total Work Hours
 const totalWorkHours = data.reduce((acc, item) => {
    if (item.start_time && item.end_time) {
      const startTime = new Date(item.start_time);
      const endTime = new Date(item.end_time);
      const diffInMs = endTime - startTime; 
      const diffInHours = diffInMs / (1000 * 60 * 60); 
      return acc + diffInHours;
    }
    return acc;
  }, 0);

  

  // --- Doughnut Chart: Task Status Distribution ---
  const statusCounts = data.reduce((acc, task) => {
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
        font: { size: 16 },
        color: '#000',
      },
    },
  };
    
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="bg-[#ddd6fee2]  dark:bg-gray-900  rounded p-2 mt-1 mx-1 ">
        <h2 className='font-bold text-lg  px-3 ml-3 '> User Progress</h2>
        <div className='flex items-center  justify-between'> 

          <div className='flex flex-row mt-1'>
            <button  onClick={() => setActiveSection('dashboard')} className={`py-1 px-3 ms-2 text-xs font-bold rounded-md  focus:ring-blue-300  block ${activeSection === 'dashboard' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#c5b6de] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`}> Dashboard  </button>
            
            <button onClick={() => setActiveSection('pay-roll')}  className={`py-1 px-3 ms-2 text-xs font-bold rounded-md  focus:ring-blue-300  block ${  activeSection === 'pay-roll' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#c5b6de] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`} > Pay Roll  </button>

            <button onClick={() => setActiveSection('work-history')}  className={`py-1 px-3 ms-2 text-xs font-bold rounded-md  focus:ring-blue-300  block ${  activeSection === 'work-history' ? 'bg-[#6d28d9] text-white' : 'text-[#5c3c8f] bg-[#c5b6de] dark:bg-gray-500 hover:dark:bg-gray-400 hover:text-white hover:bg-blue-800' }`} > Work History  </button>

          </div>
          
        </div>

      </div>

      {/* Display Selected Section */}

      <div > 

        {activeSection === 'pay-roll' && <PayrPayrollUserTable />}
        {activeSection === 'work-history' && <WorkHistory />}

        {activeSection === 'dashboard' && 

          <div className='grid grid-cols-4 gap-2 p-2'> 
            <div className='col-span-4  md:col-span-2 lg:col-span-1 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl p-2 max-h-[300px]  flex justify-center items-center'> 
              <Doughnut data={statusData} options={statusOptions} />
            </div>

            <div className='col-span-4  md:col-span-2 lg:col-span-1 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl p-2 justify-center items-center  flex flex-col '> 
            <h2 className="text-xl font-semibold text-center mb-6 "> Work Quality </h2>
              <div className=' mb-8  '> 
                <StarRating rating={workQuality} />
                <p className='mb-4 text-center '>Rating: {workQuality.toFixed(2)} out of 5</p>
              </div>
            </div>

            <div className=" col-span-4  md:col-span-2 lg:col-span-2 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl p-2 justify-center ">
              <h2 className="text-xl font-semibold text-center mb-8 ">Task Summary</h2>
              
              <div className=" grid grid-cols-2 gap-2 ">
                <div className="bg-gray-100 p-4 rounded-lg shadow-sm flex items-center justify-between col-span-1">
                  <h3 className="text-lg font-medium">Total Earned</h3>
                  <p className="text-lg font-bold text-green-500">${totalEarned}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg shadow-sm flex items-center justify-between col-span-1">
                  <h3 className="text-lg font-medium">Total Tasks</h3>
                  <p className="text-lg font-bold">{totalTasks}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg shadow-sm flex items-center justify-between col-span-1">
                  <h3 className="text-lg font-medium">Pending Tasks</h3>
                  <p className="text-lg font-bold text-yellow-500">{pendingTasks}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg shadow-sm flex items-center justify-between col-span-1">
                  <h3 className="text-lg font-medium">Total Work Hours</h3>
                  <p className="text-lg font-bold text-blue-500">{totalWorkHours.toFixed(2)} hrs</p>
                </div>
              </div>
            </div>
          
          </div>
        }
      </div>
  
    </>
  )
}
