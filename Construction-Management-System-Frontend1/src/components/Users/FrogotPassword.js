
import {React, useState} from 'react'
import axios from 'axios';
import Logo from '../Logo';
import DarkTheme from '../DarkTheme';
import BackgroundImage from '../../assets/Background-image.png';

export default function FrogotPassword() {

    const [email, setEmail] = useState("");
    const [successMessage , setSuccessMessage] = useState("");
    const [errorMessage , setErrorMessage] = useState("");
    const [token, setToken] = useState(sessionStorage.getItem("token") || "");


    const sendResetLink = async(e) =>{

        e.preventDefault();
        
        const formDate = new FormData();
        formDate.append('email',email);

        try{

            const response = await axios.post("http://127.0.0.1:8000/api/forgot-password", formDate,
                { headers : { Authorization : `Bearer ${token}`}}
            )


            if(response.status === 200){
                setSuccessMessage(response.data.status);
            }
            else{
                setErrorMessage("Failed to resend email. Please try again.");
            }
        }
        catch(error){
            console.error(error)
            setErrorMessage(error.response.data.message);
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


            <img src={BackgroundImage} className=" w-56 h-auto   " alt="Image Description"/>

                <p className="text-wrap text-justify ">Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.</p>

            
                {successMessage && <p className="mt-2 text-green-700">{successMessage}</p> }
                {errorMessage && <p className="mt-2 text-red-700">{errorMessage}</p> }

            <form onSubmit={sendResetLink} className="w-full  mt-3 mb-2 flex  flex-col " >
                    <label className="text-left items-start">Email Address: </label>
                    <input  className='py-2 px-2 border bg-white w-full border-black rounded-lg focus:outline-none focus:border-blue-500"' required type='email' value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email address"/>

                    <button type="submit" className="bg-blue-900 w-auto items-center p-3 text-white font-bold rounded-l mt-2 "> Email password reset Link  </button>
            </form>

            
            </div>
        </div>

    </>
  )
}
