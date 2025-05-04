import React from 'react'
import NavigationBar from '../../NavigationBar';
import { useParams } from 'react-router-dom';
import GeneralDetails from './GeneralDetails';
import UserProgress from './UserProgress';

export default function UserProfile() {

  let { id } = useParams();
  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
  const systemUser = id ? id : userInfo ? userInfo.id : null;

  return (
    <>
    <NavigationBar />
    
    <div className='  '>
      <GeneralDetails  systemUser={systemUser} />
      <UserProgress systemUser={systemUser} />

    </div>

    </>
  )
}
