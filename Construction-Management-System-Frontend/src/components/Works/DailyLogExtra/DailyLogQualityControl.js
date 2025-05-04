import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaTasks } from 'react-icons/fa';

import Loading from '../../Loading';
import ResponseMessages from '../../ResponseMessages';
import NewImage from '../../Project Gallery/NewImage'

export default function DailyLogQualityControl(props) {

        //props.task_id
        const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
        const [loading, setLoading] = useState(true);
        const [logs, setLogs] = useState([]);
        const currentDate = new Date().toISOString().split('T')[0];
        const setErrorMessage = useRef(null);
        const setSuccessMessage = useRef(null);
    
        
        
    const fetchWork = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/quality-controls-work-date/${props.task_id}/${props.date}`, {
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




      
      const [exapndQa, setExapandQa] = useState('');
    
      const handleQaExpand =(id) =>{
        setExapandQa(id);
      }
  
//

        // update po log
    const [status, setStatus] = useState({});
    const [comment, setComment] = useState({});
    const [action_required, setAction_required] = useState({});
    const [resolution_date, setResolution_date] = useState({});
    
    
    
    
  
    const markQaChecked = async(id) => {
            // e.preventDefault();

           
            
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/update-quality-controls/${id}`,{
            status: status[id],

    
            checked_by  : userInfo.id ,
            checked_date :  currentDate,
            comment : comment[id] ,
            action_required : action_required[id] ,
            resolution_date : resolution_date[id] ,


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

    const [newImageFor, setNewImageFor] = useState(null);

    const handleNewImage = (id) => {
        if (newImageFor === id) {
          setNewImageFor(null); // Close if same ID clicked again
        } else {
          setNewImageFor(id);
        }
      };
      
  
  

    if (loading) {
    return (
        <Loading />
    );
    }

  return (
    <div>
        
    <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>
      

    <div className="bg-white p-6 rounded-2xl shadow-md text-sm space-y-4">
     

    
        {
            logs.map((inspection)=>(

                <div key={inspection.id}>

                    <div  onClick={() => handleQaExpand(inspection.id)} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 border border-violet-200 rounded-xl hover:shadow-md transition-all cursor-pointer bg-white dark:bg-gray-900"  >

                        <div className="flex flex-col space-y-1 text-violet-900 dark:text-violet-300">
                
                            <div className="flex items-center space-x-2">
                                <FaTasks className="text-xl" />
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">#{inspection.id}</span>
                                <h2 className="font-semibold text-base sm:text-lg">{inspection.title}</h2>
                            </div>

                            <p className="text-sm text-gray-700 dark:text-gray-400 ml-1">{inspection.description}</p>
                        </div>

            
                        <div className="flex flex-wrap gap-3 items-center justify-start sm:justify-end">
                
                            <select  className="border border-violet-400 rounded-lg py-2 px-3 text-sm bg-white dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-violet-300 outline-none transition w-36"  name="status" value={status[inspection.id] ?? inspection.status }  onChange={(e) => setStatus({ ...status, [inspection.id]: e.target.value }) } required >
                                <option value=""  >Select Status</option>
                                <option value="Completed">Completed</option>
                                <option value="Rejected">Rejected</option>
                            </select>

                       
                            <svg   onClick={() => handleNewImage(inspection.id)}  xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-440ZM120-120q-33 0-56.5-23.5T40-200v-480q0-33 23.5-56.5T120-760h126l74-80h240v80H355l-73 80H120v480h640v-360h80v360q0 33-23.5 56.5T760-120H120Zm640-560v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80ZM440-260q75 0 127.5-52.5T620-440q0-75-52.5-127.5T440-620q-75 0-127.5 52.5T260-440q0 75 52.5 127.5T440-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Z"/></svg>

                             {/* newImage  */}
                                
                               {newImageFor === inspection.id && (
                                <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
                                    <NewImage  setCloseCamera={() => setNewImageFor(null)}  imageType={'Quality Control'} img_referenced_id={inspection.id}/>
                                </div>
                                ) }

                                {
                                    ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                                    <button onClick={ (e)=>{  e.stopPropagation(); markQaChecked(inspection.id); }} className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-lg shadow-sm transition disabled:cursor-not-allowed  disabled:opacity-50 "  disabled={inspection.status === 'Completed'} >  Check </button> 
          
                                    ) 
                                  }    
                            
                        </div>

                        
                        


                    </div>


                    {
                        exapndQa === inspection.id && (
                            <div className="grid grid-cols-4 gap-4 sm:flex-row justify-between items-start sm:items-center  p-4 border border-violet-200 rounded-xl hover:shadow-md transition-all cursor-pointer bg-white dark:bg-gray-900"  >
   
                           
                                <div className="mb-2 w-full col-span-3 lg:col-span-1 md:col-span-3 px-3">
                                    <label className="text-sm">Action Required</label>
                                    <select className="border rounded-lg border-violet-950 w-full py-3 px-3 bg-white dark:bg-gray-800" name='action_required'  value={action_required[inspection.id] || inspection.action_required} onChange={(e) => setAction_required({ ...action_required, [inspection.id]: e.target.value })}>
                                    <option value="">Give Action</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                      
                                    </select>
                                </div>
                
                            <div className=" lg:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Resolution Date</label>
                                <input type="date"  name="resolution_date" className="w-full border border-violet-950 rounded-lg py-2 px-3 bg-white dark:bg-gray-800"   value={resolution_date[inspection.id] || inspection.resolution_date} onChange={(e) => setResolution_date({ ...resolution_date, [inspection.id]: e.target.value })} />
                            </div>
                
                
                            <div className=" lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                                <textarea name="comment"     placeholder="Comment"     className="w-full h-11 border border-violet-950 rounded-lg py-2 px-3 bg-white dark:bg-gray-800 resize-none"  value={comment[inspection.id] ?? inspection.comment} onChange={(e) => setComment({ ...comment, [inspection.id]: e.target.value })}   />
                            </div>

                            {(inspection.checker_name || inspection.checked_date) && (
                                <div className="lg:col-span-4 flex justify-between items-center">
                                    <p>Checked By: {inspection.checker_name || 'N/A'}</p>
                                    <p className='text-orange-900'>Checked Date: {inspection.checked_date || 'N/A'}</p>
                                </div>
                            )}


                            
                
                    
                        </div>
                        )
                    }


                </div>
            ))
        }


      

    

       


        
       
        </div>



    </div>
  )
}


        //   for after finished  checked_by checked_date 