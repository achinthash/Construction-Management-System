
import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import ResponseMessages from '../ResponseMessages';
import Loading from '../Loading';

const EditBill = ({ selectedBill }) => {

    const [loading, setLoading] = useState(true);
    const setErrorMessage = useRef(null);
    const setSuccessMessage = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    project_id: '',
    bill_type: '',
    status: '',
    tax: '',
    discount: '',
    subtotal: '',
    paid_by: '',
    paid_to: '',
    notes: '',
    total: ''
  });

  useEffect(() => {
    const fetchBill = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/bill-selected/${selectedBill}`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
              Accept: 'application/json',
            },
          });
          setFormData(response.data);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          setErrorMessage.current('Error fetching Bill.');
        }
      };

    if (selectedBill) {
      fetchBill();
    }
  }, [selectedBill]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8000/api/update-bill/${selectedBill}`,
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
    <div className="p-2 max-h-[80vh] overflow-y-auto">
      <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />

      <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-2 shadow-[0_3px_10px_rgb(0,0,0,0.4)] bg-white dark:bg-gray-900 p-2 overflow-y-auto rounded-lg text-black dark:text-white">
   
        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
            <label className="text-sm text-start">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border border-violet-950 rounded-lg py-2 px-3 bg-white dark:bg-gray-800" />
        </div>
    
        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
            <label className="text-sm text-start">Bill Type</label>
            <input type="text" name="bill_type" value={formData.bill_type} onChange={handleChange} className="w-full border border-violet-950 rounded-lg py-2 px-3 bg-white dark:bg-gray-800" />
        </div>
    
        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
        <label className="text-sm text-start">Status</label>
        <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-violet-950 rounded-lg py-2 px-3 bg-white dark:bg-gray-800">
            <option value="">Select Status</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
        </select>
        </div>

        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
            <label className="text-sm text-start">Paid To (User ID)</label>
            <input type="number" name="paid_to" value={formData.paid_to} onChange={handleChange} className="w-full border border-violet-950 rounded-lg py-2 px-3 bg-white dark:bg-gray-800" />
        </div>
    
        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
            <label className="text-sm text-start">Tax</label>
            <input type="number" name="tax" value={formData.tax} onChange={handleChange} className="w-full border border-violet-950 rounded-lg py-2 px-3 bg-white dark:bg-gray-800" />
        </div>

        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
            <label className="text-sm text-start">Discount</label>
            <input type="number" name="discount" value={formData.discount} onChange={handleChange} className="w-full border border-violet-950 rounded-lg py-2 px-3 bg-white dark:bg-gray-800" />
        </div>
    
        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
            <label className="text-sm text-start">Subtotal</label>
            <input type="number" name="subtotal" value={formData.subtotal} onChange={handleChange} className="w-full border border-violet-950 rounded-lg py-2 px-3 bg-white dark:bg-gray-800" />
        </div>
    
        <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2 px-3">
            <label className="text-sm text-start">Total</label>
            <input type="number" name="total" value={formData.total} onChange={handleChange} className="w-full border border-violet-950 rounded-lg py-2 px-3 bg-white dark:bg-gray-800" />
        </div>

        <div className="mb-2 w-full col-span-4 lg:col-span-4 md:col-span-4 px-3">
            <label className="text-sm text-start">Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" className="w-full border border-violet-950 rounded-lg py-2 px-3 bg-white dark:bg-gray-800"></textarea>
        </div>
    
        <div className="w-full col-span-4">
            <hr className="border-t-3 border-gray-800 my-2" />
        </div>

        <div className="col-span-4 w-full grid grid-cols-4">
            <div className="col-span-2 lg:col-span-1 px-3">
                <button className="bg-blue-500 hover:bg-blue-700 dark:bg-gray-600 dark:hover:bg-slate-500 text-white font-bold py-2 px-4 rounded w-full" type="submit" >Save</button>
            </div>
            <div className="col-span-2 lg:col-span-1 px-3">
                <button className="bg-blue-500 hover:bg-blue-700 dark:bg-gray-600 dark:hover:bg-slate-500 text-white font-bold py-2 px-4 rounded w-full" type="reset" > Cancel</button>
            </div>
        </div>
    </form>
  </div>
  );
};

export default EditBill;
