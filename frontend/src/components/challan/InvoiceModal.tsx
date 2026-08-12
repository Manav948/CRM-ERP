import React from 'react';
import type { Challan } from '../../types';
import { FileText, Printer, X } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useUpdateChallanStatusMutation } from '../../hooks';

interface InvoiceModalProps {
  challan: Challan | null;
  onClose: () => void;
  onStatusUpdated: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  challan,
  onClose,
  onStatusUpdated,
}) => {
  const { hasRole } = useAuthContext();
  const canCreate = hasRole('Admin', 'Sales');
  const updateStatusMutation = useUpdateChallanStatusMutation();

  if (!challan) return null;

  const handleConfirmStatus = () => {
    updateStatusMutation.mutate(
      { id: challan.id, status: 'Confirmed' },
      {
        onSuccess: () => {
          onStatusUpdated();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none font-sans text-zinc-900">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-zinc-950" />
            <span className="font-bold text-zinc-950">Challan #{challan.challanNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-zinc-950 text-white hover:bg-zinc-800 rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" /> Print Receipt
            </button>
            <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-950 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto flex-1 space-y-6 text-zinc-900 bg-white text-xs">
          <div className="flex justify-between items-start border-b border-zinc-200 pb-6">
            <div>
              <div className="text-xl font-extrabold text-zinc-950 tracking-tight">NEXUS ENTERPRISE</div>
              <div className="text-xs text-zinc-500">Sales Delivery Receipt</div>
            </div>
            <div className="text-right space-y-1">
              <div className="font-mono font-bold text-zinc-950">{challan.challanNumber}</div>
              <div className="text-zinc-500">{new Date(challan.createdAt).toLocaleDateString()}</div>
              <span
                className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border inline-block ${
                  challan.status === 'Confirmed'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {challan.status}
              </span>
            </div>
          </div>

          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-1">
            <div className="text-[10px] uppercase font-bold text-zinc-400">Customer Delivery Address</div>
            <div className="font-bold text-zinc-950 text-sm">{challan.customerBusiness}</div>
            <div className="text-zinc-700">Attention: {challan.customerName} ({challan.customerMobile})</div>
            <div className="text-zinc-500">{challan.customerAddress}</div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 text-[11px] font-semibold text-zinc-500">
                <th className="py-2 px-1">SKU</th>
                <th className="py-2 px-1">Product Description</th>
                <th className="py-2 px-1 text-center">Qty</th>
                <th className="py-2 px-1 text-right">Unit Price</th>
                <th className="py-2 px-1 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {challan.items?.map((item) => (
                <tr key={item.id}>
                  <td className="py-2.5 px-1 font-mono text-[11px] font-bold text-zinc-950">{item.sku}</td>
                  <td className="py-2.5 px-1 font-medium text-zinc-900">{item.name}</td>
                  <td className="py-2.5 px-1 text-center font-bold text-zinc-950">{item.quantity}</td>
                  <td className="py-2.5 px-1 text-right">${item.unitPrice.toFixed(2)}</td>
                  <td className="py-2.5 px-1 text-right font-bold text-zinc-950">${item.totalAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center border-t-2 border-zinc-950 pt-4">
            <div className="text-zinc-500">
              Total Items Dispatched: <span className="font-bold text-zinc-950">{challan.totalQuantity}</span>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-zinc-500 uppercase font-semibold">Grand Total</div>
              <div className="text-xl font-extrabold text-zinc-950">${challan.grandTotal.toFixed(2)}</div>
            </div>
          </div>

          {challan.status === 'Draft' && canCreate && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
              <div className="text-amber-900 font-medium">
                This challan is in <span className="font-bold">Draft</span> status. Confirming will deduct inventory stock.
              </div>
              <button
                onClick={handleConfirmStatus}
                disabled={updateStatusMutation.isPending}
                className="px-3 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Confirm & Deduct Stock
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
