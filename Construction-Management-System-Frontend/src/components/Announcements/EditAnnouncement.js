
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ResponseMessages from '../ResponseMessages'; 
import Loading from '../Loading'; 

const EditAnnouncement = ({ announcementId }) => {

 const [loading, setLoading] = useState(true);
 const setErrorMessage = useRef(null);
 const setSuccessMessage = useRef(null);
  
  const [formData, setFormData] = useState({
    project_id: '',
    title: '',
    message: '',
    priority: '', 
    status: '',
    target_type: '',
    created_by: '',
    expires_at: '',
  });

  // Fetch announcement data
  const announcement = async()=>{
    try{
        const response = await axios.get(`http://localhost:8000/api/announcement-selected/${announcementId}`,{
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
},[announcementId]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async(e) => {
    e.preventDefault();

    try{
        const response = await axios.put(`http://localhost:8000/api/update-announcement/${announcementId}`, formData,{  
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                Accept: "application/json",
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

        <h1 className="col-span-4 p-1 text-lg">Edit Announcement</h1>

        <div className="mb-2 w-full col-span-4 lg:col-span-2 md:col-span-2 px-3">
            <label className="text-start text-sm">Title</label><br />
            <input className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" type="text" name="title" value={formData.title} onChange={handleChange} />
        </div>

        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
        <label className="text-start text-sm">Priority</label><br />
        <select name="priority" value={formData.priority} onChange={handleChange} className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
        </select>
        </div>

        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
        <label className="text-start text-sm">Status</label> <br />
        <select  name="status"  value={formData.status}  onChange={handleChange}  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
        </select>
        </div>

        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
        <label className="text-start text-sm">Target Type</label><br />
        <select name="target_type" value={formData.target_type} onChange={handleChange} className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" >
            <option value="all">All</option>
            <option value="group">Group</option>
            <option value="user">User</option>
        </select>
        </div>

        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2  px-3">
            <label className="text-start text-sm">Expires At</label>  <br/> 
            <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="date" name="expires_at"  required  value={formData.expires_at?.slice(0, 10) || ''} onChange={handleChange}  />
        </div>

        <div className="mb-2 w-full col-span-4 px-3">
            <label className="text-start text-sm">Message</label><br />
            <textarea className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" name="message" value={formData.message} onChange={handleChange} rows="4"/>
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
  );
};

export default EditAnnouncement;
