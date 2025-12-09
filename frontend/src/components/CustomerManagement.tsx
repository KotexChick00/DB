import { useState, useEffect } from "react";
// Đã thêm X và XCircle để sử dụng trong modal
import { Search, List, Download, BadgeDollarSign, X, XCircle } from "lucide-react";

// ---- KIỂU DỮ LIỆU ĐÚNG THEO BACKEND ----
interface Customer {
  Customer_ID: number;
  User_ID: number | null;
  FName: string;
  Phone: string;
}

interface TotalSpentResult {
  customerID: number;
  totalSpent: number;
}

// 1. KIỂU DỮ LIỆU CHO ĐƠN HÀNG (Dựa trên kết quả curl)
interface Order {
  Order_ID: number;
  FName: string;
  Status: string;
  TimeCreated: string;
  Channel: string;
}

export function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal tổng chi tiêu
  const [showSpentModal, setShowSpentModal] = useState(false); // Đổi tên state để rõ ràng hơn
  const [spentModalData, setSpentModalData] = useState<TotalSpentResult | null>(null); // Đổi tên state để rõ ràng hơn

  // 2. STATE CHO MODAL ĐƠN HÀNG
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  // Lưu tên khách hàng để hiển thị tiêu đề, và danh sách đơn hàng
  const [ordersModalData, setOrdersModalData] = useState<{
    customerName: string;
    orders: Order[];
  } | null>(null);

  // ---- FETCH DANH SÁCH KHÁCH ----
  useEffect(() => {
    fetch("/api/customer/all")
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error("Lỗi tải danh sách KH:", err));
  }, []);

  // ---- XEM TỔNG CHI TIÊU ----
  const handleViewTotalSpent = (id: number) => {
    fetch(`/api/customer/${id}/total-spent`)
      .then((res) => res.json())
      .then((data) => {
        setSpentModalData(data); // Dùng state mới
        setShowSpentModal(true); // Dùng state mới
      })
      .catch((err) => console.error("Lỗi tổng chi tiêu:", err));
  };

  // ---- XEM ĐƠN HÀNG (Đã Sửa) ----
  const handleViewOrders = (name: string) => {
    fetch(`/api/orders/customer?customerName=${encodeURIComponent(name)}`)
      .then(res => res.json())
      .then((data: Order[]) => {
        setOrdersModalData({
          customerName: name,
          orders: data,
        });
        setShowOrdersModal(true); // Mở modal đơn hàng
      })
      .catch(err => {
        console.error("Lỗi khi gọi orders:", err);
        alert(`Lỗi khi tải đơn hàng của khách ${name}.`);
      });
  };

  // ---- FILTER (Giữ nguyên) ----
  const filtered = customers.filter(
    (c) =>
      c.FName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(c.Customer_ID).includes(searchTerm)
  );

  // ... (Các hàm exportCSV, exportCSVWithSpent, downloadCSV giữ nguyên)
  // ---- CSV EXPORT (basic) ----

  const exportCSV = () => {

    const header = "Customer_ID,User_ID,FName,Phone\n";



    const rows = customers

      .map((c) => `${c.Customer_ID},${c.User_ID ?? ""},${c.FName},${c.Phone}`)

      .join("\n");



    const csvContent = header + rows;



    downloadCSV(csvContent, "customers.csv");

  };



  // ---- CSV EXPORT (kèm totalSpent) ----

  const exportCSVWithSpent = async () => {

    let header = "Customer_ID,User_ID,FName,Phone,Total_Spent\n";

    let rows = "";



    for (const c of customers) {

      try {

        const res = await fetch(

          `/api/customer/${c.Customer_ID}/total-spent`

        );

        const spent: TotalSpentResult = await res.json();



        rows += `${c.Customer_ID},${c.User_ID ?? ""},${c.FName},${c.Phone},${spent.totalSpent

          }\n`;

      } catch (err) {

        rows += `${c.Customer_ID},${c.User_ID ?? ""},${c.FName},${c.Phone},0\n`;

      }

    }



    downloadCSV(header + rows, "customers_with_total_spent.csv");

  };



  // ---- Helper download ----

  const downloadCSV = (content: string, filename: string) => {

    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);



    const link = document.createElement("a");

    link.href = url;

    link.setAttribute("download", filename);

    link.click();

  };




  return (
    <div className="p-8">
      <h1 className="text-3xl text-gray-900 mb-6">Quản lý khách hàng</h1>

      {/* Search & CSV Buttons (Giữ nguyên) */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc ID..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Download size={18} />
          Xuất CSV
        </button>

        <button
          onClick={exportCSVWithSpent}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Download size={18} />
          Xuất CSV kèm chi tiêu
        </button>
      </div>

      {/* TABLE (Giữ nguyên) */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-3 px-5">Customer ID</th>
              <th className="text-left py-3 px-5">User ID</th>
              <th className="text-left py-3 px-5">Tên</th>
              <th className="text-left py-3 px-5">Điện thoại</th>
              <th className="text-center py-3 px-5">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr key={c.Customer_ID} className="border-b hover:bg-gray-50">
                <td className="py-3 px-5">#{c.Customer_ID}</td>
                <td className="py-3 px-5">{c.User_ID ?? "-"}</td>
                <td className="py-3 px-5">{c.FName}</td>
                <td className="py-3 px-5">{c.Phone}</td>

                <td className="py-3 px-5 text-center">
                  <button
                    onClick={() => handleViewTotalSpent(c.Customer_ID)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Xem tổng chi tiêu"
                  >
                    <BadgeDollarSign size={18} />
                  </button>

                  <button
                    onClick={() => handleViewOrders(c.FName)}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                    title="Xem đơn hàng khách này"
                  >
                    <List size={18} />
                  </button>

                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  Không tìm thấy khách hàng.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---- MODAL HIỂN THỊ TỔNG CHI TIÊU (Đã đổi tên state) ---- */}
      {showSpentModal && spentModalData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Tổng chi tiêu khách hàng
            </h2>

            <p className="text-lg text-gray-800">
              Khách hàng <b>#{spentModalData.customerID}</b> đã chi:
            </p>

            <p className="text-3xl font-bold text-green-600 mt-3">
              {spentModalData.totalSpent.toLocaleString("vi-VN")} đ
            </p>

            <div className="mt-6 text-right">
              <button
                onClick={() => setShowSpentModal(false)}
                className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. ---- MODAL HIỂN THỊ DANH SÁCH ĐƠN HÀNG (Mới) ---- */}
      {showOrdersModal && ordersModalData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h2 className="text-xl font-bold text-gray-900">
                Đơn hàng của khách: {ordersModalData.customerName}
              </h2>
              <button
                onClick={() => setShowOrdersModal(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {ordersModalData.orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <XCircle className="mx-auto mb-2 text-red-400" size={32} />
                <p>Không tìm thấy đơn hàng nào của khách hàng này.</p>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="text-left py-3 px-4 text-gray-600 text-sm">Mã đơn</th>
                      <th className="text-left py-3 px-4 text-gray-600 text-sm">Thời gian tạo</th>
                      <th className="text-left py-3 px-4 text-gray-600 text-sm">Kênh</th>
                      <th className="text-left py-3 px-4 text-gray-600 text-sm">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {ordersModalData.orders.map((order) => (
                      <tr key={order.Order_ID} className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-orange-600">#{order.Order_ID}</td>
                        <td className="py-3 px-4 text-gray-900">
                          {new Date(order.TimeCreated).toLocaleString('vi-VN')}
                        </td>
                        <td className="py-3 px-4 text-gray-900">{order.Channel}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.Status === 'Completed' ? 'bg-green-100 text-green-700' :
                              order.Status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                            {order.Status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6 text-right">
              <button
                onClick={() => setShowOrdersModal(false)}
                className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}