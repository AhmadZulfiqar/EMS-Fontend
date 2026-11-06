import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

import Spinner from '../Components/Layout/Spinner'

import {AuthService} from "../Services/authService"
import { getApiError } from "../utils/errorHandler";

export type AuthStatus = 'loading' | 'valid' | 'invalid'

const ProtectedRoute: React.FC = () => {
  const [status, setStatus] = useState<AuthStatus>('loading')


  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      try {
        // If this request succeeds, the user has a valid authenticated session
        await AuthService.checkAuth();
  
        setStatus('valid')
      } catch (error) {
        let errorMessage =getApiError(error);
      toast.error(errorMessage);
        setStatus('invalid')
      }
    }
    checkAuth()
  }, [])

  if (status==='loading') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <Spinner size="lg" text="Loading employees..." />
      </div>
    );
  }
  if (status === 'invalid') return <Navigate to="/login" replace />

  return <Outlet />
}

export default ProtectedRoute
