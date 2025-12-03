import { useState } from 'react';
import { Calendar, Clock, Users, UtensilsCrossed, ShoppingCart, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import type { CustomerPageType } from '../App';

interface CustomerViewProps {
  currentPage: CustomerPageType;
  currentUser: any;
}

interface Booking {
  id: string;
  tableNumber: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface Order {
  id: string;
  items: {
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed';
  date: string;
  time: string;
  isPaid: boolean;
  tableNumber?: string;
}

const mockMenu = [
  { id: 1, name: 'Phở bò', price: 75000, category: 'Món chính', image: '' },
  { id: 2, name: 'Bún chả', price: 70000, category: 'Món chính', image: '' },
  { id: 3, name: 'Cơm tấm', price: 60000, category: 'Món chính', image: '' },
  { id: 4, name: 'Bánh mì', price: 30000, category: 'Món chính', image: '' },
  { id: 5, name: 'Gỏi cuốn', price: 40000, category: 'Món phụ', image: '' },
  { id: 6, name: 'Nem rán', price: 45000, category: 'Món phụ', image: '' },
  { id: 7, name: 'Trà đá', price: 5000, category: 'Đồ uống', image: '' },
  { id: 8, name: 'Nước ngọt', price: 15000, category: 'Đồ uống', image: '' },
  { id: 9, name: 'Chè ba màu', price: 25000, category: 'Tráng miệng', image: '' },
  { id: 10, name: 'Bánh flan', price: 20000, category: 'Tráng miệng', image: '' },
];

export function CustomerView({ currentPage, currentUser }: CustomerViewProps) {
  const [bookings, setBookings] = useState<Booking[]>([
    { id: 'BK001', tableNumber: 'B05', date: '05/12/2024', time: '19:00', guests: 4, status: 'confirmed' },
    { id: 'BK002', tableNumber: 'B08', date: '03/12/2024', time: '18:30', guests: 2, status: 'completed' as any },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD001',
      items: [
        { name: 'Phở bò', price: 75000, quantity: 2 },
        { name: 'Trà đá', price: 5000, quantity: 2 },
      ],
      total: 160000,
      status: 'completed',
      date: '02/12/2024',
      time: '12:30',
      isPaid: true,
      tableNumber: 'B05',
    },
  ]);

  const [cart, setCart] = useState<{ dishId: number; name: string; price: number; quantity: number }[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    date: '',
    time: '',
    guests: 2,
  });

  const handleBookTable = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking: Booking = {
      id: `BK${String(bookings.length + 1).padStart(3, '0')}`,
      tableNumber: `B${Math.floor(Math.random() * 20) + 1}`,
      date: new Date(bookingForm.date).toLocaleDateString('vi-VN'),
      time: bookingForm.time,
      guests: bookingForm.guests,
      status: 'pending',
    };
    setBookings([newBooking, ...bookings]);
    alert('Đặt bàn thành công! Nhà hàng sẽ xác nhận trong ít phút.');
    setBookingForm({ date: '', time: '', guests: 2 });
  };

  const addToCart = (dish: typeof mockMenu[0]) => {
    const existingItem = cart.find(item => item.dishId === dish.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.dishId === dish.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { dishId: dish.id, name: dish.name, price: dish.price, quantity: 1 }]);
    }
  };

  const updateCartQuantity = (dishId: number, change: number) => {
    setCart(cart.map(item =>
      item.dishId === dishId ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
    ).filter(item => item.quantity > 0));
  };

  const removeFromCart = (dishId: number) => {
    setCart(cart.filter(item => item.dishId !== dishId));
  };

  const calculateCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePayment = (payNow: boolean) => {
    const newOrder: Order = {
      id: `ORD${String(orders.length + 1).padStart(3, '0')}`,
      items: cart.map(item => ({ name: item.name, price: item.price, quantity: item.quantity })),
      total: calculateCartTotal(),
      status: 'pending',
      date: new Date().toLocaleDateString('vi-VN'),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isPaid: payNow,
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setShowPaymentModal(false);
    alert(payNow ? 'Thanh toán thành công! Đơn hàng đã được gửi.' : 'Đặt món thành công! Bạn sẽ thanh toán khi nhận món.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'preparing': return 'bg-orange-100 text-orange-700';
      case 'ready': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'preparing': return 'Đang chuẩn bị';
      case 'ready': return 'Sẵn sàng';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <div className="p-8">
      {/* Booking Page */}
      {currentPage === 'booking' && (
        <div>
          <h1 className="text-3xl text-gray-900 mb-6">Đặt bàn</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Booking Form */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl text-gray-900 mb-6">Thông tin đặt bàn</h2>
              <form onSubmit={handleBookTable} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Ngày</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="date"
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Giờ</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="time"
                      value={bookingForm.time}
                      onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Số khách</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={bookingForm.guests}
                      onChange={(e) => setBookingForm({ ...bookingForm, guests: parseInt(e.target.value) })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Đặt bàn ngay
                </button>
              </form>
            </div>

            {/* Booking History */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl text-gray-900 mb-6">Lịch sử đặt bàn</h2>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <UtensilsCrossed className="text-orange-600" size={20} />
                        <span className="text-gray-900">Bàn {booking.tableNumber}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={14} />
                        <span>{booking.guests} khách</span>
                      </div>
                      <div className="text-gray-500">
                        #{booking.id}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Page */}
      {currentPage === 'order' && (
        <div>
          <h1 className="text-3xl text-gray-900 mb-6">Đặt món</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Menu */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl text-gray-900 mb-6">Thực đơn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockMenu.map((dish) => (
                  <div key={dish.id} className="border border-gray-200 rounded-lg p-4 hover:border-orange-500 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-gray-900 mb-1">{dish.name}</h3>
                        <p className="text-sm text-gray-600">{dish.category}</p>
                        <p className="text-orange-600 mt-2">{dish.price.toLocaleString('vi-VN')}đ</p>
                      </div>
                      <button
                        onClick={() => addToCart(dish)}
                        className="ml-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        + Thêm
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-8">
                <div className="flex items-center gap-2 mb-6">
                  <ShoppingCart className="text-orange-600" size={24} />
                  <h2 className="text-xl text-gray-900">Giỏ hàng</h2>
                </div>

                {cart.length > 0 ? (
                  <>
                    <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.dishId} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="text-gray-900">{item.name}</h3>
                              <p className="text-sm text-orange-600">
                                {item.price.toLocaleString('vi-VN')}đ
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.dishId)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle size={16} />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCartQuantity(item.dishId, -1)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="w-12 text-center text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.dishId, 1)}
                              className="w-8 h-8 flex items-center justify-center bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                            >
                              +
                            </button>
                            <span className="ml-auto text-gray-900">
                              {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <div className="flex justify-between text-xl text-gray-900 mb-4">
                        <span>Tổng cộng:</span>
                        <span className="text-orange-600">{calculateCartTotal().toLocaleString('vi-VN')}đ</span>
                      </div>
                    </div>

                    <button
                      onClick={handlePlaceOrder}
                      className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      Đặt món
                    </button>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingCart className="mx-auto text-gray-300 mb-3" size={48} />
                    <p className="text-gray-500">Giỏ hàng trống</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My Orders Page */}
      {currentPage === 'myorders' && (
        <div>
          <h1 className="text-3xl text-gray-900 mb-6">Đơn hàng của tôi</h1>

          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg text-gray-900 mb-1">Đơn hàng #{order.id}</h3>
                    <p className="text-sm text-gray-600">{order.date} - {order.time}</p>
                    {order.tableNumber && (
                      <p className="text-sm text-gray-600">Bàn: {order.tableNumber}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    {order.isPaid && (
                      <div className="mt-2">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1 w-fit ml-auto">
                          <CheckCircle size={14} />
                          Đã thanh toán
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h4 className="text-gray-700 mb-2">Món đã đặt:</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-900">{item.name} x{item.quantity}</span>
                        <span className="text-gray-600">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <span className="text-gray-900">Tổng cộng:</span>
                  <span className="text-xl text-orange-600">{order.total.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                <ShoppingCart className="mx-auto text-gray-400 mb-4" size={64} />
                <p className="text-gray-500">Chưa có đơn hàng nào</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl text-gray-900 mb-4">Xác nhận đơn hàng</h2>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">Tổng tiền: <span className="text-2xl text-orange-600">{calculateCartTotal().toLocaleString('vi-VN')}đ</span></p>
              <p className="text-sm text-gray-500">Bạn muốn thanh toán ngay hay thanh toán khi nhận món?</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handlePayment(true)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all"
              >
                <CreditCard size={20} />
                Thanh toán ngay
              </button>
              <button
                onClick={() => handlePayment(false)}
                className="w-full py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Thanh toán sau
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
