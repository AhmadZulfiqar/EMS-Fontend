import React, { useState, FormEvent } from 'react'

import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import useApi from '../hooks/useApi'

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const {callApi} = useApi();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        setLoading(true);
        try{
            const res= await callApi("api/Administration/forgot-password","POST",{email:email},true);
            toast.success(res?.message || "Password reset link sent successfully!");
            navigate('/login');
        }catch(error:any){
            toast.error(error?.message || "Failed to send password reset link.");
        }finally{
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
         
            
            <div className="flex items-center justify-center px-4 py-16">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-bold text-slate-900">Forgot Your Password?</h2>
                        <p className="text-sm text-slate-500 mt-2">Enter your email address and we'll send you a reset link.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                placeholder="name@example.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg transition-all duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20 cursor-pointer"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors cursor-pointer"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;