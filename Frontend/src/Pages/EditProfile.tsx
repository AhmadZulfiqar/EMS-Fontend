import React, { useState, useEffect } from "react";
import NavBar from "../Components/Layout/NavBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export interface UpdateProfilePayload {
  username: string;
  password?: string;
  email: string;
}

export interface UpdateProfileResponse {
  token: string;
  id?: string;
  username?: string;
  name?: string;
  email?: string;
  roles?: string[];
  [key: string]: unknown;
}

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUsername(parsed.username || parsed.userName || "");
        setEmail(parsed.email || "");
      }
    } catch (error) {
      console.error("Failed to load user data", error);
    }
  }, []);

 
  //function to add two numbers
 

  return (
    <>
      <NavBar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Update Profile</h1>
          <p className="text-sm text-slate-500">
            Modify your account credentials and security settings
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl flex items-center gap-2 shadow-sm">
            <svg
              className="w-5 h-5 text-emerald-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {successMessage}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <h2 className="text-lg font-semibold">Account Credentials</h2>
          </div>

          <form className="p-6 space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                placeholder="Enter new username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
              <span className="text-xs text-slate-400 mt-1.5 block">
                Leave blank if you do not want to change your password.
              </span>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg shadow-md shadow-indigo-600/20 transition-all duration-200 cursor-pointer"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
