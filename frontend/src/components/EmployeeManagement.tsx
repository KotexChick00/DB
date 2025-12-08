import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Edit2, Key, UserX, Loader2, Trash } from 'lucide-react';

// Cấu trúc dữ liệu JSON thuần
interface Employee {
  User_ID: number;
  Restaurant_ID: number;
  Salary: number;
  HireDate: string;
  SupervisorID: number | null;
  EmployeeType: 'Service Staff' | 'Manager' | 'Chef' | 'Cleaner';
}

type EmployeeType = Employee['EmployeeType'];

// Ánh xạ vai trò
const roleMap: { [key in EmployeeType]: { label: string, color: string } } = {
  'Manager': { label: 'Manager', color: 'bg-purple-100 text-purple-700' },
  'Service Staff': { label: 'Service Staff', color: 'bg-green-100 text-green-700' },
  'Chef': { label: 'Chef', color: 'bg-orange-100 text-orange-700' },
  'Cleaner': { label: 'Cleaner', color: 'bg-blue-100 text-blue-700' },
};

// URL API của bạn (ví dụ: dùng proxy '/api' của Vite)
const API_URL = '/api/employee/all';
// Nếu API không dùng proxy và chạy trên cổng 5173: 'http://localhost:5173/employees'

async function insertEmployeeApi(emp: Employee) {
  const res = await fetch("/api/employee/insert", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(emp)
  });

  if (!res.ok) throw new Error("Lỗi khi thêm nhân viên");
  return res.json();
}

async function updateEmployeeApi(emp: Employee) {
  const res = await fetch("/api/employee/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(emp)
  });

  if (!res.ok) throw new Error("Lỗi khi cập nhật nhân viên");
  return res.json();
}


export function EmployeeManagement() {
  // 1. Khởi tạo mảng nhân viên là mảng rỗng
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái tải
  const [error, setError] = useState<string | null>(null); // Thêm trạng thái lỗi

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<EmployeeType | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 2. Sử dụng useEffect để Fetch dữ liệu khi component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Thực hiện lệnh gọi API
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`Lỗi HTTP: ${response.status}`);
        }

        const data: Employee[] = await response.json();

        // Cập nhật state với dữ liệu thực tế từ API
        setEmployees(data);

      } catch (err) {
        console.error("Lỗi khi fetch dữ liệu:", err);
        setError("Không thể tải dữ liệu nhân viên từ API.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []); // [] đảm bảo useEffect chỉ chạy 1 lần sau khi render ban đầu

  // --- Các hàm xử lý (format, filter, stats) giữ nguyên ---
  const getRoleDisplay = (role: EmployeeType) => roleMap[role];

  const filteredEmployees = useMemo(() => {
    // ... logic lọc ...
    return employees.filter(emp => {
      const matchesSearch =
        String(emp.User_ID).includes(searchTerm) ||
        String(emp.Restaurant_ID).includes(searchTerm) ||
        emp.EmployeeType.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = filterRole === 'all' || emp.EmployeeType === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [employees, searchTerm, filterRole]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const stats = useMemo(() => ({
    total: employees.length,
    manager: employees.filter(e => e.EmployeeType === 'Manager').length,
    serviceStaff: employees.filter(e => e.EmployeeType === 'Service Staff').length,
    chef: employees.filter(e => e.EmployeeType === 'Chef').length,
    cleaner: employees.filter(e => e.EmployeeType === 'Cleaner').length,
  }), [employees]);

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingEmployee(null);
    setShowModal(true);
  };

  // Thay thế hàm handleModalSave hiện tại bằng hàm này

  const handleModalSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    // Khai báo kiểu cho các elements dựa trên tên 'name' đã đặt trong form (FE)
    const formElements = form.elements as typeof form.elements & {
      User_ID: { value: string };      // Input name: User_ID (dùng khi thêm mới)
      RestaurantID: { value: string }; // Input name: RestaurantID
      Salary: { value: string };
      HireDate: { value: string };
      SupervisorID: { value: string };
      EmployeeType: { value: EmployeeType };
    };

    // 1. Chuẩn bị dữ liệu chung từ form
    const salary = Number(formElements.Salary.value);
    const restaurantIDValue = Number(formElements.RestaurantID.value);
    const supervisorID = formElements.SupervisorID.value ? Number(formElements.SupervisorID.value) : null;

    // Khởi tạo Payload: Bắt buộc dùng `any` vì cấu trúc khác với Employee interface (FE)
    let payload: any;

    if (editingEmployee) {
      // CẬP NHẬT (PUT): Sử dụng UserID và RestaurantID (PascalCase) cho BE
      payload = {
        UserID: editingEmployee.User_ID,         // Lấy User_ID từ object, ánh xạ thành UserID
        RestaurantID: restaurantIDValue,         // Lấy từ form, giữ nguyên RestaurantID

        Salary: salary,
        HireDate: formElements.HireDate.value,
        SupervisorID: supervisorID,
        EmployeeType: formElements.EmployeeType.value,
      };

    } else {
      // THÊM MỚI (POST): Sử dụng UserID và RestaurantID (PascalCase) cho BE
      const userID = Number(formElements.User_ID.value);

      payload = {
        UserID: userID,                          // Lấy từ User_ID, ánh xạ thành UserID
        RestaurantID: restaurantIDValue,         // Lấy từ form, giữ nguyên RestaurantID

        Salary: salary,
        HireDate: formElements.HireDate.value,
        SupervisorID: supervisorID,
        EmployeeType: formElements.EmployeeType.value,
      };
    }

    // 2. Gửi API
    try {
      const url = editingEmployee ? "/api/employee/update" : "/api/employee/insert";
      const method = editingEmployee ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload) // Payload đã được ánh xạ thành PascalCase
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(`Lỗi API: ${errorData.message || 'Lỗi không xác định'}`);
      }

      alert(editingEmployee ? "Cập nhật thành công!" : "Thêm mới thành công!");

      setShowModal(false);

      // 3. Tải lại dữ liệu (Dữ liệu trả về vẫn là Snake_Case theo Employee Interface)
      const updatedResponse = await fetch("/api/employee/all");
      if (!updatedResponse.ok) throw new Error("Không thể tải lại dữ liệu sau khi lưu.");
      setEmployees(await updatedResponse.json());

    } catch (err: any) {
      console.error("Lỗi thao tác nhân viên:", err);
      alert(`Thất bại: ${err.message}`);
    }
  };

  const handleResetAccount = (id: number) => {
    alert(`Đã reset tài khoản (giả định) cho User ID: ${id}`);
  };

  // ... trong component EmployeeManagement, cùng cấp với handleModalSave

const handleDelete = async (userID: number) => {
    // 1. Xác nhận
    if (!window.confirm(`Bạn có chắc chắn muốn xóa nhân viên có User ID #${userID} không?`)) {
        return;
    }

    // 2. Gửi API
    try {
        // Giả sử API DELETE sử dụng UserID (PascalCase) trong URL
        const url = `/api/employee/delete/${userID}`; 
        
        const res = await fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            // Thường API DELETE không cần body, nhưng nếu BE yêu cầu body JSON, 
            // bạn có thể thêm: body: JSON.stringify({ UserID: userID })
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: res.statusText }));
            throw new Error(`Lỗi API: ${errorData.message || 'Lỗi không xác định'}`);
        }

        alert(`Nhân viên có User ID #${userID} đã được xóa thành công!`);

        // 3. Tải lại dữ liệu
        const updatedResponse = await fetch("/api/employee/all");
        if (!updatedResponse.ok) throw new Error("Không thể tải lại dữ liệu sau khi xóa.");
        
        // Cập nhật state employees
        setEmployees(await updatedResponse.json()); 
        
        // Quay về trang 1 nếu trang hiện tại không còn dữ liệu
        if (currentPage > 1 && paginatedEmployees.length === 1) {
             setCurrentPage(currentPage - 1);
        }

    } catch (err: any) {
        console.error("Lỗi xóa nhân viên:", err);
        alert(`Thất bại: ${err.message}`);
    }
};

  // --- Render (Thêm trạng thái Loading và Error) ---

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin mr-2 h-8 w-8 text-orange-600" />
        <span className="text-lg text-gray-700">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-100 border border-red-400 rounded-lg">
        <p className="font-bold">Lỗi tải dữ liệu:</p>
        <p>{error}</p>
        <p className="text-sm text-red-500 mt-2">Vui lòng kiểm tra API URL hoặc server backend.</p>
      </div>
    );
  }

  return (
    <div className="p-8">


      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-6">Quản lý nhân viên (Dữ liệu từ API)</h1>

        ---

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-sm">Tổng NV</p>
            <p className="text-2xl text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <p className="text-purple-700 text-sm">{roleMap.Manager.label}</p>
            <p className="text-2xl text-purple-900 mt-1">{stats.manager}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <p className="text-green-700 text-sm">{roleMap['Service Staff'].label}</p>
            <p className="text-2xl text-green-900 mt-1">{stats.serviceStaff}</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <p className="text-orange-700 text-sm">{roleMap.Chef.label}</p>
            <p className="text-2xl text-orange-900 mt-1">{stats.chef}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-blue-700 text-sm">{roleMap.Cleaner.label}</p>
            <p className="text-2xl text-blue-900 mt-1">{stats.cleaner}</p>
          </div>
        </div>

        ---

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm theo User ID, Restaurant ID, Loại NV..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as EmployeeType | 'all')}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          >
            <option value="all">Tất cả vai trò</option>
            {Object.keys(roleMap).map(role => (
              <option key={role} value={role}>{roleMap[role as EmployeeType].label}</option>
            ))}
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

      ---

      {/* Employees Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-gray-600">User ID</th>
                <th className="text-left py-4 px-6 text-gray-600">Vai trò</th>
                <th className="text-left py-4 px-6 text-gray-600">CN (ID)</th>
                <th className="text-left py-4 px-6 text-gray-600">Lương</th>
                <th className="text-left py-4 px-6 text-gray-600">Ngày vào làm</th>
                <th className="text-left py-4 px-6 text-gray-600">Giám sát (ID)</th>
                <th className="text-center py-4 px-6 text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((employee) => (
                <tr key={employee.User_ID} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 text-gray-900 font-medium">#{employee.User_ID}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleDisplay(employee.EmployeeType).color}`}>
                      {getRoleDisplay(employee.EmployeeType).label}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-900">#{employee.Restaurant_ID}</td>
                  <td className="py-4 px-6 text-green-700 font-medium">{formatCurrency(employee.Salary)}</td>
                  <td className="py-4 px-6 text-gray-900">{formatDate(employee.HireDate)}</td>
                  <td className="py-4 px-6 text-gray-900">
                    {employee.SupervisorID ? `#${employee.SupervisorID}` : '-'}
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
                        onClick={() => handleResetAccount(employee.User_ID)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Reset tài khoản"
                      >
                        <Key size={18} />
                      </button>
                      {/* Nút XÓA NHÂN VIÊN (ĐÃ THAY THẾ) */}
                      <button
                        onClick={() => handleDelete(employee.User_ID)} // Gọi hàm xóa mới
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa nhân viên"
                      >
                        <Trash size={18} /> {/* Icon thùng rác */}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedEmployees.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    Không tìm thấy nhân viên nào phù hợp.
                  </td>
                </tr>
              )}
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
                className={`px-4 py-2 rounded-lg ${currentPage === page
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

      {/* Add/Edit Modal (Giữ nguyên) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8">
            <h2 className="text-xl text-gray-900 mb-4">
              {editingEmployee ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
            </h2>


            <form onSubmit={handleModalSave}>
              <div className="grid grid-cols-2 gap-4">

                {/* User ID khi chỉnh sửa */}
                {editingEmployee && (
                  <div className="col-span-2">
                    <label className="block text-gray-700 mb-2">User ID</label>
                    <input
                      type="text"
                      name="UserID"
                      defaultValue={`#${editingEmployee.User_ID}`}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 outline-none"
                    />
                  </div>
                )}

                {/* User ID khi thêm mới */}
                {!editingEmployee && (
                  <div className="col-span-2">
                    <label className="block text-gray-700 mb-2">User ID</label>
                    <input
                      type="number"
                      name="User_ID"
                      placeholder="Nhập User ID (ID từ bảng User)"
                      required
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                          focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    />
                  </div>
                )}

                {/* Vai trò */}
                <div>
                  <label className="block text-gray-700 mb-2">Vai trò (EmployeeType)</label>
                  <select
                    name="EmployeeType"
                    defaultValue={editingEmployee?.EmployeeType}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                        focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  >
                    {Object.keys(roleMap).map(role => (
                      <option key={role} value={role}>
                        {roleMap[role as EmployeeType].label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Restaurant ID */}
                <div>
                  <label className="block text-gray-700 mb-2">Mã chi nhánh (Restaurant ID)</label>
                  <input
                    type="number"
                    name="RestaurantID"
                    defaultValue={editingEmployee?.Restaurant_ID}
                    placeholder="Mã CN"
                    required
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                        focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Salary */}
                <div>
                  <label className="block text-gray-700 mb-2">Mức lương (Salary)</label>
                  <input
                    type="number"
                    name="Salary"
                    defaultValue={editingEmployee?.Salary}
                    placeholder="Lương"
                    required
                    min="1000000"
                    step="100000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                        focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* SupervisorID */}
                <div>
                  <label className="block text-gray-700 mb-2">Giám sát (Supervisor ID)</label>
                  <input
                    type="number"
                    name="SupervisorID"
                    defaultValue={editingEmployee?.SupervisorID ?? ''}
                    placeholder="ID Giám sát (Để trống nếu không có)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                        focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Hire Date */}
                <div>
                  <label className="block text-gray-700 mb-2">Ngày vào làm (HireDate)</label>
                  <input
                    type="date"
                    name="HireDate"
                    defaultValue={editingEmployee?.HireDate
                      ? new Date(editingEmployee.HireDate).toISOString().split('T')[0]
                      : ''
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                        focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  {editingEmployee ? 'Cập nhật' : 'Thêm nhân viên'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}


    </div>
  );
}