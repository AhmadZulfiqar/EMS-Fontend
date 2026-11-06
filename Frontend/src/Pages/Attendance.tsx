import React, { useEffect, useState } from "react";
import NavBar from "../Components/Layout/NavBar";
import useRole from "../hooks/useRole";

import toast from "react-hot-toast";
import Spinner from "../Components/Layout/Spinner";
import DataTable from "../Components/Common/DataTable";
import { AttendanceService } from "../Services/attendanceService";
import { getApiError } from "../utils/errorHandler";
import { FetchEmployeeAttendance, CheckAttendance, ClockIn, ClockOut } from '../Components/Common/Models/AttendanceDto'

export interface AttendanceRecord {
  id?: string;
  name: string;
  email: string;
  status: "Present" | "Absent" | "On Leave";
}

interface AttendanceResponse {
  id: string;
  employeeId: string;
  clockInTime: string;
  clockOutTime?: string;
  totalHours?: string;
  date: string;
  status: "Present" | "Absent" | "On Leave";
}

const Attendance: React.FC = () => {
  // Attendance Clock-in/out State
  const [isClockedIn, setIsClockedIn] = useState<boolean>(false);
  const [isClockedOut, setIsClockedOut] = useState<boolean>(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockOutTime, setClockOutTime] = useState<string | null>(null);
  const [totalHours, setTotalHours] = useState<string>("--");
  const [clockInDateObj, setClockInDateObj] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [check_In_Time, set_check_In_Time] = useState<Date | null>(null);
  const [check_Out_Time, set_check_Out_Time] = useState<Date | null>(null);
  const [dbTotalHours, setdbTotalHours] = useState<string>("");
  const [appliedSearch, setAppliedSearch] = useState<string>("");

  const [totalPage, setTotalPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5)
  const [totalCount, setTotalCount] = useState(0)

  const [employeeDetail, setEmployeeDetail] = useState<AttendanceResponse[]>(
    [],
  );

  const { user } = useRole();


  const formatDate = (date: Date = new Date()): string => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const autoClock = () => {
    let CIT = check_In_Time!;
    let COT = new Date();
    let diff = COT.getTime() - CIT.getTime();
    let hours = Math.floor(diff / (1000 * 60 * 60));
    let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    setTotalHours(`${hours} Hours and ${minutes} Minutes`);
    setdbTotalHours(`${hours}h ${minutes}m`);
    return `${hours}h ${minutes}m`;

  }


  const formatClock = (dateInput: Date | string | null | undefined): string => {
    if (!dateInput) return "--:--:--";

    const date = new Date(dateInput);

    if (isNaN(date.getTime())) return "--:--:--";

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };
  const [isSameData, setIsSameData] = useState(false);
  const checkAttendance = async () => {

    setLoading(true);
    try {

      const params: CheckAttendance = {
        employeeId: user?.id,
        date: formatDate(new Date()),
      }
      let res = await AttendanceService.checkTotdayAttendance(params)


      if (res) {
        let CIT = new Date(res.checkInTime);
        let COT = new Date(res.checkOutTime);
        if (res.clockInTime == true && res.clockOutTime == true) {
          setIsClockedIn(true);
          setIsClockedOut(true);
          setClockInTime(formatClock(CIT) || null)
          setClockOutTime(formatClock(COT) || null)
          set_check_In_Time(CIT)
          set_check_Out_Time(COT)
          setTotalHours(res.totalHours || "--")

        }
        else if (res.clockInTime == false && res.clockOutTime == true) {
          setIsClockedIn(false)
          setIsClockedOut(true)
          setClockInTime(null)
          setClockOutTime(null)
          set_check_In_Time(null)
          set_check_Out_Time(null)
          setTotalHours(res.totalHours || "--")

        } else if (res.clockInTime == true && res.clockOutTime == false) {
          setIsClockedIn(true)
          setIsClockedOut(false)
          setClockInTime(formatClock(CIT) || null)
          setClockOutTime(null)
          set_check_In_Time(CIT)
          set_check_Out_Time(null)
          setTotalHours(res.totalHours || "--")

        }
      }
    } catch (error: any) {
      let errorMessage = getApiError(error);
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  };

  const fetchData = async () => {
    if (!user?.id) return;
    try {
      const params: FetchEmployeeAttendance = {
        employeeId: user?.id,
        page: currentPage,
        pageSize: pageSize,
        search: appliedSearch,
      }
      let res = await AttendanceService.fetchUserAttendance(params);
      if (res) {
        setEmployeeDetail(res.items);
        setCurrentPage(res?.page)
        setTotalPage(Math.ceil(res?.totalCount / pageSize))
        setPageSize(res?.pageSize)
      }
    } catch (error: any) {
      let errorMessage = getApiError(error);
      toast.error(errorMessage)
    }
  };

  const calculateTotalHours = (clockOut: Date) => {
    let inTime = new Date(clockInTime!).getTime();
    let outTime = new Date(clockOut).getTime();
    let diff = outTime - inTime;
    return diff;
  }

 
  const handleClockIn = async () => {
    setLoading(true);
    const now = new Date();

    setClockInDateObj(now);
    try {
      const payload: ClockIn = {
        employeeId: user?.id,
        date: now,
        checkInTime: now,
        status: "Present",
        formatDate: formatDate(now),
      };
      const res = await AttendanceService.clockInAttendance(payload);
      if (res) {
        toast.success("Clock In Successfully");
        setClockInTime(formatClock(now));
        setClockOutTime(null);
        setTotalHours("--");
        fetchData(); 
        checkAttendance();
      }
    } catch (error: any) {
      let errorMessage = getApiError(error);
      toast.error(errorMessage)
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {

    setLoading(true)
    const now = new Date();
    let diff = calculateTotalHours(now);
    try {
      const params: ClockOut = {
        employeeId: user?.id,
        clockOutTime: now,
        clockInTime: check_In_Time,
        totalHours: dbTotalHours,
      }
      const res = await AttendanceService.ClockOutAttendance(params
      );
      if (res) {
        toast.success("Clock Out Successfully");
        setClockOutTime(formatClock(now));
        setTotalHours(res.totalHours);
        fetchData(); // Refresh table data
        checkAttendance();
      }
    } catch (error: any) {
      let errorMessage = getApiError(error);
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }


  const tableSearch = (search: string) => {
    setCurrentPage(1);
    setAppliedSearch(search.trim());
  }
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  }
  const onPageSizeChange = (pageSize: number) => {
    setCurrentPage(1);
    setPageSize(pageSize);
  }
  const columns = [
    {
      header: "Date",
      accessor: "clockInTime",
      render: (row: any) => formatDate(new Date(row.clockInTime))
    },
    {
      header: "Clock In Time", accessor: "clockInTime",
      render: (row: any) => formatClock(new Date(row.clockInTime))
    },
    {
      header: "Clock Out Time", accessor: "clockOutTime",
      render: (row: any) => formatClock(new Date(row.clockOutTime))
    },
    {
      header: "Total Hours", accessor: "totalHours",
      render: (row: any) => row.totalHours == "" ? "--:--:--" : row.totalHours
    },
    {
      header: "Status", accessor: "status",

    },
  ];

  useEffect(() => {
    ``
    if (check_In_Time && check_Out_Time) {
      return
    } else if (!check_Out_Time && check_In_Time) {
      const interval = setInterval(() => {
        autoClock();
      }, 1000);
      return () => clearInterval(interval);
    }

  }, [check_In_Time])



  useEffect(() => {
    checkAttendance();
    fetchData();
  }, [appliedSearch, currentPage, pageSize]);





  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <Spinner size="lg" text="Loading attendance..." />
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

        {/* CLOCK IN / OUT WIDGET SECTION */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                My Shift Tracker
              </h2>
              <p className="text-xs text-slate-500">
                Record your daily start time, end time, and view total elapsed
                hours.
              </p>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${isClockedIn ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-600 border-slate-200"}`}
            >
              {isClockedIn ? "● Shift Active (Clocked In)" : "○ Shift Inactive"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/60 flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Clock In Time
              </span>
              <span className="text-base font-bold text-slate-800">
                {clockInTime || "Not Clocked In"}
              </span>
            </div>

            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/60 flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Clock Out Time
              </span>
              <span className="text-base font-bold text-slate-800">
                {clockOutTime || "Not Clocked Out"}
              </span>
            </div>

            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/60 flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Total Hours
              </span>
              <span className="text-base font-bold text-indigo-600">
                {totalHours}
              </span>
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
              disabled={isClockedOut}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
            >
              Clock Out
            </button>
          </div>
        </div>

        {/* Daily Attendance Log Table */}
        <DataTable
          columns={columns}
          tableData={employeeDetail}
          tableSearch={tableSearch}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          tableCurrrntPage={currentPage}
          tableTotalPage={totalPage}
          tableTotalCount={totalCount}
          tablePageSize={pageSize}

        />

      </div>
    </div>
  );
};

export default Attendance;
