import { useState } from 'react';
import { Plus, Minus, ShoppingCart, Trash2, Send } from 'lucide-react';

interface OrderItem {
  dishId: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  tableNumber: string;
  items: OrderItem[];
}

const mockDishes = [
  { id: 1, name: 'Phở bò', price: 75000, category: 'Món chính' },
  { id: 2, name: 'Bún chả', price: 70000, category: 'Món chính' },
  { id: 3, name: 'Cơm tấm', price: 60000, category: 'Món chính' },
  { id: 4, name: 'Bánh mì', price: 30000, category: 'Món chính' },
  { id: 5, name: 'Gỏi cuốn', price: 40000, category: 'Món phụ' },
  { id: 6, name: 'Nem rán', price: 45000, category: 'Món phụ' },
  { id: 7, name: 'Trà đá', price: 5000, category: 'Đồ uống' },
  { id: 8, name: 'Nước ngọt', price: 15000, category: 'Đồ uống' },
];

const mockTables = ['B01', 'B02', 'B03', 'B04', 'B05', 'B06', 'B07', 'B08'];

export function OrderManagement() {
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [currentOrder, setCurrentOrder] = useState<Order>({ tableNumber: '', items: [] });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDishes = mockDishes.filter(dish =>
    dish.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToOrder = (dish: typeof mockDishes[0]) => {
    if (!selectedTable) {
      alert('Vui lòng chọn bàn trước');
      return;
    }

    const existingItem = currentOrder.items.find(item => item.dishId === dish.id);
    
    if (existingItem) {
      setCurrentOrder({
        ...currentOrder,
        items: currentOrder.items.map(item =>
          item.dishId === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      });
    } else {
      setCurrentOrder({
        tableNumber: selectedTable,
        items: [...currentOrder.items, {
          dishId: dish.id,
          name: dish.name,
          price: dish.price,
          quantity: 1
        }]
      });
    }
  };

  const updateQuantity = (dishId: number, change: number) => {
    setCurrentOrder({
      ...currentOrder,
      items: currentOrder.items.map(item =>
        item.dishId === dishId
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0)
    });
  };

  const removeItem = (dishId: number) => {
    setCurrentOrder({
      ...currentOrder,
      items: currentOrder.items.filter(item => item.dishId !== dishId)
    });
  };

  const calculateTotal = () => {
    return currentOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleSendToKitchen = () => {
    if (currentOrder.items.length === 0) {
      alert('Vui lòng thêm món vào order');
      return;
    }
    alert(`Đã gửi order cho bàn ${selectedTable} xuống bếp!`);
    setCurrentOrder({ tableNumber: '', items: [] });
    setSelectedTable('');
  };

  const handleSelectTable = (table: string) => {
    setSelectedTable(table);
    setCurrentOrder({ tableNumber: table, items: [] });
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl text-gray-900 mb-6">Gọi món</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Table Selection & Menu */}
        <div className="lg:col-span-2 space-y-6">
          {/* Table Selection */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl text-gray-900 mb-4">Chọn bàn</h2>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {mockTables.map(table => (
                <button
                  key={table}
                  onClick={() => handleSelectTable(table)}
                  className={`py-3 rounded-lg transition-all ${
                    selectedTable === table
                      ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {table}
                </button>
              ))}
            </div>
          </div>

          {/* Menu */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl text-gray-900 mb-4">Thực đơn</h2>
            
            <input
              type="text"
              placeholder="Tìm kiếm món..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredDishes.map(dish => (
                <div
                  key={dish.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="text-gray-900">{dish.name}</h3>
                    <p className="text-sm text-gray-600">{dish.category}</p>
                    <p className="text-orange-600 mt-1">{dish.price.toLocaleString('vi-VN')}đ</p>
                  </div>
                  <button
                    onClick={() => addToOrder(dish)}
                    disabled={!selectedTable}
                    className="ml-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Thêm
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Current Order */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-8">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="text-orange-600" size={24} />
              <h2 className="text-xl text-gray-900">Order hiện tại</h2>
            </div>

            {selectedTable ? (
              <>
                <div className="bg-orange-50 rounded-lg p-3 mb-4 border border-orange-100">
                  <p className="text-sm text-orange-700">Bàn đang chọn:</p>
                  <p className="text-xl text-orange-900">{selectedTable}</p>
                </div>

                {currentOrder.items.length > 0 ? (
                  <>
                    <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto">
                      {currentOrder.items.map(item => (
                        <div key={item.dishId} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="text-gray-900">{item.name}</h3>
                              <p className="text-sm text-orange-600">
                                {item.price.toLocaleString('vi-VN')}đ
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.dishId)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.dishId, -1)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-12 text-center text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.dishId, 1)}
                              className="w-8 h-8 flex items-center justify-center bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                            >
                              <Plus size={16} />
                            </button>
                            <span className="ml-auto text-gray-900">
                              {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Tạm tính:</span>
                        <span className="text-gray-900">{calculateTotal().toLocaleString('vi-VN')}đ</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-900">Tổng cộng:</span>
                        <span className="text-2xl text-orange-600">
                          {calculateTotal().toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleSendToKitchen}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      <Send size={20} />
                      Gửi xuống bếp
                    </button>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingCart className="mx-auto text-gray-300 mb-3" size={48} />
                    <p className="text-gray-500">Chưa có món nào</p>
                    <p className="text-sm text-gray-400 mt-1">Thêm món từ thực đơn</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Vui lòng chọn bàn</p>
                <p className="text-sm text-gray-400 mt-1">để bắt đầu gọi món</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
