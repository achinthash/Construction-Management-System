

import React, { useState,useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';

import Loading from '../Loading';

const ActualCostSummary = () => {

  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(()=>{

    const fetchData = async() =>{
      try{

        const response = await axios.get(`http://localhost:8000/api/estimation-with-actual-project/${projectId}`,{
          headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        });

        setData(response.data);
        setLoading(false);

      }catch(error){
        setLoading(false);
        console.error(error);
      }
    }
    fetchData();

  },[projectId]);


    // summary
  const totalItems = data.length;
  const completedItems = data.filter((item) => item.actual_cost).length;

  const totalEstimated = data.reduce((sum, item) => sum + parseFloat(item.total_cost), 0);
  const totalActual = data.reduce((sum, item) => sum + (item.actual_cost ? parseFloat(item.actual_cost.total_cost) : 0), 0);
  const variance = totalActual - totalEstimated;

  if (loading) {
    return (
        <Loading />
    );
  }
    
  return (


    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 p-2 bg-gray-100">

      <div className=" ">
          <h2 className="text-sm font-semibold ">Total Estimated Cost</h2>
          <p className="text-sm font-bold text-blue-600">LKR {totalEstimated.toLocaleString()}</p>
      </div>

      <div className=" ">
          <h2 className="text-sm font-semibold ">Total Actual Cost</h2>
          <p className="text-sm font-bold text-green-600">LKR {totalActual.toLocaleString()}</p>
      </div>

      <div className=" ">
          <h2 className="text-sm font-semibold ">Cost Variance</h2>
          <p className={`text-sm font-bold ${variance < 0 ? "text-red-500" : "text-yellow-500"}`}>
          LKR {variance.toLocaleString()}
          </p>
      </div>
      <div className=" ">
          <span className='flex'><h2 className="text-sm font-semibold ">Completion Rate: </h2>
          <p className="text-sm font-bold text-purple-600">
              {((completedItems / totalItems) * 100).toFixed(1)}%
          </p></span>
          <p className="text-sm text-gray-500">
              ({completedItems} out of {totalItems} items completed)
          </p>
      </div>

    </div>

  );
};

export default ActualCostSummary;
