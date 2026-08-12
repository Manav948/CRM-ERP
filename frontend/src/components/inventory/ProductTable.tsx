import React from 'react';
import type { Product, PaginatedResponse } from '../../types';
import { ArrowUpDown, Edit2, ShieldAlert, Loader2 } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

interface ProductTableProps {
  data?: PaginatedResponse<Product>;
  isLoading: boolean;
  page: number;
  setPage: (cb: (p: number) => number) => void;
  onAdjustStock: (product: Product) => void;
  onEditProduct: (product: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  data,
  isLoading,
  page,
  setPage,
  onAdjustStock,
  onEditProduct,
}) => {
  const { hasRole } = useAuthContext();
  const canManageInventory = hasRole('Admin', 'Warehouse');

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/60 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              <th className="py-3 px-4">SKU / Code</th>
              <th className="py-3 px-4">Product Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Unit Price ($)</th>
              <th className="py-3 px-4">Current Stock</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-xs">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-zinc-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-zinc-950" />
                  Loading products...
                </td>
              </tr>
            ) : data?.data?.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-zinc-400">
                  No products found.
                </td>
              </tr>
            ) : (
              data?.data?.map((product) => {
                const isLowStock = product.currentStock <= product.minStockAlert;
                return (
                  <tr key={product.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs font-bold text-zinc-950">
                      {product.sku}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-zinc-900">{product.name}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-zinc-100 text-zinc-700">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-zinc-950">
                      ${product.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-xs ${isLowStock ? 'text-amber-600 font-extrabold' : 'text-zinc-900'}`}>
                          {product.currentStock} units
                        </span>
                        {isLowStock && (
                          <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-md bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-0.5">
                            <ShieldAlert className="w-2.5 h-2.5" /> Alert (&lt;={product.minStockAlert})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-500 font-medium">{product.location}</td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      {canManageInventory && (
                        <>
                          <button
                            onClick={() => onAdjustStock(product)}
                            className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-[11px] font-semibold rounded-lg transition-colors inline-flex items-center gap-1"
                          >
                            <ArrowUpDown className="w-3 h-3" /> Adjust
                          </button>
                          <button
                            onClick={() => onEditProduct(product)}
                            className="px-2 py-1 bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 text-zinc-700 text-[11px] font-medium rounded-lg transition-colors inline-flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" /> Edit
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 && (
        <div className="p-4 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
          <div>
            Page {data.currentPage} of {data.totalPages} ({data.total} total products)
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
