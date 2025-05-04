import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Loading from '../../Loading';
import ResponseMessages from '../../ResponseMessages';
import EstActCostEdit from '../../Actual Cost/EstActCostEdit';

export default function DailyLogPurchaseOders(props) {

    //props.task_id
    const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([]);

    const setErrorMessage = useRef(null);
    const setSuccessMessage = useRef(null);

    
    
    const fetchWork = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/purchase-orders-work-date/${props.task_id}/${props.date}`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
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



        // update po log

  
    const markPoReceived = async(id) => {
        // e.preventDefault();
    
    
            try {
                const response = await axios.put(`http://127.0.0.1:8000/api/update-purchase-orders/${id}`,{
                status: 'Completed',
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
    
    
        const [exapndPoCost, setExapandPoCost] = useState('');
    
        const handleCostExpand =(id) =>{
            setExapandPoCost(id);
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
                        <th className="p-3 text-left">Status</th> 
                        <th className="p-3 text-left">Supplier </th> 
                        <th className="p-3 text-left">Delivery Date </th> 
             
                        {
                          ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                            <th className="p-3 text-left">Action</th> 

                          ) 
                        }
         
                        </tr>
                    </thead>
                    <tbody className="bg-gradient-to-r from-gray-100 to-gray-200 mb-1">

                        {
                            logs.map((po)=>(

                                <React.Fragment key={po.id}>
                                <tr onClick={()=>handleCostExpand(po.id)} className="border-b hover:bg-gray-300 mb-1">
                                    <td className="p-3">{po.id}</td>
                                    <td className="p-3 flex items-center gap-2">   {po.title}   </td>
                
                                    <td className="p-3 text-red-900"> {po.status}  </td> 

                                    <td className="p-3">{po.supplier_name}</td>
                                    <td className="p-3">{po.delivery_date}</td>

                                   
                                    { 
                                        ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                                            <td    className="p-3">     <button onClick={(e) => { e.stopPropagation(); markPoReceived(po.id);  }} className="px-3 py-1.5 rounded-lg text-white bg-green-500 cursor-pointer disabled:cursor-not-allowed  disabled:opacity-50" disabled={po.status === 'Completed'}>Received</button> 
                                        </td>
                                        )
                                    }
                                 
                                 
                                </tr> 


                                {exapndPoCost === po.id && (
                                    <tr className="bg-gray-100">
                                        <td colSpan={6}>
                                        <div className=" p-1 gap-1  mt-1">
                                            {po.cost_items.map((cost) => (
                                                <div key={cost.id} className="bg-white border border-gray-300 rounded-xl shadow p-4 hover:shadow-md transition-all" >
                        
                                                <div className="font-semibold text-lg text-violet-800 flex items-center justify-between mb-2"> <span>{cost.item_name}</span> 
                                                
                                                { 
                                                    ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                                                        <svg   onClick={()=>setIsEditEst(cost.estimation.id)} className='cursor-pointer'  xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                                                    )
                                                }
                                                
                                                </div>

                                                <div className="mt-2 text-sm text-gray-700 flex items-center justify-between ">
                                                    <div><strong>Quantity:</strong> {cost.estimation.actual_cost?.quantity ? cost.estimation.actual_cost.quantity : cost.quantity}</div>
                                                    <div><strong>Unit:</strong> { cost.estimation.actual_cost?.unit ? cost.estimation.actual_cost.unit : cost.unit}</div>
                                                    <div><strong>Unit Price:</strong> Rs. { cost.estimation.actual_cost?.unit_price ? cost.estimation.actual_cost.unit_price : cost.unit_price}</div>
                                                    <div><strong>Total:</strong> Rs. { cost.estimation.actual_cost?.total_amount ? cost.estimation.actual_cost.total_amount : cost.total_amount}</div>
                                                </div>
                                                </div>
                                            ))}
                                            </div>

                                        </td>
                                    </tr> 
                                )}
                               
                            </React.Fragment>

                                
                            ))
                        }
                       
                    </tbody>
                </table>
            </div>

    </div>
  )
}
