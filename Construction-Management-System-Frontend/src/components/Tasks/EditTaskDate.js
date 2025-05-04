

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ResponseMessages from '../ResponseMessages';
import Loading from '../Loading';

const EditTaskDate = ({ taskDateId }) => {
  const [formData, setFormData] = useState({
    status: '',
    description: '',
    weather_condition: '',
    start_time: '',
    end_time: '',
    general_note: '',
  });

  const [loading, setLoading] = useState(true);
  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);

  // Fetch Task Date Data
  useEffect(() => {
    const fetchTaskDate = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/daily-log-date-selected/${taskDateId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            Accept: 'application/json',
          },
        });
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching task date details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTaskDate();
  }, [taskDateId]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8000/api/update-task-date/${taskDateId}`, formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          Accept: "application/json",
        },
      });
      setSuccessMessage.current(response.data.message);
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMessage.current(error.response.data.message);
      } else {
        setErrorMessage.current('Unknown error occurred');
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-2 max-h-[80vh] overflow-y-auto">
      <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />

      <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-2 bg-white shadow-md dark:bg-gray-900 p-4 rounded-lg text-black dark:text-white">
        
        <div className="col-span-4 md:col-span-2 px-2">
          <label className="block text-gray-700 font-medium">Status</label>
          <input type="text" name="status" value={formData.status} onChange={handleChange} className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" />
        </div>

        <div className="col-span-4 md:col-span-2 px-2">
          <label className="block text-gray-700 font-medium">Weather Condition</label>
          <input type="text" name="weather_condition" value={formData.weather_condition} onChange={handleChange} className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" />
        </div>

        <div className="col-span-4 md:col-span-2 px-2">
          <label className="block text-gray-700 font-medium">Start Time</label>
          <input type="time" name="start_time" value={formData.start_time || ''} onChange={handleChange} className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" />
        </div>

        <div className="col-span-4 md:col-span-2 px-2">
          <label className="block text-gray-700 font-medium">End Time</label>
          <input type="time" name="end_time" value={formData.end_time || ''} onChange={handleChange} className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" />
        </div>

        <div className="col-span-4 px-2">
          <label className="block text-gray-700 font-medium">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"></textarea>
        </div>

        <div className="col-span-4 px-2">
          <label className="block text-gray-700 font-medium">General Note</label>
          <textarea name="general_note" value={formData.general_note} onChange={handleChange} rows="3" className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"></textarea>
        </div>

        <div className='col-span-4 w-full grid grid-cols-4 mt-4'>
          <div className="col-span-2 px-3">
            <button className="bg-blue-500 hover:bg-blue-700 dark:bg-gray-600 dark:hover:bg-slate-500 text-white font-bold py-2 px-4 rounded w-full" type="submit">
              Save
            </button>
          </div>
          <div className="col-span-2 px-3">
            <button className="bg-blue-500 hover:bg-blue-700 dark:bg-gray-600 dark:hover:bg-slate-500 text-white font-bold py-2 px-4 rounded w-full" type="reset">
              Cancel
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default EditTaskDate;
