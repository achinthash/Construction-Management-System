import React, { useState,useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';

import NavigationBar from '../NavigationBar'
import Sidebar from '../Sidebar'
import Loading from '../Loading';
import EditTaskDate from '../Tasks/EditTaskDate';
import DailyLogSelected from './DailyLogSelected';
import CustomSimpleTable from '../Tables/CustomSimpleTable';

export default function DayLogsProjects() {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [itemEdit , setItemEdit] = useState(""); 
  
  const columns = [
      { id: 'id', label: 'ID' },
      
      { id: 'task_id', label: 'Task ID' },
      { id: 'date', label: 'Work Date' },
      { id: 'status', label: 'Status' },
      { id: 'start_time', label: 'Start Time' },
      { id: 'end_time', label: 'End Time' },
      ...(userInfo?.role === 'admin' ? [{ id: 'action', label: 'Action' }] : [])
  
  ];

   

    useEffect(()=>{

      const fetchdata = async() =>{
  
        try{
  
          const response = await axios.get(`http://localhost:8000/api/tasks-logs-projects/${projectId}`,{
            headers: { Authorization: `Bearer ${token}` }
          });
          setData(response.data);
          setLoading(false);
  
        }catch(error){
          setLoading(false);
          console.error(error);
        }
      }
  
      fetchdata();
  
    },[projectId]);

  // edit item

  const handleEdit  = (selectedId)=>{
    if(selectedId){
      setItemEdit(selectedId);
    }
  }
  
    const handleDelete = (projectId) => {
      setData(data.filter(projects => projects.id !== projectId));
    };
    
    const [itemView, setItemView] = useState('');
  
    const handleView  = (selectedId)=>{
      if(selectedId){
        setItemView(selectedId);
      }
    }

    if (loading) {
      return (
          <Loading />
      );
    }
    

  return (
    <div>
  
  
    {/* view daily log */}
    {
      itemView && (
        <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
          <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[70%] '>
                  
            <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
              <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1"> Daily Log Detail </h1>
              <button  onClick={()=>setItemView('')} type='reset'  className='ml-auto items-center col-span-1'>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
            </div>
              
              <DailyLogSelected selectedId={itemView} />
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
              <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  Edit Task Date </h1>
              <button  onClick={()=>setItemEdit('')} type='reset'  className='ml-auto items-center col-span-1'><svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
                          
              <EditTaskDate taskDateId={itemEdit}/> 
              
          </div>
        </div>
      )
    }

    <Sidebar />
    <NavigationBar />


    <div className="bg-[#ddd6fee2] sidebar-ml dark:bg-gray-900 rounded flex  p-2 max-h-[10vh] my-1 mx-1 justify-between  ">
      <h1 className="text-left sm:text-xl font-bold text p-1.5 text-[#5c3c8f] dark:text-white">Daily Logs</h1>
    </div>

    <div className='mx-1 bg-white  sidebar-ml' >
      <CustomSimpleTable columns={columns} data={data} linkField="task-date" onDelete={handleDelete} onEdit={handleEdit} onView={handleView}   />
    </div>

    </div>
  )
}



