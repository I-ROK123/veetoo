import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';

interface Column<T> {
    key: string;
    label: string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string;
    onRowClick?: (item: T) => void;
    searchable?: boolean;
    searchPlaceholder?: string;
}

function DataTable<T extends Record<string, any>>({
    data,
    columns,
    keyExtractor,
    onRowClick,
    searchable = false,
    searchPlaceholder = 'Search...'
}: DataTableProps<T>) {
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState('');

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const filteredData = searchable
        ? data.filter((item) =>
            Object.values(item).some((value) =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        : data;

    const sortedData = sortKey
        ? [...filteredData].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];
            const modifier = sortDirection === 'asc' ? 1 : -1;

            if (aVal < bVal) return -1 * modifier;
            if (aVal > bVal) return 1 * modifier;
            return 0;
        })
        : filteredData;

    return (
        <div className="w-full">
            {searchable && (
                <div className="mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            )}

            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                >
                                    {column.sortable ? (
                                        <button
                                            onClick={() => handleSort(column.key)}
                                            className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200"
                                        >
                                            {column.label}
                                            {sortKey === column.key && (
                                                sortDirection === 'asc' ? (
                                                    <ChevronUp className="w-4 h-4" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4" />
                                                )
                                            )}
                                        </button>
                                    ) : (
                                        column.label
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {sortedData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                                >
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            sortedData.map((item) => (
                                <tr
                                    key={keyExtractor(item)}
                                    onClick={() => onRowClick?.(item)}
                                    className={`${onRowClick
                                            ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800'
                                            : ''
                                        } transition-colors`}
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                                        >
                                            {column.render
                                                ? column.render(item)
                                                : item[column.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {sortedData.length > 0 && (
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    Showing {sortedData.length} of {data.length} items
                </div>
            )}
        </div>
    );
}

export default DataTable;
