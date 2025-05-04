import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Loading from '../../Loading';
import ResponseMessages from '../../ResponseMessages';

import DefaultUser from '../../../assets/DefaultUser.png'
import EstActCostEdit from '../../Actual Cost/EstActCostEdit';

export default function DailyLogEquipments(props) {

    const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([]);

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);

    const setErrorMessage = useRef(null);
    const setSuccessMessage = useRef(null);

    

    const fetchWork = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/equipment-logs-work-date/${props.task_id}/${props.date}`, {
            headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}` },
          });
    
          setLogs(response.data);
  
        } catch (err) {
          console.error("Error fetching tasks:", err);
        } finally {
          setLoading(false); 
        }
      };
  
    useEffect(() => {
      fetchWork();
    }, [props.task_id,props.date]);
  
   // update user log

  

   const startWork = async(id) => {
    // e.preventDefault();

     try {
         const response = await axios.put(`http://127.0.0.1:8000/api/update-equipment-logs/${id}`,{
            status: 'In progress',
            start_time : currentTime ,
         },
         {
             headers: {
                 Authorization: `Bearer ${sessionStorage.getItem("token")}`,
             },
         }
         );
         setSuccessMessage.current(response.data.message);
         fetchWork();
       //  setWorkStart(true);
     } catch (error) {
         setLoading(false);
         setErrorMessage.current('Failed to update the log');
     }
   };
 



   const endWork = async(id) => {
    // e.preventDefault();



     try {
         const response = await axios.put(`http://127.0.0.1:8000/api/update-equipment-logs/${id}`,{
            status: 'Finished',
            end_time : currentTime ,
           
         },
         {
             headers: {
                 Authorization: `Bearer ${sessionStorage.getItem("token")}`,
             },
         }
         );
         setSuccessMessage.current(response.data.message);
         fetchWork();
      
     } catch (error) {
         setLoading(false);
         setErrorMessage.current('Failed to update the log');
     }
   };


   const [exapndLog, setExapandLog] = useState('');

   const handleLogExpand =(id) =>{
    setExapandLog(id);
   }
   const [isEditEst, setIsEditEst] = useState('');


   if (loading) {
    return (
        <Loading />
    );
  }


  return (
    <div>


        
    {/* EstActCostEdit Change Estimations  */}
    {
        isEditEst && (
          <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
            <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[70%] '>
                    
              <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 mb-2">
                <h1 className="text-left sm:text-xl font-bold ml-2 p-1.5 text-[#5c3c8f] col-span-1"> Change Estimations </h1>
                <button  onClick={()=>setIsEditEst('')} type='button'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
                
                <EstActCostEdit est_id={isEditEst} />
                
            </div>
          </div>
        )
      }

    <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>
        <div className="overflow-x-auto p-4 col-span-3 w-full ">
                <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
                    <thead className="bg-violet-200 text-black">
                        <tr>
                        <th className="p-3 text-left">Id</th>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Serial Number</th> 
                        <th className="p-3 text-left">Status</th> 
                        <th className="p-3 text-left"> Start Time </th>
                        <th className="p-3 text-left"> End Time  </th>
                        {
                          ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                            <th className="p-3 text-left">Action</th> 

                          ) 
                        }
         
                        </tr>
                    </thead>
                    <tbody className="bg-gradient-to-r from-gray-100 to-gray-200 mb-1">

                        {
                            logs.map((equipment)=>(

                                <React.Fragment key={equipment.id}>
                                <tr onClick={()=>handleLogExpand(equipment.id)} className="border-b hover:bg-gray-300 mb-1">
                                <td className="p-3">{equipment.id}</td>
                                <td className="p-3 flex items-center gap-2">
                                    {
                                        equipment.equipment_image ? 
                                        <img src={`http://127.0.0.1:8000/storage/${equipment.equipment_image}`} alt="User" className="w-8 h-8 rounded-full border border-gray-300" />
                                            :
                                        <img src={DefaultUser} alt="User" className="w-8 h-8 rounded-full border border-gray-300" />
                                    }
                                  {equipment.equipment_name}  
                                </td>
                
                                <td className="p-3">{equipment.equipment_serial_number}</td>
       

                                <td className="p-3 text-red-900"> {equipment.status}  </td> 
                                
                             
                                
                                    {
                                        equipment.start_time ?
                                            <td className="p-3"><span className="px-3 py-1.5 rounded-lg text-black bg-yellow-500 ">{equipment.start_time}</span> </td>
                                            :
                                            <td className="p-3"><span className="px-3 py-1.5 rounded-lg text-black  ">- - - -</span> </td>
                                    }

                                    {
                                        equipment.end_time ?
                                            <td className="p-3"><span className="px-3 py-1.5 rounded-lg text-black bg-orange-500 ">{equipment.end_time}</span> </td>
                                            :
                                            <td className="p-3"><span className="px-3 py-1.5 rounded-lg text-black  ">- - - -</span> </td>
                                    }

                                    {
                                      ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                                        equipment.status === 'Pending' ?
                                        <td className="p-3"><button  onClick={(e)=>{   e.stopPropagation(); startWork(equipment.id); }} className="px-3 py-1.5 rounded-lg text-white bg-green-500">Start</button> </td>
                                            :   equipment.status === 'In progress' ?
                                        <td  className="p-3"> <button onClick={(e)=>{   e.stopPropagation();  endWork(equipment.id); }} className="px-3 py-1.5 rounded-lg text-white bg-red-500">End</button> </td>
                                            :   <td  className="p-3"> <button className="px-3 py-1.5 rounded-lg text-white bg-green-500 disabled:cursor-not-allowed  disabled:opacity-50" disabled={equipment.status === 'Finished'}>Start</button> </td>

                                      ) 
                                    }
                              
                               

                                
                                </tr> 

                                {
                                    exapndLog === equipment.id ? 
                                    
                                    <tr className="border-b-2 border-black bg-white hover:bg-gray-100 transition duration-200">
                                        <td colSpan={9} className="p-4 ">

                                            <div className='w-full flex justify-center items-center flex-col'>
                                                <h2 className='text-lg font-bold'>  {equipment.title}</h2>

                                                <p className='text-base'>{equipment.description}</p>

                                              
                                                <div className="flex flex-row w-full space-y-1 text-sm text-gray-700 p-4  justify-between items-center">
                                                  
                                                    {/* <div><span className="font-medium text-gray-800">Hour Rate:</span> Rs.  {equipment.actual_cost_unit_price? equipment.actual_cost_unit_price : equipment.unit_price}</div> */}

                                                    <div><span className="font-medium text-gray-800">Rate:</span> Rs.  {equipment.actual_cost_unit_price? equipment.actual_cost_unit_price : equipment.unit_price}</div>
                                                    <div><span className="font-medium text-gray-800">Total Cost:</span> Rs. { equipment.actual_cost_total_cost? equipment.actual_cost_total_cost : equipment.total_cost}</div>
                                                    <div><span className="font-medium text-gray-800">Work Hours:</span> { equipment.actual_cost_quantity ? equipment.actual_cost_quantity : equipment.quantity}</div>
                                                  
                                                  { 
                                                    ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                                                      <svg onClick={()=>setIsEditEst(equipment.estimations_id)} className='cursor-pointer'  xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                                                    )
                                                  }

                                                   
                                                </div>
                                               
                                            </div>
                                      
                                        </td>

                                      
                                    </tr>





                                    : null
                                }


                                

                            </React.Fragment>

                                
                            ))
                        }
                       
                    </tbody>
                </table>
            </div>

    </div>
  )
}
