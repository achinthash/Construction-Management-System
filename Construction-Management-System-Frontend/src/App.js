
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Protected from './Protected';

import Login from './components/Users/Login';
import NotFound from './components/NotFound';
import AdminDashboard from './components/Admin Dashboard/AdminDashboard';
import Users from './components/Users/Users';
import FrogotPassword from './components/Users/FrogotPassword';
import ResetPassword from './components/Users/ResetPassword';
import UserProfile from './components/Users/UserProfile/UserProfile';

import Chat from './components/Chats/Chat';
import MyTasks from './components/MyTasks/MyTasks';
import UserLogsCalender from './components/Users/UserProfile/UserLogsCalender';
import Announcements from './components/Announcements/Announcements';
import Projects from './components/Projects/Projects';
import Equipments from './components/Equipments/Equipments';
import EquipmentProfile from './components/Equipments/EquipmentProfile/EquipmentProfile';

import Dashboard from './components/Dashboard/Dashboard';
import ProjectResource from './components/Project Resources/ProjectResource';
import ProjectGallery from './components/Project Gallery/ProjectGallery';
import ProjectFiles from './components/Project Files/ProjectFiles';
import Tasks from './components/Tasks/Tasks';
import SelectedTaskFull from './components/Tasks/SelectedTaskFull';
import Estimations from './components/Estimations/Estimations';
import Accounting from './components/Accountings/Accounting';
import QualityControl from './components/QualityContol/QualityControl';
import Works from './components/Works/Works';
import DayLogsProjects from './components/Daily Logs/DayLogsProjects';

import Unauthorized from './Unauthorized';
import RoleGuard from './RoleGuard';

function App() {




  return (
    <Router>
      <Routes>

      <Route path='*' element={<NotFound/>}> </Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path="/password-reset/:token" element={<ResetPassword />} />
      <Route path="/frogot-password" element={<FrogotPassword />} />

      <Route element={<Protected />} >

        <Route path='/users' element={
          <RoleGuard allowedRoles={['admin']}>
            <Users />
          </RoleGuard>
        } />

        <Route path='/user/profile' element={
          <RoleGuard allowedRoles={['admin', 'contractor', 'consultant','labor','client']}>
            <UserProfile />
          </RoleGuard>
        } />

        <Route path='/user/:id' element={
          <RoleGuard allowedRoles={['admin', 'contractor']}>
            <UserProfile />
          </RoleGuard>
        } />

        <Route path='/equipments' element={
          <RoleGuard allowedRoles={['admin']}>
            <Equipments />
          </RoleGuard>
        } />

        <Route path='/equipment/:id' element={
          <RoleGuard allowedRoles={['admin', 'contractor']}>
            <EquipmentProfile />
          </RoleGuard>
        } />

        <Route path='/chats' element={
          <RoleGuard allowedRoles={['admin', 'contractor', 'consultant','labor','client']}>
            <Chat />
          </RoleGuard>
        } />

        <Route path='/admin-dashboard' element={
          <RoleGuard allowedRoles={['admin']}>
            <AdminDashboard />
          </RoleGuard>
        } />  

        <Route path='/user/calendar' element={
          <RoleGuard allowedRoles={['admin', 'contractor', 'consultant','labor','client']}>
            <UserLogsCalender />
          </RoleGuard>
        } />

        <Route path='/my-tasks' element={
          <RoleGuard allowedRoles={['admin', 'contractor', 'consultant','labor','client']}>
            <MyTasks />
          </RoleGuard>
        } />

        <Route path='/announcements' element={
          <RoleGuard allowedRoles={['admin']}>
            <Announcements />
          </RoleGuard>
        } />  

        <Route path='/projects' element={
          <RoleGuard allowedRoles={['admin', 'contractor', 'consultant','client']}>
            <Projects />
          </RoleGuard>
        } />

        {/* project */}

        <Route path='/project/:projectId' element={
          <RoleGuard allowedRoles={['admin', 'contractor', 'consultant','client']}>
            <Dashboard />
          </RoleGuard>
        } />


        <Route path='/project/:projectId/resources' element={
          <RoleGuard allowedRoles={['admin', 'contractor', 'consultant','client']}>
            <ProjectResource />
          </RoleGuard>
        } />

        <Route path='/project/:projectId/gallery' element={
          <RoleGuard allowedRoles={['admin', 'contractor', 'consultant','client']}>
            <ProjectGallery />
          </RoleGuard>
        } />

        <Route path='/project/:projectId/files' element={
          <RoleGuard allowedRoles={['admin', 'contractor', 'consultant','client']}>
            <ProjectFiles />
          </RoleGuard>
        } />

        <Route path='/project/:projectId/schedule' element={
          <RoleGuard allowedRoles={['admin', 'contractor', 'consultant','client']}>
            <Tasks />
          </RoleGuard>
        } />

        <Route path='/project/:projectId/task/:taskId' element={
          <RoleGuard allowedRoles={['admin', 'contractor', 'consultant','client']}>
            <SelectedTaskFull />
          </RoleGuard>
        } />

        <Route path='/project/:projectId/estimations' element={
          <RoleGuard allowedRoles={['admin', 'contractor', 'consultant','client']}>
            <Estimations />
          </RoleGuard>
        } />

        <Route path='/project/:projectId/accounting' element={
          <RoleGuard allowedRoles={['admin', 'contractor', 'consultant','client']}>
            <Accounting />
          </RoleGuard>
        } />

        <Route path='/project/:projectId/quality-control' element={
          <RoleGuard allowedRoles={['admin', 'contractor', 'consultant','client']}>
            <QualityControl />
          </RoleGuard>
        } />

        <Route path='/project/:projectId/works' element={
          <RoleGuard allowedRoles={['admin', 'contractor', 'consultant','client']}>
            <Works />
          </RoleGuard>
        } />

        <Route path='/project/:projectId/daily-logs' element={
          <RoleGuard allowedRoles={['admin', 'contractor', 'consultant','client']}>
            <DayLogsProjects />
          </RoleGuard>
        } />
    

      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />

 
      </Routes>
    </Router>
  );
}

export default App;
