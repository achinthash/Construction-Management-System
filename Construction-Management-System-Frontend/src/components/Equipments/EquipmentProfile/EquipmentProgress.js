import React from 'react'

import EquipmentHistory from '../EquipmentHistory'
export default function EquipmentProgress() {
  return (
    <section>
    <div className='w-full bg-violet-200 flex mt-2 rounded-lg '>
        <h2 className='font-bold text-lg py-3 px-3 ml-3 '> Equipment Progress</h2>
    </div>


    <EquipmentHistory />

    
</section>
  )
}
