import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Welcome: React.FC = () => {
  const [logged, setLogged] = useState<boolean>(false);
 
  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      try {
        await axios.get('https://localhost:7200/api/Auth/me', { withCredentials: true })
        setLogged(true);
      } catch (error) {
        setLogged(false);
      }
    }
    checkAuth()
  }, [])

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col items-center justify-center px-4 py-12 select-none">
      <div className="max-w-3xl w-full text-center bg-white rounded-3xl shadow-xl border border-slate-200 p-8 sm:p-14">

        {/* Badge / Icon */}
        <div className="inline-flex p-3.5 bg-indigo-50 rounded-2xl text-indigo-600 mb-6 shadow-inner">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>

        {/* Heading & Subtitle */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Welcome to <span className="text-indigo-600">EMS Portal</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto mb-8">
          A seamless and efficient Employee Management System to streamline your team organization, tracking, and administration.
        </p>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md mx-auto">
          <Link
            to="/attendance"
            className="w-full sm:w-auto flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-md shadow-indigo-600/25 text-sm flex items-center justify-center gap-2"
          >
            <span>Go to Portal</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          {!logged && (
            <Link
              to="/login"
              className="w-full sm:w-auto flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-6 rounded-xl transition-all duration-200 text-sm text-center"
            >
              Log In
            </Link>
          )}
        </div>

      

      </div>
    </div>
  )
}

export default Welcome
