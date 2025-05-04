import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import ResponseMessages from "../ResponseMessages";
import Loading from "../Loading";

export default function NewTask() {

    const { projectId } = useParams();
    const setErrorMessage = useRef(null);
    const setSuccessMessage = useRef(null);
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [steps, setSteps] = useState(1);

    const nextPage =() =>{
        setSteps(steps +1);
    }

    const prevPage =() =>{
    setSteps(steps - 1);
    }

    // tasks

    const [taskData, setTaskData] = useState({
        project_id: projectId, 
        name: "",
        status: "",
        start_date: "",
        end_date: "",
        progress: 0,
        description: "",
        priority: "",
        task_dates: [],
        dependent_task_id: ''
    });


    
    // Handle input change for main task fields
    const handleChange = (e) => {
        setTaskData({ ...taskData, [e.target.name]: e.target.value });
    };


    // task dates


    const [taskDate, setTaskDate] = useState({
        date : "",
        description : "",
        status : "pending"
    })

    const handleDateChange = (e) => {
        setTaskDate({ ...taskDate, [e.target.name]: e.target.value });
    };

    const addTaskDate = () =>{

        if (new Date(taskDate.date) < new Date(taskData.start_date) || new Date(taskDate.date) > new Date(taskData.end_date)) {
            alert("Task date should be between start and end dates.");
            return;
        }
        
        
        if (taskDate.date) {
            setTaskData({ 
                ...taskData, 
                task_dates: [...taskData.task_dates, taskDate]
            });
            setTaskDate({ date: "", description: "", status: "pending"}); // Reset fields
        } else {
            alert("Date required for task dates.");
        }
    }

    // Remove a task date from list
    const removeTaskDate = (index) => {
        setTaskData({
            ...taskData,
            task_dates: taskData.task_dates.filter((_, i) => i !== index),
        });
    };


    // for dependent task
    useEffect(()=>{
        const tasks = async() =>{

            try{
                const response = await axios.get(`http://127.0.0.1:8000/api/tasks-project/${projectId}`,{
                    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
                });

                setLoading(false);
                setTasks(response.data);
                
            }catch(error){
                setLoading(false);
                console.error(error);
            }
        }

        tasks();

    },[]);

    const today = new Date().toISOString().split('T')[0];

   //  form submission

   const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(taskData.start_date) < new Date(today)) {
        alert("Start date should not be in the past.");
        return;
    }
    try {
        const response = await axios.post("http://localhost:8000/api/new-task", taskData,{
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


  if (loading) {
    return (
        <Loading />
    );
  }


    
  return (
    <div className=' p-2 max-h-[80vh] overflow-y-auto w-full '>
 
        <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>

        <form  onSubmit={handleSubmit} className='  shadow-[0_3px_10px_rgb(0,0,0,0.4)]  bg-white dark:bg-gray-900 p-2   overflow-y-auto  rounded-lg text-black dark:text-white'>

       {
        steps === 1 && (
            <div className='grid grid-cols-6  gap-2 '> 

            <h1 className='col-span-6 p-1 text-lg'> Genaral Information  </h1>

            <div className="mb-2 w-full col-span-6 lg:col-span-2 md:col-span-3 px-3">
                <label className="text-start text-sm"> Name</label><br/>
                <input value={taskData.name} onChange={handleChange}  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="text" placeholder="Name" name="name"    />
            </div>

            <div className="mb-2 w-full col-span-6 lg:col-span-2 md:col-span-3 px-3">
                <label className="text-start text-sm"> Start date</label><br/>
                <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="date" placeholder="Start date" name="start_date"   value={taskData.start_date} onChange={handleChange}    />
            </div>

            <div className="mb-2 w-full col-span-6 lg:col-span-2 md:col-span-3 px-3">
                <label className="text-start text-sm"> End date</label><br/>
                <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="date" placeholder="End date" name="end_date"   value={taskData.end_date} onChange={handleChange}   />
            </div>

            <div className="mb-2 w-full col-span-6 lg:col-span-2 md:col-span-3 px-3">
                <label className="text-start text-sm"> Status</label><br/>
                <select  className="   border rounded-lg border-violet-950 w-full py-3 px-3 bg-white dark:bg-gray-800" name="status"  value={taskData.status} onChange={handleChange}   >
                  <option >Select Status</option>
                  <option value="planning">Planing</option>
                  <option value="rejected">Reject</option>
                  <option value="scheduling">Scheduling</option>
                  <option value="estimating">Estimating </option>
                  <option value="constructing">Constructing</option>
                  <option value="complete">Complete</option>
                  </select>
            </div>

            <div className="mb-2 w-full col-span-6 lg:col-span-2 md:col-span-3 px-3">
                <label className="text-start text-sm"> priority</label><br/>
                <select  className="   border rounded-lg border-violet-950 w-full py-3 px-3 bg-white dark:bg-gray-800" name="priority" value={taskData.priority} onChange={handleChange}    >
                  <option >Select priority</option>
                  <option value="planning">Planing</option>
                  <option value="rejected">Reject</option>
                  <option value="scheduling">Scheduling</option>
                  <option value="estimating">Estimating </option>
                  <option value="constructing">Constructing</option>
               
                  </select>
            </div>
            
            <div className="mb-2 w-full col-span-6 lg:col-span-2 md:col-span-3 px-3">
                <label className="text-start text-sm"> Dependency</label><br/>
                <select  className="   border rounded-lg border-violet-950 w-full py-3 px-3 bg-white dark:bg-gray-800" name="dependent_task_id"  value={taskData.dependent_task_id} onChange={handleChange}   >
                    <option value="">Select Dependent Task </option>

                    {
                        tasks.map((task)=>(
                            <option key={task.id} value={task.id} > 
                                {task.name}
                            </option>
                        ))
                    }
                  
                </select>
            </div>

            <div className="mb-2 w-full col-span-6 lg:col-span-6 md:col-span-3 px-3">
                <label className="text-start text-sm"> Description</label><br/>
                <textarea  className="border h-12 rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="number" placeholder="Budget" name="description"    value={taskData.description} onChange={handleChange}   />
            </div>

          </div>
        ) }

        {
            steps === 2 && (
                <div className='grid grid-cols-5  gap-2 bg-white'> 

                    <h1 className='col-span-5 p-1 text-lg'>  Add Dates  </h1>
    
                    <div className="mb-2 w-full col-span-5 lg:col-span-1 md:col-span-2 px-3">
                        <label className="text-start text-sm"> Date</label><br/>
                        <input value={taskDate.date} onChange={handleDateChange} className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="date"  name="date"      />
                    </div>

                    <div className="mb-2 w-full col-span-5 lg:col-span-1 md:col-span-2 px-3">
                        <label className="text-start text-sm"> Status</label><br/>
                        <select  className="   border rounded-lg border-violet-950 w-full py-3 px-3 bg-white dark:bg-gray-800" name="status" value={taskDate.status} onChange={handleDateChange}   >
                            <option >Select Status</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                
                    <div className="mb-2 w-full col-span-5 lg:col-span-2 md:col-span-2 px-3">
                        <label className="text-start text-sm"> Description</label><br/>
                        <textarea value={taskDate.description} onChange={handleDateChange}  className="border h-12 rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="text" placeholder="Description" name="description"      />
                    </div>

                    <div className="mb-2 w-full col-span-5 lg:col-span-1 md:col-span-2 px-2 mt-3 items-center flex ">
                        <button onClick={addTaskDate} type='button' className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-600 w-full">Add</button>
                    </div>

                    <hr className="col-span-5 bg-black border"/>
                    

                    <div style={{ marginTop: '20px' }} className="col-span-5">
                        {taskData.task_dates.map((date, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', padding: '10px', border: '1px solid #7728d1' }}>
                              {date.date} - {date.description} ({date.status}) 

                                <button onClick={() => removeTaskDate(index)}  type='reset'  className='ml-auto items-center col-span-1'>
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg> 
                                </button>  
                            
                            </div>
                        ))}
                    </div> 
  
              </div>
            )
        }


        <div className='flex justify-between p-2'>
          {
            steps !== 1 && (
              <button onClick={prevPage} type='button' className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-600 transition duration-300">Previous</button>
            )
          }

          {
            steps < 2 && (
              <button onClick={nextPage} type='button' className="bg-violet-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-violet-600 transition duration-300">Next</button>
            ) 
          }

          {
            steps === 2 && (
              <button type='submit' className="bg-violet-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 transition duration-300"> Submit </button>
            ) 
          }

        </div>

        </form>

    </div>
  )
}
