import React from 'react';
import type { Challan, PaginatedResponse } from '../../types';
import { Eye, Loader2 } from 'lucide-react';

interface ChallanTableProps {
  data?: PaginatedResponse<Challan>;
  isLoading: boolean;
  page: number;
  setPage: (cb: (p: number) => number) => void;
  onViewChallan: (challan: Challan) => void;
}

export const ChallanTable: React.FC<ChallanTableProps> = ({
  data,
  isLoading,
  page,
  setPage,
  onViewChallan,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/60 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              <th className="py-3 px-4">Challan Number</th>
              <th className="py-3 px-4">Customer Details</th>
              <th className="py-3 px-4">Total Qty</th>
              <th className="py-3 px-4">Grand Total ($)</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Issued At</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-xs">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-zinc-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-zinc-950" />
                  Loading sales challans...
                </td>
              </tr>
            ) : data?.data?.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-zinc-400">
                  No sales challans found.
                </td>
              </tr>
            ) : (
              data?.data?.map((challan) => (
                <tr key={challan.id} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-zinc-950">
                    {challan.challanNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-zinc-900">{challan.customerName}</div>
                    <div className="text-[10px] text-zinc-500">{challan.customerBusiness} ({challan.customerMobile})</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-zinc-700">
                    {challan.totalQuantity} items
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-zinc-950">
                    ${challan.grandTotal.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full border ${
                        challan.status === 'Confirmed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : challan.status === 'Draft'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                      }`}
                    >
                      {challan.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-500 text-[11px]">
                    {new Date(challan.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => onViewChallan(challan)}
                      className="px-2.5 py-1 bg-zinc-950 text-white hover:bg-zinc-800 font-medium text-[11px] rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" /> View & Print
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
            Page {data.currentPage} of {data.totalPages} ({data.total} total challans)
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
