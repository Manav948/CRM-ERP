import React, { useState } from 'react';
import { useGetProductsQuery } from '../hooks';
import { ProductFilterBar } from '../components/inventory/ProductFilterBar';
import { ProductTable } from '../components/inventory/ProductTable';
import { ProductModal } from '../components/inventory/ProductModal';
import { StockAdjustmentModal } from '../components/inventory/StockAdjustmentModal';
import { StockLogsModal } from '../components/inventory/StockLogsModal';
import type { Product } from '../types';
import { Plus, History } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';

interface ProductsPageProps {
  isCreateOpen?: boolean;
  onCloseCreate?: () => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  isCreateOpen: externalCreateOpen,
  onCloseCreate,
}) => {
  const { hasRole } = useAuthContext();
  const canManageInventory = hasRole('Admin', 'Warehouse');

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const [page, setPage] = useState(1);

  const [internalCreateOpen, setInternalCreateOpen] = useState(false);
  const showCreateModal = externalCreateOpen || internalCreateOpen;

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [showLogsModal, setShowLogsModal] = useState(false);

  const { data, isLoading, refetch } = useGetProductsQuery({
    search,
    category: categoryFilter,
    lowStock: lowStockFilter,
    page,
    limit: 10,
  });

  const handleCloseModal = () => {
    setInternalCreateOpen(false);
    setEditingProduct(null);
    if (onCloseCreate) onCloseCreate();
  };

  return (
    <div className="space-y-6 select-none font-sans text-zinc-900">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-950">Product & Inventory Management</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Track stock levels, minimum thresholds, stock movements (IN/OUT), and warehouse locations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLogsModal(true)}
            className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <History className="w-4 h-4" />
            Movement Logs
          </button>

          {canManageInventory && (
            <button
              onClick={() => {
                setEditingProduct(null);
                setInternalCreateOpen(true);
              }}
              className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          )}
        </div>
      </div>

      <ProductFilterBar
        search={search}
        setSearch={setSearch}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        lowStockFilter={lowStockFilter}
        setLowStockFilter={setLowStockFilter}
        setPage={setPage}
      />

      <ProductTable
        data={data}
        isLoading={isLoading}
        page={page}
        setPage={setPage}
        onAdjustStock={(prod) => setAdjustingProduct(prod)}
        onEditProduct={(prod) => {
          setEditingProduct(prod);
          setInternalCreateOpen(true);
        }}
      />

      <ProductModal
        isOpen={showCreateModal}
        editingProduct={editingProduct}
        onClose={handleCloseModal}
        onSuccess={refetch}
      />

      <StockAdjustmentModal
        product={adjustingProduct}
        onClose={() => setAdjustingProduct(null)}
        onSuccess={refetch}
      />

      <StockLogsModal
        isOpen={showLogsModal}
        onClose={() => setShowLogsModal(false)}
      />
    </div>
  );
};
