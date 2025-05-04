import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import Loading from '../Loading';
import ResponseMessages from "../ResponseMessages";


export default function NewEquipmentLog(props) {

    const { projectId, taskId } = useParams(); // Get URL params
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(sessionStorage.getItem("token") || "");

    const setErrorMessage = useRef(null);
    const setSuccessMessage = useRef(null);

    const [isEstimation , setIsEstimation] = useState(false);
      // check equipment is available 

      const [equipmentLogDates, setEquipmentLogDates] = useState([]);

      useEffect(()=>{
  
          const equipmentList = async() =>{
      
            try{
      
              const response = await axios.get(`http://localhost:8000/api/equipment-logs-dates/${props.selectedId}`,{
                headers: { Authorization: `Bearer ${token}` }
              });
  
              setLoading(false);
              setEquipmentLogDates(response.data);
  
            }catch(error){
  
             setLoading(false);
              console.error(error);
            }
          }
      
          equipmentList();
      
        },[props.selectedId]);




    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("pending");
    const [hourlyRate, setHourlyRate] = useState("");
    const [workHours, setWorkHours] = useState("");
    const [totalCost, setTotalCost] = useState("");


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();


    // check user date is already assigned
    const hasLogForSelectedDate = equipmentLogDates.equipment_logs.some(
        (log) => log.date === date );
    
    if (hasLogForSelectedDate) {
        setErrorMessage.current(`The selected date (${date}) is already assigned to this equipment.`);
        return;
    }

    
   const formData = new FormData();

   formData.append('task_id',projectId);
   formData.append('project_id',taskId);
   formData.append('equipment_id',props.selectedId);

   formData.append('title',title);
   formData.append('description',description);
   formData.append('status',status);
   formData.append('date',date);

   // for estimation
   formData.append('unit_price',hourlyRate);
   formData.append('quantity',workHours);
   formData.append('total_cost',totalCost);

   
   if(isEstimation && (!formData.workHours || !formData.hourlyRate || !formData.totalCost)){
    setErrorMessage.current("Please fill in all required fields.");
   }


    try {
        const response = await axios.post("http://localhost:8000/api/new-equipmentlog", formData,{
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
                
                        <option value="pending">Pending</option>
                        <option value="planning">Planning</option>
                        <option value="rejected">Rejected</option>
                        <option value="scheduling">Scheduling</option>
                        <option value="estimating">Estimating</option>
                        <option value="constructing">Constructing</option>
                        <option value="complete">Complete</option>
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

                    <h2>Want to add Estimations for this Equipment ?  </h2>
                </span>

                    {
                    isEstimation && (
                    <div className=" col-span-3  grid  grid-cols-3 gap-2">

                        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-3 px-3">
                            <label className="text-sm">Hourly Rate</label>
                            <input className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"   type="number" step="0.01" placeholder="Hourly Rate" value={hourlyRate}  onChange={(e) => setHourlyRate(e.target.value)} required />
                        </div>
        
                        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-3 px-3">
                            <label className="text-sm">Hours Worked</label>
                            <input className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"  type="number" step="0.01"  placeholder="Hours Worked"  value={workHours} onChange={(e) => setWorkHours(e.target.value)} required />
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
