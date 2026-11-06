import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Spinner from '../Components/Layout/Spinner'
import toast from 'react-hot-toast'

export interface SignUpPayload {
  username: string;
  email: string;
  password?: string;
}

export interface SignUpErrorResponse {
  message?: string;
  error?: string;
}

const SignUp: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5291/api/user/register',
        { username, email, password }
      );
      console.log(response.data);
      setUsername('');
      setEmail('');
      setPassword('');
      toast.success("Account created successfully");
      navigate('/login');
    } catch (error) {
      if (axios.isAxiosError<SignUpErrorResponse>(error)) {
        console.log("error:", error.response);

        if (!error.response) {
          toast.error("Server is currently offline. Please try again later.");
        } else if (error.response?.data?.message === "Email is already registered.") {
          toast.error("Email is already registered.");
        } else {
          toast.error("Something went wrong.");
        }
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <Spinner size="lg" text="Creating account..." />
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create an Account</h1>
            <p className="text-sm text-slate-500 mt-1">Join the EMS Portal to get started</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
              <input 
                type="text" 
                placeholder='Ahmad Zulfiqar' 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 bg-slate-50/50 hover:bg-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
              <input 
                type="email" 
                placeholder='name@example.com' 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 bg-slate-50/50 hover:bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
              <input 
                type="password" 
                placeholder='••••••••' 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 bg-slate-50/50 hover:bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type='submit' 
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 shadow-md shadow-indigo-600/25 text-sm"
            >
              Create Account
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">
              Log in
            </Link>
          </p>

        </div>
      </div>
    </>
  )
}

export default SignUp
