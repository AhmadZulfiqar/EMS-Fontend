import React, { useState, useEffect } from 'react'
import NavBar from './NavBar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useApi from '../hooks/useApi'
import Spinner from './Spinner'

export interface RoleItem {
  id?: string;
  name?: string;
}

export type RoleEntry = RoleItem | string;

export interface RoleMemberCheck {
  id: string;
  name?: string;
  email?: string;
}

const CreateRole: React.FC = () => {
  const [roleInput, setRoleInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { callApi } = useApi()

  const [roles, setRoles] = useState<RoleEntry[]>([]);

  const fetchRoles = async (): Promise<void> => {
    try {
      const res = await callApi("api/Administration/get-roles", "GET", null, true)
      if (Array.isArray(res)) {
        setRoles(res)
      }
    }catch(error:any){
      toast.error(error?.message)
    }


  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    if(!roleInput.trim()) return;
    try{
      const res= await callApi("api/Administration/create-role","POST",{roleName:roleInput},true);
      fetchRoles()
      toast.success(res.message)
    }catch(error:any){
      toast.error(error?.message)

    }
    setLoading(false);
    setRoleInput('');
  };

  const handleDelete = async (id: string | number): Promise<void> => {
    setLoading(true);
    try{
      const res= await callApi(`api/Administration/delete-role/${id}`,"DELETE",null,true);
      fetchRoles()
      toast.success(res.message)
    }catch(error:any){
      toast.error(error?.message)
    }finally{
      setLoading(false);
    }
    
  };
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

      <div className="max-w-3xl mx-auto px-4 py-10">

        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight mb-1">
            Role Management
          </h1>
          <p className="text-sm sm:text-base text-slate-500">
            Create new system roles and manage employee permissions.
          </p>
        </header>


        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Add New Role</h2>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="w-full flex flex-col gap-1.5">
              <label htmlFor="role" className="text-sm font-medium text-slate-600">
                Role Name
              </label>
              <input
                id="role"
                type="text"
                placeholder="e.g., Team Lead, Support"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm cursor-pointer whitespace-nowrap h-[42px]"
            >
              Create Role
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">
            Available Roles ({Array.isArray(roles) ? roles.length : 0})
          </h2>

          {!Array.isArray(roles) || roles.length === 0 ? (
            <p className="text-slate-400 italic text-sm m-0">No roles available. Create one above.</p>
          ) : (
            <ul className="flex flex-col gap-3 p-0 m-0 list-none">
              {roles.map((r, index) => {

                const roleId = typeof r === 'object' && r && r.id ? r.id : index;
                const roleName = typeof r === 'string' ? r : (r?.name || 'Unknown Role');

                return (
                  <React.Fragment key={roleId}>
                    <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100/60 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                          {roleName ? roleName.charAt(0) : '?'}
                        </div>
                        <span className="text-base font-semibold text-slate-800">
                          {roleName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        
                        <button
                          onClick={() => handleDelete(roleId)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-md text-xs font-medium transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  </React.Fragment>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateRole;
