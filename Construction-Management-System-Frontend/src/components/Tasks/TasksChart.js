import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Loading from '../Loading';
import SelectedTask from './SelectedTask';

export default function TasksChar() {

  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [isTaskDetails, setIsTaskDetails] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState("");

  const [data, setTasks] = useState([]);
  const [myChart, setMyChart] = useState(null);
  const [currentMonthValue, setCurrentMonthValue] = useState('');
  const [filterValue, setFilterValue] = useState('');

useEffect(()=>{
    const tasks = async() =>{

    try{
        const response = await axios.get(`http://127.0.0.1:8000/api/tasks-project/${projectId}`,{
            headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}`  }
        });

        const formattedData = response.data.map(entry => {
          const progressValue = parseFloat(entry.progress.replace('%', '')); // Convert progress to a number
          return {
            x: [entry.start_date, entry.end_date],
            y: ` Task: ${entry.id} | ${entry.name} | ${entry.progress}`,
            fullData: entry,
            backgroundColor: progressValue >= 100 ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 26, 104, 0.2)', 
            borderColor: progressValue >= 100 ? 'rgba(0, 255, 0, 1)' : 'rgba(255, 26, 104, 1)', 
          };
        });

      setLoading(false);
      setTasks(formattedData);
        
    }catch(error){
      setLoading(false);
      console.error(error);
    }}

    tasks();

},[projectId]);


useEffect(() => {
    if (data.length > 0) {
      const initializeChart = () => {
        if (myChart) {
          myChart.destroy();
        }
  
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
        setCurrentMonthValue(`${currentYear}-${currentMonth}`);
  
        const todayLine = {
          id: 'todayLine',
          beforeDatasetsDraw: (chart, args, pluginOptions) => {
            const { ctx, chartArea: { top, bottom }, scales: { x } } = chart;
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 6]);
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.moveTo(x.getPixelForValue(new Date()), top);
            ctx.lineTo(x.getPixelForValue(new Date()), bottom);
            ctx.stroke();
            ctx.restore();
          },
        };
  
        const rowHeight = 50;
  
        const config = {
          type: 'bar',
          data: {
            datasets: [{
              label: 'Tasks',
              data: data,
              backgroundColor: data.map(entry => entry.backgroundColor),
              borderColor: data.map(entry => entry.borderColor),
              borderWidth: 1,
              borderSkipped: false,
              barThickness: rowHeight - 10,
            }]
          },
          options: {
            indexAxis: 'y',
            maintainAspectRatio: false,
            scales: {
              x: {
                position: 'top',
                type: 'time',
                time: {
                  displayFormats: {
                    day: 'd',
                  },
                },
                min: `${currentYear}-${currentMonth}-01`,
                max: `${currentYear}-${currentMonth}-${new Date(currentYear, currentMonth, 0).getDate()}`,
              },
              y: {
                afterFit: (axis) => {
                  axis.paddingRight = 20;
                }
              }
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                displayColors: false,
                yAlign: 'bottom',
                callbacks: {
                  title: (context) => {
                    const dataIndex = context[0].dataIndex;
                    const taskName = data[dataIndex]?.y || '';
                    return ` ${taskName}`;
                  },
                  label: (context) => {
                    const startDate = new Date(context.raw.x[0]);
                    const endDate = new Date(context.raw.x[1]);
                    const formattedStartDate = startDate.toLocaleDateString([], {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    });
                    const formattedEndDate = endDate.toLocaleDateString([], {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    });
                    return ` Time Line: ${formattedStartDate} - ${formattedEndDate}`;
                  },
                },
              },
            },
          },
          plugins: [todayLine]
        };
  
        const ctx = document.getElementById('myChart').getContext('2d');
        const newChart = new Chart(ctx, config);
        setMyChart(newChart);
      };
  
      initializeChart();
    }
  }, [data]);
  

  useEffect(() => {
    if (myChart) {
      const handleClick = (event) => {
        const activePoints = myChart.getElementsAtEventForMode(event, 'nearest', { intersect: true });
        if (activePoints.length > 0) {
          const clickedElementIndex = activePoints[0].index;
          const clickedData = myChart.data.datasets[0].data[clickedElementIndex];
       
          handleTaskClick(clickedData.fullData.id);  // task details section !!!!
      
        }
      };

      const canvas = document.getElementById('myChart');
      canvas.onclick = handleClick;

      return () => {
        canvas.onclick = null;
      };
    }
  }, [myChart]);


  const chartFilter = (event) => {
    const date = event.target.value;
    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    updateChartRange(year, month);
  };


  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
    filterChartData(event.target.value);
  };


  const updateChartRange = (year, month) => {
    const lastDay = (y, m) => new Date(y, m, 0).getDate();
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-${lastDay(year, month)}`;

    if (myChart) {
      myChart.config.options.scales.x.min = startDate;
      myChart.config.options.scales.x.max = endDate;
      myChart.update();
    }
  };


  const filterChartData = (taskName) => {
    const filteredData = data.filter(entry => entry.y.includes(taskName));
  
    if (filteredData.length === 0) {
      const taskEntry = data.find(entry => entry.y.includes(taskName));
      if (taskEntry) {
        const [year, month] = taskEntry.x[0].split('-');
        updateChartRange(year, month);
        setFilterValue(taskName);
      }
    } else {
      if (myChart) {
        myChart.data.datasets[0].data = filteredData;
        myChart.update();
      }
    }
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
    <>

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

    
    <div className="bg-[#ddd6fee2]  dark:bg-gray-900  rounded p-2 mt-1 mr-1 ">
    <label>Select Month: </label>
     <input className='mr-5 py-1 px-2 rounded-lg border border-violet-950 ' defaultValue={currentMonthValue} type="month" onChange={chartFilter} /> 
     <input type="text" className="py-1 rounded-lg px-2 border border-violet-950" placeholder="Search Task" value={filterValue} onChange={handleFilterChange} />

   </div>
   

  <div className="chartCard max-h-[65vh] overflow-y-auto bg-gray-100 mt-1 rounded-lg">
    <div className="chartBox">
      <canvas id="myChart" style={{ height: `${data.length * 50}px` }}></canvas>
    </div>
  </div>

    </>
  )
}


