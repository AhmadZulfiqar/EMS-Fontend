export interface FetchEmployeeAttendance {
    employeeId: string,
    page: number,
    pageSize: number,
    search: string,
}
export interface CheckAttendance {
    employeeId: string,
    date: string,
}
export interface ClockIn {
    employeeId: string,
    date: Date,
    checkInTime: Date,
    status: string,
    formatDate: string,
}
export interface ClockOut {
    employeeId: string | any,
    clockOutTime: Date,
    clockInTime: Date |null,
    totalHours: string,
}