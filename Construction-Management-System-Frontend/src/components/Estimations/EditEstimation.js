
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ResponseMessages from '../ResponseMessages'; 
import Loading from '../Loading'; 

export default function EditEstimation({estimationId}) {

    const [loading, setLoading] = useState(true);
    const setErrorMessage = useRef(null);
    const setSuccessMessage = useRef(null);

    const [formData, setFormData] = useState({
        project_id: "",
        task_id: "",
        title: "",
        cost_type: "",
        unit: "",
        quantity: "",
        unit_price: "",
        total_cost: "",
        referenced_id: "",
      });
    
      const [errors, setErrors] = useState({});
    
   // Fetch announcement data
   const announcement = async()=>{
    try{
        const response = await axios.get(`http://localhost:8000/api/estimation-selected/${estimationId}`,{
        headers: 
            { Authorization: `Bearer ${sessionStorage.getItem('token')}`,
             Accept: 'application/json'} 
    })
      
        setFormData(response.data);
        setLoading(false);
    }
    catch(error){
        setLoading(false);
        }
    }

    useEffect(()=>{
        announcement();
    },[estimationId]);

    
    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    };

    
    const handleSubmit = async(e) => {
    e.preventDefault();

    try{
        const response = await axios.put(`http://localhost:8000/api/update-estimation/${estimationId}`, formData,{  
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                
            },   });
        setSuccessMessage.current(response.data.message);
       
    }catch(error){

        setErrorMessage.current("Error: " + error.response.data.message);
    }

    }

    if (loading) {
        return <Loading />;
    }

  return (
    <div className="p-2 max-h-[80vh] overflow-y-auto">
    <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />

    <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-2 shadow-[0_3px_10px_rgb(0,0,0,0.4)] bg-white dark:bg-gray-900 p-2 overflow-y-auto rounded-lg text-black dark:text-white">

      <h1 className="col-span-4 p-1 text-lg">Edit Estimation</h1>

        <div className="mb-2 w-full col-span-4 lg:col-span-2 md:col-span-2 px-3">
          <label className="block text-gray-700 font-medium mb-1">Task ID</label>
          <input type="number" name="task_id" value={formData.task_id} onChange={handleChange} className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" />
        
        </div>

        <div className="mb-2 w-full col-span-4 lg:col-span-2 md:col-span-2 px-3">
          <label className="block text-gray-700 font-medium mb-1">Title</label>
          <input type="text" name="title" value={formData.title}onChange={handleChange} className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" />   

        </div>

        <div className="mb-2 w-full col-span-4 lg:col-span-2 md:col-span-2 px-3">
          <label className="block text-gray-700 font-medium mb-1">Cost Type</label>
          <input type="text" name="cost_type" value={formData.cost_type} onChange={handleChange} className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" />
        </div>

        <div className="mb-2 w-full col-span-4 lg:col-span-2 md:col-span-2 px-3">
          <label className="block text-gray-700 font-medium mb-1">Unit</label>
          <input type="text" name="unit" value={formData.unit} onChange={handleChange} className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"   />
        </div>

        <div className="mb-2 w-full col-span-4 lg:col-span-2 md:col-span-2 px-3">
          <label className="block text-gray-700 font-medium mb-1">Quantity</label>
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" step="0.01" />
        
        </div>

        <div className="mb-2 w-full col-span-4 lg:col-span-2 md:col-span-2 px-3">
          <label className="block text-gray-700 font-medium mb-1">Unit Price</label>
          <input type="number" name="unit_price" value={formData.unit_price} onChange={handleChange} className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" step="0.01" />
         
        </div>

        <div className="mb-2 w-full col-span-4 lg:col-span-2 md:col-span-2 px-3">
          <label className="block text-gray-700 font-medium mb-1">Total Cost</label>
          <input type="number" name="total_cost" value={formData.total_cost} onChange={handleChange} className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" step="0.01" />
        
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

    </form>
    </div>
  )
}
