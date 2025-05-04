import React from 'react'

import EstVsActLineChart from './EstVsActLineChart';
import EstimationSummaryAngleChart from './EstimationSummaryAngleChart';
import ActualSummaryAngleChart from './ActualSummaryAngleChart';
import AccountingSummaryChart from './AccountingSummaryChart';

export default function Dashboard() {
  return (
    <div className='grid grid-cols-4 gap-2 p-2 max-h-[70vh] overflow-y-auto'>

        <div className='col-span-4 md:col-span-2 lg:col-span-1 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md'>
            <EstimationSummaryAngleChart />
        </div>

        <div className='col-span-4 md:col-span-2 lg:col-span-1 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md'>
            <ActualSummaryAngleChart />
        </div>

        <div className='col-span-4 md:col-span-4 lg:col-span-2 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md'>
            <AccountingSummaryChart />
        </div>

        <div className='col-span-4 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md'>
            <EstVsActLineChart />
        </div>

    </div>
  )
}
