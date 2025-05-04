
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ResponseMessages from '../ResponseMessages'; 
import Loading from '../Loading';

const EditTask = ({ taskId }) => {

    const [formData, setFormData] = useState({
        project_id: '',
        name: '',
        status: '',
        start_date: '',
        end_date: '',
        progress: '',
        description: '',
        priority: '',
    });

  const [loading, setLoading] = useState(true);
  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);

    // Fetch task

    useEffect(() => {

    const fetchTask = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:8000/api/task/${taskId}`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
              Accept: 'application/json',
            },
          });
          setFormData(response.data);
        } catch (error) {
          console.error('Error fetching log details:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchTask();

    }, [taskId]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8000/api/update-task/${taskId}`, formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          Accept: "application/json",
        },
      });
      setSuccessMessage.current(response.data.message);
    } catch (error) {
      console.error('Update error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage.current(error.response.data.message);
      } else {
        setErrorMessage.current('Unknown error occurred');
      }
    }
  };

  if (loading) {
    return <Loading />;
  }


  return (
    <div className="p-2 max-h-[80vh] overflow-y-auto">
      <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />

      <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-2 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]  dark:bg-gray-900 p-4 rounded-lg text-black dark:text-white">
      
        <div className="col-span-4 md:col-span-2 lg:col-span-1 px-2">
          <label className="block text-gray-700 font-medium">Task Name</label>
          <input type="text" name="name" value={formData.name}   onChange={handleChange} maxLength={25}  required className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"  />
        </div>

        <div className="col-span-4 md:col-span-2 lg:col-span-1 px-2">
          <label className="block text-gray-700 font-medium">Status</label>
          <input  type="text" name="status" value={formData.status} onChange={handleChange} maxLength={25} required className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" />
        </div>

        
        <div className="col-span-4 md:col-span-2 lg:col-span-1 px-2">
            <label className="block text-gray-700 font-medium">Start Date</label>
            <input type="date" name="start_date" value={formData.start_date || ''} onChange={handleChange} className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" />
        </div>

        <div className="col-span-4 md:col-span-2 lg:col-span-1 px-2">
            <label className="block text-gray-700 font-medium">End Date</label>
            <input type="date" name="end_date" value={formData.end_date || ''} onChange={handleChange} className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" />
        </div>
       

        <div className="col-span-4 md:col-span-2 lg:col-span-1 px-2">
          <label className="block text-gray-700 font-medium">Progress (%)</label>
          <input type="number" name="progress" value={formData.progress} onChange={handleChange} min={0} max={100} required className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"/>
        </div>

        <div className="col-span-4 md:col-span-2 lg:col-span-1 px-2">
          <label className="block text-gray-700 font-medium">Priority</label>
          <select name="priority" value={formData.priority|| ''} onChange={handleChange} required className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800">
            <option  value={formData.priority|| ''}>Select Priority</option>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="col-span-4 md:col-span-4 lg:col-span-2 px-2">
          <label className="block text-gray-700 font-medium">Description</label>
          <textarea  name="description" value={formData.description} onChange={handleChange} required rows="4" className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"></textarea>
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

export default EditTask;
