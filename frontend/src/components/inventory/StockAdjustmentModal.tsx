import React, { useState } from 'react';
import { useAdjustStockMutation } from '../../hooks';
import type { Product, MovementType } from '../../types';
import { X, Loader2 } from 'lucide-react';

interface StockAdjustmentModalProps {
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
  product,
  onClose,
  onSuccess,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [movementType, setMovementType] = useState<MovementType>('IN');
  const [reason, setReason] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const adjustStockMutation = useAdjustStockMutation();

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    adjustStockMutation.mutate(
      {
        productId: product.id,
        quantityChanged: quantity,
        movementType,
        reason: reason.trim(),
      },
      {
        onSuccess: () => {
          onSuccess();
          onClose();
        },
        onError: (err: any) => {
          setErrorMsg(err.response?.data?.message || 'Failed to adjust stock');
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none font-sans text-zinc-900">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
          <div>
            <h2 className="font-bold text-base text-zinc-950">Manual Stock Adjustment</h2>
            <p className="text-xs text-zinc-500">{product.name} (SKU: {product.sku})</p>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-950 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-zinc-950 text-white text-xs font-medium">{errorMsg}</div>
          )}

          <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 flex justify-between items-center">
            <span className="text-zinc-500 font-medium">Current Stock Level:</span>
            <span className="font-bold text-zinc-950 text-sm">{product.currentStock} units</span>
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">Movement Type *</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMovementType('IN')}
                className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                  movementType === 'IN'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                }`}
              >
                + Stock IN (Add)
              </button>
              <button
                type="button"
                onClick={() => setMovementType('OUT')}
                className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                  movementType === 'OUT'
                    ? 'bg-zinc-950 text-white border-zinc-950'
                    : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                }`}
              >
                - Stock OUT (Reduce)
              </button>
            </div>
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">Quantity *</label>
            <input
              type="number"
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
              className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-950 font-bold"
            />
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">Reason for Adjustment *</label>
            <input
              type="text"
              required
              placeholder="e.g. Restocked shipment from supplier / Damaged goods"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-950"
            />
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
              disabled={adjustStockMutation.isPending}
              className="px-5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg font-semibold flex items-center gap-1.5"
            >
              {adjustStockMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Confirm Adjustment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
