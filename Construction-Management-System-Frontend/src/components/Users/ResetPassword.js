
import {React, useState, useEffect} from 'react';
import { Navigate, useLocation ,useNavigate} from 'react-router-dom';
import axios from 'axios';
import Logo from '../Logo';
import DarkTheme from '../DarkTheme';
import BackgroundImage from '../../assets/Background-image.png';

export default function ResetPassword() {

    const location = useLocation();
    const navigate = useNavigate();
    const [resetToken , setResetToken] = useState("");
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [conformPassword, setConfirmPassword] = useState("");

    const [successMessage , setSuccessMessage] = useState("");
    const [errorMessage , setErrorMessage] = useState("");


    useEffect(()=>{
    
        const queryParams = new URLSearchParams(location.search);
        setResetToken(location.pathname.split('/').pop());
        setEmail(queryParams.get('email'));

    },[location]);

    const handleResetPassword = async(e) =>{
        e.preventDefault();

        if(newPassword !== conformPassword){
            setErrorMessage("Passwords do not match.");
            return;
        }

        try{

            const response = await axios.post("http://127.0.0.1:8000/api/reset-password",{

                token: resetToken,
                email: email,
                password : newPassword,
                password_confirmation : conformPassword
            })

            if (response.status === 200) {
                setSuccessMessage("Password reset successful! You can now log in.");

                setTimeout(() =>{
                    navigate('/login');
                },3000)

              } else {
                setErrorMessage(response.data.message || "Something went wrong.");
              }
         
        }
        catch(error){
            console.error(error)
        }
    }

   



  return (

    <>
    
    <div className='flex justify-between items-center w-full absolute top-0 left-0 px-4 py-2 z-20'>
      <div className='mx-5 relative'>
        <Logo />
      </div>

      <div className='mx-5 relative'>
        <DarkTheme />
      </div>
    </div>
  
    <div className='w-full h-full absolute flex justify-center items-center z-0 '>

        <div className="flex flex-col  w-full sm:w-1/3 max-w-md justify-center items-center border p-6 rounded-lg border-black shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] mx-2 bg-gray-100 ">

        <img src={BackgroundImage} className="w-56 h-auto   " alt="Image Description"/>
        <h2 className="text-lg font-bold mb-4 text-center">Reset Your Password</h2>
            
        
            {successMessage && <p className="mt-2 text-green-700">{successMessage}</p> }
            {errorMessage && <p className="mt-2 text-red-700">{errorMessage}</p> }

            <form onSubmit={handleResetPassword} className="w-full  mt-3 mb-2 flex  flex-col " >

                <label className="text-left items-start">New Password: </label>
                <input  className='py-2 px-2 border bg-white w-full border-black rounded-lg focus:outline-none focus:border-blue-500" mb-2' required type='password' value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} placeholder="New password" name="newPassword"/>

                <label className="text-left items-start">Confirm Password: </label>
                <input  className='py-2 px-2 border bg-white w-full border-black rounded-lg focus:outline-none focus:border-blue-500" mb-2' required type='password' value={conformPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder="Confirm new password" name="conformPassword"/>

                <button type="submit" className="bg-blue-900 w-auto items-center p-3 text-white font-bold rounded-l mt-2 ">  Reset Password </button>
            </form>

        
        </div>
    </div>

    </>
  )
}
