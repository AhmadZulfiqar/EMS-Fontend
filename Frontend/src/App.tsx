import React from 'react'
import Home from './Components/Home'
import { Routes, Route } from 'react-router-dom'
import NavBar from './Components/NavBar'
import SignUp from './Components/SignUp'
import Login from './Components/Login'
import Welcome from './Components/Welcome'

import ProtectedRoute from './Components/ProtectedRoute'
import Profile from './Components/Profile'
import EditProfile from './Components/EditProfile'
import { Toaster } from 'react-hot-toast';
import CreateRole from './Components/CreateRole'
import AssignEmployee from './Components/AssignEmployee'
import AllMembers from './Components/AllMembers'
import Attendance from './Components/Attendance'
import AdminRoute from './Components/AdminRoute'
import ResetPassword from './Components/ResetPassword'
import ForgotPassword from './Components/ForgotPassword'
import NotFound from './Components/NotFound'
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