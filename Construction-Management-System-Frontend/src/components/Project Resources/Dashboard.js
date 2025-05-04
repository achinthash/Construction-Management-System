import React from 'react';

import EquipmentUsageSummary from './EquipmentUsage/EquipmentUsageSummary';
import MaterialSummary from '../Materials/MaterialSummary';
import UsageLaborSummary from '../Project Resources/UsersUsage/UsageLaborSummary'
import UsersManagersSummary from '../Project Resources/UsersUsage/UsersManagersSummary';
import MaterialUsageChart from '../Materials/MaterialUsageChart'

import LaborRoleTaskChart from './UsersUsage/LaborRoleTaskChart'

export default function Dashboard() {
  return (
    <div className='grid grid-cols-4 gap-2 bg-white p-2  '>

      <div className='col-span-4  md:col-span-2 lg:col-span-2 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl  '>
        <MaterialUsageChart />
      </div>

      <div className='col-span-4  md:col-span-2 lg:col-span-2 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl  '>
        <LaborRoleTaskChart />
      </div>

      <div className='col-span-4  md:col-span-2 lg:col-span-1 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl  '>
        <EquipmentUsageSummary />
      </div>

      <div className='col-span-4  md:col-span-2 lg:col-span-1 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl  '>
        <MaterialSummary />
      </div>

      <div className='col-span-4  md:col-span-2 lg:col-span-1 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl  '>
        <UsageLaborSummary />
      </div>

      <div className='col-span-4  md:col-span-2 lg:col-span-1 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl  '>
        <UsersManagersSummary />
      </div>

        
    </div>
  )
}
