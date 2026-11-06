import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Spinner from '../Components/Layout/Spinner'
import toast from 'react-hot-toast'
import useApi from '../hooks/useApi'

export interface LoginResponseData {
  id: string;
  name: string;
  email: string;
}

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { callApi } = useApi();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
  
    e.preventDefault();
    setLoading(true);
    try {
      const response = await callApi(
        'api/Auth/login',
        'POST',
        { email, password },
        true
      );

      if (response) {
        const role = await callApi(
          `api/Administration/get-user-roles/${response.id}`,
          'GET',
          null,
          true
        );

        if (role && role.length > 0) {
          localStorage.setItem("userRole", JSON.stringify(role[0]));
        }
        
        const user: StoredUser = {
          id: response.id,
          name: response.name,
          email: response.email,
          roles: role[0] || null,          
        };
        console.log("login",user)

        localStorage.setItem("user", JSON.stringify(user));

        setEmail('');
        setPassword('');
        toast.success("Login successful", { id: "login-success" });
        navigate('/attendance');
      }
    } catch (error:any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <Spinner size="lg" text="Logging in..." />
      </div>
    );
  }

  return (
    <>
      <button
        className='ml-5 mt-5 bg-indigo-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-800 transition-all duration-200 shadow-sm'
        onClick={() => navigate('/')}
      >
        Go Back
      </button>
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center px-4 py-12 select-none">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-10">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/20 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
            <p className="text-sm text-slate-500 mt-1">Please enter your details to log in</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder='name@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 bg-slate-50/50 hover:bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Password</label>
                <a href="/forgot-password" className="text-xs text-indigo-600 hover:underline font-medium">Forgot password?</a>
              </div>
              <input
                type="password"
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 bg-slate-50/50 hover:bg-white"
              />
            </div>

            <button
              type='submit'
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 shadow-md shadow-indigo-600/25 text-sm"
            >
              Log In
            </button>
          </form>

          

        </div>
      </div>
    </>
  )
}

export default Login
