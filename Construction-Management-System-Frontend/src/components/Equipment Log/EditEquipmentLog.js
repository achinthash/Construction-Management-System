

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ResponseMessages from '../ResponseMessages'; 
import Loading from '../Loading';

export default function EditEquipmentLog({ selectedEquipmentId }) {
  
  const [loading, setLoading] = useState(true);
  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    status: '',
    start_time: '',
    end_time: '',
  });

  // Fetch the existing log details
  const fetchLogDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/equipment-logs-selected/${selectedEquipmentId}`, {
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

  useEffect(() => {
    if (selectedEquipmentId) {
      fetchLogDetails();
    }
  }, [selectedEquipmentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8000/api/update-equipment-logs/${selectedEquipmentId}`, formData, {
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

      <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-2 shadow-md bg-white dark:bg-gray-900 p-4 rounded-lg text-black dark:text-white">
        <h1 className="col-span-4 text-xl mb-2">Edit Equipment Log</h1>

        <div className="col-span-4 md:col-span-2 px-2">
          <label className="block mb-1 font-semibold">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"
          />
        </div>

        <div className="col-span-4 md:col-span-2 px-2">
          <label className="block mb-1 font-semibold">Status<span className="text-red-500">*</span></label>
          <input
            type="text"
            name="status"
            value={formData.status || ''}
            onChange={handleChange}
            required
           className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"
          />
        </div>

        <div className="col-span-4 md:col-span-2 px-2">
          <label className="block mb-1 font-semibold">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date || ''}
            onChange={handleChange}
            className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"
          />
        </div>

        <div className="col-span-4 md:col-span-2 px-2">
          <label className="block mb-1 font-semibold">Start Time</label>
          <input
            type="time"
            name="start_time"
            value={formData.start_time || ''}
            onChange={handleChange}
           className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"
          />
        </div>

        <div className="col-span-4 md:col-span-2 px-2">
          <label className="block mb-1 font-semibold">End Time</label>
          <input
            type="time"
            name="end_time"
            value={formData.end_time || ''}
            onChange={handleChange}
            className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"
          />
        </div>

        <div className="col-span-4 px-2">
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
           className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"
          />
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
}
