
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


import Protected from './Protected';
import Login from './components/Users/Login';
import NotFound from './components/NotFound';
import TRy from './components/TRy';

import Dashboard from './components/Dashboard/Dashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';

import Users from './components/Users/Users';
import FrogotPassword from './components/Users/FrogotPassword';
import ResetPassword from './components/Users/ResetPassword';

import UserProfile from './components/Users/UserProfile/UserProfile';

import Equipments from './components/Equipments/Equipments';
import EquipmentProfile from './components/Equipments/EquipmentProfile/EquipmentProfile';

import Chat from './components/Chats/Chat';

import Projects from './components/Projects/Projects';


function App() {

  const isLogin = sessionStorage.getItem('token');


  return (
    <Router>
      <Routes>

      <Route path='*' element={<NotFound/>}> </Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path="/password-reset/:token" element={<ResetPassword />} />
      <Route path="/frogot-password" element={<FrogotPassword />} />

      <Route element={<Protected />} >

        <Route path='/users' element={<Users/>}></Route>
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/user/profile" element={<UserProfile />} />

        <Route path='/equipments' element={<Equipments/>}></Route>
        <Route path='/equipment/:id' element={<EquipmentProfile/>}></Route>

        <Route path='/chats' element={<Chat/>}></Route>

        <Route path='/dashboard' element={<Dashboard/>}></Route>
        <Route path='/admin-dashboard' element={<AdminDashboard/>}></Route>

        <Route path="/projects" element={<Projects/>}></Route>

        

        <Route path='/test' element={<TRy/>}></Route>

        
        

        
      
      </Route>
      
      </Routes>
    </Router>
  );
}

export default App;
