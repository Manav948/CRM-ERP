import React, { useState } from 'react';
import { useGetCustomersQuery } from '../hooks';
import { CustomerFilterBar } from '../components/crm/CustomerFilterBar';
import { CustomerTable } from '../components/crm/CustomerTable';
import { AddCustomerModal } from '../components/crm/AddCustomerModal';
import { CustomerDetailDrawer } from '../components/crm/CustomerDetailDrawer';
import { Plus } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';

interface CustomersPageProps {
  isCreateOpen?: boolean;
  onCloseCreate?: () => void;
}

export const CustomersPage: React.FC<CustomersPageProps> = ({
  isCreateOpen: externalCreateOpen,
  onCloseCreate,
}) => {
  const { hasRole } = useAuthContext();
  const canEdit = hasRole('Admin', 'Sales');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);

  const [internalCreateOpen, setInternalCreateOpen] = useState(false);
  const showCreateModal = externalCreateOpen || internalCreateOpen;
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useGetCustomersQuery({
    search,
    status: statusFilter,
    customerType: typeFilter,
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
          <h1 className="text-xl font-bold tracking-tight text-zinc-950">Customer CRM</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage wholesale, retail & distributor client records, leads, and follow-ups.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setInternalCreateOpen(true)}
            className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Add New Customer
          </button>
        )}
      </div>

      <CustomerFilterBar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        setPage={setPage}
      />

      <CustomerTable
        data={data}
        isLoading={isLoading}
        page={page}
        setPage={setPage}
        onSelectCustomer={(id) => setSelectedCustomerId(id)}
      />

      <AddCustomerModal
        isOpen={showCreateModal}
        onClose={handleCloseCreate}
        onSuccess={refetch}
      />

      <CustomerDetailDrawer
        customerId={selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
      />
    </div>
  );
};
