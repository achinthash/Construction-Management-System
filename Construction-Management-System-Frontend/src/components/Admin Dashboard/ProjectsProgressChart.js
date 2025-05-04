import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale,ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

export default function ProjectsProgressChart({projects}) {

    // bar chart
    const chartData = {
        labels: projects.map(project => project.name),
        datasets: [{
            label: 'Progress (%)',
            data: projects.map(project => parseInt(project.progress, 10)),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw}%`;
                    }
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Projects'
                }
            },
            y: {
                beginAtZero: true,
                max: 100,
                title: {
                    display: true,
                    text: 'Progress (%)'
                }
            }
        }
    };

    
    // --- Doughnut Chart: Task Status Distribution ---
    const statusCounts = projects.reduce((acc, task) => {
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


  return (
    <div className='grid grid-cols-4 gap-2'>

        <div className='col-span-4 md:col-span-4 lg:lg:col-span-1 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl max-h-[350px] flex items-center justify-center'>
            <Doughnut data={statusData} options={statusOptions} />
        </div>

        
        <div className='col-span-4 md:col-span-4 lg:lg:col-span-3 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl  max-h-[350px] flex items justify-center'>
            <Bar data={chartData} options={options} />
        </div>
       
    </div>
  )
}
