import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import ResponseMessages from "../ResponseMessages";
import Loading from "../Loading";

export default function NewQualityControl() {

    const { projectId, taskId } = useParams();
    const [token, setToken] = useState(sessionStorage.getItem("token") || "");
    const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
  
    const setErrorMessage = useRef(null);
    const setSuccessMessage = useRef(null);
    const [loading, setLoading] = useState(true);


    const handleChange = (event) =>{
        setFormData({...formData,[event.target.name]: event.target.value})
    }
    


    const [formData, setFormData] = useState({
        project_id : projectId,
        task_id : '',
        title : '',
        status : '',
        description : '',
        expected_check_date : ''

    });



    const handleSubmit = async(e) =>{
        e.preventDefault();

        try{

            const response = await axios.post("http://localhost:8000/api/new-quality-control",formData,{
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
    <div className=' p-2 max-h-[80vh] overflow-y-auto w-full '>
 
      <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>

        <form  onSubmit={handleSubmit} className='  shadow-[0_3px_10px_rgb(0,0,0,0.4)]  bg-white dark:bg-gray-900 p-2   overflow-y-auto  rounded-lg text-black dark:text-white'>


                <div className='grid grid-cols-4  gap-2 '> 

                    <h1 className='col-span-4 p-1 text-lg'> Cost Information  </h1>


                    <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
                        <label className="text-start text-sm"> Task Id</label><br/>
                        <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="number" placeholder="Task Id" name="task_id"   value={formData.task_id} onChange={handleChange} />
                    </div>


                    <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
                        <label className="text-start text-sm"> Title</label><br/>
                        <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="text" placeholder="Title" name="title"   value={formData.title} onChange={handleChange}  />
                    </div>

                    <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
                        <label className="text-start text-sm"> Status</label><br/>
                        <select  className="   border rounded-lg border-violet-950 w-full py-3 px-3 bg-white dark:bg-gray-800" name="status"  value={formData.status} onChange={handleChange}   >

                        <option >Select Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Completed">Completed </option>

                        </select>
                    </div>

                    <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
                        <label className="text-start text-sm"> Expected Check Date</label><br/>
                        <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="date"  name="expected_check_date"   value={formData.expected_check_date} onChange={handleChange}  />
                    </div>

                    
                    <div className="mb-2 w-full col-span-4 lg:col-span-4 md:col-span-4 px-3">
                        <label className="text-sm">Description</label>
                        <textarea className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" placeholder="Task Description" value={formData.description} onChange={handleChange} name="description" />
                    </div>




                    <div className='w-full col-span-4'>
                        <hr className='border-t-3 border-gray-800 my-2'></hr>
                    </div>
                    
                    <div className='  col-span-4   w-full grid grid-cols-4 '>
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


