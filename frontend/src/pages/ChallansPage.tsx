import React, { useState } from 'react';
import { useGetChallansQuery } from '../hooks';
import { ChallanFilterBar } from '../components/challan/ChallanFilterBar';
import { ChallanTable } from '../components/challan/ChallanTable';
import { CreateChallanModal } from '../components/challan/CreateChallanModal';
import { InvoiceModal } from '../components/challan/InvoiceModal';
import type { Challan } from '../types';
import { Plus } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';

interface ChallansPageProps {
  isCreateOpen?: boolean;
  onCloseCreate?: () => void;
}

export const ChallansPage: React.FC<ChallansPageProps> = ({
  isCreateOpen: externalCreateOpen,
  onCloseCreate,
}) => {
  const { hasRole } = useAuthContext();
  const canCreate = hasRole('Admin', 'Sales');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const [internalCreateOpen, setInternalCreateOpen] = useState(false);
  const showCreateModal = externalCreateOpen || internalCreateOpen;
  const [viewingChallan, setViewingChallan] = useState<Challan | null>(null);

  const { data, isLoading, refetch } = useGetChallansQuery({
    search,
    status: statusFilter,
    page,
    limit: 10,
  });

  const handleCloseCreate = () => {
    setInternalCreateOpen(false);
    if (onCloseCreate) onCloseCreate();
  };

  return (
    <div className="space-y-6 select-none font-sans text-zinc-900">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-950">Sales Delivery Challans</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Issue sales delivery orders, manage draft challans, auto-deduct stock upon confirmation, and print receipts.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setInternalCreateOpen(true)}
            className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            New Sales Challan
          </button>
        )}
      </div>

      <ChallanFilterBar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        setPage={setPage}
      />

      <ChallanTable
        data={data}
        isLoading={isLoading}
        page={page}
        setPage={setPage}
        onViewChallan={(challan) => setViewingChallan(challan)}
      />

      <CreateChallanModal
        isOpen={showCreateModal}
        onClose={handleCloseCreate}
        onSuccess={refetch}
      />

      <InvoiceModal
        challan={viewingChallan}
        onClose={() => setViewingChallan(null)}
        onStatusUpdated={refetch}
      />
    </div>
  );
};
