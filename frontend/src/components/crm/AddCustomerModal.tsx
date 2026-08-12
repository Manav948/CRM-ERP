import React, { useState } from 'react';
import { useCreateCustomerMutation } from '../../hooks';
import type { CustomerStatus, CustomerType, CreateCustomerPayload } from '../../types';
import { X, Loader2 } from 'lucide-react';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<CreateCustomerPayload>({
    name: '',
    mobile: '',
    email: '',
    businessName: '',
    gstNumber: '',
    customerType: 'Retail',
    address: '',
    status: 'Lead',
    followUpDate: '',
  });
  const [errorMsg, setErrorMsg] = useState('');

  const createCustomerMutation = useCreateCustomerMutation();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    createCustomerMutation.mutate(formData, {
      onSuccess: () => {
        onSuccess();
        onClose();
      },
      onError: (err: any) => {
        setErrorMsg(err.response?.data?.message || 'Failed to create customer');
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
          <h2 className="font-bold text-base text-zinc-950">Add New Customer</h2>
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
              <label className="block font-medium text-zinc-700 mb-1">Contact Name *</label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-950"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Mobile Number *</label>
              <input
                type="text"
                required
                placeholder="+1 987 654 3210"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-950"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Business Name *</label>
              <input
                type="text"
                required
                placeholder="Apex Retailers Inc."
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-950"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-950"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Customer Type</label>
              <select
                value={formData.customerType}
                onChange={(e) => setFormData({ ...formData, customerType: e.target.value as CustomerType })}
                className="w-full px-2.5 py-2 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-950"
              >
                <option value="Retail">Retail</option>
                <option value="Wholesale">Wholesale</option>
                <option value="Distributor">Distributor</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as CustomerStatus })}
                className="w-full px-2.5 py-2 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-950"
              >
                <option value="Lead">Lead</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">GST Number</label>
              <input
                type="text"
                placeholder="29ABC..."
                value={formData.gstNumber || ''}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                className="w-full px-2.5 py-2 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-950"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">Full Address *</label>
            <textarea
              required
              rows={2}
              placeholder="Street name, City, Zip Code..."
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-950"
            />
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">Follow-up Date</label>
            <input
              type="date"
              value={formData.followUpDate || ''}
              onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
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
              disabled={createCustomerMutation.isPending}
              className="px-5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-sm"
            >
              {createCustomerMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
