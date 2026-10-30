import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import useApi from '../hooks/useApi'
import Spinner from './Spinner'

export type AuthStatus = 'loading' | 'valid' | 'invalid'

const ProtectedRoute: React.FC = () => {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const {callApi} = useApi();

  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      try {
        // If this request succeeds, the user has a valid authenticated session
        await callApi("api/Auth/me","GET",null,true);
  
        setStatus('valid')
      } catch (error) {
        toast.error("Please login to access this page")
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
