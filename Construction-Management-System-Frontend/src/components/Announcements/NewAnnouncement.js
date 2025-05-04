


import React, { useState, useRef } from 'react';
import axios from 'axios';
import ResponseMessages from '../ResponseMessages';

export default function NewAnnouncement() {


  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));

  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);

  const [project_id, setProjectId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [target_type, setTargetType] = useState('');
  const [created_by, setCreatedBy] = useState('');
  const [expires_at, setExpiresAt] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      project_id,
      title,
      message,
      priority,
      status,
      target_type,
      created_by: userInfo.id,
      expires_at,
    };

    try {
      const response = await axios.post("http://localhost:8000/api/new-announcement", formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          Accept: "application/json",
        },
      });
      setSuccessMessage.current(response.data.message);
    } catch (error) {
      if (error.response) {
        setErrorMessage.current("Error: " + error.response.data.message);
      } else {
        setErrorMessage.current("An error occurred.");
      }
    }
  };

  return (
    <div className='p-2 max-h-[80vh] overflow-y-auto'>
      <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />

      <form onSubmit={handleSubmit} className='grid grid-cols-4 gap-2 shadow-[0_3px_10px_rgb(0,0,0,0.4)] bg-white dark:bg-gray-900 p-2 rounded-lg text-black dark:text-white'>

        <h1 className='col-span-4 p-1 text-lg'>New Announcement</h1>

        <div className="mb-2 col-span-4 lg:col-span-1 md:col-span-2 px-3">
          <label className="text-sm">Project ID</label>
          <input type="text" required value={project_id} onChange={(e) => setProjectId(e.target.value)}
            className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" />
        </div>

        <div className="mb-2 col-span-4 lg:col-span-1 md:col-span-2 px-3">
          <label className="text-sm">Title</label>
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
            className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" />
        </div>

        <div className="mb-2 col-span-4 lg:col-span-1 md:col-span-2 px-3">
          <label className="text-sm">Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} required
            className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800">
            <option value="">Select Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="mb-2 col-span-4 lg:col-span-1 md:col-span-2 px-3">
          <label className="text-sm">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} required
            className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800">
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="mb-2 col-span-2 px-3">
          <label className="text-sm">Message</label>
          <textarea required value={message} onChange={(e) => setMessage(e.target.value)}
            className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"></textarea>
        </div>

    

        <div className="mb-2 col-span-4 lg:col-span-1 md:col-span-2 px-3">
          <label className="text-sm">Target Type</label>
          <select value={target_type} onChange={(e) => setTargetType(e.target.value)} required
            className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800">
            <option value="">Select Target</option>
            <option value="all">All</option>
            <option value="group">Group</option>
            <option value="user">User</option>
          </select>
        </div>



        <div className="mb-2 col-span-4 lg:col-span-1 md:col-span-2 px-3">
          <label className="text-sm">Expires At</label>
          <input type="date" value={expires_at} onChange={(e) => setExpiresAt(e.target.value)}
            className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" />
        </div>

        <div className='w-full col-span-4'>
          <hr className='border-t-3 border-gray-800 my-2'></hr>
        </div>

        <div className='col-span-4 w-full grid grid-cols-4'>
          <div className="col-span-2 lg:col-span-1 md:col-span-2 mb-4 px-3">
            <button className="bg-blue-500 hover:bg-blue-700 dark:bg-gray-600 dark:hover:bg-slate-500 text-white font-bold py-2 px-4 rounded w-full" type="submit">
              Save
            </button>
          </div>
          <div className="col-span-2 lg:col-span-1 md:col-span-2 mb-4 px-3">
            <button className="bg-blue-500 hover:bg-blue-700 dark:bg-gray-600 dark:hover:bg-slate-500 text-white font-bold py-2 px-4 rounded w-full" type="reset">
              Cancel
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
