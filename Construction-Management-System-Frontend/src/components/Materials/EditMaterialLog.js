import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ResponseMessages from '../ResponseMessages'; 
import Loading from '../Loading';

const EditMaterialLog = ({ selectedMaterialId }) => {

    const [loading, setLoading] = useState(true);
    const setErrorMessage = useRef(null);
    const setSuccessMessage = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    status: '',
  });

   

  useEffect(() => {
   
    const fetchLogDetails = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:8000/api/material-logs-selected/${selectedMaterialId}`, {
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

      fetchLogDetails();

  }, [selectedMaterialId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8000/api/update-material-logs/${selectedMaterialId}`, formData, {
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

    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-2 shadow-md bg-white dark:bg-gray-900 p-4 rounded-lg text-black dark:text-white">

      <h1 className="col-span-3 text-xl mb-2">Edit Material Log</h1>

        <div className="col-span-3 md:col-span-3 lg:col-span-1 px-2">
          <label className="block text-sm font-medium">Title</label>
          <input  type="text" name="title" value={formData.title} onChange={handleChange}   className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"  />
        </div>

        <div className="col-span-3 md:col-span-3 lg:col-span-1 px-2">
          <label className="block text-sm font-medium">Date</label>
          <input  type="date"  name="date"  value={formData.date}  onChange={handleChange} className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"  />
        </div>

        <div className="col-span-3 md:col-span-3 lg:col-span-1 px-2">
          <label className="block text-sm font-medium">Status</label>
          <input  type="text"  name="status"  value={formData.status} onChange={handleChange} className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"  required  />
        </div>

        <div className="col-span-3 md:col-span-3 lg:col-span-3 px-2">
          <label className="block text-sm font-medium">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"/>
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

export default EditMaterialLog;
