import { 
  DollarSign, 
  Users, 
  ShoppingBag, 
  TrendingUp,
  UtensilsCrossed,
  Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export function Dashboard() {
  // Mock data
  const revenueData = [
    { day: 'T2', revenue: 12500000 },
    { day: 'T3', revenue: 15200000 },
    { day: 'T4', revenue: 13800000 },
    { day: 'T5', revenue: 18900000 },
    { day: 'T6', revenue: 22400000 },
    { day: 'T7', revenue: 28700000 },
    { day: 'CN', revenue: 26300000 },
  ];

  const topDishes = [
    { name: 'Phở bò', sold: 145, revenue: 10875000 },
    { name: 'Bún chả', sold: 128, revenue: 8960000 },
    { name: 'Cơm tấm', sold: 112, revenue: 6720000 },
    { name: 'Bánh mì', sold: 95, revenue: 2850000 },
    { name: 'Gỏi cuốn', sold: 87, revenue: 3480000 },
  ];

  const tableStatus = [
    { status: 'Trống', count: 12, color: '#10b981' },
    { status: 'Đang phục vụ', count: 8, color: '#f59e0b' },
    { status: 'Đã đặt', count: 3, color: '#3b82f6' },
  ];

  const stats = [
    {
      title: 'Doanh thu hôm nay',
      value: '26.300.000đ',
      change: '+15.3%',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Đơn hàng',
      value: '156',
      change: '+8.2%',
      icon: ShoppingBag,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Khách hàng',
      value: '423',
      change: '+12.5%',
      icon: Users,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Bàn đang phục vụ',
      value: '8/23',
      change: '34.8%',
      icon: UtensilsCrossed,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">Tổng quan</h1>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock size={16} />
          <p>Cập nhật lúc: {new Date().toLocaleString('vi-VN')}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={stat.iconColor} size={24} />
                </div>
                <span className="text-green-600 text-sm flex items-center gap-1">
                  <TrendingUp size={16} />
                  {stat.change}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
              <p className="text-2xl text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl text-gray-900 mb-6">Doanh thu tuần này</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => value.toLocaleString('vi-VN') + 'đ'}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Table Status Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl text-gray-900 mb-6">Trạng thái bàn</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tableStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.status}: ${entry.count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {tableStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {tableStatus.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">{item.status}</span>
                </div>
                <span className="text-gray-900">{item.count} bàn</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Dishes */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl text-gray-900 mb-6">Top món ăn bán chạy</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600">Hạng</th>
                <th className="text-left py-3 px-4 text-gray-600">Tên món</th>
                <th className="text-right py-3 px-4 text-gray-600">Số lượng bán</th>
                <th className="text-right py-3 px-4 text-gray-600">Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {topDishes.map((dish, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-yellow-100 text-yellow-600' :
                      index === 1 ? 'bg-gray-100 text-gray-600' :
                      index === 2 ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-900">{dish.name}</td>
                  <td className="py-4 px-4 text-right text-gray-900">{dish.sold}</td>
                  <td className="py-4 px-4 text-right text-gray-900">{dish.revenue.toLocaleString('vi-VN')}đ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
