import React, { useState,useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';

import CustomSimpleTable from '../Tables/CustomSimpleTable';
import Loading from '../Loading';
import EditTaskDate from '../Tasks/EditTaskDate';
import DailyLogSelected from './DailyLogSelected';
import NewTaskDate from '../Tasks/NewTaskDate';

export default function DailyLogTasks() {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
  const { projectId, taskId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [itemEdit , setItemEdit] = useState("");
  const [isNewTaskDate, setIsNewTaskDate] = useState(false); 

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

        const response = await axios.get(`http://localhost:8000/api/tasks-logs-tasks/${projectId}/${taskId}`,{
          headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        });
        setData(response.data);

        setLoading(false);

      }catch(error){
        setLoading(false);
        console.error(error);
      }
    }

    fetchdata();

  },[projectId,taskId]);



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


 {/* new task date */}
 {
      isNewTaskDate && (
        <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
          <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[70%] '>
                  
            <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
              <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1"> New Task Date </h1>
              <button  onClick={()=>setIsNewTaskDate(false)} type='reset'  className='ml-auto items-center col-span-1'>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
            </div>
         
              <NewTaskDate />
          </div>
        </div>
      )
    }



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
              
              {/* <QualityControlSelected selectedId={itemView} /> */}
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

    <div className="bg-[#ddd6fee2]  dark:bg-gray-900 rounded flex  p-2 max-h-[10vh] my-1 mx-1 justify-between  ">
      <h1 className="text-left sm:text-xl font-bold text p-1.5 text-[#5c3c8f] dark:text-white">  Daily Logs</h1>
        {
          ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
            <button  onClick={()=>setIsNewTaskDate(true)} className=" py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>  </button>
          )
        }
      
    </div>
 

      <div className='mx-1 bg-white  ' >

        <CustomSimpleTable columns={columns} data={data} linkField="task-date" onDelete={handleDelete} onEdit={handleEdit} onView={handleView}   />

      </div>
    </div>
  )
}



