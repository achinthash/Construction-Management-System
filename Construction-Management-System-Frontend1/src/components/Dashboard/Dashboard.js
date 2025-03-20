import React from 'react'

import NavigationBar from '../NavigationBar'
import Sidebar from '../Sidebar'
import Company_icon from '../Company_icon'

export default function Dashboard() {
  return (
    <div className='overflow-hidden max-h-[100vh] '>
        <NavigationBar />
        <Company_icon />
        <Sidebar />
    
      <div className='max-h-[90vh] overflow-auto'>
        Dashboard  
      </div>
    </div>
  )
}
