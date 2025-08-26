import React, { useState } from "react";
import { Menu, Bell, ChevronDown, LogOut, User, History } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const navItems = [
    { name: "Trang chủ", path: "/" },
    { 
      name: "Về chúng tôi",
      dropdown: [
        { name: "Giới thiệu", path: "/introduce" },
        { name: "Liên hệ", path: "/contact" },
        { name: "Đọc báo / Tin tức y khoa", path: "/" },
      ]
    },
    { name: "Cộng đồng", path: "/" },
    { 
      name: "Dịch vụ", 
      dropdown: [
        { name: "Chẩn đoán bệnh", path: "/" },
        { name: "Theo dõi tiến trình", path: "/" },
        { name: "Cảnh báo UV", path: "/" },
        { name: "Tìm kiếm thông tin bệnh theo tên", path: "/" },
        { name: "Gợi ý bệnh viện / phòng khám", path: "/" },
      ]
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 backdrop-blur-md bg-white/80 border-b border-white/20 z-50 transition-all duration-300">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-all"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <Menu className="w-6 h-6 text-[#145566]" />
          </button>
          <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain" />
          <div>
            <h1 className="text-xl font-bold text-[#145566]">Dermatology</h1>
            <p className="text-xs text-gray-500">Smart Diagnosis</p>
          </div>
        </div>

        <nav className="hidden lg:flex items-center space-x-8">
          {navItems.map((item, index) =>
            item.dropdown ? (
              <div key={index} className="relative group">
                <button className="flex items-center text-gray-700 hover:text-[#145566] transition-all duration-300">
                  {item.name}
                  <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-lg rounded-lg border border-gray-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {item.dropdown.map((sub, i) => (
                    <Link
                      key={i}
                      to={sub.path}
                      className="block px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-[#145566] transition-all duration-200"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={index}
                to={item.path}
                className="text-gray-700 hover:text-[#145566] transition-all duration-300 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#145566] to-indigo-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition-all">
            <Bell className="w-6 h-6 text-[#145566]" />
            <span className="absolute top-1 right-1 block w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>
          <div className="relative group">
            <button className="flex items-center space-x-2 bg-gradient-to-r from-[#145566] to-[#145569] text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300">
              <img
                src="/avatar.webp"
                alt="User"
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
              />
              <span className="hidden md:inline text-sm font-medium">Người dùng</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <Link
                to="/profile"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-xl"
              >
                <User className="w-4 h-4 mr-2" /> Hồ sơ bệnh án
              </Link>
              <Link
                to="/medical-history"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <History className="w-4 h-4 mr-2" /> Lịch sử bệnh án
              </Link>
              <button
                className="w-full text-left flex items-center px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-b-xl"
              >
                <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {openMenu && (
        <div className="lg:hidden bg-white shadow-md border-t border-gray-100 animate-slideDown">
          <div className="flex flex-col p-4 space-y-3">
            {navItems.map((item, index) =>
              item.dropdown ? (
                <div key={index} className="flex flex-col space-y-2">
                  <span className="font-semibold text-gray-700">{item.name}</span>
                  {item.dropdown.map((sub, i) => (
                    <Link
                      key={i}
                      to={sub.path}
                      className="pl-4 text-gray-600 hover:text-[#145566] transition-all"
                      onClick={() => setOpenMenu(false)}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={index}
                  to={item.path}
                  className="text-gray-700 hover:text-[#145566] transition-all duration-300"
                  onClick={() => setOpenMenu(false)}
                >
                  {item.name}
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
