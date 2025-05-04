import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import Loading from '../Loading';
import ResponseMessages from "../ResponseMessages";


export default function NewUserLog(props) {

    const { projectId, taskId } = useParams(); // Get URL params
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(sessionStorage.getItem("token") || "");

    const [isEstimation , setIsEstimation] = useState(false);

    const setErrorMessage = useRef(null);
    const setSuccessMessage = useRef(null);


    // check user is available 

    const [userLogDates, setUserLogDates] = useState([]);

    useEffect(()=>{

        const UsersList = async() =>{
    
          try{
    
            const response = await axios.get(`http://localhost:8000/api/user-logs-dates/${props.selectedId}`,{
              headers: { Authorization: `Bearer ${token}` }
            });

            setLoading(false);
            setUserLogDates(response.data);

          }catch(error){

           setLoading(false);
            console.error(error);
          }
        }
    
        UsersList();
    
      },[props.selectedId]);



    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("pending");
    


    // estimation for 

  
    const [wagetype, setWageType] = useState('');
    const [wage_rate, setWageRate] = useState('');
    const [workHours, setWorkHours] = useState("");
    const [totalCost, setTotalCost] = useState("");


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();


    // check user date is already assigned
    const hasLogForSelectedDate = userLogDates.user_logs.some(
        (log) => log.date === date );
    
    if (hasLogForSelectedDate) {
        setErrorMessage.current(`The selected date (${date}) is already assigned to this user.`);
        return;
    }

    
   const formData = new FormData();

   formData.append('task_id',projectId);
   formData.append('project_id',taskId);
   formData.append('user_id',props.selectedId);

   formData.append('title',title);
   formData.append('description',description);
   formData.append('status',status);
   formData.append('date',date);



   // for estimation 

   formData.append('wagetype',wagetype);
   formData.append('wage_rate',wage_rate);
   formData.append('workHours',workHours);
   formData.append('total_cost',totalCost);

   if(isEstimation && (!formData.wagetype || !formData.wage_rate || !formData.totalCost)){
    setErrorMessage.current("Please fill in all required fields. 3");
   }



    try {
        const response = await axios.post("http://localhost:8000/api/new-userlog", formData,{
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                Accept: "application/json",
                "Content-Type": "multipart/json", 
            },
        });

        
        setSuccessMessage.current(response.data.message);   
      
       
    } catch (error) {
        setErrorMessage.current(error.response.data.message)
       console.error(error);
    }
};




const handleestimation = () =>{
    setIsEstimation(!isEstimation)
}

  // loading fucntion
  if (loading) {
    return (
        <Loading />
    );
  }


  return (

   
    <div className=' p-2 max-h-[80vh]  overflow-y-auto w-full '>
 
        <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>

        <form onSubmit={handleSubmit} className="shadow-[0_3px_10px_rgb(0,0,0,0.4)] bg-white dark:bg-gray-900 p-2 rounded-lg text-black dark:text-white">
                
            <div className="grid grid-cols-3 gap-2">
                <h1 className="col-span-4 p-1 text-lg">General Information</h1>

                <div className="mb-2 w-full col-span-3 lg:col-span-1 md:col-span-3 px-3">
                    <label className="text-sm">Title</label>
                    <input className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"    type="text"  placeholder="Title"  value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className="mb-2 w-full col-span-3 lg:col-span-1 md:col-span-3 px-3">
                    <label className="text-sm">Date</label>
                    <input className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"  type="date"       value={date} onChange={(e) => setDate(e.target.value)}  />
                </div>

                <div className="mb-2 w-full col-span-3 lg:col-span-1 md:col-span-3 px-3">
                    <label className="text-sm">Status</label>
                    <select className="border rounded-lg border-violet-950 w-full py-3 px-3 bg-white dark:bg-gray-800"   value={status} onChange={(e) => setStatus(e.target.value)} >
                    <option value="">Select Status</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                        <option value="Finished">Finished</option>
                    </select>
                </div>
        
                <div className="mb-2 w-full col-span-3 lg:col-span-3 md:col-span-3 px-3">
                    <label className="text-sm">Description</label>
                    <textarea className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" placeholder="Task Description" value={description}    onChange={(e) => setDescription(e.target.value)}  />
                </div>

                <span onClick={handleestimation} className="col-span-3 text-black  rounded-lg flex" > 
                    
                    {
                        isEstimation  ? 
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"/></svg> : 
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg>
                    }

                    <h2>Want to add estimations for this labors ?  </h2>
                </span>

                    {
                    isEstimation && (
                    <div className=" col-span-4  grid  grid-cols-4 gap-2">

                        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
                            <label className="text-start text-sm">Wage Type</label><br />
                            <select   value={wagetype}      onChange={(e) => setWageType(e.target.value)}  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"   name="wagetype"        required    >
                                <option value="">Select Wage Type</option>
                                <option value="Hours">Hours</option>
                                <option value="Daily">Daily</option>
                            </select>
                        </div>

                        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
                            <label className="text-start text-sm">Wage Rate</label><br />
                            <input   className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"  type="number"  placeholder="Wage Rate"   name="wage_rate"   required   value={wage_rate}   onChange={(e) => setWageRate(e.target.value)} />
                        </div>
        
                        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-3 px-3">
                            <label className="text-sm">Est. Work Hours</label>
                            <input className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"  type="number" step="0.01"  placeholder="Hours Worked"  value={workHours} onChange={(e) => setWorkHours(e.target.value)}  required/>
                        </div>
                    
                        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-3 px-3">
                            <label className="text-sm">Total Cost</label>
                            <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-gray-200 dark:bg-gray-700" type="number" step="0.01" value={totalCost} onChange={(e) => setTotalCost(e.target.value)}  required />
                        </div>

                    </div>
                    )
                }

                <div className='w-full col-span-3'>
                    <hr className='border-t-3 border-gray-800 my-2'></hr>
                </div>
                    
                <div className='  col-span-3   w-full grid grid-cols-4 '>
                    <div className=" col-span-2 lg:col-span-1 md:col-span-2  w-full  mb-4 sm:mb-0 px-3 ">
                        <button className="bg-blue-500  hover:bg-blue-700  dark:bg-gray-600 dark:hover:bg-slate-500  text-white font-bold py-2 px-4 rounded w-full" type="submit">Save</button>
                    </div>
                    <div className="w-full  mb-4 sm:mb-0 px-3 col-span-2 lg:col-span-1 md:col-span-2  ">
                        <button   className="bg-blue-500 hover:bg-blue-700 text-white  dark:bg-gray-600 dark:hover:bg-slate-500 font-bold py-2 px-4 rounded w-full"  type="reset">Cancel</button>
                    </div>
                </div>

            </div>
        </form>
    </div>

  )
}



