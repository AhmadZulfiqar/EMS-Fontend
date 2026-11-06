import React, { useState, useEffect, FormEvent } from 'react'

import { useSearchParams, useNavigate } from 'react-router-dom'

import toast from 'react-hot-toast'

import {AuthService} from "../Services/authService"
import {ResetPassordDto } from '../Components/Common/Models/authDto'

import { getApiError } from "../utils/errorHandler";

const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();


    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!token || !email) {
            toast.error("Invalid or missing password reset link.");
        }
    }, [token, email]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        if(!token || !email){
            toast.error("Invalid or missing password reset link.");
            return;
        }
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);
        try{
            const params:ResetPassordDto={
                email:email,
                token:token,
                newPassword:password,
            }
            const res= await AuthService.ResetPassword(params);
            toast.success(res?.message);
            navigate('/login');
        }
        catch(error:any){
            let errorMessage =getApiError(error);
      toast.error(errorMessage);
        }finally{
            setLoading(false);
        }
        
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
          
            
            <div className="flex items-center justify-center px-4 py-16">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    
        
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm border border-indigo-100">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Set New Password</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Enter a secure new password for <span className="font-medium text-slate-700">{email || 'your account'}</span>
                        </p>
                    </div>

               
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                                New Password
                            </label>
                            <input 
                                type="password"
                                placeholder="At least 6 chars, uppercase, number, symbol"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                                Confirm Password
                            </label>
                            <input 
                                type="password"
                                placeholder="Re-enter your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full mt-3 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition-all shadow-md shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
                        >
                            {loading ? "Resetting Password..." : "Reset Password"}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default ResetPassword;