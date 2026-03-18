import * as Icons from 'lucide-react';
import type { TableProps } from '../../types/components';

const Table = <T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  onRowClick,
  keyField = 'id'
}: TableProps<T>) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icons.Loader2 className="animate-spin text-primary-600" size={32} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <Icons.Inbox size={48} className="mb-2 text-gray-300" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                style={{ width: column.width }}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.header}</span>
                  {column.sortable && (
                    <Icons.ArrowUpDown size={12} className="text-gray-400" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row) => (
            <tr
              key={row[keyField] || Math.random().toString(36)}
              className={`
                transition-colors duration-150
                ${onRowClick ? 'hover:bg-gray-50 cursor-pointer' : ''}
              `}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-4 py-3 text-sm text-gray-700"
                >
                  {column.cell ? column.cell(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
