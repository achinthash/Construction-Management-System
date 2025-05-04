
import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import Loading from '../Loading';

import ResponseMessages from '../ResponseMessages'; 

export default function EditQualityControl({ selectedId }) {

  const [loading, setLoading] = useState(true);
  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    status: '',
    description: '',
    expected_check_date: '',
    checked_by: '',
    checked_date: '',
    comment: '',
    action_required: '',
    resolution_date: '',
  });

  const fetchData = async () => {
    try {
      
      const response = await axios.get(`http://127.0.0.1:8000/api/quality-controls-selected/${selectedId}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      setFormData(response.data);
      
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [selectedId]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    try{
        const response = await axios.put(`http://localhost:8000/api/update-quality-controls/${selectedId}`, formData,{  
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                Accept: "application/json",
            },   });
        setSuccessMessage.current(response.data.message);
    }catch(error){
        setErrorMessage.current("Error: " + error.response.data.message);
    }

  }

  if (loading) return <Loading />;

  return (
<div className="p-2 max-h-[80vh] overflow-y-auto">
      <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />

      <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-2 shadow-[0_3px_10px_rgb(0,0,0,0.4)] bg-white dark:bg-gray-900 p-2 overflow-y-auto rounded-lg text-black dark:text-white">
        <h1 className="col-span-4 p-1 text-lg">Edit Quality Control</h1>

        <div className="mb-2 w-full col-span-4 lg:col-span-2 md:col-span-2 px-3">
          <label className="text-sm">Title</label><br />
          <input type="text" name="title" value={formData.title} onChange={handleChange}
            className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" />
        </div>

        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
          <label className="text-sm">Status</label><br />
          <select name="status" value={formData.status} onChange={handleChange}
            className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800">
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
          <label className="text-sm">Expected Check Date</label><br />
          <input type="date" name="expected_check_date" value={formData.expected_check_date?.slice(0, 10) || ''} onChange={handleChange}
            className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" />
        </div>

      

        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
          <label className="text-sm">Checked By</label><br />
          <input type="number" name="checked_by" value={formData.checked_by} onChange={handleChange}
            className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" />
         
        </div>

        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
          <label className="text-sm">Checked Date</label><br />
          <input type="date" name="checked_date" value={formData.checked_date?.slice(0, 10) || ''} onChange={handleChange}
            className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" />
        </div>

        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
          <label className="text-sm">Action Required</label><br />
          <select name="action_required" value={formData.action_required} onChange={handleChange}
            className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800">
            <option value={formData.action_required || ''}>{formData.action_required || 'Select'}</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          
          </select>


        </div>

        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
          <label className="text-sm">Resolution Date</label><br />
          <input type="date" name="resolution_date" value={formData.resolution_date?.slice(0, 10) || ''} onChange={handleChange}
            className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" />
        </div>


        <div className="mb-2 w-full col-span-4 md:col-span-2 px-3">
          <label className="text-sm">Description</label><br />
          <textarea name="description" value={formData.description} onChange={handleChange} rows="2"
            className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"></textarea>
        </div>

        <div className="mb-2 w-full col-span-4 lg:col-span-2 md:col-span-4 px-3">
          <label className="text-sm">Comment</label><br />
          <input type="text" name="comment" value={formData.comment} onChange={handleChange} rows="2"
            className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" />
        </div>

       
        <div className='w-full col-span-4'>
          <hr className='border-t-3 border-gray-800 my-2'></hr>
        </div>

        <div className='col-span-4 w-full grid grid-cols-4'>
          <div className="col-span-2 lg:col-span-1 px-3 mb-4">
            <button className="bg-blue-500 hover:bg-blue-700 dark:bg-gray-600 dark:hover:bg-slate-500 text-white font-bold py-2 px-4 rounded w-full" type="submit">Save</button>
          </div>
          <div className="col-span-2 lg:col-span-1 px-3 mb-4">
            <button type="reset" className="bg-blue-500 hover:bg-blue-700 dark:bg-gray-600 dark:hover:bg-slate-500 text-white font-bold py-2 px-4 rounded w-full">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  );
}
