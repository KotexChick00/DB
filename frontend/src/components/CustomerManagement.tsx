import { useState, useEffect } from "react";
import { Search, Eye, Download } from "lucide-react";

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

export function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal tổng chi tiêu
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<TotalSpentResult | null>(null);

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
        setModalData(data);
        setShowModal(true);
      })
      .catch((err) => console.error("Lỗi tổng chi tiêu:", err));
  };

  // ---- FILTER ----
  const filtered = customers.filter(
    (c) =>
      c.FName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(c.Customer_ID).includes(searchTerm)
  );

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

        rows += `${c.Customer_ID},${c.User_ID ?? ""},${c.FName},${c.Phone},${
          spent.totalSpent
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

      {/* Search */}
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

        {/* CSV Buttons */}
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

      {/* TABLE */}
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
                    <Eye size={18} />
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

      {/* ---- MODAL HIỂN THỊ TỔNG CHI TIÊU ---- */}
      {showModal && modalData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Tổng chi tiêu khách hàng
            </h2>

            <p className="text-lg text-gray-800">
              Khách hàng <b>#{modalData.customerID}</b> đã chi:
            </p>

            <p className="text-3xl font-bold text-green-600 mt-3">
              {modalData.totalSpent.toLocaleString("vi-VN")} đ
            </p>

            <div className="mt-6 text-right">
              <button
                onClick={() => setShowModal(false)}
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
