import { useState } from 'react';
import { Search, Calendar, Printer, Eye, DollarSign, User } from 'lucide-react';

interface Invoice {
  id: string;
  tableNumber: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  cashier: string;
  date: string;
  time: string;
}

export function InvoiceManagement() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'INV001',
      tableNumber: 'B02',
      items: [
        { name: 'Phở bò', quantity: 2, price: 75000 },
        { name: 'Trà đá', quantity: 2, price: 5000 },
      ],
      subtotal: 160000,
      discount: 0,
      tax: 16000,
      total: 176000,
      paymentMethod: 'Tiền mặt',
      cashier: 'Trần Thị B',
      date: '02/12/2024',
      time: '14:30',
    },
    {
      id: 'INV002',
      tableNumber: 'B05',
      items: [
        { name: 'Bún chả', quantity: 3, price: 70000 },
        { name: 'Nem rán', quantity: 2, price: 45000 },
        { name: 'Nước ngọt', quantity: 3, price: 15000 },
      ],
      subtotal: 345000,
      discount: 17250,
      tax: 32775,
      total: 360525,
      paymentMethod: 'Thẻ',
      cashier: 'Trần Thị B',
      date: '02/12/2024',
      time: '13:15',
    },
    {
      id: 'INV003',
      tableNumber: 'B08',
      items: [
        { name: 'Cơm tấm', quantity: 2, price: 60000 },
        { name: 'Gỏi cuốn', quantity: 1, price: 40000 },
      ],
      subtotal: 160000,
      discount: 0,
      tax: 16000,
      total: 176000,
      paymentMethod: 'Tiền mặt',
      cashier: 'Trần Thị B',
      date: '02/12/2024',
      time: '12:45',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredInvoices = invoices.filter(invoice =>
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.tableNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.cashier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetail = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailModal(true);
  };

  const handlePrint = (invoice: Invoice) => {
    alert(`In hóa đơn ${invoice.id}`);
  };

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const todayInvoices = invoices.filter(inv => inv.date === '02/12/2024').length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-6">Quản lý hóa đơn</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <DollarSign size={20} />
              <span className="text-sm">Tổng doanh thu</span>
            </div>
            <p className="text-2xl text-gray-900">{totalRevenue.toLocaleString('vi-VN')}đ</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <Calendar size={20} />
              <span className="text-sm">Hóa đơn hôm nay</span>
            </div>
            <p className="text-2xl text-blue-900">{todayInvoices}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <DollarSign size={20} />
              <span className="text-sm">Trung bình/HĐ</span>
            </div>
            <p className="text-2xl text-green-900">
              {invoices.length > 0 ? Math.round(totalRevenue / invoices.length).toLocaleString('vi-VN') : 0}đ
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm theo mã HĐ, bàn, thu ngân..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-gray-600">Mã HĐ</th>
                <th className="text-left py-4 px-6 text-gray-600">Bàn</th>
                <th className="text-left py-4 px-6 text-gray-600">Ngày</th>
                <th className="text-left py-4 px-6 text-gray-600">Giờ</th>
                <th className="text-left py-4 px-6 text-gray-600">Thu ngân</th>
                <th className="text-right py-4 px-6 text-gray-600">Tổng tiền</th>
                <th className="text-left py-4 px-6 text-gray-600">Thanh toán</th>
                <th className="text-center py-4 px-6 text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <span className="text-orange-600">{invoice.id}</span>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{invoice.tableNumber}</td>
                  <td className="py-4 px-6 text-gray-600">{invoice.date}</td>
                  <td className="py-4 px-6 text-gray-600">{invoice.time}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      <span className="text-gray-900">{invoice.cashier}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right text-gray-900">
                    {invoice.total.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      invoice.paymentMethod === 'Tiền mặt'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {invoice.paymentMethod}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleViewDetail(invoice)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handlePrint(invoice)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="In hóa đơn"
                      >
                        <Printer size={18} />
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

      {/* Detail Modal */}
      {showDetailModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl text-gray-900 mb-2">HÓA ĐƠN THANH TOÁN</h2>
              <p className="text-gray-600">Mã: {selectedInvoice.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Bàn:</p>
                <p className="text-gray-900">{selectedInvoice.tableNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ngày giờ:</p>
                <p className="text-gray-900">{selectedInvoice.date} - {selectedInvoice.time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Thu ngân:</p>
                <p className="text-gray-900">{selectedInvoice.cashier}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Thanh toán:</p>
                <p className="text-gray-900">{selectedInvoice.paymentMethod}</p>
              </div>
            </div>

            <div className="mb-6">
              <table className="w-full">
                <thead className="border-b-2 border-gray-300">
                  <tr>
                    <th className="text-left py-2 text-gray-700">Món</th>
                    <th className="text-center py-2 text-gray-700">SL</th>
                    <th className="text-right py-2 text-gray-700">Đơn giá</th>
                    <th className="text-right py-2 text-gray-700">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-3 text-gray-900">{item.name}</td>
                      <td className="py-3 text-center text-gray-900">{item.quantity}</td>
                      <td className="py-3 text-right text-gray-900">
                        {item.price.toLocaleString('vi-VN')}đ
                      </td>
                      <td className="py-3 text-right text-gray-900">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính:</span>
                <span>{selectedInvoice.subtotal.toLocaleString('vi-VN')}đ</span>
              </div>
              {selectedInvoice.discount > 0 && (
                <div className="flex justify-between text-orange-600">
                  <span>Giảm giá:</span>
                  <span>-{selectedInvoice.discount.toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Thuế (10%):</span>
                <span>{selectedInvoice.tax.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between text-xl text-gray-900 pt-2 border-t-2 border-gray-300">
                <span>Tổng cộng:</span>
                <span className="text-orange-600">{selectedInvoice.total.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={() => handlePrint(selectedInvoice)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Printer size={18} />
                In hóa đơn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
