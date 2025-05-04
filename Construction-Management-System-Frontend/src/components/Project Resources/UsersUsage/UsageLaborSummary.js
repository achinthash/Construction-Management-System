import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import Loading from "../../Loading";

export default function UsageLaborSummary(props) {


  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/user-logs-projects/${projectId}`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
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
   
      }, [projectId]);
    
    
    const totalLogs = data.reduce((acc, item) => acc + (item.log?.length || 0), 0);

    const pendingLogs = data
    .reduce((acc,item)=>{
      const count = item.log.filter(item => item.status === 'Pending').length;
      return acc + count;
    },0);
  
    const finishedLogs = data
    .reduce((acc,item)=>{
      const count =   item.log.filter(item => item.status === 'Finished').length;
      return acc + count;
    },0);

    const finishedPercentage = (finishedLogs/totalLogs) * 100;
  

    
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
                <p className="text-sm font-bold">{totalLogs}</p>
                </div>
        
                <div className="p-2">
                <p className="text-sm text-gray-500">Finished</p>
                <p className="text-sm font-bold">{finishedLogs}</p>
                </div>
        
                <div className="p-2">
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-sm font-bold">{pendingLogs}</p>
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
                    Labor Usage Summary
                </h2>
            
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-blue-100 rounded-lg">
                    <p className="text-sm text-gray-600">Total Logs</p>
                    <p className="text-xl font-bold text-blue-800">{totalLogs}</p>
                    </div>
        
                    <div className="p-4 bg-green-100 rounded-lg">
                    <p className="text-sm text-gray-600">Finished</p>
                    <p className="text-xl font-bold text-green-800">{finishedLogs}</p>
                    </div>
        
                    <div className="p-4 bg-yellow-100 rounded-lg">
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-xl font-bold text-yellow-800">{pendingLogs}</p>
                    </div>
        
                    <div className="p-4 bg-purple-100 rounded-lg ">
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
