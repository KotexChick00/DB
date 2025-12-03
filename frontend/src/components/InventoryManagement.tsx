import { useState } from 'react';
import { Search, Plus, AlertTriangle, TrendingUp, TrendingDown, Package } from 'lucide-react';

interface Ingredient {
  id: number;
  name: string;
  unit: string;
  quantity: number;
  minQuantity: number;
  price: number;
  lastUpdate: string;
}

interface Transaction {
  id: string;
  type: 'import' | 'export';
  ingredientName: string;
  quantity: number;
  date: string;
  time: string;
  note: string;
}

export function InventoryManagement() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 1, name: 'Thịt bò', unit: 'kg', quantity: 45, minQuantity: 20, price: 350000, lastUpdate: '02/12/2024' },
    { id: 2, name: 'Bánh phở', unit: 'kg', quantity: 30, minQuantity: 15, price: 25000, lastUpdate: '02/12/2024' },
    { id: 3, name: 'Rau sống', unit: 'kg', quantity: 12, minQuantity: 10, price: 15000, lastUpdate: '02/12/2024' },
    { id: 4, name: 'Thịt lợn', unit: 'kg', quantity: 8, minQuantity: 15, price: 120000, lastUpdate: '01/12/2024' },
    { id: 5, name: 'Gạo', unit: 'kg', quantity: 150, minQuantity: 50, price: 18000, lastUpdate: '30/11/2024' },
    { id: 6, name: 'Nước mắm', unit: 'lít', quantity: 25, minQuantity: 10, price: 45000, lastUpdate: '02/12/2024' },
    { id: 7, name: 'Dầu ăn', unit: 'lít', quantity: 6, minQuantity: 10, price: 55000, lastUpdate: '01/12/2024' },
    { id: 8, name: 'Đường', unit: 'kg', quantity: 35, minQuantity: 20, price: 22000, lastUpdate: '02/12/2024' },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'TXN001', type: 'import', ingredientName: 'Thịt bò', quantity: 20, date: '02/12/2024', time: '09:00', note: 'Nhập từ nhà cung cấp A' },
    { id: 'TXN002', type: 'export', ingredientName: 'Bánh phở', quantity: 5, date: '02/12/2024', time: '14:00', note: 'Xuất cho ca trưa' },
    { id: 'TXN003', type: 'import', ingredientName: 'Rau sống', quantity: 10, date: '02/12/2024', time: '08:30', note: 'Nhập từ chợ' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentView, setCurrentView] = useState<'inventory' | 'transactions'>('inventory');

  const lowStockItems = ingredients.filter(item => item.quantity < item.minQuantity);

  const filteredIngredients = ingredients.filter(ing =>
    ing.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (item: Ingredient) => {
    const percentage = (item.quantity / item.minQuantity) * 100;
    if (percentage < 50) return { color: 'text-red-600 bg-red-50', text: 'Sắp hết' };
    if (percentage < 100) return { color: 'text-orange-600 bg-orange-50', text: 'Thấp' };
    return { color: 'text-green-600 bg-green-50', text: 'Đủ' };
  };

  const totalValue = ingredients.reduce((sum, ing) => sum + (ing.quantity * ing.price), 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-6">Quản lý kho</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Package size={20} />
              <span className="text-sm">Tổng NVL</span>
            </div>
            <p className="text-2xl text-gray-900">{ingredients.length}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <AlertTriangle size={20} />
              <span className="text-sm">Sắp hết</span>
            </div>
            <p className="text-2xl text-red-900">{lowStockItems.length}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <TrendingUp size={20} />
              <span className="text-sm">Giá trị kho</span>
            </div>
            <p className="text-lg text-blue-900">{(totalValue / 1000000).toFixed(1)}M đ</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <TrendingDown size={20} />
              <span className="text-sm">Giao dịch hôm nay</span>
            </div>
            <p className="text-2xl text-green-900">{transactions.length}</p>
          </div>
        </div>

        {/* Warning */}
        {lowStockItems.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={20} />
              <div className="flex-1">
                <p className="text-red-900 mb-2">Cảnh báo: {lowStockItems.length} nguyên liệu sắp hết!</p>
                <div className="flex flex-wrap gap-2">
                  {lowStockItems.map(item => (
                    <span key={item.id} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                      {item.name} ({item.quantity}{item.unit})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Toggle */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setCurrentView('inventory')}
            className={`px-6 py-3 rounded-lg transition-colors ${
              currentView === 'inventory'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Nguyên liệu
          </button>
          <button
            onClick={() => setCurrentView('transactions')}
            className={`px-6 py-3 rounded-lg transition-colors ${
              currentView === 'transactions'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Nhật ký xuất/nhập
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm nguyên liệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>
          {currentView === 'inventory' && (
            <>
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
              >
                <TrendingUp size={20} />
                Nhập kho
              </button>
              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                <TrendingDown size={20} />
                Xuất kho
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
              >
                <Plus size={20} />
                Thêm NVL
              </button>
            </>
          )}
        </div>
      </div>

      {/* Inventory View */}
      {currentView === 'inventory' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-600">Tên nguyên liệu</th>
                  <th className="text-center py-4 px-6 text-gray-600">Đơn vị</th>
                  <th className="text-right py-4 px-6 text-gray-600">Số lượng</th>
                  <th className="text-right py-4 px-6 text-gray-600">Tồn tối thiểu</th>
                  <th className="text-center py-4 px-6 text-gray-600">Trạng thái</th>
                  <th className="text-right py-4 px-6 text-gray-600">Giá/ĐV</th>
                  <th className="text-right py-4 px-6 text-gray-600">Giá trị</th>
                  <th className="text-left py-4 px-6 text-gray-600">Cập nhật</th>
                </tr>
              </thead>
              <tbody>
                {filteredIngredients.map((item) => {
                  const status = getStockStatus(item);
                  return (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">{item.name}</td>
                      <td className="py-4 px-6 text-center text-gray-600">{item.unit}</td>
                      <td className="py-4 px-6 text-right text-gray-900">{item.quantity}</td>
                      <td className="py-4 px-6 text-right text-gray-600">{item.minQuantity}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm ${status.color}`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right text-gray-900">
                        {item.price.toLocaleString('vi-VN')}đ
                      </td>
                      <td className="py-4 px-6 text-right text-gray-900">
                        {(item.quantity * item.price).toLocaleString('vi-VN')}đ
                      </td>
                      <td className="py-4 px-6 text-gray-600 text-sm">{item.lastUpdate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transactions View */}
      {currentView === 'transactions' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-600">Mã GD</th>
                  <th className="text-left py-4 px-6 text-gray-600">Loại</th>
                  <th className="text-left py-4 px-6 text-gray-600">Nguyên liệu</th>
                  <th className="text-right py-4 px-6 text-gray-600">Số lượng</th>
                  <th className="text-left py-4 px-6 text-gray-600">Ngày</th>
                  <th className="text-left py-4 px-6 text-gray-600">Giờ</th>
                  <th className="text-left py-4 px-6 text-gray-600">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 text-gray-900">{txn.id}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 w-fit ${
                        txn.type === 'import'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {txn.type === 'import' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {txn.type === 'import' ? 'Nhập' : 'Xuất'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-900">{txn.ingredientName}</td>
                    <td className="py-4 px-6 text-right text-gray-900">{txn.quantity}</td>
                    <td className="py-4 px-6 text-gray-600">{txn.date}</td>
                    <td className="py-4 px-6 text-gray-600">{txn.time}</td>
                    <td className="py-4 px-6 text-gray-600">{txn.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl text-gray-900 mb-4">Nhập kho</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Nguyên liệu</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none">
                  {ingredients.map(ing => (
                    <option key={ing.id} value={ing.id}>{ing.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Số lượng</label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Ghi chú</label>
                <textarea
                  rows={3}
                  placeholder="Nhập ghi chú..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Nhập kho
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl text-gray-900 mb-4">Xuất kho</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Nguyên liệu</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none">
                  {ingredients.map(ing => (
                    <option key={ing.id} value={ing.id}>{ing.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Số lượng</label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Ghi chú</label>
                <textarea
                  rows={3}
                  placeholder="Nhập ghi chú..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Xuất kho
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Ingredient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl text-gray-900 mb-4">Thêm nguyên liệu mới</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Tên nguyên liệu</label>
                <input
                  type="text"
                  placeholder="VD: Thịt gà"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Đơn vị</label>
                  <input
                    type="text"
                    placeholder="kg, lít..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Giá/ĐV</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Số lượng ban đầu</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Tồn tối thiểu</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
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
                  Thêm NVL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
