import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Loading from '../../Loading';
import ResponseMessages from '../../ResponseMessages';

import { FaTasks } from 'react-icons/fa';
import EstActCostEdit from '../../Actual Cost/EstActCostEdit';

export default function DailyLogMaterials(props) {

    //props.task_id
    const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([]);
    const setErrorMessage = useRef(null);
    const setSuccessMessage = useRef(null);

    const fetchWork = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/material-logs-work-date/${props.task_id}/${props.date}`, {
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
  
  
    // update material log

  
     const markMaterialAsUsed = async(id) => {
      // e.preventDefault();

  
       try {
           const response = await axios.put(`http://127.0.0.1:8000/api/update-material-logs/${id}`,{
              status: 'Finished',
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

    <div className='p-2 bg-gray-200 '>
        {
            logs.map((material)=>(
              <div key={material.id} className='w-full p-3  bg-white rounded-lg shadow-md mb-2'>
                <div className='mb-2'>
                    <div className='flex justify-between items-center'>
                        <span className='flex items-center space-x-2'>
                            <FaTasks className="text-xl text-blue-600" />
                            <span className='text-sm text-gray-600'>{material.id}</span>
                            <h2 className='text-xl font-semibold text-gray-800'>{material.title}</h2>
                        </span>
                        <p className='text-base font-semibold text-orange-800'>{material.status} </p>
            
                        { 
                          ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                            <button onClick={(e) => { e.stopPropagation();    markMaterialAsUsed(material.id);   }}className="px-3 py-1.5 rounded-lg text-white bg-green-500 cursor-pointe disabled:cursor-not-allowed  disabled:opacity-50 " disabled={material.status === 'Finished'}>  Use </button>
                          )
                        }
                        
                    </div>
                    <h2 className='text-lg text-gray-600 mt-2'>{material.description}</h2>
                </div>
               
                <div className='flex justify-between items-center bg-gray-100 p-4 rounded-lg'>

                    <p className='font-medium text-gray-700 text-sm w-1/4'>Unit: {material.actual_cost_unit ? material.actual_cost_unit : material.unit}</p>
                    <p className='font-medium text-gray-700 text-sm w-1/4'>Unit Price: Rs. { material.actual_cost_unit_price ? material.actual_cost_unit_price : material.unit_price}</p>
                    <p className='font-medium text-gray-700 text-sm w-1/4'>Quantity: { material.actual_cost_quantity ? material.actual_cost_quantity : material.quantity}  </p>
                    <p className='font-medium text-gray-700 text-sm w-1/4 text-right'>Total Cost: Rs. { material.actual_cost_total_cost ? material.actual_cost_total_cost : material.total_cost} </p>

                    { 
                      ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                        <p> <svg onClick={()=>setIsEditEst(material.estimations_id)} className='cursor-pointer ml-4'   xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></p> 
                      )
                    }
                </div>
            </div>
            ) 
        )}
    </div>
   
       
   



    </div>
  )
}
