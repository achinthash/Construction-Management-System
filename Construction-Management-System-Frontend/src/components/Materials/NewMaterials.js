import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import ResponseMessages from "../ResponseMessages";
import axios from "axios";

export default function NewMaterials() {

  const { projectId, taskId } = useParams();
  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);
  const [isEstimation , setIsEstimation] = useState(false);


  const [formData, setFormData] = useState({
    project_id : projectId,
    task_id  : taskId,
    title : '',
    description : '',
    date : '',
    status : '',
    unit : '',
    quantity : '',
    unit_price : '',
    total_cost : '',

  });


  const handleChange = (event) =>{
    setFormData({...formData,[event.target.name]: event.target.value})
  }

  const handleSubmit = async(e) =>{
    e.preventDefault();

    try{

      const response = await axios.post("http://localhost:8000/api/new-material",formData,{
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          Accept: "application/json",
          "Content-Type": "multipart/json", 
      },
      })
      
      setSuccessMessage.current(response.data.message);

    }catch(error){
      setErrorMessage.current(error.response.data.message)
      console.error(error);
    }
  }

  const handleestimation = () =>{
    setIsEstimation(!isEstimation)
  }

    
  return (
    <div className=' p-2 max-h-[80vh] overflow-y-auto w-full '>
 
      <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>

        <form  onSubmit={handleSubmit} className='  shadow-[0_3px_10px_rgb(0,0,0,0.4)]  bg-white dark:bg-gray-900 p-2   overflow-y-auto  rounded-lg text-black dark:text-white'>

          <div className='grid grid-cols-3  gap-2 '> 

            <h1 className='col-span-3 p-1 text-lg'> General Information  </h1>

            <div className="mb-2 w-full col-span-3 lg:col-span-1 md:col-span-3 px-3">
                <label className="text-start text-sm"> Title</label><br/>
                <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="text" placeholder="Title" name="title"   value={formData.title} onChange={handleChange}  />
            </div>

            <div className="mb-2 w-full col-span-3 lg:col-span-1 md:col-span-3 px-3">
                    <label className="text-sm">Date</label>
                    <input className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"  type="date"      value={formData.date} onChange={handleChange}  name="date" />
                </div>

                <div className="mb-2 w-full col-span-3 lg:col-span-1 md:col-span-3 px-3">
                    <label className="text-sm">Status</label>
                    <select className="border rounded-lg border-violet-950 w-full py-3 px-3 bg-white dark:bg-gray-800"   value={formData.status} onChange={handleChange} name="status"  >
                
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
                    <textarea className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" name="description" placeholder="Task Description" value={formData.description} onChange={handleChange}   />
                </div>


                <span onClick={handleestimation} className="col-span-3 text-black  rounded-lg flex" > 
                    
                    {
                        isEstimation  ? 
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"/></svg> : 
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg>
                    }

                    <h2>Want to add Estimations for this Material ?  </h2>
                </span>


              {

                isEstimation && (
                  <div className="col-span-3 grid grid-cols-4 gap-2">
                  
                    <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
                      <label className="text-start text-sm">Unit</label><br />
                      <select className="border rounded-lg border-violet-950 w-full py-3 px-3 bg-white dark:bg-gray-800" name="unit"  value={formData.unit} onChange={handleChange} required >
                        <option>Select Unit</option>
                        <option value="kg">kg</option>
                        <option value="m3">m³</option>
                        <option value="sqm">sqm</option>
                        <option value="hr">hr</option>
                        <option value="piece">Piece</option>
                        <option value="day">Day</option>
                        <option value="hour">Hour</option>
                        <option value="lump_sum">Lump Sum</option>
                      </select>
                    </div>


                    <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
                        <label className="text-start text-sm"> Quantity </label><br/>
                        <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="number" placeholder="Quantity" name="quantity"   value={formData.quantity} onChange={handleChange}  />
                    </div>


                    <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
                        <label className="text-start text-sm"> Unit Price </label><br/>
                        <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="number" placeholder="Unit Price" name="unit_price"   value={formData.unit_price} onChange={handleChange}  />
                    </div>

                    <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
                        <label className="text-start text-sm"> Total Cost </label><br/>
                        <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="number" placeholder="Total Cost" name="total_cost"  value={formData.total_cost} onChange={handleChange}  required />
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







