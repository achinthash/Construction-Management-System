import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Loading from '../../Loading';
import ResponseMessages from '../../ResponseMessages';
import DefaultUser from '../../../assets/DefaultUser.png'
import EstActCostEdit from '../../Actual Cost/EstActCostEdit'

export default function DailyLogAssignees(props) {

  //  task_id

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([]);

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);

    const setErrorMessage = useRef(null);
    const setSuccessMessage = useRef(null);


  const fetchWork = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/user-logs-work-date/${props.task_id}/${props.date}`, {
        headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}` },
      });

      setLogs(response.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false); 
    }
  };
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchWork();
  }, [props.task_id,props.date]);


  const startWork = async(id) => {
    // e.preventDefault();

     try {
         const response = await axios.put(`http://127.0.0.1:8000/api/update-user-logs/${id}`,{
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
 
   const [workQuality, setWorkQuality] = useState({});


   const endWork = async(id) => {
    // e.preventDefault();

    const selectedQuality = workQuality[id];

     try {
         const response = await axios.put(`http://127.0.0.1:8000/api/update-user-logs/${id}`,{
            status: 'Finished',
            end_time : currentTime ,
            work_quality : selectedQuality
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


   const [exapndUserLog, setExapandUserLog] = useState('');

   const handleLogExpand =(id) =>{
    setExapandUserLog(id);
   }

   const [isEditEst, setIsEditEst] = useState(false)
   const [selectedEstimationId, setselectedEstimationId] = useState('');
   const [selectedUserId, setSelectedUserId] = useState('');

   const handleEdtiEst = (estimationId, userId) =>{
    setselectedEstimationId(estimationId);
    setSelectedUserId(userId);
    setIsEditEst(!isEditEst);

   }

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
                <button  onClick={()=>setIsEditEst(false)} type='button'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
                
                <EstActCostEdit est_id={selectedEstimationId} user_id={selectedUserId} />
                
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
                        <th className="p-3 text-left">Role</th> 
                        <th className="p-3 text-left">Position</th> 

                        <th className="p-3 text-left">Status</th> 
                        
                        <th className="p-3 text-left"> Work Quality</th>
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
                            logs.map((user)=>(

                                <React.Fragment key={user.id}>
                                <tr onClick={()=>handleLogExpand(user.id)} className="border-b hover:bg-gray-300 mb-1">
                                <td className="p-3">{user.id}</td>
                                <td className="p-3 flex items-center gap-2">
                                    {
                                        user.user_profile_picture ? 
                                        <img src={`http://127.0.0.1:8000/storage/${user.user_profile_picture}`} alt="User" className="w-8 h-8 rounded-full border border-gray-300" />
                                            :
                                        <img src={DefaultUser} alt="User" className="w-8 h-8 rounded-full border border-gray-300" />
                                    }
                                  {user.user_name}  
                                </td>
                
                                <td className="p-3">{user.user_role}</td>
                                <td className="p-3">{user.user_position}</td>

                                <td className="p-3 text-red-900"> {user.status}  </td> 
                                
                             
                                <td className="p-3">
                                    <select key={user.id}  className="    rounded-lg  w-full py-3 px-3 bg-white dark:bg-gray-800" name="work_quality"    value={workQuality[user.id] || ''} onChange={(e) => setWorkQuality({ ...workQuality, [user.id]: e.target.value })} >
                                        <option value={user.work_quality}> { user.work_quality ?  user.work_quality : 'Give Mark' }</option>
                                        <option value="Excellent">Excellent</option>
                                        <option value="Good">Good</option>
                                        <option value="Average">Average</option>
                                        <option value="Poor">Poor </option>
   
                                    </select>
                                </td>
                                    {
                                        user.start_time ?
                                            <td className="p-3"><span className="px-3 py-1.5 rounded-lg text-black bg-yellow-500 ">{user.start_time}</span> </td>
                                            :
                                            <td className="p-3"><span className="px-3 py-1.5 rounded-lg text-black  ">- - - -</span> </td>
                                    }

                                    {
                                        user.end_time ?
                                            <td className="p-3"><span className="px-3 py-1.5 rounded-lg text-black bg-orange-500 ">{user.end_time}</span> </td>
                                            :
                                            <td className="p-3"><span className="px-3 py-1.5 rounded-lg text-black  ">- - - -</span> </td>
                                    }
                              
                                {
                                  ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                                    user.status === 'Pending' ?
                                    <td  className="p-3"><button onClick={(e)=>{   e.stopPropagation(); startWork(user.id); }} className="px-3 py-1.5 rounded-lg text-white bg-green-500">Start</button> </td>
                                        :   user.status === 'In progress' ?
                                    <td className="p-3"> <button onClick={(e)=>{   e.stopPropagation(); endWork(user.id)}}  className="px-3 py-1.5 rounded-lg text-white bg-red-500">End</button> </td>
                                        :   <td  className="p-3"> <button   className="px-3 py-1.5 rounded-lg text-white bg-green-500 disabled:cursor-not-allowed  disabled:opacity-50" disabled={user.status === 'Finished'}>Start</button> </td>

                                  ) 
                                }


                                
                                </tr> 


                                {
                                    exapndUserLog === user.id ? 
                                    
                                    <tr className="border-b-2 border-black bg-white hover:bg-gray-100 transition duration-200">
                                        <td colSpan={9} className="p-4 ">

                                            <div className='w-full flex justify-center items-center flex-col'>
                                                <h2 className='text-lg font-bold'>  {user.title}</h2>

                                                <p className='text-base'>{user.description}</p>

                                              
                                                <div className="flex flex-row w-full space-y-1 text-sm text-gray-700 p-4  justify-between items-center">
                                                    <div><span className="font-medium text-gray-800">Rate:</span> Rs. {user.actual_cost_unit_price? user.actual_cost_unit_price : user.unit_price}</div>
                                                    <div><span className="font-medium text-gray-800">Total Cost:</span> Rs. { user.actual_cost_total_cost? user.actual_cost_total_cost : user.total_cost}</div>
                                                    <div><span className="font-medium text-gray-800">Work Hours:</span> { user.actual_cost_quantity ? user.actual_cost_quantity : user.quantity}</div>

                                                  { 
                                                    ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                                                      <svg  onClick={()=>handleEdtiEst(user.estimations_id, user.user_id)} className='cursor-pointer'  xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
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
