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
      <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Account Profile</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage your personal information and security credentials</p>
          </div>

          
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden">

          {/* Profile Banner / Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
            {/* Background Decorative Glow */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-5 relative z-10">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-3xl font-bold border border-white/20 shadow-inner shrink-0 text-white">
                  {displayName ? displayName.charAt(0).toUpperCase() : "?"}
                </div>
                {/* Status Badge Over Avatar */}
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-indigo-700 rounded-full" title="Active status" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight truncate">{displayName || "User"}</h2>
                </div>
                <p className="text-xs sm:text-sm text-indigo-100/90 truncate mt-1">{user?.email || "No email provided"}</p>
              </div>
            </div>

            {/* Quick Role Chip in Header */}
            <div className="relative z-10 self-start sm:self-center bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide text-indigo-50">
              {roleText || "Member"}
            </div>
          </div>

          {/* Info Grid Section */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-slate-800 text-sm font-semibold shadow-2xs flex items-center justify-between">
                  <span className="truncate">{user?.name || 'N/A'}</span>
                  <span className="text-xs text-slate-400 font-normal">Verified</span>
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-slate-800 text-sm font-semibold shadow-2xs flex items-center justify-between truncate">
                  <span className="truncate">{user?.email || 'N/A'}</span>
                  <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-medium shrink-0 ml-2">Primary</span>
                </div>
              </div>

              {/* Role */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  System Access & Role
                </label>
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-slate-800 text-sm font-semibold shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs border border-indigo-100">
                      {roleText ? roleText.charAt(0).toUpperCase() : "R"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{roleText}</p>
                      <p className="text-xs text-slate-500 font-normal">Standard system privileges assigned</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active Account
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Footer Section / Additional Details */}
          <div className="px-6 sm:px-8 py-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <p>Secure Account Dashboard</p>
            <p>ID: {user?.id || user?.id || "Ref-0042"}</p>
          </div>

        </div>
      </div>
    </>
  )
}

export default Profile
