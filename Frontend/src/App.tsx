import React from 'react'
import Home from './Pages/Home'
import { Routes, Route } from 'react-router-dom'

import Login from './Pages/Login'
import Welcome from './Pages/Welcome'

import ProtectedRoute from './Routes/ProtectedRoute'
import Profile from './Pages/Profile'
import EditProfile from './Pages/EditProfile'
import { Toaster } from 'react-hot-toast';
import CreateRole from './Pages/CreateRole'
import AssignEmployee from './Pages/AssignEmployee'
import AllMembers from './Pages/AllMembers'
import Attendance from './Pages/Attendance'
import AdminRoute from './Routes/AdminRoute'
import ResetPassword from './Pages/ResetPassword'
import ForgotPassword from './Pages/ForgotPassword'
import NotFound from './Pages/NotFound'

const App = () => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path='/' element={<Welcome />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />

        <Route path="*" element={<NotFound />} />
        


        <Route path='/login' element={<Login />} />
        <Route element={<ProtectedRoute />}>
        <Route path='/attendance' element={<Attendance />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/all-members' element={<AllMembers />} />
          <Route element={<AdminRoute />}>
            <Route path='/edit-profile' element={<EditProfile />} />
            <Route path='/create-role' element={<CreateRole />} />
            <Route path='/dashboard' element={<Home />} />
            <Route path='/assign-role' element={<AssignEmployee />} />
          </Route>
       </Route> 
      </Routes>
    </>
  )
}

export default App