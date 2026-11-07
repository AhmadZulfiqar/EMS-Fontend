import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NavBar from '../Components/Layout/NavBar'
import { useNavigate } from 'react-router-dom'
import Spinner from "../Components/Layout/Spinner"
import toast from 'react-hot-toast'
import useRole from '../hooks/useRole.js'
import { z } from 'zod'

import DataTable from '../Components/Common/DataTable'
import { EmployeeService } from '../Services/employeeservice'
import { getApiError } from "../utils/errorHandler";
import {updateEmployee,createEmployee,getAllTableDataDto} from '../Components/Common/Models/EmployeeDto'

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
  const [totalPage, setTotalPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5)
  const [totalCount, setTotalCount] = useState(0)
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');


  const fetchEmployee = async (): Promise<void> => {
    setLoading(true);
    try {
      const param:getAllTableDataDto={
        page: currentPage,
        pageSize: pageSize,
        search: appliedSearch,  
      }
      const response = await EmployeeService.getAll(param);

      if (Array.isArray(response?.items)) {
        setEmployee(response.items);
        setTotalCount(response.totalCount);
        setTotalPage(Math.ceil(response.totalCount / pageSize));
      }
    } catch (error: any) {
      let errorMessage =getApiError(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    setLoading(true)
    try {
      if (editingId) {
        const params: updateEmployee = {
          Name: name,
          Email: email,
        }
        const response = await EmployeeService.updateEmployee(editingId,params)
        if (response) {
          toast.success("User Updated Successfully");
          setName("");
          setEmail("");
          fetchEmployee();
          setShowFormModal(false)

        }
      } else {
        const params : createEmployee={
          Name:name,
          Email:email,
          Password:password
        }
        const response = await EmployeeService.createEmployee(params)
        if (response) {
          toast.success("User Created Successfully");
          setName("");
          setEmail("");
          setPassword("");
          fetchEmployee();
          setShowFormModal(false)
        }
      }
    } catch (error: any) {
      let errorMessage =getApiError(error);
      toast.error(errorMessage)
    } finally {
      setLoading(false);
    }
  }
  const handleEdit = (emp: EmployeeRecord): void => {
    debugger
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
      const response = await EmployeeService.deleteEmployee(id)
      if(response){
        toast.success(response.message);
      }
      fetchEmployee();
    } catch (error: any) {
      let errorMessage =getApiError(error);
      toast.error(errorMessage)
    } finally {
      setLoading(false);
      setShowDelete(false);
      setDeleteId('');
    }
  };
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

  
  useEffect(() => {
    fetchEmployee();
  }, [currentPage, pageSize, appliedSearch]);

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
  ];

  const actions = [
    {
      label: "Edit",
      onClick: (emp: EmployeeRecord) => handleEdit(emp)
    },
    {
      label: "Delete",
      onClick: (emp: EmployeeRecord) => {setShowDelete(true);setDeleteId(emp.id);}
    }
  ]

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
      <div className='px-6 py-6'>
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
        <DataTable
          columns={columns}
          actions={actions}
          tableData={employee}
          tableSearch={tableSearch}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          tableCurrrntPage={currentPage}
          tableTotalPage={totalPage}
          tableTotalCount={totalCount}
          tablePageSize={pageSize}
          tableName='Employee List'
          searchPlaceHolder='Search by name'


        />

      </div>
    </>
  )
}

export default Home
