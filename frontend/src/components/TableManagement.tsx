import { useState } from 'react';
import { Search, Plus, UtensilsCrossed, Users, Clock, ArrowLeftRight, Merge } from 'lucide-react';

type TableStatus = 'empty' | 'occupied' | 'reserved';

interface Table {
  id: number;
  number: string;
  seats: number;
  status: TableStatus;
  currentOrder?: string;
  reservedTime?: string;
  reservedBy?: string;
}

export function TableManagement() {
  const [tables, setTables] = useState<Table[]>([
    { id: 1, number: 'B01', seats: 4, status: 'empty' },
    { id: 2, number: 'B02', seats: 2, status: 'occupied', currentOrder: '#001' },
    { id: 3, number: 'B03', seats: 6, status: 'reserved', reservedTime: '19:00', reservedBy: 'Nguyễn Văn A' },
    { id: 4, number: 'B04', seats: 4, status: 'occupied', currentOrder: '#002' },
    { id: 5, number: 'B05', seats: 8, status: 'empty' },
    { id: 6, number: 'B06', seats: 2, status: 'occupied', currentOrder: '#003' },
    { id: 7, number: 'B07', seats: 4, status: 'empty' },
    { id: 8, number: 'B08', seats: 6, status: 'reserved', reservedTime: '20:00', reservedBy: 'Trần Thị B' },
    { id: 9, number: 'B09', seats: 4, status: 'empty' },
    { id: 10, number: 'B10', seats: 2, status: 'occupied', currentOrder: '#004' },
    { id: 11, number: 'B11', seats: 10, status: 'empty' },
    { id: 12, number: 'B12', seats: 4, status: 'empty' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<TableStatus | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const filteredTables = tables.filter(table => {
    const matchesSearch = table.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || table.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case 'empty':
        return 'from-green-500 to-emerald-600';
      case 'occupied':
        return 'from-orange-500 to-red-600';
      case 'reserved':
        return 'from-blue-500 to-cyan-600';
    }
  };

  const getStatusText = (status: TableStatus) => {
    switch (status) {
      case 'empty':
        return 'Trống';
      case 'occupied':
        return 'Đang phục vụ';
      case 'reserved':
        return 'Đã đặt';
    }
  };

  const handleReserveTable = (table: Table) => {
    setSelectedTable(table);
    setShowReserveModal(true);
  };

  const handleChangeStatus = (tableId: number, newStatus: TableStatus) => {
    setTables(tables.map(t => t.id === tableId ? { ...t, status: newStatus } : t));
  };

  const stats = {
    total: tables.length,
    empty: tables.filter(t => t.status === 'empty').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-6">Quản lý bàn ăn</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-sm">Tổng số bàn</p>
            <p className="text-2xl text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <p className="text-green-700 text-sm">Bàn trống</p>
            <p className="text-2xl text-green-900 mt-1">{stats.empty}</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <p className="text-orange-700 text-sm">Đang phục vụ</p>
            <p className="text-2xl text-orange-900 mt-1">{stats.occupied}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-blue-700 text-sm">Đã đặt</p>
            <p className="text-2xl text-blue-900 mt-1">{stats.reserved}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo số bàn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as TableStatus | 'all')}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="empty">Trống</option>
            <option value="occupied">Đang phục vụ</option>
            <option value="reserved">Đã đặt</option>
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            Thêm bàn mới
          </button>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTables.map((table) => (
          <div
            key={table.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 overflow-hidden"
          >
            <div className={`bg-gradient-to-r ${getStatusColor(table.status)} p-4 text-white`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed size={24} />
                  <span className="text-xl">Bàn {table.number}</span>
                </div>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  {getStatusText(table.status)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/90">
                <Users size={16} />
                <span>{table.seats} chỗ ngồi</span>
              </div>
            </div>

            <div className="p-4">
              {table.status === 'occupied' && (
                <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <p className="text-sm text-orange-700">Order: {table.currentOrder}</p>
                </div>
              )}

              {table.status === 'reserved' && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 text-sm text-blue-700 mb-1">
                    <Clock size={14} />
                    <span>{table.reservedTime}</span>
                  </div>
                  <p className="text-sm text-blue-600">{table.reservedBy}</p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {table.status === 'empty' && (
                  <>
                    <button
                      onClick={() => handleChangeStatus(table.id, 'occupied')}
                      className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                    >
                      Bắt đầu phục vụ
                    </button>
                    <button
                      onClick={() => handleReserveTable(table)}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Đặt bàn
                    </button>
                  </>
                )}

                {table.status === 'occupied' && (
                  <>
                    <button className="w-full py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm flex items-center justify-center gap-2">
                      <ArrowLeftRight size={16} />
                      Chuyển bàn
                    </button>
                    <button
                      onClick={() => handleChangeStatus(table.id, 'empty')}
                      className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Thanh toán xong
                    </button>
                  </>
                )}

                {table.status === 'reserved' && (
                  <>
                    <button
                      onClick={() => handleChangeStatus(table.id, 'occupied')}
                      className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                    >
                      Khách đã đến
                    </button>
                    <button
                      onClick={() => handleChangeStatus(table.id, 'empty')}
                      className="w-full py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      Hủy đặt bàn
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTables.length === 0 && (
        <div className="text-center py-16">
          <UtensilsCrossed className="mx-auto text-gray-400 mb-4" size={64} />
          <p className="text-gray-500">Không tìm thấy bàn nào</p>
        </div>
      )}

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl text-gray-900 mb-4">Thêm bàn mới</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Số bàn</label>
                <input
                  type="text"
                  placeholder="VD: B13"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Số chỗ ngồi</label>
                <input
                  type="number"
                  placeholder="VD: 4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Thêm bàn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reserve Table Modal */}
      {showReserveModal && selectedTable && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl text-gray-900 mb-4">Đặt bàn {selectedTable.number}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Tên khách hàng</label>
                <input
                  type="text"
                  placeholder="Nhập tên khách hàng"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Thời gian đặt</label>
                <input
                  type="time"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowReserveModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    handleChangeStatus(selectedTable.id, 'reserved');
                    setShowReserveModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Xác nhận đặt bàn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
