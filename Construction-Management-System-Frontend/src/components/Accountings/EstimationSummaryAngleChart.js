

import ReactApexChart from 'react-apexcharts';
import React, { useState,useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';

import Loading from '../Loading'

export default function EstimationSummaryAngleChart() {

  const [data, setData] = useState([]);
  const { projectId } = useParams();;
  const [loading, setLoading] = useState(true);

  useEffect(()=>{

    const fetchData = async() =>{
      try{

        const response = await axios.get(`http://localhost:8000/api/estimation-summary/1`,{
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`  }
        });
          
          setData(response.data);

          const labels = response.data.cost_types.map(item => item.cost_type);
          const costTypes = response.data.cost_types;
          const rawValues = costTypes.map(item => parseFloat(item.total_cost));
          const totalSum = rawValues.reduce((sum, value) => sum + value, 0);
          const series = rawValues.map(value => ((value / totalSum) * 100).toFixed(2)); 

          setState(prevState => ({
            ...prevState,
            options: {
              chart: {
                type: 'donut',
              },
              
              labels: labels,
            },
           series: series
          }));
          
        setLoading(false);

      }catch(error){
        setLoading(false);
        console.error(error);
      }
    }

    fetchData();

  },[projectId]);


  const [state, setState] = React.useState({
          
    series: [],
    options: {
      chart: {
        height: 100,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: '22px',
            },
            value: {
              fontSize: '16px',
            },
            total: {
              show: true,
              label: 'Total',
              formatter: function (w) {
              
                return 249
              }
              
            }
          }
        }
      },
      labels: [],
    },
  
  
});



if (loading) {
    return (
        <Loading />
    );
}

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 text-center ">Estimation Summary</h2>
      <div id="chart">
        <ReactApexChart options={state.options} series={state.series} type="radialBar" height={200} />
      </div>
      <div id="html-dist"></div>
      
      <div id="html-dist" className='justify-center text-center text-xs'>
        {data.cost_types.map((item, index) => (
          <div key={index}>
            {item.cost_type}: {item.total_cost}
          </div>
        ))}
        <div> Total Amount:  {data.overall_total_cost}  </div>
      </div>  

    </div>
  );
}
