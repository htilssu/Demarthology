import React, { useState } from "react";
import { Menu, Bell, ChevronDown, LogOut, User, History, Clock, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import useNotificationController from "../controllers/useNotificationController";

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
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
    getTotalNotificationsCount
  } = useNotificationController();

  const [openMenu, setOpenMenu] = useState(false);

  const navItems = [
    { name: "Trang chủ", path: "/" },
    {
      name: "Về chúng tôi",
      dropdown: [
        { name: "Giới thiệu", path: "/introduce" },
        { name: "Liên hệ", path: "/contact" },
        { name: "Đọc báo / Tin tức y khoa", path: "/articles" },
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

        {/* Desktop Nav */}
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

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications - only show when authenticated */}
          {isAuthenticated && (
            <button
              className="relative p-2 rounded-full hover:bg-gray-100 transition-all"
              onClick={() => setOpenNotifications(!openNotifications)}
            >
              <Bell className="w-6 h-6 text-[#145566]" />
              {hasUnreadNotifications && (
                <span className="absolute top-1 right-1 block w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>
          )}

          {/* User dropdown */}
          <div className="relative group" ref={notificationRef}>
            {isAuthenticated ? (
              // Show user profile when authenticated
              <button 
                className="flex items-center space-x-2 bg-gradient-to-r from-[#145566] to-[#145569] text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300"
                onClick={() => setOpenMenu(!openMenu)}
              >
                <img 
                  src={user?.avatarUrl || "/avatar.webp"} 
                  alt="User" 
                  className="w-8 h-8 rounded-full border-2 border-white object-cover" 
                />
                <span className="hidden md:inline text-sm font-medium">
                  {user?.name || 'Người dùng'}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
            ) : (
              // Show login button when not authenticated
              <Link 
                to="/login" 
                className="flex items-center space-x-2 bg-gradient-to-r from-[#145566] to-[#145569] text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <LogIn className="w-5 h-5" />
                <span className="hidden md:inline text-sm font-medium">Đăng nhập</span>
              </Link>
            )}

            {/* User dropdown menu */}
            {isAuthenticated && openMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 py-2 z-50">
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setOpenMenu(false)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Hồ sơ cá nhân
                </Link>
                <Link
                  to="/medical-history"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setOpenMenu(false)}
                >
                  <History className="w-4 h-4 mr-2" />
                  Lịch sử y tế
                </Link>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={async () => {
                    setOpenMenu(false);
                    await logout();
                  }}
                  className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification Panel for authenticated users */}
      {isAuthenticated && (openNotifications || isClosing) && (
        <div className={`fixed top-20 right-4 w-80 h-[420px] bg-white shadow-2xl rounded-xl border border-gray-200 flex flex-col z-50 ${isClosing ? "animate-slideOutRight" : "animate-slideInRight"}`}>
          <div className="flex items-center justify-center p-4 border-b border-gray-200 bg-[#26667F] text-white rounded-t-xl">
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
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-center py-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-[#26667F] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600">Đang tải...</span>
                </div>
              </div>
            )}

            {notifications.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Không có thông báo nào</p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 p-3">
            {!showAll && hasMore && (
              <button
                onClick={() => setShowAll(true)}
                className="w-full text-center text-sm text-[#26667F] hover:text-[#1e5066] font-medium"
              >
                Xem tất cả thông báo
              </button>
            )}
            {showAll && (
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Tổng: {getTotalNotificationsCount()} thông báo</span>
                <button
                  onClick={() => {
                    setNotifications([]);
                    setHasMore(true);
                    setPage(1);
                    setShowAll(false);
                  }}
                  className="text-[#26667F] hover:text-[#1e5066] font-medium"
                >
                  Làm mới
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
