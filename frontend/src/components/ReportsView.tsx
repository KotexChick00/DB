import { useState } from 'react';
import { Calendar, Download, TrendingUp, DollarSign, ShoppingBag, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export function ReportsView() {
  const [dateRange, setDateRange] = useState('week');
  const [reportType, setReportType] = useState<'revenue' | 'dishes' | 'staff' | 'inventory'>('revenue');

  // Mock data for revenue
  const revenueDataWeek = [
    { label: 'T2', revenue: 12500000, orders: 85 },
    { label: 'T3', revenue: 15200000, orders: 102 },
    { label: 'T4', revenue: 13800000, orders: 95 },
    { label: 'T5', revenue: 18900000, orders: 128 },
    { label: 'T6', revenue: 22400000, orders: 156 },
    { label: 'T7', revenue: 28700000, orders: 195 },
    { label: 'CN', revenue: 26300000, orders: 178 },
  ];

  const revenueDataMonth = [
    { label: 'T1', revenue: 45000000 },
    { label: 'T2', revenue: 52000000 },
    { label: 'T3', revenue: 48000000 },
    { label: 'T4', revenue: 61000000 },
    { label: 'T5', revenue: 58000000 },
    { label: 'T6', revenue: 67000000 },
    { label: 'T7', revenue: 72000000 },
    { label: 'T8', revenue: 68000000 },
    { label: 'T9', revenue: 75000000 },
    { label: 'T10', revenue: 71000000 },
    { label: 'T11', revenue: 78000000 },
    { label: 'T12', revenue: 82000000 },
  ];

  // Top dishes data
  const topDishes = [
    { name: 'Phở bò', sold: 1245, revenue: 93375000, percentage: 18.5 },
    { name: 'Bún chả', sold: 1128, revenue: 78960000, percentage: 15.7 },
    { name: 'Cơm tấm', sold: 1012, revenue: 60720000, percentage: 12.1 },
    { name: 'Bánh mì', sold: 895, revenue: 26850000, percentage: 5.3 },
    { name: 'Gỏi cuốn', sold: 787, revenue: 31480000, percentage: 6.2 },
  ];

  // Staff performance
  const staffPerformance = [
    { name: 'Trần Thị B', role: 'Thu ngân', orders: 456, revenue: 85600000 },
    { name: 'Lê Văn C', role: 'Phục vụ', orders: 389, revenue: 72400000 },
    { name: 'Phạm Thị D', role: 'Bếp', ordersCompleted: 823, avgTime: '12 phút' },
  ];

  // Inventory alerts
  const inventoryAlerts = [
    { name: 'Thịt lợn', current: 8, min: 15, status: 'critical' },
    { name: 'Dầu ăn', current: 6, min: 10, status: 'critical' },
    { name: 'Rau sống', current: 12, min: 10, status: 'warning' },
  ];

  const categoryData = [
    { name: 'Món chính', value: 45, color: '#f97316' },
    { name: 'Món phụ', value: 25, color: '#10b981' },
    { name: 'Đồ uống', value: 20, color: '#3b82f6' },
    { name: 'Tráng miệng', value: 10, color: '#ec4899' },
  ];

  const currentData = dateRange === 'week' ? revenueDataWeek : revenueDataMonth;

  const stats = {
    totalRevenue: currentData.reduce((sum, item) => sum + item.revenue, 0),
    avgOrderValue: dateRange === 'week' ? 147000 : 165000,
    totalOrders: dateRange === 'week' ? 939 : 12500,
    growth: '+12.5%',
  };

  const handleExport = () => {
    alert('Đang xuất báo cáo...');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-6">Báo cáo & Thống kê</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex gap-3">
            <button
              onClick={() => setDateRange('week')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                dateRange === 'week'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tuần này
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                dateRange === 'month'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tháng này
            </button>
            <button
              onClick={() => setDateRange('year')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                dateRange === 'year'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Năm nay
            </button>
          </div>

          <div className="flex gap-3">
            <input
              type="date"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
            <span className="flex items-center text-gray-500">đến</span>
            <input
              type="date"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>

          <button
            onClick={handleExport}
            className="ml-auto flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={18} />
            Xuất báo cáo
          </button>
        </div>

        {/* Report Type Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setReportType('revenue')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              reportType === 'revenue'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            Doanh thu
          </button>
          <button
            onClick={() => setReportType('dishes')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              reportType === 'dishes'
                ? 'bg-orange-600 text-white'
                : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
            }`}
          >
            Món ăn
          </button>
          <button
            onClick={() => setReportType('staff')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              reportType === 'staff'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            Nhân viên
          </button>
          <button
            onClick={() => setReportType('inventory')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              reportType === 'inventory'
                ? 'bg-green-600 text-white'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            Kho hàng
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <DollarSign size={20} />
              <span className="text-sm">Tổng doanh thu</span>
            </div>
            <p className="text-2xl text-gray-900 mb-1">
              {(stats.totalRevenue / 1000000).toFixed(1)}M đ
            </p>
            <span className="text-green-600 text-sm flex items-center gap-1">
              <TrendingUp size={14} />
              {stats.growth}
            </span>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <ShoppingBag size={20} />
              <span className="text-sm">Tổng đơn hàng</span>
            </div>
            <p className="text-2xl text-blue-900">{stats.totalOrders.toLocaleString()}</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center gap-2 text-purple-700 mb-2">
              <DollarSign size={20} />
              <span className="text-sm">Giá trị TB/đơn</span>
            </div>
            <p className="text-2xl text-purple-900">
              {stats.avgOrderValue.toLocaleString()}đ
            </p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center gap-2 text-orange-700 mb-2">
              <Users size={20} />
              <span className="text-sm">Khách trung bình/ngày</span>
            </div>
            <p className="text-2xl text-orange-900">
              {Math.round(stats.totalOrders / (dateRange === 'week' ? 7 : 30))}
            </p>
          </div>
        </div>
      </div>

      {/* Revenue Report */}
      {reportType === 'revenue' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl text-gray-900 mb-6">Biểu đồ doanh thu</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => value.toLocaleString('vi-VN') + 'đ'}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {dateRange === 'week' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl text-gray-900 mb-6">Đơn hàng theo ngày</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                  <Line type="monotone" dataKey="orders" stroke="#f97316" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Dishes Report */}
      {reportType === 'dishes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl text-gray-900 mb-6">Top món bán chạy</h2>
            <div className="space-y-4">
              {topDishes.map((dish, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-yellow-100 text-yellow-600' :
                        index === 1 ? 'bg-gray-100 text-gray-600' :
                        index === 2 ? 'bg-orange-100 text-orange-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-gray-900">{dish.name}</p>
                        <p className="text-sm text-gray-600">Đã bán: {dish.sold}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900">{dish.revenue.toLocaleString('vi-VN')}đ</p>
                      <p className="text-sm text-gray-600">{dish.percentage}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-600 to-red-600 h-2 rounded-full"
                      style={{ width: `${dish.percentage * 5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl text-gray-900 mb-6">Phân loại theo danh mục</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Staff Report */}
      {reportType === 'staff' && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl text-gray-900 mb-6">Hiệu suất nhân viên</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-600">Tên nhân viên</th>
                  <th className="text-left py-4 px-6 text-gray-600">Vai trò</th>
                  <th className="text-right py-4 px-6 text-gray-600">Số đơn</th>
                  <th className="text-right py-4 px-6 text-gray-600">Doanh thu</th>
                  <th className="text-center py-4 px-6 text-gray-600">Hiệu suất</th>
                </tr>
              </thead>
              <tbody>
                {staffPerformance.map((staff, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-6 text-gray-900">{staff.name}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {staff.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right text-gray-900">
                      {staff.orders || staff.ordersCompleted}
                    </td>
                    <td className="py-4 px-6 text-right text-gray-900">
                      {staff.revenue ? staff.revenue.toLocaleString('vi-VN') + 'đ' : staff.avgTime}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        Xuất sắc
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inventory Report */}
      {reportType === 'inventory' && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl text-gray-900 mb-6">Cảnh báo tồn kho</h2>
          <div className="space-y-4">
            {inventoryAlerts.map((item, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 ${
                item.status === 'critical'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-orange-50 border-orange-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${
                      item.status === 'critical' ? 'text-red-900' : 'text-orange-900'
                    }`}>
                      {item.name}
                    </p>
                    <p className={`text-sm ${
                      item.status === 'critical' ? 'text-red-600' : 'text-orange-600'
                    }`}>
                      Hiện tại: {item.current} / Tối thiểu: {item.min}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-lg ${
                    item.status === 'critical'
                      ? 'bg-red-600 text-white'
                      : 'bg-orange-600 text-white'
                  }`}>
                    {item.status === 'critical' ? 'Cần nhập ngay' : 'Cần chú ý'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
