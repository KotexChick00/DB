import { 
  LayoutDashboard, 
  Users, 
  UtensilsCrossed, 
  ShoppingCart, 
  ChefHat, 
  Receipt, 
  Package, 
  BarChart3,
  LogOut,
  Menu,
  X,
  CalendarCheck,
  ClipboardList,
  UserCircle
} from 'lucide-react';
import { useState } from 'react';
import type { AdminPageType, CustomerPageType } from '../App';

interface SidebarProps {
  currentPage: AdminPageType | CustomerPageType;
  onPageChange: (page: AdminPageType | CustomerPageType) => void;
  onLogout: () => void;
  currentUser: any;
}

export function Sidebar({ currentPage, onPageChange, onLogout, currentUser }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const adminMenuItems = [
    { id: 'dashboard' as AdminPageType, label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'tables' as AdminPageType, label: 'Quản lý bàn', icon: UtensilsCrossed },
    { id: 'menu' as AdminPageType, label: 'Quản lý món', icon: Menu },
    { id: 'orders' as AdminPageType, label: 'Gọi món', icon: ShoppingCart },
    { id: 'kitchen' as AdminPageType, label: 'Bếp', icon: ChefHat },
    { id: 'invoices' as AdminPageType, label: 'Hóa đơn', icon: Receipt },
    { id: 'employees' as AdminPageType, label: 'Nhân viên', icon: Users },
    { id: 'customers' as AdminPageType, label: 'Khách hàng', icon: UserCircle },
    { id: 'inventory' as AdminPageType, label: 'Kho', icon: Package },
    { id: 'reports' as AdminPageType, label: 'Báo cáo', icon: BarChart3 },
  ];

  const customerMenuItems = [
    { id: 'booking' as CustomerPageType, label: 'Đặt bàn', icon: CalendarCheck },
    { id: 'order' as CustomerPageType, label: 'Đặt món', icon: ShoppingCart },
    { id: 'myorders' as CustomerPageType, label: 'Đơn của tôi', icon: ClipboardList },
  ];

  const menuItems = currentUser?.role === 'customer' ? customerMenuItems : adminMenuItems;

  const handleMenuClick = (page: AdminPageType | CustomerPageType) => {
    onPageChange(page);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-orange-600 text-white p-2 rounded-lg shadow-lg"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl">
              <ChefHat size={32} />
            </div>
            <div>
              <h1 className="text-xl">Restaurant Pro</h1>
              <p className="text-gray-400 text-sm">Quản lý nhà hàng</p>
            </div>
          </div>
          
          {/* User Info */}
          <div className="bg-gray-800/50 rounded-lg p-3 mt-4">
            <p className="text-sm text-gray-400">Xin chào,</p>
            <p>{currentUser?.name}</p>
            <p className="text-xs text-orange-400">
              {currentUser?.role === 'admin' ? 'Quản lý' : 'Khách hàng'}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-all duration-200
                      ${isActive 
                        ? 'bg-gradient-to-r from-orange-600 to-red-600 shadow-lg shadow-orange-500/30' 
                        : 'hover:bg-gray-700/50'
                      }
                    `}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
    </>
  );
}
