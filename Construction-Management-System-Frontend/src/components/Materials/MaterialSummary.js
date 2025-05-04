
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import Loading from "../Loading";

export default function MaterialSummary(props) {

    const { projectId, taskId } = useParams(); 
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const fetchData = async () => {
      try {
        
        const response = await axios.get(`http://localhost:8000/api/materials-project/${projectId}`,{
          headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}`,},
        });
        setData(response.data);
        
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };


    useEffect(() => {

      if(!props.data){
        fetchData();
      }else{
        setData(props.data);
        setLoading(false);
      }

    }, [projectId,props.data]);


    //summary 

    const totalMaterial = data.reduce((acc, item) => acc + item.materials.length, 0);

    const finishedMaterial = data.reduce((acc, item) => {
      const count = item.materials.filter(m => m.status === 'Finished').length;
      return acc + count;
    }, 0);
    
    const pendingMaterial = data.reduce((acc, item) => {
      const count = item.materials.filter(m => m.status === 'Pending').length;
      return acc + count;
    }, 0);
  
    const finishedPercentage = totalMaterial > 0 ? (finishedMaterial / totalMaterial) * 100 : 0;
    

  
    if (loading) {
      return <Loading />;
    }

  return (
    <>


    {
        props.data ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-gray-200">

                <div className="p-2">
                <p className="text-sm text-gray-500">Total Materials </p>
                <p className="text-sm font-bold">{totalMaterial}</p>
                </div>
        
                <div className="p-2">
                <p className="text-sm text-gray-500">Finished</p>
                <p className="text-sm font-bold">{finishedMaterial}</p>
                </div>
        
                <div className="p-2">
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-sm font-bold">{pendingMaterial}</p>
                </div>
        
                <div className="p-2">
                <p className="text-sm text-gray-500">Finished</p>
                <p className="text-sm font-bold">{finishedPercentage.toFixed(1)}%</p>
                </div>
        
            </div>
        ) :

        (
              <div className="w-full max-w-md md:max-w-2xl mx-auto bg-white  p-6 rounded-xl ">
                <h2 className="text-lg font-semibold mb-6 text-gray-800 text-center">
                    Material Usage Summary
                </h2>
            
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-blue-100 rounded-lg">
                    <p className="text-sm text-gray-600">Total Logs</p>
                    <p className="text-xl font-bold text-blue-800">{totalMaterial}</p>
                    </div>
        
                    <div className="p-4 bg-green-100 rounded-lg">
                    <p className="text-sm text-gray-600">Finished</p>
                    <p className="text-xl font-bold text-green-800">{finishedMaterial}</p>
                    </div>
        
                    <div className="p-4 bg-yellow-100 rounded-lg">
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-xl font-bold text-yellow-800">{pendingMaterial}</p>
                    </div>
        
                    <div className="p-4 bg-purple-100 rounded-lg">
                    <p className="text-sm text-gray-600">Finished %</p>
                    <p className="text-xl font-bold text-purple-800">
                        {finishedPercentage.toFixed(1)}%
                    </p>
                    </div>
                </div>
            </div>
        )
    }

    </>
  )
}
