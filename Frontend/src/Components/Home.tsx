import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NavBar from './NavBar'
import { useNavigate } from 'react-router-dom'
import Spinner from "./Spinner"
import toast from 'react-hot-toast'
import useRole from '../hooks/useRole.js'
import { z } from 'zod'
import useApi from '../hooks/useApi'

const employeeSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
})
const EditEmployeeSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
})

export type EmployeeSchema = z.infer<typeof employeeSchema>
export type EditEmployeeSchema = z.infer<typeof EditEmployeeSchema>

export interface EmployeeRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

export interface EmployeePayload {
  name: string;
  email: string;
  password?: string;
}

const Home: React.FC = () => {
  const [employee, setEmployee] = useState<EmployeeRecord[]>([]);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const { userRole } = useRole();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string>('');
  const { callApi } = useApi();

  const fetchEmployee = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await callApi("api/Administration/get-all-users", "GET", null, true);
      if (Array.isArray(response)) {
        setEmployee(response)
      }
    } catch (error: any) {
      console.log("error", error.response)
    }
    setLoading(false)

  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    debugger
    e.preventDefault();

    setErrors({});
    if (!name || !email) {
      toast.error('Please fill all the fields', {
        position: "top-right"
      });
      return;
    }


    if (editingId) {
      const validation = EditEmployeeSchema.safeParse({ name, email });

      if (!validation.success) {
        const fieldErrors: Record<string, string> = {};
        validation.error.issues.forEach((issue) => {
          fieldErrors[issue.path[0] as string] = issue.message;
        });
        setErrors(fieldErrors);
        return;
      }
      setLoading(true);
      try {
        const response = await callApi(
          `api/Auth/users/${editingId}`,
          "PUT",
          { name, email },
          true
        );
        console.log("response", response);
        toast.success("Employee updated successfully");
        setEditingId(null);
        fetchEmployee();
        setName('');
        setEmail('');
        setPhone('');
        setRole('');
        setPassword('');
      } catch (error: any) {
        toast.error(error?.message);
        setLoading(false);
      }
    } else {
      const validation = employeeSchema.safeParse({ name, email, password });

      if (!validation.success) {
        const fieldErrors: Record<string, string> = {};
        validation.error.issues.forEach((issue) => {
          fieldErrors[issue.path[0] as string] = issue.message;
        });
        setErrors(fieldErrors);
        return;
      }
      if (!password) {
        toast.error('Please fill all the fields', { position: "top-right" });
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await callApi(
          "api/Auth/register",
          "POST",
          { name, email, password },
          true
        );
        console.log("response", response);
        toast.success("Employee added successfully");
        fetchEmployee();
        setName('');
        setEmail('');
        setPhone('');
        setRole('');
        setPassword('');
      } catch (error: any) {
        toast.error(error?.message);
        setLoading(false);
      }

    }
    setLoading(false);
    setShowFormModal(false);
  };

  const handleEdit = (emp: EmployeeRecord): void => {
    setShowFormModal(true);
    setEditingId(emp.id);
    setName(emp.name);
    setEmail(emp.email);
    setPhone(emp.phone || '');
    setRole(emp.role || '');
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await callApi(
        `api/Auth/users/${id}`,
        "DELETE",
        null,
        true
      );
      console.log("response", response);
      toast.success("Employee deleted successfully");
      fetchEmployee();
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setLoading(false);
      setShowDelete(false);
      setDeleteId('');
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <Spinner size="lg" text="Loading employees..." />
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className='p-6'>
        <div className='flex items-center justify-between px-6 py-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm mb-6'>
          <div>
            <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>Employee Management System</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage and organize your organization's staff.</p>
          </div>
          <button
            onClick={() => { setShowFormModal(true) }}
            className='inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-600/20 cursor-pointer shrink-0'
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add New Employee
          </button>
        </div>
        <br />
        {showFormModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in duration-150">

              {/* Modal Header */}
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId ? 'Edit Employee' : 'Add New Employee'}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className='space-y-4'>
                <div className='flex flex-col gap-1.5'>
                  <label htmlFor="name" className='text-xs font-semibold uppercase tracking-wider text-slate-600'>Name</label>
                  <input
                    type="text"
                    className='w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all'
                    id='name'
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && <p className='text-rose-500 text-xs mt-0.5'>{errors.name}</p>}
                </div>

                <div className='flex flex-col gap-1.5'>
                  <label htmlFor="email" className='text-xs font-semibold uppercase tracking-wider text-slate-600'>Email</label>
                  <input
                    type="email"
                    className='w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all'
                    id='email'
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <p className='text-rose-500 text-xs mt-0.5'>{errors.email}</p>}
                </div>

                {!editingId && (
                  <div className='flex flex-col gap-1.5'>
                    <label htmlFor="password" className='text-xs font-semibold uppercase tracking-wider text-slate-600'>Password</label>
                    <input
                      type="password"
                      id="password"
                      placeholder='••••••••'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className='w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all'
                    />
                    {errors.password && <p className='text-rose-500 text-xs mt-0.5'>{errors.password}</p>}
                  </div>
                )}

                <div className='flex items-center justify-end gap-3 pt-4 border-t border-slate-100'>
                  <button
                    type="button"
                    onClick={() => setShowFormModal(false)}
                    className='px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition-all shadow-md shadow-indigo-600/20 cursor-pointer'
                  >
                    {editingId ? 'Update Employee' : 'Add Employee'}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}
        {showDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in duration-150">
              <h2 className='text-lg font-bold text-slate-900'>Are you sure you want to delete this employee?</h2>
              <div className='flex items-center justify-end gap-3 pt-4 border-t border-slate-100'>
                <button
                  type="button"
                  onClick={() => {
                    setShowDelete(false);
                    setDeleteId('');
                  }}
                  className='px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer'
                >
                  Cancel
                </button>
                <button
                  type='button'
                  onClick={() => handleDelete(deleteId)}
                  className='px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl text-sm transition-all shadow-md shadow-red-600/20 cursor-pointer'
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        <br />
        <div className=''>
          <h2 className='text-2xl font-bold mb-4'>Employee List</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
              <thead className="bg-gray-100/75 text-gray-700 uppercase tracking-wider text-xs font-semibold">
                <tr>
                  <th className="px-6 py-3.5 border-b border-gray-200">Name</th>
                  <th className="px-6 py-3.5 border-b border-gray-200">Email</th>
                  <th className="px-6 py-3.5 border-b border-gray-200">Role</th>
                  <th className="px-6 py-3.5 border-b border-gray-200 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employee.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{emp.name}</td>
                    <td className="px-6 py-4 text-gray-600">{emp.email}</td>
                    <td className="px-6 py-4 text-gray-600">{emp.role}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(emp)}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors duration-200 cursor-pointer"
                        >
                          Edit
                        </button>
                        {(userRole === 'Admin' || userRole === 'Administrator') && (
                          <button
                            onClick={() => {
                              setShowDelete(true);
                              setDeleteId(emp.id);
                            }}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors duration-200 cursor-pointer"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
