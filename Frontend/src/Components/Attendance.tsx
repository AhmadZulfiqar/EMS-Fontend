import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import useRole from '../hooks/useRole';
import useApi from '../hooks/useApi';
import toast from 'react-hot-toast';
import Spinner from './Spinner';
export interface AttendanceRecord {
  id?: string;
  name: string;
  email: string;
  status: 'Present' | 'Absent' | 'On Leave';
}

const Attendance: React.FC = () => {
  // Attendance Clock-in/out State
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockOutTime, setClockOutTime] = useState<string | null>(null);
  const [totalHours, setTotalHours] = useState<string>('--');
  const [isClockedIn, setIsClockedIn] = useState<boolean>(false);
  const [clockInDateObj, setClockInDateObj] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  
  const formatClock=(date:Date)=>{
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  const { user ,userAttendance} = useRole();
  console.log("userAttendance", userAttendance);
  const { callApi } = useApi();
  console.log("user", user);

  // Handle Clock In
  const handleClockIn = async () => {
    setLoading(true);
    const now = new Date();
    setClockInDateObj(now);
    try {
      const payload  = {
        employeeId: user?.id,
        checkInTime: now,
        date: now,
        status:'Present'
      }
      const res = await callApi("api/Attendance/clock-in", 'POST', {
        employeeId: user?.id,
        checkInTime: now,
        date: now,
        status:'Present'
      }, true)
      if (res) {
        localStorage.setItem('attendance', JSON.stringify(payload));
        toast.success("Clock In Successfully");
        setClockInTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        setIsClockedIn(true);
        setClockOutTime(null);
        setTotalHours('--');
      }
    } catch (error: any) {
      toast.error(error?.message);
    }finally{
      setLoading(false);
    }
  };

  // Handle Clock Out
  const handleClockOut = async() => {
  
    setLoading(true);
    const now = new Date();
    let savedClockInTime = userAttendance?.checkInTime;
    if(!savedClockInTime)
    {
      toast.error("You are not clocked in");
      setLoading(false);
      return;
    }
    setClockOutTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setIsClockedIn(false);
    const diffMs = now.getTime() - new Date(savedClockInTime).getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      setTotalHours(`${diffHrs}h ${diffMins}m`);
    try{
      const res= await callApi("api/Attendance/clock-out", 'PUT', {
        employeeId: user?.id,
        clockOutTime:now,
        totalHours:`${diffHrs}h ${diffMins}m`,
        clockInTime: new Date(savedClockInTime),
      }, true)
      if(res){
        let savedAttendance = localStorage.getItem("attendance");
        let parseAttendance = JSON.parse(savedAttendance|| "{}");
        let updatedAttendance = {
          ...parseAttendance,
          clockOutTime: now,
          totalHours: `${diffHrs}h ${diffMins}m`,
        }
        localStorage.setItem("attendance", JSON.stringify(updatedAttendance));
        
        toast.success("Clock Out Successfully");
        
      }
    }catch(error: any){
      toast.error(error?.message);
    }finally{
      setLoading(false);
    }
  
  };
  useEffect(()=>{
    const attendance = localStorage.getItem('attendance');
    if(attendance)
    {
      const parsedAttendance = JSON.parse(attendance);
      setClockInTime(formatClock(new Date(parsedAttendance.checkInTime)));
      setClockOutTime(parsedAttendance.clockOutTime?formatClock(new Date(parsedAttendance.clockOutTime)):null);
      setTotalHours(parsedAttendance.totalHours);
      
    }
  },[])
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <Spinner size="lg" text="Loading employees..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Header Banner */}
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-1">
              Attendance Management
            </h1>
            <p className="text-sm text-slate-500">
              Track, record, and monitor employee daily attendance records.
            </p>
          </div>
        </header>

        {/* ================= NEW: CLOCK IN / OUT WIDGET SECTION ================= */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-800">My Shift Tracker</h2>
              <p className="text-xs text-slate-500">Record your daily start time, end time, and view total elapsed hours.</p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${isClockedIn ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
              {isClockedIn ? '● Shift Active (Clocked In)' : '○ Shift Inactive'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/60 flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Clock In Time</span>
              <span className="text-base font-bold text-slate-800">{clockInTime || 'Not Clocked In'}</span>
            </div>

            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/60 flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Clock Out Time</span>
              <span className="text-base font-bold text-slate-800">{clockOutTime || 'Not Clocked Out'}</span>
            </div>

            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/60 flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Total Hours</span>
              <span className="text-base font-bold text-indigo-600">{totalHours}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={handleClockIn}
              disabled={isClockedIn}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
            >
              Clock In
            </button>
            <button
              onClick={handleClockOut}
              disabled={!isClockedIn}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
            >
              Clock Out
            </button>
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Present Today</p>
              <h3 className="text-2xl font-bold text-slate-800 m-0">24</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm border border-emerald-100">
              P
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Absent</p>
              <h3 className="text-2xl font-bold text-slate-800 m-0">3</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm border border-rose-100">
              A
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">On Leave</p>
              <h3 className="text-2xl font-bold text-slate-800 m-0">2</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm border border-amber-100">
              L
            </div>
          </div>
        </div>

        {/* Daily Attendance Log Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-base font-bold text-slate-800 m-0">Daily Attendance Log</h2>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
              Showing All Employees
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-6">Employee Name</th>
                  <th className="py-3 px-6">Email</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-slate-800">Ahmad Zulfiqar</td>
                  <td className="py-3.5 px-6 text-slate-600">zulfiqaradmin@ems.com</td>
                  <td className="py-3.5 px-6">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Present
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer">Edit Status</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Attendance