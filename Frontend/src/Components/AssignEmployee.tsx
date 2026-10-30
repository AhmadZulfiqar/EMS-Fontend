import React, { useState, useEffect } from 'react'
import NavBar from './NavBar'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useSearchParams, useNavigate } from 'react-router-dom'
import useApi from '../hooks/useApi'
import Spinner from './Spinner'

export interface Employee {
    id: string;
    name?: string;
    userName?: string;
    email?: string;
    role?: string;
}

export interface RoleMember {
    id: string;
    name?: string;
    userName?: string;
    email?: string;
}

export interface AssignRolePayload {
    roleId: string;
    userId: string;
}

export interface UnassignRolePayload {
    userId: string;
    roleId: string;
}

export interface ApiErrorResponse {
    message?: string;
    error?: string;
}
export interface RolesList {
    id?: string;
    name?: string;
    normalizedName?: string;
    concurrencyStamp?: string;
}

const AssignEmployee: React.FC = () => {
    const [employees, setEmployee] = useState<Employee[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [members, setMembers] = useState<RoleMember[]>([]);
    const [roles, setRoles] = useState<RolesList[]>([]);


    const { callApi } = useApi();

 
 
    

    const fetchEmployee = async (): Promise<void> => {
        setLoading(true);
        try {
            const res = await callApi("api/Administration/get-all-users", "GET", null, true);
            const resRoles = await callApi("api/Administration/get-roles", "GET", null, true);
            setEmployee(res);
            setRoles(resRoles);
        } catch (error: any) {
            console.log("Error", error.message);
            toast.error(error?.message);
        } finally {
            setLoading(false);
        }
    };

    

    const handleAssignToRole = async (targetRoleId: string | null, employeeId: string): Promise<void> => {
        console.log("targetRoleId", targetRoleId);
        console.log("employeeId", employeeId);
        setLoading(true);
        try {
            let res = await callApi("api/Administration/assign-role", "POST", { userId: employeeId, roleId: targetRoleId }, true);
            if (res) {
                toast.success(res?.message);
                
                await fetchEmployee();
            }
        } catch (error: any) {
            console.log("Error", error.message);
            toast.error(error?.message);
        } finally {
            setLoading(false);
        }
    };

    

    useEffect(() => {
        fetchEmployee();
       
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 font-sans">
                <NavBar />
                <div className="flex justify-center items-center py-20">
                    <p className="text-slate-500 font-medium">Loading management portal...</p>
                </div>
            </div>
        );
    }
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                
                {/* Header Banner */}
                <header className="mb-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Role Assignment Management
                        </h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Assign and manage system access roles for all registered employees.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100">
                            {employees.length} Total Employees
                        </span>
                    </div>
                </header>

                {/* Two-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT COLUMN: Employee Directory (Spans 12 if alone, or 7 if you want a right sidebar) */}
                    <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 flex flex-col">
                        <div className="mb-5 pb-3 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Employee Directory</h2>
                                <p className="text-xs text-slate-400">Select a role from the dropdown to instantly update permissions.</p>
                            </div>
                        </div>

                        {employees.length === 0 ? (
                            <div className="py-16 text-center">
                                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <p className="text-slate-500 font-medium text-sm">No employees found.</p>
                            </div>
                        ) : (
                            <ul className="flex flex-col gap-3 list-none p-0 m-0 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                                {employees.map((employee) => (
                                    <li 
                                        key={employee.id} 
                                        className="p-4 bg-white rounded-xl border border-slate-200/70 hover:border-indigo-200 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-3.5">
                                            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                                                {employee.name ? employee.name.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 m-0">
                                                    {employee.name || employee.userName || "Unnamed User"}
                                                </p>
                                                <p className="text-xs text-slate-500 m-0 mt-0.5">
                                                    {employee.email || "No email available"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="w-full sm:w-auto">
                                            <select
                                                id={employee.id}
                                                 defaultValue={roles.find(r => r.name === employee.role)?.id || ""}
                                                className="w-full sm:w-48 bg-slate-50/50 hover:bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-700 shadow-sm cursor-pointer outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                                onChange={(e) => handleAssignToRole(e.target.value, employee.id)}
                                            >
                                                <option value="" disabled>Select Role</option>
                                                {roles.map((role) => (
                                                    <option key={role.id} value={role.id} >
                                                        {role.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Quick Guide / Summary Widget (Balanced Layout) */}
                    <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 flex flex-col gap-6">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 mb-1">Role Guidelines</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Assigning a new role will immediately update the user's permissions across the enterprise system modules.
                            </p>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Available System Roles</h4>
                            <div className="flex flex-wrap gap-1.5">
                                {roles.map(role => (
                                    <span key={role.id} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg shadow-2xs">
                                        {role.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default AssignEmployee;