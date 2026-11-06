import React from 'react'
import NavBar from '../Components/Layout/NavBar'
import { useNavigate } from 'react-router-dom'

export interface UserProfile {
  id?: string;
  name?: string;
  username?: string;
  userName?: string;
  email?: string;
  roles?: string;
}

const getStoredUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const user = getStoredUser();

  const displayName = user?.name || user?.username || user?.userName || "User";
  const roleText = user?.roles || "Employee";

  return (
    <>
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Account Profile</h1>
            <p className="text-sm text-slate-500 mt-1">View your account information and preferences</p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-100 border border-slate-200/80 overflow-hidden">

          {/* Profile Banner / Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-6 sm:p-8 text-white flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-2xl font-bold border border-white/20 shadow-inner shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight truncate">{displayName}</h2>
              <p className="text-xs sm:text-sm text-indigo-100/90 truncate mt-0.5">{user?.email || "No email provided"}</p>
            </div>
          </div>

          {/* Info Grid Section */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="p-3.5 rounded-xl bg-slate-50/75 border border-slate-200/80 text-slate-900 text-sm font-medium shadow-2xs transition-all hover:bg-slate-50">
                  {user?.name || 'N/A'}
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="p-3.5 rounded-xl bg-slate-50/75 border border-slate-200/80 text-slate-900 text-sm font-medium shadow-2xs transition-all hover:bg-slate-50 truncate">
                  {user?.email || 'N/A'}
                </div>
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Username
                </label>
                <div className="p-3.5 rounded-xl bg-slate-50/75 border border-slate-200/80 text-slate-900 text-sm font-medium shadow-2xs transition-all hover:bg-slate-50">
                  {user?.userName || user?.username || 'N/A'}
                </div>
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Role
                </label>
                <div className="p-3.5 rounded-xl bg-slate-50/75 border border-slate-200/80 text-slate-900 text-sm font-medium shadow-2xs transition-all hover:bg-slate-50 flex items-center justify-between">
                  <span>{roleText}</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                    Active
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default Profile
