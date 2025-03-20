import React, { useState, useRef, useEffect } from "react";
import ResponseMessages from "../ResponseMessages";
import axios from "axios";
import Loading from "../Loading";

export default function EditUserDetails(props) {

    const setErrorMessage = useRef(null);
    const setSuccessMessage = useRef(null);
    const [loading, setLoading] = useState(true);

    const userInfo = JSON.parse(sessionStorage.getItem('user-info'));

    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        address: '',
        status: '',
        phone_number: '',
        nic: '',
        profilePicture: null,
        role: '',
        position: ''
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


     // Handle file input change
     const handleFileChange = (e) => {
        setUserDetails((prevState) => ({
          ...prevState,
          profilePicture: e.target.files[0],
        }));
      };



  const user = async()=>{
      try{
          const response = await axios.get(`http://127.0.0.1:8000/api/user/${props.selectedUserId}`,{
          headers: 
              { Authorization: `Bearer ${sessionStorage.getItem('token')}`,
               Accept: 'application/json'} 
      })
        
        setUserDetails(response.data);
          setLoading(false);
      }
      catch(error){
      //  setErrorMessage(error.response.data.message);
        console.error(error)
          setLoading(false);
      }
  }


  useEffect(()=>{
      user();
  },[]);


    const handleSubmit = async(e) =>{

        e.preventDefault();
        const formData = new FormData();
        formData.append("name", userDetails.name);
        formData.append("email", userDetails.email);
        formData.append("address", userDetails.address);
        formData.append("status", userDetails.status);
        formData.append("phone", userDetails.phone);
        formData.append("nic", userDetails.nic);

        formData.append("role", userDetails.role);
        formData.append("position", userDetails.position);

        if (userDetails.profilePicture) formData.append("profile_picture", userDetails.profilePicture);


        try{
            const response = await axios.post(`http://127.0.0.1:8000/api/user-update/${props.selectedUserId}`, formData, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data", 
                },
                
            });
          
            setSuccessMessage.current(response.data.message);
        }
        catch(error){
          // console.error(error);
            setErrorMessage.current(error.response.data.message);
        }

    }


    if (loading) {
        return (
            <Loading />
        );
    }
    
  return (
    <div className=' p-2 max-h-[80vh] overflow-y-auto '>

        <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>

        <form onSubmit={handleSubmit} className='grid grid-cols-4  gap-2  shadow-[0_3px_10px_rgb(0,0,0,0.4)]  bg-white dark:bg-gray-900 p-2     rounded-lg text-black dark:text-white'>

        <h1 className='col-span-4 p-1 text-lg'> Genaral Information  </h1>

            <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2   px-3">
                <label className="text-start text-sm"> User Name</label><br/>
                <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="text" placeholder="Name" name="name"  required value={userDetails.name} onChange={handleChange} />
            </div>

            <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2   px-3">
                <label className="text-start text-sm"> Phone Number</label><br/>
                <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" type="tel" placeholder="Phone number" name="phone_number"  required value={userDetails.phone_number}  onChange={handleChange} />
            </div>

            <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2   px-3">
                <label className="text-start text-sm"> Email address </label><br/>
                <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" type="email" placeholder="Email address " name="email"  required value={userDetails.email} onChange={handleChange}  />
            </div>

            <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2   px-3">
                <label className="text-start text-sm"> Status </label><br/>
                <select className="border rounded-lg border-violet-950 w-full py-2 px-3  bg-white dark:bg-gray-800"  name="status"  required value={userDetails.status} onChange={handleChange} >
                        <option value="">Select Status</option>
                        <option value="active">Active</option>
                        <option value="in active">In Active </option>
                </select>
            </div>

            


            <div className="mb-2 w-full col-span-4 lg:col-span-2 md:col-span-4  px-3">
                <label className="text-start text-sm"> Address </label><br/>
                <textarea   className="border rounded-lg border-violet-950 w-full p-2   bg-white dark:bg-gray-800 " type="text" placeholder="Address" name="address" value={userDetails.address} onChange={handleChange}  />

            </div>


            


            <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2  px-3">
                <label className="text-start text-sm"> Profile Picture</label><br/>
                <input  className="block w-full text-sm   border rounded-lg border-violet-950 py-[7px] px-2  cursor-pointer  bg-white dark:bg-gray-800 " type="file" name="profile_picture"  onChange={handleFileChange} />
            </div>
            {
                userInfo.role === 'admin' ? 

                    <>
                  

                    <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2   px-3">
                        <label className="text-start text-sm"> Role</label><br/>    
                        <select className="border rounded-lg border-violet-950 w-full py-2 px-3  bg-white dark:bg-gray-800"  name="role"  required value={userDetails.role}  onChange={handleChange} >
                            <option value="">Select Role</option>
                            <option value="contractor">Contractor</option>
                            <option value="consultant">Consultant </option>
                            <option value="labor"> Labor</option>
                            <option value="client">Client</option>
                        </select>
                    </div>

                    <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2   px-3">
                        <label className="text-start text-sm"> Position</label><br/>
                        <select className="border rounded-lg border-violet-950 w-full py-2 px-3  bg-white dark:bg-gray-800"  name="position"  required value={userDetails.position}  onChange={handleChange} >
                        <option value="">Select Position</option>
                            <option value="project manager">Project Manager</option>
                            <option value="financial manager">Financial Manager </option>
                            <option value="engineer"> Engineer</option>
                            <option value="quality checker">Quality Checker</option>
                        </select>
                    </div>

                </>
                    
                : null

                
            }

            

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
