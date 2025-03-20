import React from 'react'
import BackgroundImage from '../../assets/Background-image.png'
export default function DefaultChatBox() {
    
  return (
    <div className="flex flex-col h-[90vh] w-full bg-slate-100 items-center justify-center">

        <div className="flex flex-col items-center justify-center "> 
            <img src={BackgroundImage} className="h-auto w-64 " alt="Image Description"/>

            <h2 className="w-3/4 text-center text-lg font-bold text-black ">
                Stay connected effortlessly with a smooth and fast experience right from your screen.
            </h2>

            <p className="bottom-10 mt-14 text-sm  text-black">Your personal messages are end-to-end encripted </p>
        </div>

    </div>
  )
}


