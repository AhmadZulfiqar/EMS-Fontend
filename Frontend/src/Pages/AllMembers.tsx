import { useState, useEffect } from 'react'
import NavBar from '../Components/Layout/NavBar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useApi from '../hooks/useApi'
import DataTable from '../Components/Common/DataTable'

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
    const [totalPage, setTotalPage] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5)
    const [totalCount, setTotalCount] = useState(0)
    const navigate = useNavigate();
    const [appliedSearch, setAppliedSearch] = useState('');
    const { callApi } = useApi();

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const response = await callApi('api/Administration/all-users', 'POST', { page: currentPage, pageSize: pageSize , search:appliedSearch }, true);
            setMembers(response.items);
            setCurrentPage(response?.page)
            setTotalPage(Math.ceil(response?.totalCount / pageSize))
            setPageSize(response?.pageSize)
            setTotalCount(response?.totalCount)
        } catch (error: any) {
            console.log("Error", error.message)
            toast.error(error?.message)
        } finally {
            setLoading(false);
        }
    };
    
    const tableSearch = (search:string)=>{
        setCurrentPage(1);
        setAppliedSearch(search.trim());
    }
    const onPageChange =(page:number)=>{
       setCurrentPage(page);     
    }
    const onPageSizeChange =(pageSize:number)=>{
        setCurrentPage(1);
        setPageSize(pageSize);
    }

   useEffect(() => {
         fetchMembers();
       }, [currentPage, pageSize, appliedSearch]);
    const columns = [
        { header: "Name", accessor: "name" },
        { header: "Email", accessor: "email" },
        { header: "Role", accessor: "roles" },
        
    ];

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
            <DataTable
                columns={columns}
                tableData={members}
                tableSearch={tableSearch}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                tableCurrrntPage={currentPage}
                tableTotalPage={totalPage}
                tableTotalCount={totalCount}
                tablePageSize={pageSize}
            />

            
        </div>
    );
};

export default AllMembers;