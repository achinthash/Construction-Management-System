
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ResponseMessages from '../ResponseMessages';
import Loading from '../Loading';

const EditPayroll = ({ selectedPayroll }) => {

  const [loading, setLoading] = useState(true);
  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);

  const [formData, setFormData] = useState({
    project_id: '',
    user_id: '',
    wagetype: '',
    wage_rate: '',
    worked_date: '',
    worked_hours: '',
    total_earned: '',
    status: '',
  });

  const fetchPayrollData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/payroll-selected/${selectedPayroll}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          Accept: 'application/json',
        },
      });
      setFormData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrorMessage.current('Error fetching payroll data.');
    }
  };

  useEffect(() => {
    fetchPayrollData();
  }, [selectedPayroll]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8000/api/update-payroll/${selectedPayroll}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            Accept: 'application/json',
          },
        }
      );
      setSuccessMessage.current(response.data.message);
    } catch (error) {
      setErrorMessage.current('Error: ' + (error.response?.data?.message || 'Something went wrong.'));
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-4 max-h-[80vh] overflow-y-auto">
      <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 shadow-[0_3px_10px_rgb(0,0,0,0.4)] bg-white dark:bg-gray-900 p-4 rounded-lg text-black dark:text-white">
        <h1 className="col-span-3 p-1 text-lg">Edit Payroll</h1>

        <div className="mb-2 w-full col-span-3 lg:col-span-1 px-3">
          <label className="text-start text-sm">Wage Type</label>
          <input className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" type="text" name="wagetype" value={formData.wagetype} onChange={handleChange} />
        </div>

        <div className="mb-2 w-full col-span-3 lg:col-span-1 px-3">
          <label className="text-start text-sm">Wage Rate</label>
          <input className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" type="number" name="wage_rate" value={formData.wage_rate} onChange={handleChange} />
        </div>

        <div className="mb-2 w-full col-span-3 lg:col-span-1 px-3">
          <label className="text-start text-sm">Worked Date</label>
          <input className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" type="date" name="worked_date" value={formData.worked_date} onChange={handleChange} />
        </div>

        <div className="mb-2 w-full col-span-3 lg:col-span-1 px-3">
          <label className="text-start text-sm">Worked Hours</label>
          <input className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" type="number" name="worked_hours" value={formData.worked_hours} onChange={handleChange}/>
        </div>

        <div className="mb-2 w-full col-span-3 lg:col-span-1 px-3">
          <label className="text-start text-sm">Total Earned</label>
          <input className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" type="number"  name="total_earned" value={formData.total_earned} onChange={handleChange}  />
        </div>

        <div className="mb-2 w-full col-span-4 lg:col-span-1 px-3">
          <label className="text-start text-sm">Status</label>
          <select className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"   name="status"  value={formData.status}  onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="Processed">Processed</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

       
        <div className="w-full col-span-3">
          <hr className="border-t-3 border-gray-800 my-2" />
        </div>

        <div className="col-span-3 w-full grid grid-cols-4">
          <div className="col-span-2 lg:col-span-1 px-3">
            <button className="bg-blue-500 hover:bg-blue-700 dark:bg-gray-600 dark:hover:bg-slate-500 text-white font-bold py-2 px-4 rounded w-full" type="submit" >Save
            </button>
          </div>
          <div className="col-span-2 lg:col-span-1 px-3">
            <button className="bg-blue-500 hover:bg-blue-700 dark:bg-gray-600 dark:hover:bg-slate-500 text-white font-bold py-2 px-4 rounded w-full" type="reset" > Cancel</button>
          </div>
        </div>


      </form>
    </div>
  );
};

export default EditPayroll;
