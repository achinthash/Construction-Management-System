import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate , Link } from 'react-router-dom';
import Logo from '../Logo'
import DarkTheme from '../DarkTheme';
import axios from 'axios';
import BackgroundImage from "../../assets/Background-image.png";

export default function Login() {


  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const setErrorMessage = (errorMessage, timeout = 3000) => {
      setError(errorMessage);
        setTimeout(() => {
           setError('');
        }, timeout);
      };

  const setSuccessMessage = (successMessage, timeout = 3000) => {
    setSuccess(successMessage);
      setTimeout(() => {
          setSuccess('');
      }, timeout);
  };


  const Navigate = useNavigate();
  const [email , setEmail] = useState("");
  const [password, setPassword] = useState("");



  const login = async(e) =>{
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try{

      const response = await axios.post("http://localhost:8000/api/login", formData,{
       // withCredentials: true,
       //StrongPassword123!
      });

      setSuccessMessage("Registration successful!");
      // save user details and token in local storage 
      sessionStorage.setItem("token", response.data.token);

      sessionStorage.setItem('user-info', JSON.stringify({
        id : response.data.user.id,
        name : response.data.user.name,
        email : response.data.user.email,
        profile_picture : response.data.user.profile_picture, 
        role : response.data.user.role, 
        position : response.data.user.position, 
      }));

      if(response.data.user.role === 'admin'){
        Navigate('/dashboard')
      }
      else{
        Navigate('/dashboard')
      }

     

    }
    catch(error){
      setErrorMessage(error.response.data.message);
    }
  }



    
  return (

    <div className='max-h-[100vh] overflow-auto   bg-gray-100 text-black dark:bg-gray-900 dark:text-white  '>

    <div className=' flex justify-between items-center w-full md:absolute '>
      <div className='mx-5'>
        <Logo />
      </div>

      <div className='mx-5'>
        <DarkTheme />
      </div>
    </div>

    <div className='  w-full h-[100vh]  md:flex justify-center items-center  '>

      <div className=' flex flex-col md:flex-row p-6 md:shadow-[0_3px_10px_rgb(0,0,0,0.4)] rounded-lg dark:bg-gray-800'>

        <div className='  '>

          <h2 className=' font-bold text-3xl mb-6'>Login</h2>

          {success && <p className="text-green-500 text-center">{success}</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}

          <h3 className='mb-2 '> Enter Your Email and password</h3>

          <form onSubmit={login} className=' w-full min-w-[350px]  ' >

            <input value={email} onChange={(e)=>setEmail(e.target.value)} id='email' type='text' name='email'  className=' bg-gray-50 border border-gray-600 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required=""' placeholder='Email address'   /> <br/>

            <input value={password} onChange={(e)=>setPassword(e.target.value)} id='password' type='password' name='password'  className='placeholder="••••••••" class="bg-gray-50 border border-gray-600 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" '   placeholder='Password'  /> <br/>
            
            <input type='checkbox' />
            <label className='text-[1rem]'> Remember me </label> <br/>

            <button className='  w-full text-white bg-indigo-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'  > Log In</button>

            <span className='flex justify-center'> <Link to="/frogot-password" className='text-center mt-4 text-[1rem]'> Froggot password!</Link> </span>

          </form>
        </div>

        <div className=' md:border-r-[1px] md:border-black md:ml-4 md:mr-4  '>
        </div>

        <div className='   flex justify-center items-center   '>
          <img className="rounded-lg max-w-[350px] object-cover " alt='backgrond image'   src={BackgroundImage} />
        </div>

      </div>
    </div>

    </div>
  )
}
