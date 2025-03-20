import React, { useState, useEffect } from 'react'
import NavigationBar from '../../NavigationBar';
import Company_icon from '../../Company_icon';
import { useParams } from 'react-router-dom';
import GeneralDetails from './GeneralDetails';
import UserProgress from './UserProgress';

export default function UserProfile() {

  let { id } = useParams();
  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
  const systemUser = id ? id : userInfo ? userInfo.id : null;

  return (
    <>
     
    <Company_icon />
    <NavigationBar />
    
    <div className='h-[90vh] overflow-y-auto '>

      <GeneralDetails  systemUser={systemUser} />
      <UserProgress systemUser={systemUser} />

    </div>

   
        
    </>
  )
}
