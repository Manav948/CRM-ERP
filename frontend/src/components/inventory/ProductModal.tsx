import React, { useState, useEffect } from 'react';
import { useCreateProductMutation, useUpdateProductMutation } from '../../hooks';
import type { Product, CreateProductPayload } from '../../types';
import { X, Loader2 } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  editingProduct: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  editingProduct,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<CreateProductPayload>({
    name: '',
    sku: '',
    category: '',
    unitPrice: 0,
    currentStock: 0,
    minStockAlert: 5,
    location: 'Main Warehouse',
  });
  const [errorMsg, setErrorMsg] = useState('');

  const createProductMutation = useCreateProductMutation();
  const updateProductMutation = useUpdateProductMutation();

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        sku: editingProduct.sku,
        category: editingProduct.category,
        unitPrice: editingProduct.unitPrice,
        currentStock: editingProduct.currentStock,
        minStockAlert: editingProduct.minStockAlert,
        location: editingProduct.location,
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        category: '',
        unitPrice: 0,
        currentStock: 0,
        minStockAlert: 5,
        location: 'Main Warehouse',
      });
    }
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (editingProduct) {
      updateProductMutation.mutate(
        { id: editingProduct.id, payload: formData },
        {
          onSuccess: () => {
            onSuccess();
            onClose();
          },
          onError: (err: any) => setErrorMsg(err.response?.data?.message || 'Failed to update product'),
        }
      );
    } else {
      createProductMutation.mutate(formData, {
        onSuccess: () => {
          onSuccess();
          onClose();
        },
        onError: (err: any) => setErrorMsg(err.response?.data?.message || 'Failed to create product'),
      });
    }
  };

  const isLoading = createProductMutation.isPending || updateProductMutation.isPending;

  return (
    <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
          <h2 className="font-bold text-base text-zinc-950">
            {editingProduct ? 'Edit Product Details' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-950 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-zinc-950 text-white text-xs font-medium">{errorMsg}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Product Name *</label>
              <input
                type="text"
                required
                placeholder="Wireless Sensor"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-950"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">SKU / Code *</label>
              <input
                type="text"
                required
                placeholder="WNS-001"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-950 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Category *</label>
              <input
                type="text"
                required
                placeholder="Electronics"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-950"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Unit Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-950 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Current Stock</label>
              <input
                type="number"
                min="0"
                required
                disabled={Boolean(editingProduct)}
                value={formData.currentStock}
                onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-2.5 py-2 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-950 disabled:bg-zinc-100 font-bold"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Min Alert Qty</label>
              <input
                type="number"
                min="0"
                required
                value={formData.minStockAlert}
                onChange={(e) => setFormData({ ...formData, minStockAlert: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-2.5 py-2 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-950"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="Rack A-12"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-2.5 py-2 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-950"
              />
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
              disabled={isLoading}
              className="px-5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-sm"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
