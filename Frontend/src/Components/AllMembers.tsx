import { useState, useEffect } from 'react'
import NavBar from './NavBar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useApi from './../hooks/useApi'

interface Member {
    id: string;
    name?: string;
    email?: string;
    userName?: string;
    roles: string[];
}

const AllMembers = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const { callApi } = useApi();

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const response = await callApi('api/Administration/all-users', 'GET',null,true);
            setMembers(response);
        } catch (error:any) {
            console.log("Error",error.message)
            toast.error(error?.message)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 font-sans">
                <NavBar />
                <div className="flex justify-center items-center py-20">
                    <p className="text-slate-500 font-medium">Loading members directory...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <NavBar />

            <div className="max-w-6xl mx-auto px-4 py-10">
                {/* Header Section */}
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight mb-1">
                            Team Members
                        </h1>
                        <p className="text-sm text-slate-500">
                            View and manage all registered user accounts and system roles.
                        </p>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                        {members.length} Total Users
                    </span>
                </div>

                {/* Content Card / Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    {members.length === 0 ? (
                        <div className="py-16 text-center">
                            <p className="text-slate-400 italic text-sm">No members found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-100/70 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        <th className="py-3.5 px-6">Member</th>
                                        <th className="py-3.5 px-6">Email Address</th>
                                        <th className="py-3.5 px-6">System Role</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 text-sm">
                                    {members.map((member) => (
                                        <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                                                        {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
                                                    </div>
                                                    <span className="font-semibold text-slate-800">
                                                        {member.name || "Unnamed User"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-slate-600">
                                                {member.email || "No email provided"}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    {member.roles?.length > 0 ? member.roles : "Employee"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllMembers;