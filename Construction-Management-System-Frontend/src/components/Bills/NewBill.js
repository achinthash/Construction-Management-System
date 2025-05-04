import React, { useState, useRef } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ResponseMessages from '../ResponseMessages';

const NewBill = () => {

  const { projectId } = useParams();
  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));

  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    project_id: projectId,
    bill_type: '',
    status: 'draft',
    tax: '',
    discount: '',
    subtotal: '',
    total: '',
    paid_by: userInfo.id,
    paid_to: '',
    notes: '',

    items: []
  });


  const handleFormChange = (event) =>{
    setFormData({...formData,[event.target.name]: event.target.value});
  }

  const [items, setItems] = useState({
    title : '',
    quantity: '',
    unit_price: '',
    total: ''

  });

  const handleItems = (event) => {
    setItems({...items, [event.target.name]: event.target.value})

  }

  const addItem = () => {
    const calculatedTotal = parseFloat(items.quantity || 0) * parseFloat(items.unit_price || 0);
    const newItem = {
      ...items,
      total: calculatedTotal.toFixed(2)
    };
  
    setFormData({
      ...formData,
      items: [...formData.items, newItem]
    });
  
    setItems({ title: '', quantity: '', unit_price: '', total: '' });
  };
  


  const removeItem = (index) =>{
    setFormData({...formData,
      items: formData.items.filter((_,i) => i !== index) 
    })
  }




  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     

      await axios.post('http://localhost:8000/api/new-bill' ,formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      });

      setSuccessMessage.current && setSuccessMessage.current("Bill created successfully.");
    } catch (error) {
      console.error(error);
      setErrorMessage.current && setErrorMessage.current("Failed to create bill.");
    }
  };

  return (
    <div className='p-2 max-h-[80vh] overflow-y-auto w-full'>
      <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg text-black dark:text-white space-y-6">
      
    

      <div className="flex justify-between flex-col lg:flex-row  items-center ">

        <div className="col-span-1">
          <div className="flex items-center space-x-4 mb-2">
            <label htmlFor="bill to" className="text-gray-500 text-sm w-20">Bill To</label>
            <input  type="number"   name="paid_to"  className="border border-gray-300 rounded-md px-3 py-2 w-[200px] focus:outline-none focus:ring-2 focus:ring-violet-500" value={formData.paid_to} onChange={handleFormChange}/>
          </div>

        </div>


        <div className="col-span-1 items-end  text-right">

          <div className="flex items-center space-x-4 mb-2">
            <label htmlFor="date" className="text-gray-500 text-sm w-20">Date</label>
            <input  type="date"  id="date" name="date"  className="border border-gray-300 rounded-md px-3 py-2 w-[200px] focus:outline-none focus:ring-2 focus:ring-violet-500"/>
          </div>


          <div className="flex items-center space-x-4 mb-2">
            <label htmlFor="date" className="text-gray-500 text-sm w-20">type</label>
            <select name="bill_type" value={formData.bill_type}  onChange={handleFormChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-[200px] focus:outline-none focus:ring-2 focus:ring-violet-500">
              <option value="">Select Type</option>
              <option value="Purchase Order">Purchase Order</option>
              <option value="Payroll">Payroll</option>
              <option value="Rejected">Rejected</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center space-x-4 mb-2">
            <label htmlFor="date" className="text-gray-500 text-sm w-20">Title</label>
            <input  type="text"  id="title"   className="border border-gray-300 rounded-md px-3 py-2 w-[200px] focus:outline-none focus:ring-2 focus:ring-violet-500" name="title" onChange={handleFormChange} value={formData.title}  />
          </div>

        </div>

      </div>



        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-sm">
            <thead className="bg-gray-400 rounded-lg  dark:bg-gray-800 text-black dark:text-gray-200">
              <tr className=" rounded-lg">
                <th className="p-2 text-left">Item</th>
                <th className="p-2 text-center">Qty</th>
           
                <th className="p-2 text-center">Cost</th>
                <th className="p-2 text-center">Amount</th>
                <th className="p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
            <tr  className="border-t  dark:border-gray-700">
                  <td className="p-2">
                    <input type="text" name="title"  placeholder="Enter item" className=" border border-violet-950 rounded-lg px-3 py-2 bg-white dark:bg-gray-800" value={items.title}  onChange={handleItems}/>
                  </td>
                  <td className="p-2 text-center">
                    <input type="number" name="quantity" className=" border border-violet-950 rounded-lg px-3 py-2 bg-white dark:bg-gray-800" value={items.quantity} onChange={handleItems}/>
                  </td>
                
                  <td className="p-2 text-center">
                    <input type="number" name="unit_price"  className=" border border-violet-950 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"  value={items.unit_price} onChange={handleItems} />
                  </td>
                  <td className="p-2 text-center">   
                    <input type="number" name="total" className=" border border-violet-950 rounded-lg px-3 py-2 bg-white dark:bg-gray-800" value={items.total} onChange={handleItems} />
                  </td>

                  <td className="p-2 text-center">
                  
                  </td>
                </tr>

              {formData.items.map((item,index) => (
                <tr key={index} className="border-t  dark:border-gray-700">
                  <td className="p-2">
                    <input type="text" name="title"  placeholder="Enter item" className="w-full border border-violet-950 rounded-lg px-3 py-2 bg-white dark:bg-gray-800" value={item.title} onChange={handleItems} />
                  </td>
                  <td className="p-2 text-center">
                    <input type="number" name="quantity" className=" border border-violet-950 rounded-lg px-3 py-2 bg-white dark:bg-gray-800" value={item.quantity} onChange={handleItems}/>
                  </td>
                
                  <td className="p-2 text-center">
                    <input type="number" name="unit_price"  className=" border border-violet-950 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"  value={item.unit_price} onChange={handleItems} />
                  </td>
                  <td className="p-2 text-center">   
                    <input type="number" name="total" className=" border border-violet-950 rounded-lg px-3 py-2 bg-white dark:bg-gray-800" value={item.total} onChange={handleItems} />
                  </td>

                  <td className="p-2 text-center">
                    <button type="button" onClick={() => removeItem(index)} className="text-red-600 hover:scale-110"> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-2">
            
            <button type="button" onClick={addItem} className="text-green-600 text-sm hover:bg-green-200 flex items-center p-2 border border-green-500 rounded-lg "> <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg> Add item </button>
          </div>

        </div>





        {/* */ }


        <div className="grid grid-cols-5 gap-2 ">

          <div className="col-span-5 md:col-span-5 lg:col-span-3 p-4 lg:order-1 order-2 ">

         
            <div>
              <label className="block text-sm mb-1">Notes / Terms</label>
              <textarea rows={3} name="notes" value={formData.notes}  onChange={handleFormChange} placeholder="Enter any notes or terms of services" className="w-full border border-violet-950 rounded-lg px-3 py-2 bg-white dark:bg-gray-800" />
            </div>

            <div className="text-right mt-6">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition">Create Bill</button>
            </div>

         

          </div>

          <div className=" col-span-5 md:col-span-5 lg:col-span-2 p-4 lg:order-2 order-1 ">

       

            <span className="flex justify-between items-center mb-2">
              <label className="block text-right text-sm mb-1">Subtotal</label>
              <input type="number" name="subtotal"  className=" w-[35%] border border-violet-950 rounded-lg px-3 py-1 bg-white dark:bg-gray-800" placeholder="%"  onChange={handleFormChange} value={formData.subtotal} />
            </span>

            <span className="flex justify-between items-center   mb-2">
              <label className="block text-sm mb-1">Discount</label>
              <input type="number" name="discount"  className=" w-[35%] border border-violet-950 rounded-lg px-3 py-1 bg-white dark:bg-gray-800" placeholder="%"  onChange={handleFormChange} value={formData.discount} />
            </span>

            <span className="flex justify-between items-center  mb-3">
              <label className="block text-sm mb-1">Tax</label>
              <input type="number" name="tax"  className=" w-[35%] border border-violet-950 rounded-lg px-3 py-1 bg-white dark:bg-gray-800" placeholder="%"  onChange={handleFormChange} value={formData.tax} />
            </span>


            <div className='w-full '>
              <hr className='border-t-3 border-gray-800 my-2'></hr>
            </div>
              
            <span className="flex justify-between items-center  mb-2">
              <label className="block text-sm mb-1">Total</label>

              <input type="number"  name="total" className=" w-[35%] border border-violet-950 rounded-lg px-3 py-1 bg-white dark:bg-gray-800" placeholder="%"  onChange={handleFormChange} value={formData.total} />    
            </span>
      
            
      

              
      

          </div>


        </div>

       
      </form>
    </div>
  );
};

export default NewBill;


