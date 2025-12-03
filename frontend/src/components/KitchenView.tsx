import { useState } from 'react';
import { Clock, ChefHat, CheckCircle, AlertCircle } from 'lucide-react';

type OrderStatus = 'pending' | 'cooking' | 'completed';

interface KitchenOrder {
  id: string;
  tableNumber: string;
  items: {
    name: string;
    quantity: number;
  }[];
  status: OrderStatus;
  orderTime: string;
  startTime?: string;
  completeTime?: string;
}

export function KitchenView() {
  const [orders, setOrders] = useState<KitchenOrder[]>([
    {
      id: 'ORD001',
      tableNumber: 'B02',
      items: [
        { name: 'Phở bò', quantity: 2 },
        { name: 'Gỏi cuốn', quantity: 1 },
      ],
      status: 'pending',
      orderTime: '14:30',
    },
    {
      id: 'ORD002',
      tableNumber: 'B04',
      items: [
        { name: 'Bún chả', quantity: 1 },
        { name: 'Nem rán', quantity: 2 },
        { name: 'Trà đá', quantity: 2 },
      ],
      status: 'cooking',
      orderTime: '14:25',
      startTime: '14:26',
    },
    {
      id: 'ORD003',
      tableNumber: 'B06',
      items: [
        { name: 'Cơm tấm', quantity: 3 },
        { name: 'Nước ngọt', quantity: 3 },
      ],
      status: 'pending',
      orderTime: '14:35',
    },
    {
      id: 'ORD004',
      tableNumber: 'B10',
      items: [
        { name: 'Bánh mì', quantity: 1 },
      ],
      status: 'completed',
      orderTime: '14:15',
      startTime: '14:16',
      completeTime: '14:20',
    },
  ]);

  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');

  const handleStartCooking = (orderId: string) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: 'cooking' as OrderStatus, startTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) }
        : order
    ));
  };

  const handleComplete = (orderId: string) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: 'completed' as OrderStatus, completeTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) }
        : order
    ));
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'from-red-500 to-orange-600';
      case 'cooking':
        return 'from-blue-500 to-cyan-600';
      case 'completed':
        return 'from-green-500 to-emerald-600';
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'Chờ chế biến';
      case 'cooking':
        return 'Đang nấu';
      case 'completed':
        return 'Hoàn thành';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <AlertCircle size={20} />;
      case 'cooking':
        return <ChefHat size={20} />;
      case 'completed':
        return <CheckCircle size={20} />;
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    cooking: orders.filter(o => o.status === 'cooking').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-6">Màn hình bếp</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <AlertCircle size={20} />
              <span className="text-sm">Chờ chế biến</span>
            </div>
            <p className="text-3xl text-red-900">{stats.pending}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <ChefHat size={20} />
              <span className="text-sm">Đang nấu</span>
            </div>
            <p className="text-3xl text-blue-900">{stats.cooking}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <CheckCircle size={20} />
              <span className="text-sm">Hoàn thành</span>
            </div>
            <p className="text-3xl text-green-900">{stats.completed}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'pending'
                ? 'bg-red-600 text-white'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            Chờ chế biến ({stats.pending})
          </button>
          <button
            onClick={() => setFilter('cooking')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'cooking'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            Đang nấu ({stats.cooking})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'completed'
                ? 'bg-green-600 text-white'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            Hoàn thành ({stats.completed})
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 overflow-hidden">
            <div className={`bg-gradient-to-r ${getStatusColor(order.status)} p-4 text-white`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span className="text-xl">Bàn {order.tableNumber}</span>
                </div>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  {order.id}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/90">
                <Clock size={16} />
                <span>Đặt lúc: {order.orderTime}</span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-gray-900 mb-3">Danh sách món:</h3>
              <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">{item.name}</span>
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-sm">
                      x{item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {order.startTime && (
                <div className="mb-4 p-2 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-700">Bắt đầu: {order.startTime}</p>
                </div>
              )}

              {order.completeTime && (
                <div className="mb-4 p-2 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-xs text-green-700">Hoàn thành: {order.completeTime}</p>
                </div>
              )}

              {order.status === 'pending' && (
                <button
                  onClick={() => handleStartCooking(order.id)}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ChefHat size={16} />
                  Bắt đầu chế biến
                </button>
              )}

              {order.status === 'cooking' && (
                <button
                  onClick={() => handleComplete(order.id)}
                  className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} />
                  Hoàn thành
                </button>
              )}

              {order.status === 'completed' && (
                <div className="w-full py-2 bg-gray-100 text-gray-500 rounded-lg text-center">
                  Đã hoàn thành
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-16">
          <ChefHat className="mx-auto text-gray-400 mb-4" size={64} />
          <p className="text-gray-500">Không có order nào</p>
        </div>
      )}
    </div>
  );
}
