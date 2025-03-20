import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ResponseMessages from '../ResponseMessages';
import { MultiSelect } from "react-multi-select-component";
import Pusher from 'pusher-js';

export default function NewNotification() {

    
    const setErrorMessage = useRef(null);
    const setSuccessMessage = useRef(null);


    const [users , setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);



    const [formData , setFormData] = useState({
        type: '',
        title: '',
        description: '',
        is_read: false,
        referenced_id: ''
    });

 



    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = sessionStorage.getItem("token");
                const response = await axios.get("http://localhost:8000/api/users-all", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const userOptions = response.data.map(user => ({
                    label: user.name,
                    value: user.id
                }));
                
                setUsers(userOptions);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, []);




     // Handle form submission
     const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (selectedUsers.length === 0) {
            setErrorMessage.current("Please select at least one user.");
            return;
        }
        
        const notificationData = {
            ...formData,
            user_id: selectedUsers.map(user => user.value),
            is_read: formData.is_read ? 1 : 0 
        };

        try {
            const response = await axios.post("http://localhost:8000/api/new-notification", notificationData, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                }
            });
            
            setSuccessMessage.current("Notification sent successfully!");
            setSelectedUsers([]);
            
        } catch (error) {
            console.error("Error sending notification:", error);
            setErrorMessage.current(error.response?.data?.message || "An error occurred.");
        }
    };


  

  return (
    <div className=' p-2 max-h-[80vh] overflow-y-auto  '>

    <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>

        <form onSubmit={handleSubmit} className='grid grid-cols-4  gap-2  shadow-[0_3px_10px_rgb(0,0,0,0.4)]  bg-white dark:bg-gray-900 p-2   overflow-y-auto  rounded-lg text-black dark:text-white'>

            <h1 className='col-span-4 p-1 text-lg'> Custom Notification  </h1>

            <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2  px-3">
                <label className="text-start text-sm"> Type</label><br/>
                <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="text" placeholder="Type" name="type"  value={formData.type} onChange={handleChange}  />
            </div>

            <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2  px-3">
                <label className="text-start text-sm"> Title</label><br/>
                <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="text" placeholder="Title" name="title"  required value={formData.title} onChange={handleChange}  />
            </div>



            <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2  px-3">
                <label className="text-start text-sm"> Description </label><br/>
                <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="text" placeholder="Description" name="description"  value={formData.description} onChange={handleChange}   />
            </div>

           
            <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2  px-3">
                <label className="text-start text-sm"> User</label><br/>
                <MultiSelect options={users} value={selectedUsers} onChange={setSelectedUsers} labelledBy="Select"  />
            </div>

            

            <div className='w-full col-span-4 mt-6'>
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


