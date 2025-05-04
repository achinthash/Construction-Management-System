import React, { useState, useRef } from "react";
import axios from "axios";
import ResponseMessages from '../ResponseMessages';

export default function ChangePassword(props) {

    // {props.selectedUserId}

    const setErrorMessage = useRef(null);
    const setSuccessMessage = useRef(null);

    const [current_password , setCurrent_password] = useState('');
    const [new_password , setNew_password] = useState('');
    const [new_password_confirmation, setNew_password_confirmation] = useState('');

    const handleSubmit = async(e) =>{

        e.preventDefault();
        const formData = new FormData();
        formData.append('current_password', current_password);
        formData.append('new_password', new_password);
        formData.append('new_password_confirmation', new_password_confirmation);

        try{
            const response = await axios.put(`http://127.0.0.1:8000/api/user-update-password/${props.selectedUserId}`, formData, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            });
          
            setSuccessMessage.current(response.data.message);
        }
        catch(error){
           // console.error(error);
            setErrorMessage.current(error.response.data.message);
        }

    }
  return (
    <div className=' p-2 '>

        <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>

        <form onSubmit={handleSubmit} className='grid grid-cols-3  gap-2  shadow-[0_3px_10px_rgb(0,0,0,0.4)]  bg-white dark:bg-gray-900 p-2     rounded-lg text-black dark:text-white'>

        <h1 className='col-span-4 p-1 text-lg'> Password Information  </h1>

            <div className="mb-2 w-full col-span-3 lg:col-span-1 md:col-span-3  px-3">
                <label className="text-start text-sm"> Current Password </label><br/>
                <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" type="password" placeholder="Password" name="current_password"  required  value={current_password}  onChange={(e)=>setCurrent_password(e.target.value)} />
            </div>

            <div className="mb-2 w-full col-span-3 lg:col-span-1 md:col-span-3  px-3">
                <label className="text-start text-sm"> New Password </label><br/>
                <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="password" placeholder="Confirm Password " name="new_password"  required value={new_password}  onChange={(e)=>setNew_password(e.target.value)} />
            </div>

            <div className="mb-2 w-full col-span-3 lg:col-span-1 md:col-span-3  px-3">
                <label className="text-start text-sm"> Confirm New Password </label><br/>
                <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="password" placeholder="Confirm Password " name="new_password_confirmation"  required value={new_password_confirmation}  onChange={(e)=>setNew_password_confirmation(e.target.value)} />
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
