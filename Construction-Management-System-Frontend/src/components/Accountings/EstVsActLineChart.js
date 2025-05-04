
import ReactApexChart from 'react-apexcharts';
import React, { useState,useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';

import Loading from '../Loading';

export default function EstVsActLineChart() {

  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(()=>{

    const fetchData = async() =>{
      try{

        const response = await axios.get(`http://localhost:8000/api/estimation-taskwise/${projectId}`,{
          headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        });
          
          const categories = response.data.map(item => item.task_name);
          const estimationAmounts = response.data.map(item => item.total_estimated_cost);
          const actualCostAmounts = response.data.map(item =>
            item.total_actual_cost? parseFloat(item.total_actual_cost) : 0
          );

          setChartData(prevState=>({
            ...prevState,

            series:[

              {
                name: 'Estimations',
                data: estimationAmounts
              },

              {
                name: 'Actual',
                data: actualCostAmounts
              }
            ],

            options:{
              ...prevState.options,
              xaxis: {
                categories: categories
              }
            }
          })

          )
          
        setLoading(false);

      }catch(error){
        setLoading(false);
        console.error(error);
      }
    }

    fetchData();

  },[projectId]);


  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Estimations",
        data: [],
      },
      {
        name: "Actual",
        data: [],
      },
  
    ],
    options: {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [5, 5],
        curve: 'smooth',
        dashArray: [0, 0],
      },
      title: {
        text: 'Estimation Vs Actucal Cost',
        align: 'center',
      },
      legend: {
        tooltipHoverFormatter: function (val, opts) {
          return val + ' - <strong>' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + '</strong>';
        },
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6,
        },
      },
      xaxis: {
        categories: [],
      },
      yaxis: {
        title: {
          text: 'Total Amount'
        }
      },

      tooltip: {
        y: [
          {
            title: {
              formatter: function (val) {
                return val + " (mins)";
              },
            },
          },
          {
            title: {
              formatter: function (val) {
                return val + " per session";
              },
            },
          },
          {
            title: {
              formatter: function (val) {
                return val;
              },
            },
          },
        ],
      },
      grid: {
        borderColor: '#f1f1f1',
      },
    },
  });

  if (loading) {
    return (
      <Loading />
    );
  }
  return (
    <div className="p-6">
      <ReactApexChart options={chartData.options} series={chartData.series} type="line" height={350} />
    </div>
  );
}
