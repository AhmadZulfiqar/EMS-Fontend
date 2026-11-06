import api from "./api";
import {FetchEmployeeAttendance,CheckAttendance,ClockIn,ClockOut} from '../Components/Common/Models/AttendanceDto'

export const AttendanceService = {
    fetchUserAttendance: async (params: FetchEmployeeAttendance)=>{
        const response = await api.post(`/api/Attendance/attendance/get-all`,params);
        return response.data;
    },
    checkTotdayAttendance: async (params: CheckAttendance)=>{
        const response = await api.post("/api/Attendance/check-today",params);
        return response.data;
    },
    clockInAttendance: async (params:ClockIn)=>{
        const response = await api.post("/api/Attendance/clock-in",params);
        return response.data;
    },
    ClockOutAttendance : async( params:ClockOut)=>{
        const response = await api.post("/api/Attendance/clock-out",params);
        return response.data;
    }
}