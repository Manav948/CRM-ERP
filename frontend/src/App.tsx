import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { HomePage } from './pages/HomePage';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { CustomersPage } from './pages/CustomersPage';
import { ProductsPage } from './pages/ProductsPage';
import { ChallansPage } from './pages/ChallansPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const MainContent: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  const [activeTab, setActiveTab] = useState('dashboard');

  const [isCustomerCreateOpen, setIsCustomerCreateOpen] = useState(false);
  const [isProductCreateOpen, setIsProductCreateOpen] = useState(false);
  const [isChallanCreateOpen, setIsChallanCreateOpen] = useState(false);

  // If user is not logged in, show Public Home Page with Sign In / Sign Up Navbar
  if (!isAuthenticated) {
    return <HomePage />;
  }

  // Once authenticated, render authenticated ERP + CRM Operations Suite
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardPage
            setActiveTab={setActiveTab}
            openCreateCustomer={() => {
              setActiveTab('customers');
              setIsCustomerCreateOpen(true);
            }}
            openCreateProduct={() => {
              setActiveTab('products');
              setIsProductCreateOpen(true);
            }}
            openCreateChallan={() => {
              setActiveTab('challans');
              setIsChallanCreateOpen(true);
            }}
          />
        );
      case 'customers':
        return (
          <CustomersPage
            isCreateOpen={isCustomerCreateOpen}
            onCloseCreate={() => setIsCustomerCreateOpen(false)}
          />
        );
      case 'products':
        return (
          <ProductsPage
            isCreateOpen={isProductCreateOpen}
            onCloseCreate={() => setIsProductCreateOpen(false)}
          />
        );
      case 'challans':
        return (
          <ChallansPage
            isCreateOpen={isChallanCreateOpen}
            onCloseCreate={() => setIsChallanCreateOpen(false)}
          />
        );
      default:
        return (
          <DashboardPage
            setActiveTab={setActiveTab}
            openCreateCustomer={() => {
              setActiveTab('customers');
              setIsCustomerCreateOpen(true);
            }}
            openCreateProduct={() => {
              setActiveTab('products');
              setIsProductCreateOpen(true);
            }}
            openCreateChallan={() => {
              setActiveTab('challans');
              setIsChallanCreateOpen(true);
            }}
          />
        );
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderActiveTab()}
    </Layout>
  );
};

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
