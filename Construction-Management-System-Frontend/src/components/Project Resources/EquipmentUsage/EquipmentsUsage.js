import React from 'react';
import EquipmentUsageTable from './EquipmentUsageTable';

export default function EquipmentsUsage() {
  return (
    <div className='max-h-screen overflow-y-hidden'>
        
      <div id="header" className="bg-[#ddd6fee2]   dark:bg-gray-900  rounded flex md:flex-row flex-col p-2  my-1  mr-1 justify-between ">
        <h1 className="text-left sm:text-xl font-bold text p-1 text-[#5c3c8f] dark:text-white ">Project Equipment Usage </h1> 
      </div>

      <div className='max-h-[80vh] overflow-y-auto'>
        <EquipmentUsageTable />
      </div>

    </div>
  )
}

