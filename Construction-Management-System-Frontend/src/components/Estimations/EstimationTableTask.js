import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import Loading from "../Loading";
import NewEstimation from "./NewEstimation";

import CustomSimpleTable from '../Tables/CustomSimpleTable';
import EditEstimation from './EditEstimation';

export default function EstimationTableTask() {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
    const { projectId, taskId } = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [token, setToken] = useState(sessionStorage.getItem("token") || "");

    const [itemEdit , setItemEdit] = useState(""); 
    const [isNewEstimation, setIsNewEstimation] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://127.0.0.1:8000/api/estimation-tasks/${taskId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
    
            setData(response.data);
          } catch (error) {
            console.error(error);
          }
          setLoading(false);
        };
    
        fetchData();
      }, [taskId]);
    
  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'title', label: 'Title' },
    { id: 'cost_type', label: 'Cost Type' },
    { id: 'unit', label: 'Unit' },
    { id: 'unit_price', label: 'Unit Price' },
    { id: 'quantity', label: 'Quantity' },
    { id: 'total_cost', label: 'Total Cost' },

    ...(userInfo?.role === 'admin' ? [{ id: 'action', label: 'Action' }] : [])

  ];

  // edit item


  const handleEdit  = (selectedId)=>{
    if(selectedId){
      setItemEdit(selectedId);
    }
  }

  const handleDelete = (projectId) => {
    setData(data.filter(projects => projects.id !== projectId));
  };
  

  if (loading) {
    return <Loading />;
  }


  return (
    <div>

      {
        isNewEstimation && (
            <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
            <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[70%] '>
                    
              <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
                <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  New Estimation </h1>
                <button  onClick={()=>setIsNewEstimation(false)} type='reset'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
                
                <NewEstimation />
                
            </div>
          </div>
        )
      }

      {/* edit item */}
      {
      itemEdit && (
        <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
          <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] '>  
            <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
              <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  Edit Project </h1>
              <button  onClick={()=>setItemEdit('')} type='reset'  className='ml-auto items-center col-span-1'><svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
                          
              <EditEstimation estimationId={itemEdit}/> 
              
          </div>
        </div>
      )
    }
        
      <div className="bg-[#cec8ecb7]  dark:bg-gray-900  rounded p-1.5 mt-1 mr-1 flex justify-between items-center ">
        <h1 className="text-left sm:text-xl font-bold text p-1 text-[#5c3c8f] dark:text-white ">Task Estimations</h1>
        {
          ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
            <button onClick={()=>setIsNewEstimation(true)} className="py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg> </button>
          )
        }
      </div>

      <div className='mx-1 bg-white overflow-y-auto mt-1'>
        <CustomSimpleTable columns={columns} data={data} linkField="estimation"  onDelete={handleDelete} onEdit={handleEdit}    />
      </div>

    </div>
  )
}
