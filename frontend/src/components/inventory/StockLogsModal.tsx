import React from 'react';
import { useGetStockLogsQuery } from '../../hooks';
import { X } from 'lucide-react';

interface StockLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StockLogsModal: React.FC<StockLogsModalProps> = ({ isOpen, onClose }) => {
  const { data: stockLogsData, isLoading } = useGetStockLogsQuery();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none font-sans text-zinc-900">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl w-full max-w-3xl overflow-hidden max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
          <div>
            <h2 className="font-bold text-base text-zinc-950">Stock Movement Audit Trail</h2>
            <p className="text-xs text-zinc-500">History of stock IN/OUT transactions and sales deductions</p>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-950 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3">Movement</th>
                <th className="py-2.5 px-3">Qty</th>
                <th className="py-2.5 px-3">Reason</th>
                <th className="py-2.5 px-3">Created By</th>
                <th className="py-2.5 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-400">Loading stock logs...</td>
                </tr>
              ) : stockLogsData?.data?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-400">No stock movements logged yet.</td>
                </tr>
              ) : (
                stockLogsData?.data?.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-50">
                    <td className="py-3 px-3">
                      <div className="font-bold text-zinc-950">{log.product?.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{log.product?.sku}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                          log.movementType === 'IN' ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-950 text-white'
                        }`}
                      >
                        {log.movementType}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-zinc-950">{log.quantityChanged}</td>
                    <td className="py-3 px-3 text-zinc-700 font-medium">{log.reason}</td>
                    <td className="py-3 px-3 text-zinc-500">{log.createdBy?.name || 'System'}</td>
                    <td className="py-3 px-3 text-[11px] text-zinc-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
