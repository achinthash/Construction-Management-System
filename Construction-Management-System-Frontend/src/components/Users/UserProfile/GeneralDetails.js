import React, { useState, useEffect } from 'react'
import axios from 'axios';

import DefaultUser from '../../../assets/DefaultUser.png'
import Loading from '../../Loading';
import ChangePassword from '../ChangePassword';
import EditUserDetails from '../EditUserDetails';

export default function GeneralDetails(props) {

    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState("");
    const [changePassword , setChangePassword] = useState("");
    const [changeUserDetails, setChangeUserDetails] = useState('');

    useEffect(()=>{

        const user = async()=>{
            try{
                const response = await axios.get(`http://127.0.0.1:8000/api/user/${props.systemUser}`,{
                headers: 
                    { Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    Accept: 'application/json'} 
            })
            
                setUserDetails(response.data);
                setLoading(false);
            }
            catch(error){
                console.error(error);
                setLoading(false);
            }
        }

    user();
    },[props.systemUser]);

    // user password update
    const handleChangePassword = (selectedId) =>{
        setChangePassword(selectedId);
     }

    // user details update
    const handleChangeUserDetails = (selectedId) =>{
        setChangeUserDetails(selectedId);
    }

    if (loading) {
        return (
            <Loading />
        );
    }

return (

    <>

        {/* Change password */} 
        { changePassword && (

            <div className="flex absolute  inset-0 items-center justify-center z-0 bg-black bg-opacity-75  w-full" > 
                <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] '>
                        
                <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
                    <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  Change Password </h1>
                    <button  onClick={()=>setChangePassword('')} type='reset'  className='ml-auto items-center col-span-1'>
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                    <ChangePassword selectedUserId={changePassword} />
                </div>
            </div>
        )}

         {/* Update user Details*/}

        { changeUserDetails && (

        <div className="flex absolute inset-0 items-center justify-center z-0 bg-black bg-opacity-75 " > 
            <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] '>
                    
            <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
                <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  Update User Details </h1>
                <button  onClick={()=>setChangeUserDetails('')} type='reset'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
                
                <EditUserDetails selectedUserId={changeUserDetails} />
                
            </div>
        </div>
        )}
            
   
        <section >

            <div className='bg-gradient-to-r from-fuchsia-500 to-cyan-500  w-full  top-0 left-0  right-0 z-0 h-32'></div>

            <div className="w-full  max-w-7xl mx-auto px-6 md:px-8  ">

                <div className="flex items-center justify-center sm:justify-start  -mt-16 z-10 mb-5">
                    { userDetails.profile_picture ? 
                        <img src={`http://127.0.0.1:8000/storage/${userDetails.profile_picture}` } alt="user-avatar-image" className="border-4 border-solid border-white rounded-full h-36 w-36 "/> :

                        <img src={DefaultUser} alt="user-avatar-image" className="border-4 border-solid border-white rounded-full h-36 w-36 "/>
                    }
                </div>

                <div className="flex flex-col sm:flex-row max-sm:gap-5 items-center justify-between mb-1 ">
                    <div className="block">
                        <h3 className="font-manrope font-bold text-4xl text-gray-900  ">  {userDetails.name}   </h3>
                        <p className="font-normal text-base leading-7 text-gray-500 text-center "> {userDetails.address} </p>
                        <p className="font-normal text-base leading-7 text-gray-500 text-center  "> {userDetails.email} </p>
                    </div>

                    <button
                        className="rounded-full py-3.5 px-5 bg-gray-100 flex items-center group transition-all duration-500 hover:bg-indigo-100 ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path className="stroke-gray-700 transition-all duration-500 group-hover:stroke-indigo-600"
                                d="M14.1667 11.6666V13.3333C14.1667 14.9046 14.1667 15.6903 13.6785 16.1785C13.1904 16.6666 12.4047 16.6666 10.8333 16.6666H7.50001C5.92866 16.6666 5.14299 16.6666 4.65483 16.1785C4.16668 15.6903 4.16668 14.9047 4.16668 13.3333V11.6666M16.6667 9.16663V13.3333M11.0157 10.434L12.5064 9.44014C14.388 8.18578 15.3287 7.55861 15.3287 6.66663C15.3287 5.77466 14.388 5.14749 12.5064 3.89313L11.0157 2.8993C10.1194 2.3018 9.67131 2.00305 9.16668 2.00305C8.66205 2.00305 8.21393 2.3018 7.31768 2.8993L5.82693 3.89313C3.9454 5.14749 3.00464 5.77466 3.00464 6.66663C3.00464 7.55861 3.9454 8.18578 5.82693 9.44014L7.31768 10.434C8.21393 11.0315 8.66205 11.3302 9.16668 11.3302C9.67131 11.3302 10.1194 11.0315 11.0157 10.434Z"
                                stroke="#374151" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                        <span className="px-2 font-medium text-base leading-7 text-gray-700 transition-all duration-500 group-hover:text-indigo-600">   {userDetails.role} </span>
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row max-lg:gap-5 items-center justify-between py-0.5">
                    <div className="flex items-center gap-4">
                        
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-6 ">
                        
                        <ul className="flex items-center max-sm:justify-center max-sm:flex-wrap gap-2.5">
                            
                            <button onClick={()=>handleChangePassword(userDetails.id)} className="py-3.5 px-5 rounded-full bg-indigo-600 text-white font-semibold text-base leading-7 shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-100 hover:bg-indigo-700">Change Password </button>
                            
                            <button onClick={()=>handleChangeUserDetails(userDetails.id)} className="py-3.5 px-5 rounded-full bg-indigo-600 text-white font-semibold text-base leading-7 shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-100 hover:bg-indigo-700">Edit
                            Profile</button>
                            
                        </ul>

                    </div>
                </div>
            </div> 

            <div className='w-full bg-violet-200 flex mt-2 rounded-lg '>
                <h2 className='font-bold text-lg py-3 px-3 ml-3 '>General Informations</h2>
            </div>

            <div className=' grid md:grid-cols-2 p-2 sm:grid-cols-1 gap-2    '>

                <div className='col-span-1 grid lg:grid-cols-2 md:grid-cols-1 bg-white rounded-lg py-3 '> 

                    <div className='col-span-1 items-center sm:text-center py-2 rounded-lg px-1 mb-2'>
                        <label className="text-center text-sm font-bold block">{userDetails.role === 'consultant' ? 'Company ID:' :'NIC:'} </label> 
                        <label className="text-center text-sm px-1 block"> {userDetails.nic}</label>
                    </div>

                    <div className='col-span-1 text-center py-2 rounded-lg px-1 mb-2'>
                        <label className="text-center text-sm font-bold block">Name:</label> 
                        <label className="text-center text-sm px-1 block"> {userDetails.name}</label>
                    </div>

                    <div className='col-span-1 text-center py-2 rounded-lg px-1 mb-2'>
                        <label className="text-center text-sm font-bold block">Email:</label> 
                        <label className="text-center text-sm px-1 block"> {userDetails.email}</label>
                    </div>

                    <div className='col-span-1 text-center py-2 rounded-lg px-1 mb-2'>
                        <label className="text-center text-sm font-bold block">Address:</label> 
                        <label className="text-center text-sm px-1 block"> {userDetails.address}</label>
                    </div>

                </div>


                <div className='col-span-1 grid lg:grid-cols-2 md:grid-cols-1 bg-white rounded-lg '> 

                    {/* set user posion and type  */}
                    {
                        userDetails.position ?
                        <div className='col-span-1 items-center sm:text-center py-2 rounded-lg px-1 mb-2'>
                            <label className="text-center text-sm font-bold block"> {userDetails.role === 'consultant' ? 'Type:' : 'Position:'}</label> 
                            <label className="text-center text-sm px-1 block"> {userDetails.position}</label>
                        </div> : null
                    }
                    
                    <div className='col-span-1 text-center py-2 rounded-lg px-1 mb-2'>
                        <label className="text-center text-sm font-bold block">Status:</label> 
                        <label className="text-center text-sm px-1 block"> {userDetails.status}</label>
                    </div>

                    <div className='col-span-1 text-center py-2 rounded-lg px-1 mb-2'>
                        <label className="text-center text-sm font-bold block">Phone:</label> 
                        <label className="text-center text-sm px-1 block"> {userDetails.phone_number}</label>
                    </div>

                    <div className='col-span-1 text-center py-2 rounded-lg px-1 mb-2'>
                        <label className="text-center text-sm font-bold block">Joined Date:</label> 
                        <label className="text-center text-sm px-1 block">{userDetails.created_at.substring(0,10)}</label>
                    </div>

                </div>


            </div>

        </section>
    </>
  )
}
