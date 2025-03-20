import React from 'react';
import BackgroundImage from "../assets/Background-image.png";


export default function Company_icon() {
  return (
    <div className=' absolute top-0 left-0 p-1 w-[55px] h-[60px]  bg-[#e5e7eb] dark:bg-black md:flex  flex items-center justify-center '>

      <img className="   w-[50px] h-[50px]   " alt='backgrond image' src={BackgroundImage}  />

    </div>
  )
}
 

