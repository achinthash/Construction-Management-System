import React from 'react'

import DarkTheme from './DarkTheme';


export default function NotFound() {

    const goBack = ()=>{
        window.history.back();
    }

  return (

    <div className=''>
        
        <div className='absolute  right-2 top-2'>
            <DarkTheme />
        </div>

        <div className='w-full h-[100vh] flex justify-center items-center bg-white text-black dark:bg-gray-800 dark:text-white'>

            <div className='text-center lg:shadow-[0_3px_10px_rgb(0,0,0,0.4)] rounded-lg p-4 flex flex-col items-center  bg-white text-black dark:bg-gray-900 dark:text-white '>

                <img className=" max-w-[350px] object-cover " alt='backgrond image' src='../images/Background-image.png' />
                <h1 className='text-2xl font-bold  mb-3'>This page is unavailable</h1>

                <p className='text-lg '> This Workspace doesn't exist anymore.</p>

                <button onClick={goBack} className='text-white bg-indigo-800  py-2.5  w-full mt-2 rounded-lg hover:bg-indigo-950 '>Go back</button>
            
            </div>

        </div>


    </div>
   
  )
}

