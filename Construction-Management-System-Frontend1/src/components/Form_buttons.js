import React from 'react'

export default function Form_buttons() {
  return (
    <div>
        <div className='  col-span-4   w-full grid grid-cols-4 '>

          <div className=" col-span-2 lg:col-span-1 md:col-span-2  w-full  mb-4 sm:mb-0 px-3 ">
              <button className="bg-blue-500  hover:bg-blue-700  dark:bg-gray-600 dark:hover:bg-slate-500  text-white font-bold py-2 px-4 rounded w-full" type="submit">Save</button>
          </div>
          <div className="w-full  mb-4 sm:mb-0 px-3 col-span-2 lg:col-span-1 md:col-span-2  ">
              <button   className="bg-blue-500 hover:bg-blue-700 text-white  dark:bg-gray-600 dark:hover:bg-slate-500 font-bold py-2 px-4 rounded w-full"  type="reset">Cancel</button>
          </div>
        </div>
    </div>
  )
}
