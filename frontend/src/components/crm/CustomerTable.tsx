import React from 'react';
import type { Customer, PaginatedResponse } from '../../types';
import { Mail, Phone, MessageSquare, Loader2 } from 'lucide-react';

interface CustomerTableProps {
  data?: PaginatedResponse<Customer>;
  isLoading: boolean;
  page: number;
  setPage: (cb: (p: number) => number) => void;
  onSelectCustomer: (id: string) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  data,
  isLoading,
  page,
  setPage,
  onSelectCustomer,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/60 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              <th className="py-3 px-4">Customer Name</th>
              <th className="py-3 px-4">Business & Mobile</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Follow-up Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-xs">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-zinc-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-zinc-950" />
                  Loading customers...
                </td>
              </tr>
            ) : data?.data?.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-zinc-400">
                  No customers match your search criteria.
                </td>
              </tr>
            ) : (
              data?.data?.map((customer) => (
                <tr key={customer.id} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-zinc-950">{customer.name}</div>
                    <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-zinc-400" />
                      {customer.email || 'No email registered'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-zinc-900">{customer.businessName}</div>
                    <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-zinc-400" />
                      {customer.mobile}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200">
                      {customer.customerType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full border ${
                        customer.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : customer.status === 'Lead'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-zinc-600">
                    {customer.followUpDate ? new Date(customer.followUpDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectCustomer(customer.id)}
                      className="px-3 py-1.5 bg-zinc-950 text-white hover:bg-zinc-800 font-medium text-[11px] rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" />
                      View Notes ({customer._count?.notes || 0})
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 && (
        <div className="p-4 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
          <div>
            Page {data.currentPage} of {data.totalPages} ({data.total} total customers)
          </div>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={page >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
