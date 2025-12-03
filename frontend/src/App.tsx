import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TableManagement } from './components/TableManagement';
import { MenuManagement } from './components/MenuManagement';
import { OrderManagement } from './components/OrderManagement';
import { KitchenView } from './components/KitchenView';
import { InvoiceManagement } from './components/InvoiceManagement';
import { EmployeeManagement } from './components/EmployeeManagement';
import { InventoryManagement } from './components/InventoryManagement';
import { ReportsView } from './components/ReportsView';
import { CustomerManagement } from './components/CustomerManagement';
import { CustomerView } from './components/CustomerView';
import { LoginPage } from './components/LoginPage';

export type AdminPageType = 'dashboard' | 'tables' | 'menu' | 'orders' | 'kitchen' | 'invoices' | 'employees' | 'inventory' | 'reports' | 'customers';
export type CustomerPageType = 'booking' | 'order' | 'myorders';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<AdminPageType | CustomerPageType>('dashboard');
  const [currentUser, setCurrentUser] = useState<any>(null);

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    // Set initial page based on role
    if (user.role === 'customer') {
      setCurrentPage('booking');
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentPage('dashboard');
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Customer view
  if (currentUser?.role === 'customer') {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar 
          currentPage={currentPage} 
          onPageChange={setCurrentPage}
          onLogout={handleLogout}
          currentUser={currentUser}
        />
        <main className="flex-1 overflow-y-auto">
          <CustomerView currentPage={currentPage as CustomerPageType} currentUser={currentUser} />
        </main>
      </div>
    );
  }

  // Admin view
  const renderAdminPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'tables':
        return <TableManagement />;
      case 'menu':
        return <MenuManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'kitchen':
        return <KitchenView />;
      case 'invoices':
        return <InvoiceManagement />;
      case 'employees':
        return <EmployeeManagement />;
      case 'inventory':
        return <InventoryManagement />;
      case 'reports':
        return <ReportsView />;
      case 'customers':
        return <CustomerManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
        currentUser={currentUser}
      />
      <main className="flex-1 overflow-y-auto">
        {renderAdminPage()}
      </main>
    </div>
  );
}
