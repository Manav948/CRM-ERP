import React, { useState } from 'react';
import {
  useCreateChallanMutation,
  useGetCustomersQuery,
  useGetProductsQuery,
} from '../../hooks';
import type { ChallanStatus, CreateChallanItemPayload } from '../../types';
import { X, Trash2, Loader2 } from 'lucide-react';

interface CreateChallanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateChallanModal: React.FC<CreateChallanModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ChallanStatus>('Confirmed');
  const [challanItems, setChallanItems] = useState<CreateChallanItemPayload[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const [addItemProductId, setAddItemProductId] = useState('');
  const [addItemQty, setAddItemQty] = useState(1);

  const { data: customersData } = useGetCustomersQuery({ limit: 100 });
  const { data: productsData } = useGetProductsQuery({ limit: 100 });
  const createChallanMutation = useCreateChallanMutation();

  if (!isOpen) return null;

  const handleAddItem = () => {
    if (!addItemProductId) return;
    const existingIndex = challanItems.findIndex((item) => item.productId === addItemProductId);
    if (existingIndex > -1) {
      const updated = [...challanItems];
      updated[existingIndex]!.quantity += addItemQty;
      setChallanItems(updated);
    } else {
      setChallanItems([...challanItems, { productId: addItemProductId, quantity: addItemQty }]);
    }
    setAddItemProductId('');
    setAddItemQty(1);
  };

  const handleRemoveItem = (index: number) => {
    setChallanItems(challanItems.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      setErrorMsg('Please select a customer.');
      return;
    }
    if (challanItems.length === 0) {
      setErrorMsg('Please add at least one item.');
      return;
    }
    setErrorMsg('');

    createChallanMutation.mutate(
      {
        customerId: selectedCustomerId,
        items: challanItems,
        status: selectedStatus,
      },
      {
        onSuccess: () => {
          onSuccess();
          onClose();
        },
        onError: (err: any) => {
          setErrorMsg(err.response?.data?.message || 'Failed to create sales challan');
        },
      }
    );
  };

  const selectedCustomer = customersData?.data?.find((c) => c.id === selectedCustomerId);
  const itemsWithProduct = challanItems.map((item) => {
    const prod = productsData?.data?.find((p) => p.id === item.productId);
    return {
      ...item,
      product: prod,
      totalAmount: (prod?.unitPrice || 0) * item.quantity,
    };
  });

  const grandTotal = itemsWithProduct.reduce((sum, item) => sum + item.totalAmount, 0);

  return (
    <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none font-sans text-zinc-900">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
          <div>
            <h2 className="font-bold text-base text-zinc-950">Issue Sales Delivery Challan</h2>
            <p className="text-xs text-zinc-500">Select customer and line items to calculate totals</p>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-950 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-zinc-950 text-white font-medium">{errorMsg}</div>
          )}

          <div>
            <label className="block font-bold text-zinc-900 mb-1">1. Select Customer *</label>
            <select
              required
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-950 font-medium"
            >
              <option value="">-- Choose Customer from CRM --</option>
              {customersData?.data?.map((cust) => (
                <option key={cust.id} value={cust.id}>
                  {cust.name} ({cust.businessName}) - {cust.mobile}
                </option>
              ))}
            </select>

            {selectedCustomer && (
              <div className="mt-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
                <div className="font-bold text-zinc-950">{selectedCustomer.businessName}</div>
                <div className="text-zinc-600">Contact: {selectedCustomer.name} ({selectedCustomer.mobile})</div>
                <div className="text-zinc-500">Address: {selectedCustomer.address}</div>
              </div>
            )}
          </div>

          <div>
            <label className="block font-bold text-zinc-900 mb-1">2. Add Line Items *</label>
            <div className="flex gap-2 mb-3">
              <select
                value={addItemProductId}
                onChange={(e) => setAddItemProductId(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-950 font-medium"
              >
                <option value="">-- Select Product from Inventory --</option>
                {productsData?.data?.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.name} (SKU: {prod.sku}) - ${prod.unitPrice} [Stock: {prod.currentStock}]
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={addItemQty}
                onChange={(e) => setAddItemQty(parseInt(e.target.value, 10) || 1)}
                className="w-20 px-3 py-2 bg-white border border-zinc-300 rounded-xl font-bold text-center"
              />

              <button
                type="button"
                onClick={handleAddItem}
                disabled={!addItemProductId}
                className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl font-semibold disabled:opacity-50"
              >
                Add Item
              </button>
            </div>

            <div className="border border-zinc-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-100 text-[11px] font-semibold text-zinc-500">
                    <th className="p-2.5">Item</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Price</th>
                    <th className="p-2.5 text-right">Total</th>
                    <th className="p-2.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {itemsWithProduct.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-zinc-400">No products added.</td>
                    </tr>
                  ) : (
                    itemsWithProduct.map((item, index) => (
                      <tr key={index}>
                        <td className="p-2.5">
                          <div className="font-bold text-zinc-950">{item.product?.name}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">{item.product?.sku}</div>
                        </td>
                        <td className="p-2.5 text-center font-bold text-zinc-900">{item.quantity}</td>
                        <td className="p-2.5 text-right font-medium">${item.product?.unitPrice.toFixed(2)}</td>
                        <td className="p-2.5 text-right font-bold text-zinc-950">${item.totalAmount.toFixed(2)}</td>
                        <td className="p-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="p-1 text-zinc-400 hover:text-red-600 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 bg-zinc-950 text-white rounded-xl flex items-center justify-between">
            <div>
              <div className="text-[10px] text-zinc-400 uppercase font-semibold">Challan Status</div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as ChallanStatus)}
                className="mt-1 px-2.5 py-1 bg-zinc-800 text-white font-semibold rounded-lg border border-zinc-700"
              >
                <option value="Confirmed">Confirmed (Auto-deduct stock)</option>
                <option value="Draft">Save as Draft</option>
              </select>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-zinc-400 uppercase font-semibold">Grand Total</div>
              <div className="text-xl font-extrabold text-white">${grandTotal.toFixed(2)}</div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-zinc-200 text-zinc-700 hover:bg-zinc-100 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createChallanMutation.isPending}
              className="px-5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-sm"
            >
              {createChallanMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Issue Delivery Challan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
