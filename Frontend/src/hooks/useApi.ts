import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { string } from "zod";

const baseURL = "https://localhost:7200";

export default function useApi() {
    const [apierror, setApiError] = useState<string | null>(null);
    
    const callApi = async (
        endpoint:string,
        method:'GET'|'POST'|'PUT'|'DELETE',
        body?: object | Array<any> | null,
        withCredentials?:boolean
    )=>{        
        try{
            const response = await axios({
                url:`${baseURL}/${endpoint}`,
                method:method,
                data:body,
                withCredentials:withCredentials
            })
            return response.data
        }catch(err:any){
            let status: number | null = null;
            let message: string = "Error";
        if (axios.isAxiosError(err)) {
          
          status = err.response?.status ?? null;

          if (!err.response) {
            message = "Server is currently offline. Please try again later.";        
          } else if (status === 401) {
            message = "Unauthorized";
          } else if (status === 403) {
            message = "Forbidden";
          } else if (status === 404) {
            message = "Not Found";
          }else if(status === 400){
            message = "Bad Request";
          } else {
            message = err.response.data?.error ?? err.response.data?.details[0]?.description?? err.response.data?.message ?? message;
          }
        }
        setApiError(message)
        throw new Error(message); 
        }
    }
    
    
    return{
        callApi,apierror
    }
}