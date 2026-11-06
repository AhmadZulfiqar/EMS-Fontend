import { EmployeeLoginDto, ForgotPasswordDto, ResetPassordDto } from "../Components/Common/Models/authDto";
import ForgotPassword from "../Pages/ForgotPassword";
import api from "./api";

export const AuthService = {
    employeeLogin: async (params:EmployeeLoginDto)=>{
        const response = await api.post('/api/Auth/login',params);
        return response.data;
    },
    checkAuth: async ()=>{
        const response = await api.get("/api/Auth/me");
        return response.data;
    },
    logout: async ()=>{
        const response = await api.post("/api/Auth/logout");
        return response.data;
    },
    ForgotPassword: async(params:ForgotPasswordDto)=>{
        const response = await api.post("/api/Administration/forgot-password",params);
        return response.data;
    },
    ResetPassword:async(params:ResetPassordDto)=>{
        const response= await api.post("/api/Administration/reset-password",params);
        return response.data;
    }
    
    
}