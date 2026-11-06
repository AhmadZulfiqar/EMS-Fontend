import { Navigate, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import useApi from '../hooks/useApi'
import Spinner from '../Components/Layout/Spinner'

type AuthStatus = 'loading' | 'valid' | 'invalid'

const ALLOWED_ROLES: string[] = ['Admin', 'HR','Administrator']

const AdminRoute = () => {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const { callApi } = useApi();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await callApi("api/Auth/me", "GET", null, true);

        const stored = localStorage.getItem('userRole')
        const role: string | null = stored ? JSON.parse(stored) : null
        const isAllowed = role !== null && ALLOWED_ROLES.includes(role)

        if (!isAllowed) {
          toast.error('You are not authorized to access this page')
          setStatus('invalid')
          return
        }

        setStatus('valid')
      } catch (error) {
        toast.error('You are not authorized to access this page')
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

export default AdminRoute