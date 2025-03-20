import React, { useState, useRef } from 'react'
import axios from 'axios';
import ResponseMessages from '../ResponseMessages';


export default function NewEquipment() {

    const setErrorMessage = useRef(null);
    const setSuccessMessage = useRef(null);


    const [serial_number , setSerialNumber] = useState('');
    const [category , setCategory] = useState('');
    const [model , setModel] = useState('');

    const [name , setName] = useState('');
    const [status , setStatus] = useState('');
    const [condition_level , setConditionLevel] = useState('');
    const [purchase_price , setPurchasePrice] = useState('');
    const [purchase_date, setPurchaseDate] = useState('');
    const [image , setImage] = useState(null);


     // Handle file input change
  const handleFileChange = (e) => {
    setImage(e.target.files[0])
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("serial_number", serial_number);
    formDataToSend.append("category", category);
    formDataToSend.append("model", model);
    formDataToSend.append("name", name);
    formDataToSend.append("status", status);
    formDataToSend.append("condition_level", condition_level);
    formDataToSend.append("purchase_price", purchase_price);
    formDataToSend.append("purchase_date", purchase_date);


    if (image) {
      formDataToSend.append("image", image);
    }

    try {
      const response = await axios.post("http://localhost:8000/api/equipment-store", formDataToSend,{  
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            Accept: "application/json",
            "Content-Type": "multipart/json", 
        },
    });
 
        setSuccessMessage.current(response.data.message);

    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        setErrorMessage.current("Error: " + error.response.data.message);
      } else {
        console.error("Error:", error.message);
        setErrorMessage.current("An error occurred.");
      }
    }
  };
    


  return (
    <div className=' p-2 max-h-[80vh] overflow-y-auto  '>

    <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>

        <form onSubmit={handleSubmit} className='grid grid-cols-4  gap-2  shadow-[0_3px_10px_rgb(0,0,0,0.4)]  bg-white dark:bg-gray-900 p-2   overflow-y-auto  rounded-lg text-black dark:text-white'>

            <h1 className='col-span-4 p-1 text-lg'> Genaral Information  </h1>

            <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2  px-3">
                <label className="text-start text-sm"> Name</label><br/>
                <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="text" placeholder="Name" name="name"  required value={name} onChange={(e)=>setName(e.target.value)}  />
            </div>

            <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2  px-3">
                <label className="text-start text-sm"> Serial Number</label><br/>
                <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="text" placeholder="Serial Number" name="serial_number"  required value={serial_number} onChange={(e)=>setSerialNumber(e.target.value)}  />
            </div>

            <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2  px-3">
                <label className="text-start text-sm"> Model</label><br/>
                <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="text" placeholder="Model" name="model"  required value={model} onChange={(e)=>setModel(e.target.value)}  />
            </div>

            <div className="w-full  col-span-4 lg:col-span-1 md:col-span-2  px-3 mb-2">
                <label className="text-start text-sm"> Status </label><br/>
                    <select value={status} onChange={(e)=>setStatus(e.target.value)}   className="border rounded-lg border-violet-950 w-full py-2 px-3  bg-white dark:bg-gray-800 "  name="status"  required >
                        <option value="">Select Status</option>
                        <option value="available">Available</option>
                        <option value="in_use">In Use</option>
                        <option value="under_maintenance">Under Maintenance</option>
                        <option value="damaged">Damaged</option>
                    </select>
            </div>

            <div className="w-full  col-span-4 lg:col-span-1 md:col-span-2  px-3 mb-2">
                <label className="text-start text-sm"> Category </label><br/>
                    <select value={category} onChange={(e)=>setCategory(e.target.value)}   className="border rounded-lg border-violet-950 w-full py-2 px-3  bg-white dark:bg-gray-800 "  name="category"  required >
                        <option value="">Select Category</option>
                        <option value="heavy_machinery">Heavy Machinery</option>
                        <option value="power_tools">Power Tools</option>
                        <option value="hand_tools">Hand Tools</option>
                        <option value="safety_equipment">Safety Equipment</option>
                        <option value="surveying_instruments">Surveying Instruments</option>
               
                    </select>
            </div>

           


            <div className="w-full  col-span-4 lg:col-span-1 md:col-span-2  px-3 mb-2">
                <label className="text-start text-sm"> Condition Level </label><br/>
                    <select value={condition_level} onChange={(e)=>setConditionLevel(e.target.value)}   className="border rounded-lg border-violet-950 w-full py-2 px-3  bg-white dark:bg-gray-800 "  name="condition_level"  required >
                        <option value="">Select Condition Level</option>
                        <option value="new">New</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                        <option value="damaged">Damaged</option>
                                    
                    </select>
            </div>
            <div className='w-full col-span-4'>
                <hr className='border-t-3 border-gray-800 my-2'></hr>
            </div>

            <h1 className='col-span-4 p-1 text-lg'> Other Information  </h1>
         

            <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2  px-3">
                <label className="text-start text-sm"> Image </label><br/>
                <input  className="block w-full text-sm   border rounded-lg border-violet-950 py-[7px] px-2  cursor-pointer  bg-white dark:bg-gray-800 " type="file" name="profile picture"   onChange={handleFileChange} />
            </div>


            <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2  px-3">
                <label className="text-start text-sm"> Purchase Date</label><br/>
                <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="date" placeholder="Purchase Date" name="purchase_date"  required value={purchase_date} onChange={(e)=>setPurchaseDate(e.target.value)}  />
            </div>


            
            <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2  px-3">
                <label className="text-start text-sm"> Purchase Price</label><br/>
                <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="number" placeholder="Purchase Price" name="purchase_price"  required value={purchase_price} onChange={(e)=>setPurchasePrice(e.target.value)}  />
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


  )
}
