


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ResponseMessages from '../ResponseMessages'; 
import Loading from '../Loading'; 

const EditActualCost = ({ selectedActCost }) => {
  const [loading, setLoading] = useState(true);
  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);

  const [formData, setFormData] = useState({
    estimation_id: '',
    reason: '',
    cost_type: '',
    unit: '',
    quantity: '',
    unit_price: '',
    total_cost: '',
  });


  const fetchPayrollData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/actual-cost-selected/${selectedActCost}`, {
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
  }, [selectedActCost]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8000/api/update-actual-cost/${selectedActCost}`,
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
          <label className="text-start text-sm">Estimation ID</label>
          <input
            className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"
            type="number"
            name="estimation_id"
            value={formData.estimation_id}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2 w-full col-span-3 lg:col-span-1 px-3">
          <label className="text-start text-sm">Cost Type</label>
          <input
            className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"
            type="text"
            name="cost_type"
            value={formData.cost_type}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2 w-full col-span-3 lg:col-span-1 px-3">
          <label className="text-start text-sm">Unit</label>
          <input
            className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2 w-full col-span-3 lg:col-span-1 px-3">
          <label className="text-start text-sm">Quantity</label>
          <input
            className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2 w-full col-span-3 lg:col-span-1 px-3">
          <label className="text-start text-sm">Unit Price</label>
          <input
            className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"
            type="number"
            name="unit_price"
            value={formData.unit_price}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2 w-full col-span-3 lg:col-span-1 px-3">
          <label className="text-start text-sm">Total Cost</label>
          <input
            className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"
            type="number"
            name="total_cost"
            value={formData.total_cost}
            onChange={handleChange}
          />
        </div>

   
        <div className="mb-2 w-full col-span-3 lg:col-span-3 px-3">
          <label className="text-start text-sm">Reason</label>
          <input
            className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"
            type="text"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
          />
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

export default EditActualCost;
