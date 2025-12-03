import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

type DishCategory = 'main' | 'side' | 'drink' | 'dessert';

interface Dish {
  id: number;
  name: string;
  category: DishCategory;
  price: number;
  image?: string;
  available: boolean;
  description: string;
}

export function MenuManagement() {
  const [dishes, setDishes] = useState<Dish[]>([
    { id: 1, name: 'Phở bò', category: 'main', price: 75000, available: true, description: 'Phở bò Hà Nội truyền thống' },
    { id: 2, name: 'Bún chả', category: 'main', price: 70000, available: true, description: 'Bún chả Hà Nội' },
    { id: 3, name: 'Cơm tấm', category: 'main', price: 60000, available: true, description: 'Cơm tấm sườn bì chả' },
    { id: 4, name: 'Bánh mì', category: 'main', price: 30000, available: true, description: 'Bánh mì thịt pate' },
    { id: 5, name: 'Gỏi cuốn', category: 'side', price: 40000, available: true, description: 'Gỏi cuốn tôm thịt' },
    { id: 6, name: 'Nem rán', category: 'side', price: 45000, available: true, description: 'Nem rán giòn' },
    { id: 7, name: 'Trà đá', category: 'drink', price: 5000, available: true, description: 'Trà đá truyền thống' },
    { id: 8, name: 'Nước ngọt', category: 'drink', price: 15000, available: true, description: 'Coca Cola, Pepsi, 7Up' },
    { id: 9, name: 'Chè ba màu', category: 'dessert', price: 25000, available: true, description: 'Chè ba màu mát lạnh' },
    { id: 10, name: 'Bánh flan', category: 'dessert', price: 20000, available: true, description: 'Bánh flan caramel' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<DishCategory | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'category'>('name');

  const itemsPerPage = 6;

  const getCategoryText = (category: DishCategory) => {
    switch (category) {
      case 'main': return 'Món chính';
      case 'side': return 'Món phụ';
      case 'drink': return 'Đồ uống';
      case 'dessert': return 'Tráng miệng';
    }
  };

  const getCategoryColor = (category: DishCategory) => {
    switch (category) {
      case 'main': return 'bg-orange-100 text-orange-700';
      case 'side': return 'bg-green-100 text-green-700';
      case 'drink': return 'bg-blue-100 text-blue-700';
      case 'dessert': return 'bg-pink-100 text-pink-700';
    }
  };

  let filteredDishes = dishes.filter(dish => {
    const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || dish.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort
  filteredDishes = [...filteredDishes].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'category') return a.category.localeCompare(b.category);
    return 0;
  });

  const totalPages = Math.ceil(filteredDishes.length / itemsPerPage);
  const paginatedDishes = filteredDishes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (dish: Dish) => {
    setEditingDish(dish);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa món này?')) {
      setDishes(dishes.filter(d => d.id !== id));
    }
  };

  const handleToggleAvailable = (id: number) => {
    setDishes(dishes.map(d => d.id === id ? { ...d, available: !d.available } : d));
  };

  const handleAddNew = () => {
    setEditingDish(null);
    setShowModal(true);
  };

  const stats = {
    total: dishes.length,
    main: dishes.filter(d => d.category === 'main').length,
    side: dishes.filter(d => d.category === 'side').length,
    drink: dishes.filter(d => d.category === 'drink').length,
    dessert: dishes.filter(d => d.category === 'dessert').length,
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-6">Quản lý món ăn</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-sm">Tổng món</p>
            <p className="text-2xl text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <p className="text-orange-700 text-sm">Món chính</p>
            <p className="text-2xl text-orange-900 mt-1">{stats.main}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <p className="text-green-700 text-sm">Món phụ</p>
            <p className="text-2xl text-green-900 mt-1">{stats.side}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-blue-700 text-sm">Đồ uống</p>
            <p className="text-2xl text-blue-900 mt-1">{stats.drink}</p>
          </div>
          <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
            <p className="text-pink-700 text-sm">Tráng miệng</p>
            <p className="text-2xl text-pink-900 mt-1">{stats.dessert}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên món..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as DishCategory | 'all')}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          >
            <option value="all">Tất cả loại</option>
            <option value="main">Món chính</option>
            <option value="side">Món phụ</option>
            <option value="drink">Đồ uống</option>
            <option value="dessert">Tráng miệng</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'category')}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          >
            <option value="name">Sắp xếp: Tên</option>
            <option value="price">Sắp xếp: Giá</option>
            <option value="category">Sắp xếp: Loại</option>
          </select>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            Thêm món mới
          </button>
        </div>
      </div>

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {paginatedDishes.map((dish) => (
          <div key={dish.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 overflow-hidden">
            <div className="relative h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
              {dish.image ? (
                <ImageWithFallback src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="text-gray-400" size={64} />
              )}
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-sm ${getCategoryColor(dish.category)}`}>
                  {getCategoryText(dish.category)}
                </span>
              </div>
              {!dish.available && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-red-600 text-white px-4 py-2 rounded-lg">Hết món</span>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-lg text-gray-900 mb-1">{dish.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{dish.description}</p>
              <p className="text-xl text-orange-600 mb-4">{dish.price.toLocaleString('vi-VN')}đ</p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(dish)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit2 size={16} />
                  Sửa
                </button>
                <button
                  onClick={() => handleToggleAvailable(dish.id)}
                  className={`flex-1 px-3 py-2 rounded-lg transition-colors ${
                    dish.available 
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {dish.available ? 'Hết món' : 'Còn món'}
                </button>
                <button
                  onClick={() => handleDelete(dish.id)}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8">
            <h2 className="text-xl text-gray-900 mb-4">
              {editingDish ? 'Chỉnh sửa món' : 'Thêm món mới'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Tên món</label>
                <input
                  type="text"
                  defaultValue={editingDish?.name}
                  placeholder="Nhập tên món"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Mô tả</label>
                <textarea
                  defaultValue={editingDish?.description}
                  placeholder="Nhập mô tả món ăn"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Loại món</label>
                  <select
                    defaultValue={editingDish?.category}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  >
                    <option value="main">Món chính</option>
                    <option value="side">Món phụ</option>
                    <option value="drink">Đồ uống</option>
                    <option value="dessert">Tráng miệng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Giá (VNĐ)</label>
                  <input
                    type="number"
                    defaultValue={editingDish?.price}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Hình ảnh</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 transition-colors cursor-pointer">
                  <ImageIcon className="mx-auto text-gray-400 mb-2" size={48} />
                  <p className="text-gray-600">Nhấn để tải lên hình ảnh</p>
                  <p className="text-sm text-gray-500 mt-1">hoặc kéo thả vào đây</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="available"
                  defaultChecked={editingDish?.available ?? true}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="available" className="text-gray-700">Còn phục vụ</label>
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
                  {editingDish ? 'Cập nhật' : 'Thêm món'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
