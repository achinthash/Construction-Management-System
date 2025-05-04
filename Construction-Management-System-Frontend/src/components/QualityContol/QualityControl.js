import React, { useState} from 'react';
import { useParams } from "react-router-dom";

import Sidebar from '../Sidebar';
import NavigationBar from '../NavigationBar';
import QualityControlTable from './QualityControlTable';
import NewQualityControl from './NewQualityControl';
import QualityControlTableTask from './QualityControlTableTask';

export default function QualityControl() {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
  const { projectId, taskId } = useParams();
  const [isNewQulityControl, setIsQulityControl] = useState(false);

 
  return (
    <div>


    {
      !taskId && (
       <>
        <Sidebar />
        <NavigationBar />
       </>
      )
       
    }
        
        {/* new quality control */}
        
      {
        isNewQulityControl && (
            <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
            <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[70%] '>
                    
              <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
                <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  New Quality Control </h1>
                <button  onClick={()=>setIsQulityControl(false)} type='reset'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
                
                <NewQualityControl />
                
            </div>
          </div>
        )
      }


      <div  className={`bg-[#ddd6fee2] ${taskId ? 'ml-1' : 'sidebar-ml'}  dark:bg-gray-900  rounded flex  p-2  my-1 mx-1 justify-between `}>
        <h1 className="text-left sm:text-xl font-bold text p-2 text-[#5c3c8f] dark:text-white ">Quality Control </h1> 

        {
          ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
          <>
            <button onClick={()=>setIsQulityControl(true)}  className="py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 hidden md:block"> New Quality Control  </button>
            <button  onClick={()=>setIsQulityControl(true)} className="md:hidden block py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>  </button>
          </>
       )}
                   
      </div>

      {
        taskId ? 

        <div className=' max-h-[75vh] overflow-y-auto '>
          <QualityControlTableTask />
        </div> : 

        <div className=' sidebar-ml max-h-[75vh] overflow-y-auto '>
          <QualityControlTable />
        </div>
      }




    </div>
  )
}
