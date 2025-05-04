import React, { useState, useEffect,useRef } from "react";
import { useParams } from 'react-router-dom';

import axios from "axios";
import Loading from '../Loading';
import EquipmentAvailability from './EquipmentAvailability';
import ResponseMessages from '../ResponseMessages';
import EditEquipmentLog from './EditEquipmentLog'

export default function TaskAssignedEquipments() {

    const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
    const { projectId, taskId } = useParams(); 
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(sessionStorage.getItem("token") || "");
    const [isEquipmentAvailability, setIsEquipmentAvailability] = useState(false);
    const [equipmentLogs, setEquipmentLogs] = useState([]);
    const [selectedEquipmentId, setSelectedEqupmentId] = useState(null);
    const [isEditLog, setisEditLog] = useState('');
    
    const setErrorMessage = useRef(null);
    const setSuccessMessage = useRef(null);


    useEffect(()=>{

        const equipmentLogs = async() =>{
    
          try{
    
            const response = await axios.get(`http://localhost:8000/api/equipment-logs/${taskId}`,{
              headers: { Authorization: `Bearer ${token}` }
            });

            setLoading(false);
            setEquipmentLogs(response.data);

          }catch(error){

           setLoading(false);
            console.error(error);
          }
        }
    
        equipmentLogs();
    
      },[taskId]);



    
    // check user is available 
    const EquipmentlogExtra = (equipmentId) =>{
      setSelectedEqupmentId(selectedEquipmentId === equipmentId ? null : equipmentId);
    }
 // delete 

  const deleteEquipmentLogs = async (id) => {
    if (window.confirm(`Are you sure you want to delete this Equipment Log`)) {
      try {
        const response =  await axios.delete(`http://localhost:8000/api/delete-equipment-log/${id}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
      });
      setSuccessMessage.current(response.data.message);

      //   fetchData();
      } catch (error) {
        setErrorMessage.current(`Error deleting Equipment Lo:`, error);
      }
    }
  };


    if (loading) {
      return (
          <Loading />
      );
    }
  
  return (
    <div>
        
          {/* equipment Availability  */}
      {
        isEquipmentAvailability && (
          <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
            <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[70%] '>
                    
              <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 mb-2">
                <h1 className="text-left sm:text-xl font-bold ml-2 p-1.5 text-[#5c3c8f] col-span-1">  Equipment Availability  </h1>
                <button  onClick={()=>setIsEquipmentAvailability(false)} type='button'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
                
                <EquipmentAvailability />
                
            </div>
          </div>
        )
      }

       {/* Edit Equipment logs */}
    {
      isEditLog && (
        <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
          <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[80%]'>
                  
            <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
              <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1"> Edit Equipment Log </h1>
              <button  onClick={()=>setisEditLog('')} type='reset'  className='ml-auto items-center col-span-1'>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
            </div>
              
              <EditEquipmentLog selectedEquipmentId={isEditLog} />
              
          </div>
        </div>
      )
    }


      <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>
        
        <div className="bg-[#cec8ecb7]  dark:bg-gray-900  rounded p-1.5 mt-1 mr-1 flex justify-between items-center ">
          <h1 className="text-left sm:text-xl font-bold text p-1 text-[#5c3c8f] dark:text-white ">Equipment Assignee</h1>
          {
            ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
              <button onClick={()=>setIsEquipmentAvailability(true)}  className="py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg> </button>
            )
          }
            
        </div>


        {
          equipmentLogs.map((equipment) =>(


            <div key={equipment.equipment_id}  >
             
              <div  onClick={()=>EquipmentlogExtra(equipment.equipment_id)} className="p-4 bg-white shadow-md rounded-lg border border-gray-200 grid grid-cols-4 gap-2 w-full cursor-pointer hover:bg-violet-100 mt-2">
                <div className="flex items-center gap-4 col-span-2">
                  <img src={`http://localhost:8000/storage/${equipment.equipment_image}`}   alt={equipment.equipment_name}  className="w-12 h-12 rounded-full object-cover border border-gray-300"/>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{equipment.equipment_name}</h2>
                    <p className="text-sm text-gray-600">{equipment.equipment_serial_number}</p>
                    <p className="text-sm text-gray-600">{equipment.equipment_category}</p>
                  </div>
                </div>

                <div className='col-span-1 items-center '> 
                  <p className={`text-sm ${equipment.equipment_status === 'active' ? 'text-green-500' : ' text-red-500 '}`}>Status: {equipment.equipment_status}</p>
                </div>

                <div className="col-span-1 flex flex-col  items-start space-y-2 ">
                  <p className="text-sm text-gray-600">Progress: <span className="font-medium text-blue-600">{equipment.progress_percentage}%</span></p>
                 
                  <p className="text-sm text-gray-600">Allocated Dates: <span className="font-medium text-gray-800">{equipment.allocated_dates}</span></p>
                </div>

              </div>

               {/* User Logs */}

              <div className='col-span-4 w-full bg-gray-100 p-2  '> 
                {
                  selectedEquipmentId === equipment.equipment_id && equipment.log && equipment.log.map((log, index) => (
                    <div key={index} className="p-4 bg-gray-100 hover:bg-violet-100 rounded-lg my-2 shadow-lg  transition-all duration-300 ease-in-out">


                      <div className='flex items-center justify-between w-full'>
                   
                          <h3 className="text-lg font-semibold text-gray-800">#{log.id} - {log.title}</h3>
                         
                          
                          <div className='flex space-x-4 '>
                          <p>Status: <span className={`font-medium ${log.status === 'completed' ? 'text-green-500' : 'text-red-500'}`}>{log.status}</span></p>

                          {
                            ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                            <>
                                <svg onClick={()=>setisEditLog(log.id)} xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#000000"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                                <svg onClick={()=>deleteEquipmentLogs(log.id)} xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#000000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>

                              </>
                            )
                          }
                           
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2  ">

                        <p className="text-sm text-gray-500">Date: {log.date}</p>
                        <p className="text-sm text-gray-700 mt-2">{log.description}</p>

                        <div className="flex space-x-4 text-sm text-gray-600 mt-2 justify-between">
                          <div className='flex justify-between  space-x-4 '>
                            <p>Start Time: {log.start_time ? log.start_time : 'N/A'}</p> 
                             <p>End Time: {log.end_time?log.end_time: 'N/A'}</p>
                          </div>
                         
                        </div>

                      </div>

                    </div>

                  ))
                }
              </div>

            </div>

            
          ) )
        }

    </div>
  )
}
