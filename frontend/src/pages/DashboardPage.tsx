import React from 'react';
import { useGetCustomersQuery, useGetProductsQuery, useGetChallansQuery } from '../hooks';
import { Users, Package, FileText, AlertTriangle, ArrowUpRight, Plus, Shield, TrendingUp } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';

interface DashboardPageProps {
  setActiveTab: (tab: string) => void;
  openCreateCustomer: () => void;
  openCreateProduct: () => void;
  openCreateChallan: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  setActiveTab,
  openCreateCustomer,
  openCreateProduct,
  openCreateChallan,
}) => {
  const { user } = useAuthContext();

  const { data: customersData, isLoading: loadingCustomers } = useGetCustomersQuery({ limit: 100 });
  const { data: productsData, isLoading: loadingProducts } = useGetProductsQuery({ limit: 100 });
  const { data: challansData, isLoading: loadingChallans } = useGetChallansQuery({ limit: 10 });

  const totalCustomers = customersData?.total || 0;
  const totalProducts = productsData?.total || 0;
  const lowStockProducts = productsData?.data?.filter((p) => p.currentStock <= p.minStockAlert) || [];
  const confirmedChallans = challansData?.data?.filter((c) => c.status === 'Confirmed') || [];

  const totalRevenue = confirmedChallans.reduce((sum, c) => sum + c.grandTotal, 0);

  return (
    <div className="space-y-6 select-none font-sans text-zinc-900">
    
      <div className="bg-white text-zinc-950 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-zinc-200 shadow-xs relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-semibold border border-zinc-200 mb-2">
            <Shield className="w-3.5 h-3.5 text-zinc-950" />
            <span>Role: {user?.role}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-xl">
            Here is your live ERP & CRM operational summary. Monitor stock movement, customer leads, and sales challans in real time.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 w-full md:w-auto">
          <button
            onClick={openCreateChallan}
            className="flex-1 md:flex-none px-4 py-2.5 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            New Sales Challan
          </button>
        </div>
      </div>

    
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-xs text-amber-950">
                Low Stock Warning ({lowStockProducts.length} Product{lowStockProducts.length > 1 ? 's' : ''})
              </div>
              <p className="text-[11px] text-amber-800">
                {lowStockProducts.map((p) => `${p.name} (${p.currentStock} left)`).join(', ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('products')}
            className="px-3 py-1.5 bg-amber-900 text-white hover:bg-amber-950 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
          >
            <span>Manage Inventory</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      )}

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-3">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Total Customers
            </span>
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-950">
            {loadingCustomers ? '...' : totalCustomers}
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>CRM Records</span>
            <button
              onClick={() => setActiveTab('customers')}
              className="text-zinc-950 font-medium hover:underline flex items-center gap-0.5 text-[11px]"
            >
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

       
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-3">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Products Catalog
            </span>
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-950">
            {loadingProducts ? '...' : totalProducts}
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>{lowStockProducts.length} low stock</span>
            <button
              onClick={() => setActiveTab('products')}
              className="text-zinc-950 font-medium hover:underline flex items-center gap-0.5 text-[11px]"
            >
              Inventory <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

       
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-3">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Sales Challans
            </span>
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-950">
            {loadingChallans ? '...' : confirmedChallans.length}
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Confirmed Sales</span>
            <button
              onClick={() => setActiveTab('challans')}
              className="text-zinc-950 font-medium hover:underline flex items-center gap-0.5 text-[11px]"
            >
              Challans <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

       
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-3">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Challan Volume
            </span>
            <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-950">
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Confirmed Value</span>
            <span className="text-emerald-600 font-semibold text-[11px]">Live</span>
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-zinc-950">Recent Sales Challans</h3>
              <p className="text-xs text-zinc-500">Latest dispatched and draft sales orders</p>
            </div>
            <button
              onClick={() => setActiveTab('challans')}
              className="text-xs font-medium text-zinc-950 hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Challan #</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Qty</th>
                  <th className="py-2.5 px-3">Total ($)</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs">
                {loadingChallans ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-400">Loading sales challans...</td>
                  </tr>
                ) : challansData?.data?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-400">No sales challans issued yet.</td>
                  </tr>
                ) : (
                  challansData?.data?.slice(0, 5).map((challan) => (
                    <tr key={challan.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="py-3 px-3 font-semibold text-zinc-950">{challan.challanNumber}</td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-zinc-900">{challan.customerName}</div>
                        <div className="text-[10px] text-zinc-500">{challan.customerBusiness}</div>
                      </td>
                      <td className="py-3 px-3 font-medium text-zinc-700">{challan.totalQuantity} items</td>
                      <td className="py-3 px-3 font-semibold text-zinc-950">
                        ${challan.grandTotal.toFixed(2)}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                            challan.status === 'Confirmed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : challan.status === 'Draft'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                          }`}
                        >
                          {challan.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-6 space-y-4">
          <div>
            <h3 className="font-bold text-sm text-zinc-950">Quick Operations</h3>
            <p className="text-xs text-zinc-500">Shortcut actions for quick entry</p>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={openCreateCustomer}
              className="w-full p-3 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl text-left transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-zinc-900 group-hover:text-black">Add Customer</div>
                  <div className="text-[10px] text-zinc-500">Register new client / lead</div>
                </div>
              </div>
              <Plus className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900" />
            </button>

            <button
              onClick={openCreateProduct}
              className="w-full p-3 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl text-left transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-zinc-900 group-hover:text-black">Add Product</div>
                  <div className="text-[10px] text-zinc-500">Create stock catalog item</div>
                </div>
              </div>
              <Plus className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900" />
            </button>

            <button
              onClick={openCreateChallan}
              className="w-full p-3 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl text-left transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-zinc-900 group-hover:text-black">Generate Challan</div>
                  <div className="text-[10px] text-zinc-500">Issue sales delivery challan</div>
                </div>
              </div>
              <Plus className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
