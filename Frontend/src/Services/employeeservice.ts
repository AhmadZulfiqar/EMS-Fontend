import api from "./api";
import { getAllTableDataDto, createEmployee, updateEmployee ,createRole, assignRole} from '../Components/Common/Models/EmployeeDto'

export const EmployeeService = {
    getAll: async (pageData: getAllTableDataDto) => {
        const response = await api.post("/api/Administration/get-all-users", pageData);
        return response.data;
    },
    createEmployee: async (params: createEmployee) => {
        const response = await api.post("/api/Auth/register", params);
        return response.data;
    },
    updateEmployee: async (id: string, params: updateEmployee) => {
        const response = await api.put(`/api/Auth/users/${id}`, params);
        return response.data;
    },
    deleteEmployee: async (id: string) => {
        const response = await api.delete(`/api/Auth/users/${id}`);
        return response.data;
    },
    allMembers: async (pageData: getAllTableDataDto) => {
        const response = await api.post("/api/Administration/all-users", pageData);
        return response.data;
    },
    createRole: async (params :createRole) => {
        const response = await api.post("/api/Administration/create-role", params);
        return response.data;
    },
    fetchRoles: async()=>{
        const response = await api.get("/api/Administration/get-roles");
        return response.data;
    },
    deleteRoles: async (id:string |number)=>{
        const response = await api.delete(`/api/Administration/delete-role/${id}`);
        return response.data;
        
    },
    assignRole:async (params:assignRole)=>{
        const response= await api.post("/api/Administration/assign-role",params);
        return response.data;
    },
    getUserRoles: async(id:string)=>{
        const response= await api.get(`/api/Administration/get-user-roles/${id}`);
         return response.data;
    }

}