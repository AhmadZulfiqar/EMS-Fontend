import React, { useState } from 'react'




export interface Column<T> {
    header: string;
    accessor: keyof T | string;
    render?: (row: T) => React.ReactNode;
}

export interface Action<T> {
    label: string;
    onClick: (row: T) => void;
    className?: string;
}

interface DataTableProps<T> {
    tableData: T[];
    columns: Column<T>[];
    actions?: Action<T>[];
    tableSearch: (search: string) => void;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    tableTotalPage: number;
    tableCurrrntPage: number;
    tablePageSize: number;
    tableTotalCount: number;
}
export function DataTable<T extends { id: string }>({
    tableData,
    columns,
    actions,
    tableSearch,
    onPageChange,
    onPageSizeChange,
    tableTotalPage,
    tableCurrrntPage,
    tablePageSize,
    tableTotalCount,
}: DataTableProps<T>) {





    const [search, setSearch] = useState('');




    return (
        <div className=''>

            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <div>
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pt-5 px-5">
                        <h2 className="text-2xl font-bold">Employee List</h2>
                        <div className="flex gap-3">
                            <input
                                className="border border-gray-300 rounded-md w-72 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                                type="text"
                                name="search"
                                id="search"
                                placeholder="Search by name"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button
                                className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md px-4 py-2 text-sm transition-colors"
                                onClick={() => tableSearch(search)}
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <table className="w-full border-collapse border border-gray-300 text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-300 bg-gray-50">
                                {columns && columns.length > 0 && (
                                    columns.map((col: any, index: any) => (
                                        <th key={index} className="p-3 border border-gray-300 font-semibold">
                                            {col.header}
                                        </th>
                                    ))
                                )}
                                {actions && (

                                    <th className="p-3 border border-gray-300 font-semibold">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {tableData?.length > 0 ? (
                                tableData.map((row: any) => (
                                    <tr key={row.id} className="border-b border-gray-300 hover:bg-gray-50">
                                        {columns.map((col: any, colIndex: number) => (
                                            <td key={colIndex} className="p-3 border border-gray-300">
                                                {col.render? col.render(row) :row[col.accessor || "--"]}
                                            </td>
                                        ))}

                                        {actions && actions.length > 0 && (
                                            <td className="p-3 border border-gray-300 text-right">
                                                <div className="inline-flex items-center justify-end gap-2">
                                                    {actions.map((action: any, index: number) => (
                                                        <button
                                                            key={index}
                                                            className={action.className || "px-2.5 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100 transition-colors"}
                                                            onClick={() => action.onClick(row)}
                                                        >
                                                            {action.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length + (actions?.length ? 1 : 0)}
                                        className="p-8 text-center text-gray-500 italic border border-gray-300 bg-gray-50"
                                    >
                                        No Data Found..
                                    </td>
                                </tr>
                            )}


                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={100} className="p-3 border border-gray-300 bg-gray-50">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        {/* Page Info & Page Size Selector */}
                                        <div className="flex items-center gap-4">
                                            <div>
                                                Page <span className="font-semibold">{tableCurrrntPage}</span> of{" "}
                                                <span className="font-semibold">{tableTotalPage}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span>Show:</span>
                                                <select
                                                    value={tablePageSize}
                                                    onChange={(e) => { onPageSizeChange(Number(e.target.value)) }}
                                                    className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                                                >
                                                    <option value={3}>3</option>
                                                    <option value={5}>5</option>
                                                    <option value={10}>10</option>
                                                    <option value={20}>20</option>
                                                    <option value={50}>50</option>
                                                </select>
                                            </div>
                                            <div>
                                                Total Rows {tableTotalCount}
                                            </div>
                                        </div>

                                        {/* Navigation Buttons */}
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => onPageChange(1)}
                                                disabled={tableTotalPage == 0 ? true : tableCurrrntPage === 1}
                                                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 text-sm bg-white hover:bg-gray-100 transition-colors"
                                            >
                                                First
                                            </button>

                                            <button
                                                onClick={() => { onPageChange(tableCurrrntPage - 1) }}
                                                disabled={tableTotalPage == 0 ? true : tableCurrrntPage === 1}
                                                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 text-sm bg-white hover:bg-gray-100 transition-colors"
                                            >
                                                Previous
                                            </button>

                                            <span className="px-3 py-1 border border-gray-300 rounded font-semibold text-sm bg-white">
                                                {tableCurrrntPage}
                                            </span>

                                            <button
                                                onClick={() => { onPageChange(tableCurrrntPage + 1) }}
                                                disabled={tableTotalPage == 0 ? true : tableCurrrntPage === tableTotalPage}
                                                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 text-sm bg-white hover:bg-gray-100 transition-colors"
                                            >
                                                Next
                                            </button>

                                            <button
                                                onClick={() => { onPageChange(tableTotalPage) }}
                                                disabled={tableTotalPage == 0 ? true : tableCurrrntPage === tableTotalPage}
                                                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 text-sm bg-white hover:bg-gray-100 transition-colors"
                                            >
                                                Last
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default DataTable