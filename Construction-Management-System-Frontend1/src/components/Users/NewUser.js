
import React, { useState, useRef } from 'react'

import Form_buttons from '../Form_buttons';
import axios from "axios";
import ResponseMessages from '../ResponseMessages';


export default function NewUser() {

    const setErrorMessage = useRef(null);
    const setSuccessMessage = useRef(null);

    const [name , setName] = useState('');
    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');

    const [address , setAddress] = useState('');
    const [status , setStatus] = useState('');
    const [phone , setPhone] = useState('');
    const [role , setRole] = useState('');
    const [profilePicture , setProfilePicture] = useState(null);
    const [password_confirmation, setPassword_confirmation] = useState('');

    const [nic, setNic] = useState('');
    const [position, setPostion] = useState('');


  // Handle file input change
  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0])
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", name);
    formDataToSend.append("email", email);
    formDataToSend.append("status", status);
    formDataToSend.append("address", address);
    formDataToSend.append("password", password);
    formDataToSend.append("password_confirmation", password_confirmation);
    formDataToSend.append("phone_number", phone);
    formDataToSend.append("role", role);
    
    if (profilePicture) {
      formDataToSend.append("profile_picture", profilePicture);
    }

    if (nic) {
        formDataToSend.append("nic", nic);
    }

    if (position) {
      formDataToSend.append("position", position);
    }

    try {
      const response = await axios.post("http://localhost:8000/api/register", formDataToSend,
        { headers: { "Content-Type": "application/form-data",},
        }
      );
 

        setSuccessMessage.current("User created successfully!");

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
    <div className=' p-2 '>

    <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>

        <form onSubmit={handleSubmit} className='grid grid-cols-4  gap-2  shadow-[0_3px_10px_rgb(0,0,0,0.4)]  bg-white dark:bg-gray-900 p-2  h-[80vh] overflow-y-auto  rounded-lg text-black dark:text-white'>

            <h1 className='col-span-4 p-1 text-lg'> Genaral Information  </h1>
            <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2  px-3">
                <label className="text-start text-sm"> User Name</label><br/>
                <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="text" placeholder="Name" name="name"  required value={name} onChange={(e)=>setName(e.target.value)}  />
            </div>

            <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2   px-3">
                <label className="text-start text-sm"> Phone Number</label><br/>
                <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" type="tel" placeholder="Phone number" name="phone"  required value={phone}  onChange={(e)=>setPhone(e.target.value)} />
            </div>

            <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2   px-3">
                <label className="text-start text-sm"> Email address </label><br/>
                <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" type="email" placeholder="Email address " name="email"  required value={email}  onChange={(e)=>setEmail(e.target.value)} />
            </div>


            <div className="w-full  col-span-4 lg:col-span-1 md:col-span-2  px-3 mb-2">
                <label className="text-start text-sm"> User Role </label><br/>
                    <select value={role} onChange={(e)=>setRole(e.target.value)}   className="border rounded-lg border-violet-950 w-full py-2 px-3  bg-white dark:bg-gray-800 "  name="role"  required >
                        <option value="">Select Role</option>
                        <option value="contractor">Contractor</option>
                        <option value="consultant">Consultant </option>
                        <option value="labor"> Labor</option>
                        <option value="client">Client</option>
               
                    </select>
            </div>

            <div className="mb-2 w-full col-span-4 lg:col-span-2 md:col-span-4  px-3">
                <label className="text-start text-sm"> Address </label><br/>
                <textarea   className="border rounded-lg border-violet-950 w-full p-2   bg-white dark:bg-gray-800 " type="text" placeholder="Address" name="address" value={address}  onChange={(e)=>setAddress(e.target.value)} />

            </div>

            { /* contractor   input section */}

            {
                role === 'contractor'  ? (
                    <div className=' col-span-4 lg:col-span-2 md:col-span-4  w-full grid grid-cols-2 gap-2'>

                        <div className="mb-2 w-full col-span-2 lg:col-span-1 md:col-span-1 px-3">
                            <label className="text-start text-sm"> NIC </label><br/>
                            <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="text" placeholder="NIC" name="nic"  value={nic} onChange={(e)=>setNic(e.target.value)} required />
                        </div>
                        
                        <div className="mb-2 w-full col-span-2 lg:col-span-1 md:col-span-1 px-3">
                            <label className="text-start text-sm"> Position </label><br/>
                                <select value={position} onChange={(e)=>setPostion(e.target.value)}  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"  name="position"  required >
                                    <option value="">Select Position</option>
                                    <option value="project manager">Project Manager</option>
                                    <option value="financial manager">Financial Manager </option>
                                    <option value="engineer"> Engineer</option>
                                    <option value="quality checker">Quality Checker</option>
                        
                                </select>
                        </div>

                    </div>
                ) : null
            }

            { /* labor   input section */}

            {
                  role === 'labor' ? (
                    <div className=' col-span-4 lg:col-span-2 md:col-span-4  w-full grid grid-cols-2 gap-2'>

                        <div className="mb-2 w-full col-span-2 lg:col-span-1 md:col-span-1 px-3">
                            <label className="text-start text-sm"> NIC </label><br/>
                            <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="text" placeholder="NIC" name="nic"  value={nic} onChange={(e)=>setNic(e.target.value)} required />
                        </div>
                        
                        <div className="mb-2 w-full col-span-2 lg:col-span-1 md:col-span-1 px-3">
                            <label className="text-start text-sm"> Position </label><br/>
                                <select value={position} onChange={(e)=>setPostion(e.target.value)}  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800"  name="position"  required >
                                    <option value="">Select Position</option>
                                    <option value="meson">Meson</option>
                                    <option value="electrition">Electrition </option>
                                    <option value="plumber"> Plumber</option>
                                    <option value="worker"> Worker </option>
                        
                                </select>
                        </div>

                    </div>
                ) : null
            }

            { /* contractor  input section */}
            
            {
                role === 'consultant'  ? (
                    <div className=' col-span-4 lg:col-span-2 md:col-span-4  w-full grid grid-cols-2 gap-2'>

                        <div className="mb-2 w-full col-span-2 lg:col-span-1 md:col-span-1 px-3">
                            <label className="text-start text-sm"> Company ID </label><br/>
                            <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" type="number" placeholder="Company ID" name="comapny id" value={nic} onChange={(e)=>setNic(e.target.value)}    />
                        </div>
                        
                        <div className="mb-2 w-full col-span-2 lg:col-span-1 md:col-span-1 px-3">
                            <label className="text-start text-sm">Consultant Type </label><br/>
                                <select value={position} onChange={(e)=>setPostion(e.target.value)} className="border rounded-lg border-violet-950 w-full py-2 px-3  bg-white dark:bg-gray-800"  name="type"   >
                                    <option value="">Select Type</option>
                                    <option value="financial">Financial</option>
                                    <option value="sub contractor">Sub Contractor </option>
                                    
                        
                                </select>
                        </div>

                    </div>
                ) : null
            }

            { /* Client  input section */}

            {
                role === 'client' ? (
                    <div className='w-full col-span-4 lg:col-span-1 md:col-span-2    grid grid-cols-1 gap-2'>
  
                        <div className="mb-2 w-full  px-3">
                            <label className="text-start text-sm"> NIC </label><br/>
                            <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="text" placeholder="NIC" name="nic" value={nic} onChange={(e)=>setNic(e.target.value)} required  />
                        </div>
                        
            
                    </div>
                ) : null
            } 

            <div className='w-full col-span-4 '>
                <hr className='border-t-3 border-gray-800 my-2'></hr>
            </div>
            
            <h1 className='col-span-4 p-2 text-lg'> Account Information  </h1>

            <div className="mb-2 w-full  col-span-4 lg:col-span-1 md:col-span-2  px-3">
                <label className="text-start text-sm"> Status </label><br/>
                <select className="border rounded-lg border-violet-950 w-full py-2 px-3  bg-white dark:bg-gray-800"  name="status"  required value={status}  onChange={(e)=>setStatus(e.target.value)} >
                        <option value="">Select Status</option>
                        <option value="active">Active</option>
                        <option value="in active">In Active </option>
                    </select>
            </div>


            <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2  px-3">
                <label className="text-start text-sm"> Profile Picture</label><br/>
                <input  className="block w-full text-sm   border rounded-lg border-violet-950 py-[7px] px-2  cursor-pointer  bg-white dark:bg-gray-800 " type="file" name="profile picture"   onChange={handleFileChange} />
            </div>

            <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2  px-3">
                <label className="text-start text-sm"> Password </label><br/>
                <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800" type="password" placeholder="Password" name="password"  required  value={password}  onChange={(e)=>setPassword(e.target.value)} />
            </div>

            <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2  px-3">
                <label className="text-start text-sm"> Confirm Password </label><br/>
                <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="password" placeholder="Confirm Password " name="confirm password"  required value={password_confirmation}  onChange={(e)=>setPassword_confirmation(e.target.value)} />
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





