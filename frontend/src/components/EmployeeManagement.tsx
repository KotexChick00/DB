import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Key, UserCheck, UserX } from 'lucide-react';

type Role = 'Quản lý' | 'Thu ngân' | 'Phục vụ' | 'Bếp';

interface Employee {
  id: number;
  name: string;
  role: Role;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  username: string;
  joinDate: string;
}

export function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, name: 'Nguyễn Văn A', role: 'Quản lý', phone: '0901234567', email: 'nguyenvana@email.com', status: 'active', username: 'admin', joinDate: '01/01/2024' },
    { id: 2, name: 'Trần Thị B', role: 'Thu ngân', phone: '0912345678', email: 'tranthib@email.com', status: 'active', username: 'cashier', joinDate: '15/02/2024' },
    { id: 3, name: 'Lê Văn C', role: 'Phục vụ', phone: '0923456789', email: 'levanc@email.com', status: 'active', username: 'waiter', joinDate: '20/03/2024' },
    { id: 4, name: 'Phạm Thị D', role: 'Bếp', phone: '0934567890', email: 'phamthid@email.com', status: 'active', username: 'chef', joinDate: '10/04/2024' },
    { id: 5, name: 'Hoàng Văn E', role: 'Quản lý', phone: '0945678901', email: 'hoangvane@email.com', status: 'inactive', username: 'manager2', joinDate: '05/05/2024' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<Role | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'active' | 'inactive' | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getRoleColor = (role: Role) => {
    switch (role) {
      case 'Quản lý': return 'bg-purple-100 text-purple-700';
      case 'Thu ngân': return 'bg-blue-100 text-blue-700';
      case 'Phục vụ': return 'bg-green-100 text-green-700';
      case 'Bếp': return 'bg-orange-100 text-orange-700';
    }
  };

  let filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.phone.includes(searchTerm) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || emp.role === filterRole;
    const matchesStatus = filterStatus === 'all' || emp.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      setEmployees(employees.filter(e => e.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setEmployees(employees.map(e =>
      e.id === id ? { ...e, status: e.status === 'active' ? 'inactive' as const : 'active' as const } : e
    ));
  };

  const handleResetPassword = (id: number) => {
    alert(`Đã reset mật khẩu cho nhân viên ID: ${id}`);
  };

  const handleAddNew = () => {
    setEditingEmployee(null);
    setShowModal(true);
  };

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.status === 'active').length,
    manager: employees.filter(e => e.role === 'Quản lý').length,
    cashier: employees.filter(e => e.role === 'Thu ngân').length,
    waiter: employees.filter(e => e.role === 'Phục vụ').length,
    chef: employees.filter(e => e.role === 'Bếp').length,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-6">Quản lý nhân viên</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-sm">Tổng NV</p>
            <p className="text-2xl text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <p className="text-green-700 text-sm">Đang làm</p>
            <p className="text-2xl text-green-900 mt-1">{stats.active}</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <p className="text-purple-700 text-sm">Quản lý</p>
            <p className="text-2xl text-purple-900 mt-1">{stats.manager}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-blue-700 text-sm">Thu ngân</p>
            <p className="text-2xl text-blue-900 mt-1">{stats.cashier}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <p className="text-green-700 text-sm">Phục vụ</p>
            <p className="text-2xl text-green-900 mt-1">{stats.waiter}</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <p className="text-orange-700 text-sm">Bếp</p>
            <p className="text-2xl text-orange-900 mt-1">{stats.chef}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm theo tên, SĐT, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as Role | 'all')}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="Quản lý">Quản lý</option>
            <option value="Thu ngân">Thu ngân</option>
            <option value="Phục vụ">Phục vụ</option>
            <option value="Bếp">Bếp</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'active' | 'inactive' | 'all')}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang làm việc</option>
            <option value="inactive">Đã nghỉ</option>
          </select>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            Thêm nhân viên
          </button>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-gray-600">ID</th>
                <th className="text-left py-4 px-6 text-gray-600">Họ tên</th>
                <th className="text-left py-4 px-6 text-gray-600">Vai trò</th>
                <th className="text-left py-4 px-6 text-gray-600">Số điện thoại</th>
                <th className="text-left py-4 px-6 text-gray-600">Email</th>
                <th className="text-left py-4 px-6 text-gray-600">Username</th>
                <th className="text-center py-4 px-6 text-gray-600">Trạng thái</th>
                <th className="text-center py-4 px-6 text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((employee) => (
                <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 text-gray-900">#{employee.id}</td>
                  <td className="py-4 px-6 text-gray-900">{employee.name}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm ${getRoleColor(employee.role)}`}>
                      {employee.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{employee.phone}</td>
                  <td className="py-4 px-6 text-gray-600">{employee.email}</td>
                  <td className="py-4 px-6 text-gray-900">{employee.username}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      employee.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {employee.status === 'active' ? 'Đang làm' : 'Đã nghỉ'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleResetPassword(employee.id)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Reset mật khẩu"
                      >
                        <Key size={18} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(employee.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          employee.status === 'active'
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={employee.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}
                      >
                        {employee.status === 'active' ? <UserX size={18} /> : <UserCheck size={18} />}
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8">
            <h2 className="text-xl text-gray-900 mb-4">
              {editingEmployee ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-gray-700 mb-2">Họ tên</label>
                <input
                  type="text"
                  defaultValue={editingEmployee?.name}
                  placeholder="Nhập họ tên"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Vai trò</label>
                <select
                  defaultValue={editingEmployee?.role}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                >
                  <option value="Quản lý">Quản lý</option>
                  <option value="Thu ngân">Thu ngân</option>
                  <option value="Phục vụ">Phục vụ</option>
                  <option value="Bếp">Bếp</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  defaultValue={editingEmployee?.phone}
                  placeholder="0901234567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={editingEmployee?.email}
                  placeholder="email@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  defaultValue={editingEmployee?.username}
                  placeholder="username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              {!editingEmployee && (
                <div>
                  <label className="block text-gray-700 mb-2">Mật khẩu</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                {editingEmployee ? 'Cập nhật' : 'Thêm nhân viên'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
