import React, { useState } from "react";
import { Menu, Bell, ChevronDown, LogOut, User, History, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import useNotificationController from "../controllers/useNotificationController";

const Navbar: React.FC = () => {
  const {
    openNotifications,
    isClosing,
    notifications,
    loading,
    hasMore,
    showAll,
    hasUnreadNotifications,
    notificationRef,
    setOpenNotifications,
    handleScroll,
    handleNotificationClickLocal,
    // handleCloseNotifications,
    setNotifications,
    setHasMore,
    setPage,
    setShowAll,
    getTotalNotificationsCount,
    mockNotifications
  } = useNotificationController();

  const [openMenu, setOpenMenu] = useState(false);

  const navItems = [
    { name: "Trang chủ", path: "/" },
    {
      name: "Về chúng tôi",
      dropdown: [
        { name: "Giới thiệu", path: "/introduce" },
        { name: "Liên hệ", path: "/contact" },
      ]
    },
    { name: "Cộng đồng", path: "/community" },
    {
      name: "Dịch vụ",
      dropdown: [
        { name: "Chẩn đoán bệnh", path: "/diagnosis" },
        { name: "So sánh Trước & Sau", path: "/before-after" },
        { name: "Theo dõi tiến trình", path: "/" },
        { name: "Cảnh báo UV", path: "/uv" },
        { name: "Tìm kiếm thông tin", path: "/" },
        { name: "Gợi ý bệnh viện", path: "/hospital" },
      ]
    },
  ];

  return (
    <header className="fixed h-[80px] top-0 left-0 right-0 backdrop-blur-md bg-white/80 border-b border-white/20 z-50 transition-all duration-300">
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
            <h1 className="text-l font-bold text-[#145566]">Dermatology</h1>
            <p className="text-xs text-gray-500">Smart Diagnosis</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-2 text-xs whitespace-nowrap">
  {navItems.map((item, index) =>
    item.dropdown ? (
      <div key={index} className="relative group">
        <button className="flex items-center text-gray-700 hover:text-[#145566] transition-all duration-300 text-xs whitespace-nowrap">
          {item.name}
          <ChevronDown className="ml-1 w-3 h-3" />
        </button>
        <div className="absolute top-full left-0 mt-1 w-40 bg-white shadow-lg rounded-md border border-gray-100 p-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          {item.dropdown.map((sub, i) => (
            <Link
              key={i}
              to={sub.path}
              className="block px-2 py-1 text-gray-700 text-xs whitespace-nowrap rounded-md hover:bg-gray-100 hover:text-[#145566] transition-all duration-200"
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
        className="text-gray-700 hover:text-[#145566] transition-all duration-300 relative group text-xs whitespace-nowrap"
      >
        {item.name}
        <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-[#145566] to-indigo-600 transition-all duration-300 group-hover:w-full"></span>
      </Link>
    )
  )}
</nav>


        {/* Right side */}
        <div className="flex items-center space-x-4">
          <button
            className="relative p-2 rounded-full hover:bg-gray-100 transition-all"
            onClick={() => setOpenNotifications(!openNotifications)}
          >
            <Bell className="w-6 h-6 text-[#145566]" />
            {hasUnreadNotifications && (
              <span className="absolute top-1 right-1 block w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {/* User dropdown + notifications */}
          <div className="relative group" ref={notificationRef}>
            <button className="flex items-center space-x-2 bg-gradient-to-r from-[#145566] to-[#145569] text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300">
              <img src="/avatar.webp" alt="User" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
              <span className="hidden md:inline text-sm font-medium">Người dùng</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Notification Panel */}
            {(openNotifications || isClosing) && (
              <div className={`absolute right-0 top-full mt-2 w-80 h-[420px] bg-white shadow-2xl rounded-l-xl border border-gray-200 flex flex-col z-50 ${isClosing ? "animate-slideOutRight" : "animate-slideInRight"}`}>
                <div className="flex items-center justify-center p-4 border-b border-gray-200 bg-[#26667F] text-white rounded-tl-xl">
                  <h3 className="text-lg font-semibold">Thông báo</h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3" onScroll={handleScroll}>
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      onClick={e => handleNotificationClickLocal(notification, e)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                        notification.read ? "bg-gray-50 border-gray-200 hover:bg-gray-100" : "bg-blue-50 border-blue-200 hover:bg-blue-100"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`font-medium text-sm ${notification.read ? "text-gray-700" : "text-blue-900"}`}>
                            {notification.title}
                          </h4>
                          <p className={`text-xs mt-1 ${notification.read ? "text-gray-600" : "text-blue-700"}`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {notification.time}
                          </div>
                        </div>
                        {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>}
                      </div>
                    </div>
                  ))}

                  {loading && <div className="flex justify-center py-4">Đang tải...</div>}

                  {!hasMore && notifications.length > 0 && !showAll && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      Đã hiển thị tất cả thông báo ({notifications.length}/{getTotalNotificationsCount()})
                    </div>
                  )}

                  {showAll && (
                    <div className="text-center py-4 text-green-600 text-sm font-medium">
                      ✅ Đã hiển thị tất cả {getTotalNotificationsCount()} thông báo
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setNotifications([...mockNotifications]);
                      setHasMore(false);
                      setPage(1);
                      setShowAll(true);
                    }}
                    className="w-full bg-[#26667F] text-white py-2 px-4 rounded-lg hover:bg-[#1e4f63] transition-colors text-sm font-medium"
                  >
                    {showAll ? `Đã hiển thị tất cả (${getTotalNotificationsCount()})` : `Xem tất cả (${getTotalNotificationsCount()})`}
                  </button>
                </div>
              </div>
            )}

            {/* User Dropdown */}
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
              <button className="w-full text-left flex items-center px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-b-xl">
                <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {openMenu && (
        <div className="lg:hidden bg-white shadow-md border-t border-gray-100 animate-slideDown">
          <div className="flex flex-col p-4 space-y-3">
            {navItems.map((item, index) =>
              item.dropdown ? (
                <div key={index} className="flex flex-col space-y-2">
                  <span className="font-semibold text-gray-700">{item.name}</span>
                  {item.dropdown.map((sub, i) => (
                    <Link key={i} to={sub.path} className="pl-4 text-gray-600 hover:text-[#145566]" onClick={() => setOpenMenu(false)}>
                      {sub.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link key={index} to={item.path} className="text-gray-700 hover:text-[#145566]" onClick={() => setOpenMenu(false)}>
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
