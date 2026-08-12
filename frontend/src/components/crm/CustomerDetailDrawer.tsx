import React, { useState } from 'react';
import { useGetCustomerByIdQuery, useAddCustomerNoteMutation } from '../../hooks';
import { X, Phone, Mail, MapPin, Loader2, Check } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

interface CustomerDetailDrawerProps {
  customerId: string | null;
  onClose: () => void;
}

export const CustomerDetailDrawer: React.FC<CustomerDetailDrawerProps> = ({
  customerId,
  onClose,
}) => {
  const { hasRole } = useAuthContext();
  const canEdit = hasRole('Admin', 'Sales');
  const [newNoteText, setNewNoteText] = useState('');

  const { data: customer, isLoading } = useGetCustomerByIdQuery(
    customerId || '',
    Boolean(customerId)
  );

  const addNoteMutation = useAddCustomerNoteMutation();

  if (!customerId) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    addNoteMutation.mutate(
      { id: customerId, text: newNoteText.trim() },
      {
        onSuccess: () => {
          setNewNoteText('');
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-end z-50 select-none">
      <div className="bg-white w-full max-w-md h-full border-l border-zinc-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        <div className="p-6 border-b border-zinc-100 flex justify-between items-start bg-zinc-50/60">
          <div>
            <span className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-zinc-200 text-zinc-800 mb-1.5 inline-block">
              {customer?.customerType} Customer
            </span>
            <h2 className="text-lg font-bold text-zinc-950">{customer?.name}</h2>
            <div className="text-xs text-zinc-500 font-medium">{customer?.businessName}</div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-950 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs">
          {isLoading ? (
            <div className="py-12 text-center text-zinc-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-zinc-950" />
              Loading customer details...
            </div>
          ) : customer ? (
            <>
              <div className="space-y-2 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                <div className="flex items-center gap-2 text-zinc-700">
                  <Phone className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{customer.mobile}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-700">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{customer.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-700">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{customer.address}</span>
                </div>
                {customer.gstNumber && (
                  <div className="flex items-center gap-2 text-zinc-700 pt-1 border-t border-zinc-200">
                    <span className="font-semibold text-zinc-500">GST:</span>
                    <span>{customer.gstNumber}</span>
                  </div>
                )}
              </div>

              {canEdit && (
                <form onSubmit={handleAddNote} className="space-y-2">
                  <label className="block font-bold text-zinc-950">Add Follow-up Note</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Log customer call, order inquiry, meeting notes..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="w-full p-3 bg-white border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-950"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={addNoteMutation.isPending || !newNoteText.trim()}
                      className="px-4 py-1.5 bg-zinc-950 text-white hover:bg-zinc-800 rounded-lg font-semibold disabled:opacity-50 flex items-center gap-1"
                    >
                      {addNoteMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                      Save Note
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                <h3 className="font-bold uppercase tracking-wider text-zinc-950">
                  Follow-up Notes History ({customer.notes?.length || 0})
                </h3>

                {customer.notes?.length === 0 ? (
                  <div className="p-4 text-center text-zinc-400 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                    No notes recorded yet.
                  </div>
                ) : (
                  customer.notes?.map((note) => (
                    <div key={note.id} className="p-3.5 bg-white border border-zinc-200 rounded-xl space-y-1 shadow-2xs">
                      <p className="text-zinc-900 leading-relaxed font-medium">"{note.text}"</p>
                      <div className="flex justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-100">
                        <span>Logged by {note.createdBy?.name || 'Staff'}</span>
                        <span>{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
