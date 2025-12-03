import { useState } from 'react';
import { Search, Mail, Phone, Calendar, ShoppingBag, DollarSign, Eye } from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  status: 'active' | 'inactive';
}

interface CustomerDetail extends Customer {
  orders: {
    id: string;
    date: string;
    total: number;
    status: string;
  }[];
  bookings: {
    id: string;
    date: string;
    time: string;
    guests: number;
    status: string;
  }[];
}

export function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([
    { id: 1, name: 'Trần Thị B', email: 'tranthib@email.com', phone: '0912345678', joinDate: '15/10/2024', totalOrders: 12, totalSpent: 3650000, lastOrder: '02/12/2024', status: 'active' },
    { id: 2, name: 'Nguyễn Văn C', email: 'nguyenvanc@email.com', phone: '0923456789', joinDate: '20/09/2024', totalOrders: 8, totalSpent: 2100000, lastOrder: '01/12/2024', status: 'active' },
    { id: 3, name: 'Lê Thị D', email: 'lethid@email.com', phone: '0934567890', joinDate: '05/11/2024', totalOrders: 15, totalSpent: 4820000, lastOrder: '02/12/2024', status: 'active' },
    { id: 4, name: 'Phạm Văn E', email: 'phamvane@email.com', phone: '0945678901', joinDate: '12/08/2024', totalOrders: 25, totalSpent: 7500000, lastOrder: '30/11/2024', status: 'active' },
    { id: 5, name: 'Hoàng Thị F', email: 'hoangthif@email.com', phone: '0956789012', joinDate: '28/10/2024', totalOrders: 5, totalSpent: 1250000, lastOrder: '15/11/2024', status: 'inactive' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'active' | 'inactive' | 'all'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetail | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetail = (customer: Customer) => {
    // Mock detailed customer data
    const detailData: CustomerDetail = {
      ...customer,
      orders: [
        { id: 'ORD001', date: '02/12/2024', total: 350000, status: 'completed' },
        { id: 'ORD002', date: '28/11/2024', total: 280000, status: 'completed' },
        { id: 'ORD003', date: '25/11/2024', total: 420000, status: 'completed' },
      ],
      bookings: [
        { id: 'BK001', date: '05/12/2024', time: '19:00', guests: 4, status: 'confirmed' },
        { id: 'BK002', date: '28/11/2024', time: '18:30', guests: 2, status: 'completed' },
      ],
    };
    setSelectedCustomer(detailData);
    setShowDetailModal(true);
  };

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    avgSpent: Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length),
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-6">Quản lý khách hàng</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <ShoppingBag size={20} />
              <span className="text-sm">Tổng khách hàng</span>
            </div>
            <p className="text-2xl text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <ShoppingBag size={20} />
              <span className="text-sm">Đang hoạt động</span>
            </div>
            <p className="text-2xl text-green-900">{stats.active}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <DollarSign size={20} />
              <span className="text-sm">Tổng doanh thu</span>
            </div>
            <p className="text-lg text-blue-900">{(stats.totalRevenue / 1000000).toFixed(1)}M đ</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center gap-2 text-purple-700 mb-2">
              <DollarSign size={20} />
              <span className="text-sm">Chi tiêu TB/KH</span>
            </div>
            <p className="text-lg text-purple-900">{(stats.avgSpent / 1000).toFixed(0)}K đ</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm theo tên, email, SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'active' | 'inactive' | 'all')}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-gray-600">ID</th>
                <th className="text-left py-4 px-6 text-gray-600">Họ tên</th>
                <th className="text-left py-4 px-6 text-gray-600">Email</th>
                <th className="text-left py-4 px-6 text-gray-600">Số điện thoại</th>
                <th className="text-left py-4 px-6 text-gray-600">Ngày tham gia</th>
                <th className="text-right py-4 px-6 text-gray-600">Tổng đơn</th>
                <th className="text-right py-4 px-6 text-gray-600">Tổng chi tiêu</th>
                <th className="text-left py-4 px-6 text-gray-600">Đơn gần nhất</th>
                <th className="text-center py-4 px-6 text-gray-600">Trạng thái</th>
                <th className="text-center py-4 px-6 text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 text-gray-900">#{customer.id}</td>
                  <td className="py-4 px-6 text-gray-900">{customer.name}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={14} />
                      <span className="text-sm">{customer.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={14} />
                      <span>{customer.phone}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={14} />
                      <span className="text-sm">{customer.joinDate}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right text-gray-900">{customer.totalOrders}</td>
                  <td className="py-4 px-6 text-right text-gray-900">
                    {customer.totalSpent.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-sm">{customer.lastOrder}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      customer.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {customer.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleViewDetail(customer)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-200">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === page
                    ? 'bg-orange-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      {showDetailModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-4xl w-full p-8 my-8">
            <h2 className="text-2xl text-gray-900 mb-6">Thông tin khách hàng</h2>

            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 mb-1">Họ tên</p>
                <p className="text-lg text-gray-900">{selectedCustomer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="text-gray-900">{selectedCustomer.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Số điện thoại</p>
                <p className="text-gray-900">{selectedCustomer.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Ngày tham gia</p>
                <p className="text-gray-900">{selectedCustomer.joinDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng đơn hàng</p>
                <p className="text-lg text-blue-600">{selectedCustomer.totalOrders}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng chi tiêu</p>
                <p className="text-lg text-green-600">{selectedCustomer.totalSpent.toLocaleString('vi-VN')}đ</p>
              </div>
            </div>

            {/* Orders History */}
            <div className="mb-6">
              <h3 className="text-lg text-gray-900 mb-4">Lịch sử đơn hàng</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-gray-600 text-sm">Mã đơn</th>
                      <th className="text-left py-3 px-4 text-gray-600 text-sm">Ngày</th>
                      <th className="text-right py-3 px-4 text-gray-600 text-sm">Tổng tiền</th>
                      <th className="text-left py-3 px-4 text-gray-600 text-sm">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCustomer.orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-orange-600">{order.id}</td>
                        <td className="py-3 px-4 text-gray-900">{order.date}</td>
                        <td className="py-3 px-4 text-right text-gray-900">
                          {order.total.toLocaleString('vi-VN')}đ
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bookings History */}
            <div className="mb-6">
              <h3 className="text-lg text-gray-900 mb-4">Lịch sử đặt bàn</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-gray-600 text-sm">Mã đặt bàn</th>
                      <th className="text-left py-3 px-4 text-gray-600 text-sm">Ngày</th>
                      <th className="text-left py-3 px-4 text-gray-600 text-sm">Giờ</th>
                      <th className="text-right py-3 px-4 text-gray-600 text-sm">Số khách</th>
                      <th className="text-left py-3 px-4 text-gray-600 text-sm">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCustomer.bookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-blue-600">{booking.id}</td>
                        <td className="py-3 px-4 text-gray-900">{booking.date}</td>
                        <td className="py-3 px-4 text-gray-900">{booking.time}</td>
                        <td className="py-3 px-4 text-right text-gray-900">{booking.guests}</td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
