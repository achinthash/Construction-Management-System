import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ResponseMessages from '../ResponseMessages';

const NewPayroll = () => {

  const { projectId } = useParams();
  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);

  const [user_id, setUserID] = useState('');
  const [wagetype, setWageType] = useState('');
  const [wage_rate, setWageRate] = useState('');
  const [worked_date, setWorkedDate] = useState('');
  const [worked_hours, setWorkedHours] = useState('');
  const [total_earned, setTotalEarned] = useState('');
  const [status, setStatus] = useState('');

  const submit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('project_id', projectId);
    formData.append('user_id', user_id);

    formData.append('wagetype', wagetype);
    formData.append('wage_rate', wage_rate);
    formData.append('worked_date', worked_date);
    formData.append('worked_hours', worked_hours);
    formData.append('total_earned', total_earned);
    formData.append('status', status);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/new-payroll", formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccessMessage.current(response.data.message);
    } catch (error) {
      console.error(error);
      setErrorMessage.current(error.response.data.message);
    }
  };

  return (
    <div className='p-2 max-h-[80vh] overflow-y-auto'>
      <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />

      <form onSubmit={submit} className='grid grid-cols-4 gap-2 shadow-[0_3px_10px_rgb(0,0,0,0.4)] bg-white dark:bg-gray-900 p-2 overflow-y-auto rounded-lg text-black dark:text-white'>
        <h1 className='col-span-4 p-1 text-lg'>General Information</h1>

        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
          <label className="text-start text-sm">User ID</label><br />
          <input   className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"  type="text"  placeholder="User ID"  name="user_id"  required  value={user_id}  onChange={(e) => setUserID(e.target.value)} />
        </div>

        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
          <label className="text-start text-sm">Wage Type</label><br />


          <select   value={wagetype}      onChange={(e) => setWageType(e.target.value)}  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"   name="wagetype"        required    >
            <option value="">Select Wage Type</option>
            <option value="Hours">Hours</option>
            <option value="Daily">Daily</option>
          </select>
        </div>

        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
          <label className="text-start text-sm">Wage Rate</label><br />
          <input   className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"  type="number"  placeholder="Wage Rate"   name="wage_rate"   required   value={wage_rate}   onChange={(e) => setWageRate(e.target.value)} />
        </div>

        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
          <label className="text-start text-sm">Worked Date</label><br />
          <input   className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"   type="date"   name="worked_date"  required  value={worked_date}   onChange={(e) => setWorkedDate(e.target.value)} />
        </div>

        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
          <label className="text-start text-sm">Worked Hours</label><br />
          <input    className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"    type="number"    placeholder="Worked Hours"    name="worked_hours"    required    value={worked_hours}    onChange={(e) => setWorkedHours(e.target.value)}  />
        </div>

        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
          <label className="text-start text-sm">Total Earned</label><br />
          <input      className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"    type="number"   placeholder="Total Earned"   name="total_earned"    required    value={total_earned}    onChange={(e) => setTotalEarned(e.target.value)}    />
        </div>

        <div className="w-full col-span-4 lg:col-span-1 md:col-span-2 px-3 mb-2">
          <label className="text-start text-sm">Status</label><br />
          <select   value={status}      onChange={(e) => setStatus(e.target.value)}  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"   name="status"        required    >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Processed">Processed</option>
          </select>
        </div> 

        <div className='w-full col-span-4'>
          <hr className='border-t-3 border-gray-800 my-2' />
        </div>

        <div className='col-span-4 w-full grid grid-cols-4'>
          <div className="col-span-2 lg:col-span-1 md:col-span-2 w-full mb-4 sm:mb-0 px-3">
            <button className="bg-blue-500 hover:bg-blue-700 dark:bg-gray-600 dark:hover:bg-slate-500 text-white font-bold py-2 px-4 rounded w-full"
              type="submit" >  Save  </button>
          </div>
          <div className="w-full mb-4 sm:mb-0 px-3 col-span-2 lg:col-span-1 md:col-span-2">
            <button  className="bg-blue-500 hover:bg-blue-700 text-white dark:bg-gray-600 dark:hover:bg-slate-500 font-bold py-2 px-4 rounded w-full" type="reset"  > Cancel </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewPayroll;
