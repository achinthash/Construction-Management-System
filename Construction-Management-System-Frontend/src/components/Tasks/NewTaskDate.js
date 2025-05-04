

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";

import ResponseMessages from '../ResponseMessages'; 

const NewTaskDate = () => {


 const { projectId } = useParams();

  const [formData, setFormData] = useState({
    project_id: projectId,
    task_id: '',
    status: '',
    date: '',
    description: '',
    weather_condition: '',
    start_time: '',
    end_time: '',
    general_note: '',
  });


  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };



  const handleSubmit = async(e) =>{
    e.preventDefault();

    try{

        const response = await axios.post("http://localhost:8000/api/new-task-date",formData,{
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                Accept: "application/json",
                "Content-Type": "multipart/json", 
            },
        })

        setSuccessMessage.current(response.data.message);

    }catch(error){
        console.error(error);
        setErrorMessage.current(error.response.data.message)
       
    }
}




  return (
    <div className="p-4 max-w-4xl mx-auto bg-white dark:bg-gray-900 shadow rounded-lg">
      <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-black dark:text-white">

      <div className="mb-2 w-full col-span-3 lg:col-span-1 md:col-span-3 px-3">
            <label className="text-start text-sm">Task ID</label><br/>
            <input type="text" name="task_id" value={formData.task_id} onChange={handleChange} placeholder="Task ID" required className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" />
        </div>
       


        <div className="mb-2 w-full col-span-3 lg:col-span-1 md:col-span-3 px-3">
            <label className="text-start text-sm"> Status</label><br/>
            <select  className="   border rounded-lg border-violet-950 w-full py-3 px-3 bg-white dark:bg-gray-800" name="status" value={formData.status} onChange={handleChange}   >
                <option >Select Status</option>
                <option value="pending">Pending</option>
            </select>
        </div>
        
        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
            <label className="text-start text-sm">Date</label><br/>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"/>
        </div>

        <div className="mb-2 w-full col-span-3  px-3">
            <label className="text-sm">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description"  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"  rows="3" />
        </div>

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

      </form>
    </div>
  );
};

export default NewTaskDate;
