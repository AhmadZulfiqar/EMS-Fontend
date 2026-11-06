import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useRole from '../../hooks/useRole.js'

import toast from 'react-hot-toast';
import {AuthService} from "../../Services/authService"
import { getApiError } from '../../utils/errorHandler.js';

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 1. Get current location
  const { userRole, isLogged } = useRole();


  const handleLogout = async (): Promise<void> => {
    try {
      const res = await AuthService.logout();
      toast.success(res.message);
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
      navigate("/login");
    } catch (error: any) {
      let errorMessage =getApiError(error);
      toast.error(errorMessage);
    }
  };

  const normalizedRole = userRole.toLowerCase();

  const inAllMembers = ['admin', 'manager', 'hr', 'administrator'].includes(normalizedRole);
  const inCreateRole = ['admin', 'administrator'].includes(normalizedRole);
  const inAssignRole = ['admin', 'hr', 'administrator'].includes(normalizedRole);
  const inDashboard = ['admin', 'hr', 'administrator'].includes(normalizedRole);

  // 2. Helper function to return active or inactive classes based on path
  const isActive = (path: string) => 
    location.pathname === path
      ? "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
      : "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900";

  // Helper for right-side nav items (Dashboard, Profile)
  const isActiveRight = (path: string) =>
    location.pathname === path
      ? "bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-md shadow-indigo-600/20"
      : "bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200";

  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-sm select-none">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link to="/">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-md shadow-indigo-600/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-base tracking-wide leading-tight">EMS Portal</h1>
              <span className="text-xs text-slate-500 font-medium hidden sm:block">Employee Management System</span>
            </div>
          </div>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center space-x-2">
            <Link to="/attendance" className={isActive("/attendance")}>
              Attendance
            </Link>

            {inCreateRole && (
              <Link to="/create-role" className={isActive("/create-role")}>
                Create Role
              </Link>
            )}

            {inAssignRole && (
              <Link to="/assign-role" className={isActive("/assign-role")}>
                Assign Role
              </Link>
            )}

            {inAllMembers && (
              <Link to='/all-members' className={isActive("/all-members")}>
                All Members
              </Link>
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {isLogged && (
            <>
              {inDashboard && (
                <Link to="/dashboard" className={isActiveRight("/dashboard")}>
                  Dashboard
                </Link>
              )}

              <Link to="/profile" className={isActiveRight("/profile")}>
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  )
}

export default NavBar