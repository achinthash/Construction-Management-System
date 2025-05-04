import React, { useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import ResponseMessages from "../../ResponseMessages";

export default function NewPurchaseOrder() {

    const { projectId } = useParams();
    const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
    const setErrorMessage = useRef(null);
    const setSuccessMessage = useRef(null);
    const [steps, setSteps] = useState(1);

    const nextPage =() =>{
        setSteps(steps +1);
    }
    
    const prevPage =() =>{
    setSteps(steps - 1);
    }

    const [formData, setFormData] = useState({
        project_id : projectId,
        task_id : '',
        title : '',
        status : '',
        delivery_date : '',
        created_by : userInfo.id,
        supplier_name : '',
        supplier_phone : '',
        cost_items : [],

    });

    const [costItems, setCostItems] = useState({
        item_name : '', 
        quantity : '',
        unit : '',
        unit_price : '', 
        total_amount : '',
    });

    const handleCostItemChanges = (e) =>{
        setCostItems({...costItems, [e.target.name]: e.target.value});
    }

    const handleChange = (e) =>{
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const addCostItems = () =>{

        if (formData.cost_items) {
            setFormData({ 
                ...formData, 
                cost_items: [...formData.cost_items, costItems]
            });
            setCostItems({ item_name: "", quantity: "", unit: "", total_amount:""}); 
        } else {
            alert("Date required for task dates.");
        }
    }


    const removeCostItem = (index) =>{
        setFormData({...costItems,
            cost_items: formData.cost_items.filter((_, i) => i !== index),  });
    }


    const handleSubmit = async(e) =>{
        e.preventDefault();

        try{

            const response = await axios.post("http://localhost:8000/api/new-purchase-order",formData,{
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    Accept: "application/json",
                    "Content-Type": "multipart/json", 
                },
            })

            setSuccessMessage.current(response.data.message);

        }catch(error){
            console.error(error);
            setErrorMessage.current(error.response.data.message)
           
        }
    }

    

  return (
    <div className=' p-2 max-h-[80vh] overflow-y-auto w-full '>
 
      <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>

        <form  onSubmit={handleSubmit} className='  shadow-[0_3px_10px_rgb(0,0,0,0.4)]  bg-white dark:bg-gray-900 p-2   overflow-y-auto  rounded-lg text-black dark:text-white'>


        {
            steps === 1 && (
                <div className='grid grid-cols-2  gap-2 '> 

                    <h1 className='col-span-2 p-1 text-lg'> Cost Information  </h1>


                    <div className="mb-2 w-full col-span-2 lg:col-span-1 md:col-span-2 px-3">
                        <label className="text-start text-sm"> Task Id</label><br/>
                        <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="number" placeholder="Task Id" name="task_id"   value={formData.task_id} onChange={handleChange} />
                    </div>


                    <div className="mb-2 w-full col-span-2 lg:col-span-1 md:col-span-2 px-3">
                        <label className="text-start text-sm"> Title</label><br/>
                        <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="text" placeholder="Title" name="title"   value={formData.title} onChange={handleChange}  />
                    </div>

                    <div className="mb-2 w-full col-span-2 lg:col-span-1 md:col-span-2 px-3">
                        <label className="text-start text-sm"> Delivery date</label><br/>
                        <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="date" name="delivery_date"   value={formData.delivery_date} onChange={handleChange}   />
                    </div>

                    <div className="mb-2 w-full col-span-2 lg:col-span-1 md:col-span-2 px-3">
                        <label className="text-start text-sm"> Status</label><br/>
                        <select  className="   border rounded-lg border-violet-950 w-full py-3 px-3 bg-white dark:bg-gray-800" name="status"  value={formData.status} onChange={handleChange}   >

                        <option >Select Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Completed">Completed </option>

                        </select>
                    </div>


                    <div className='w-full col-span-2'>
                    <hr className='border-t-3 border-gray-800 my-2'></hr>
                    </div>


                    <div className="mb-2 w-full col-span-2 lg:col-span-1 md:col-span-2 px-3">
                        <label className="text-start text-sm"> Supplier Name</label><br/>
                        <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="text" placeholder="Supplier Name" name="supplier_name"   value={formData.supplier_name} onChange={handleChange}  />
                    </div>

                    <div className="mb-2 w-full col-span-2 lg:col-span-1 md:col-span-2 px-3">
                        <label className="text-start text-sm"> Supplier Phone</label><br/>
                        <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="tel" placeholder="Supplier Phone" name="supplier_phone"   value={formData.supplier_phone} onChange={handleChange}  />
                    </div>

                </div>
            )
        }

        {
            steps === 2 && (
                <div className='grid grid-cols-3  gap-2 '> 

                    <div className="mb-2 w-full col-span-3 lg:col-span-1 md:col-span-2 px-3">
                        <label className="text-start text-sm"> Item Name</label><br/>
                        <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="text" placeholder="Item Name" name="item_name"   value={costItems.item_name} onChange={handleCostItemChanges}  />
                    </div>

                    <div className="mb-2 w-full col-span-3 lg:col-span-1 md:col-span-2 px-3">
                        <label className="text-start text-sm">Unit</label><br />
                        <select className="border rounded-lg border-violet-950 w-full py-3 px-3 bg-white dark:bg-gray-800" name="unit"  value={costItems.unit} onChange={handleCostItemChanges} >
                            <option>Select Unit</option>
                            <option value="kg">kg</option>
                            <option value="m3">m³</option>
                            <option value="sqm">sqm</option>
                            <option value="hr">hr</option>
                            <option value="piece">Piece</option>
                            <option value="day">Day</option>
                            <option value="hour">Hour</option>
                            <option value="lump_sum">Lump Sum</option>
                        </select>
                    </div>


                    <div className="mb-2 w-full col-span-3 lg:col-span-1 md:col-span-2 px-3">
                        <label className="text-start text-sm"> Quantity </label><br/>
                        <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="number" placeholder="Quantity" name="quantity"   value={costItems.quantity} onChange={handleCostItemChanges}  />
                    </div>


                    <div className="mb-2 w-full col-span-3 lg:col-span-1 md:col-span-3 px-3">
                        <label className="text-start text-sm"> Unit Price </label><br/>
                        <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="number" placeholder="Unit Price" name="unit_price"   value={costItems.unit_price} onChange={handleCostItemChanges}  />
                    </div>

                    <div className="mb-2 w-full col-span-3 lg:col-span-1 md:col-span-3 px-3">
                        <label className="text-start text-sm"> Total Cost </label><br/>
                        <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="number" placeholder="Total Cost" name="total_amount"  value={costItems.total_amount} onChange={handleCostItemChanges}   />
                    </div>


                    <div className="mb-2 w-full col-span-3 lg:col-span-1 md:col-span-3 px-2 mt-3 items-center flex ">
                        <button onClick={addCostItems} type='button' className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-600 w-full">Add</button>
                    </div>

                    <hr className="col-span-3 bg-black border"/>
                    
                    <div style={{ marginTop: '20px' }} className="col-span-3">
                        {formData.cost_items.map((item, index) => (
                            <div key={index} className="flex flex-wrap items-center justify-between bg-gray-100 p-4 border border-violet-900 rounded-lg mb-2 shadow-md">

                                <div className="grid grid-cols-2   lg:col-span-6 md:grid-cols-3 gap-4 w-full">
                                    <p className="font-semibold">Item: <span className="font-normal">{item.item_name}</span></p>
                                    <p className="font-semibold">Quantity: <span className="font-normal">{item.quantity}</span></p>
                                    <p className="font-semibold">Unit: <span className="font-normal">{item.unit}</span></p>
                                    <p className="font-semibold">Unit Price: <span className="font-normal">{item.unit_price}</span></p>
                                    <p className="font-semibold">Total Amount: <span className="font-normal">{item.total_amount}</span></p>

                                    <button onClick={() => removeCostItem(index)}  type='button'  className='ml-auto items-center '>
                                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg> 
                                    </button>  
                                </div>
                            </div>
                        ))}
                    </div> 
                </div>
            )
        }
     
        <div className='flex justify-between p-2'>
            {
                steps !== 1 && (
                <button onClick={prevPage} type='button' className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-600 transition duration-300">Previous</button>  )
            }

            {
                steps < 2 && (
                <button onClick={nextPage} type='button' className="bg-violet-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-violet-600 transition duration-300">Next</button>) 
            }

            {
                steps === 2 && (
                <button type='submit' className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 transition duration-300"> Submit </button> ) 
            }

        </div>
           
    </form>
  </div>
  )
}
