import React, { useState, useEffect, useRef } from "react";
import { Menu, Bell, ChevronDown, LogOut, User, History, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import {
  mockNotifications,
  getNotificationsWithPagination,
  hasMoreNotifications,
  getTotalNotificationsCount,
  type Notification
} from "../data";
import { useNotification } from "../contexts/NotificationContext";

const Navbar: React.FC = () => {
  const { handleNotificationClick, showModal } = useNotification();
  const [openMenu, setOpenMenu] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Check if there are unread notifications from all data
  const hasUnreadNotifications = mockNotifications.some(notification => !notification.read);

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



  // Load notifications with lazy loading
  const loadNotifications = async (pageNum: number = 1) => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Use helper function to get notifications with pagination (5 items per page)
    const newNotifications = getNotificationsWithPagination(pageNum, 5);

    if (pageNum === 1) {
      setNotifications(newNotifications);
    } else {
      setNotifications(prev => [...prev, ...newNotifications]);
    }

    // Check if there are more notifications to load
    const hasMore = hasMoreNotifications(pageNum, 5);
    setHasMore(hasMore);
    setPage(pageNum);
    setLoading(false);

    console.log(`Loaded page ${pageNum}: ${newNotifications.length} items, hasMore: ${hasMoreNotifications}`);
  };

  // Handle scroll for lazy loading
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10 && !loading && hasMore) {
      loadNotifications(page + 1);
    }
  };

  // Load initial notifications when panel opens
  useEffect(() => {
    if (openNotifications && notifications.length === 0) {
      loadNotifications(1);
    }
  }, [openNotifications, notifications.length]);

  // Handle notification close with animation
  const handleCloseNotifications = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpenNotifications(false);
      setIsClosing(false);
      // Reset states when closing
      setNotifications([]);
      setHasMore(true);
      setPage(1);
      setShowAll(false);
    }, 300);
  };

  // Handle notification click
  const handleNotificationClickLocal = (notification: Notification, e: React.MouseEvent) => {
    // Prevent event bubbling to avoid closing the notification panel
    e.stopPropagation();

    // Mark as read if not already read
    if (!notification.read) {
      // Update local notifications state
      setNotifications(prev =>
        prev.map(n =>
          n.id === notification.id ? { ...n, read: true } : n
        )
      );

      // Update the original mock data to persist the read status
      const notificationIndex = mockNotifications.findIndex(n => n.id === notification.id);
      if (notificationIndex !== -1) {
        mockNotifications[notificationIndex].read = true;
      }
    }

    // Call context handler
    handleNotificationClick(notification);
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close notification panel if modal is open
      if (showModal) return;

      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        handleCloseNotifications();
      }
    };

    if (openNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openNotifications, showModal]);

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
          <button
            className="relative p-2 rounded-full hover:bg-gray-100 transition-all"
            onClick={() => setOpenNotifications(!openNotifications)}
          >
            <Bell className="w-6 h-6 text-[#145566]" />
            {hasUnreadNotifications && (
              <span className="absolute top-1 right-1 block w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          <div className="relative group" ref={notificationRef}>
            <button className="flex items-center space-x-2 bg-gradient-to-r from-[#145566] to-[#145569] text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300">
              <img
                src="/avatar.webp"
                alt="User"
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
              />
              <span className="hidden md:inline text-sm font-medium">Người dùng</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Notification Panel */}
            {(openNotifications || isClosing) && (
              <div className={`absolute right-0 top-full mt-2 w-80 h-[420px] bg-white shadow-2xl rounded-l-xl border border-gray-200 flex flex-col z-50 ${isClosing ? 'animate-slideOutRight' : 'animate-slideInRight'
                }`}>
                {/* Header */}
                <div className="flex items-center justify-center p-4 border-b border-gray-200 bg-[#26667F] text-white rounded-tl-xl">
                  <h3 className="text-lg font-semibold">Thông báo</h3>
                </div>

                {/* Notifications List */}
                <div
                  className="flex-1 overflow-y-auto p-4 space-y-3"
                  onScroll={handleScroll}
                >
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={(e) => handleNotificationClickLocal(notification, e)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md ${notification.read
                          ? 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                        }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`font-medium text-sm ${notification.read ? 'text-gray-700' : 'text-blue-900'
                            }`}>
                            {notification.title}
                          </h4>
                          <p className={`text-xs mt-1 ${notification.read ? 'text-gray-600' : 'text-blue-700'
                            }`}>
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
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#26667F]"></div>
                        <span className="text-sm text-gray-500">Đang tải thêm...</span>
                      </div>
                    </div>
                  )}

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

                {/* Footer */}
                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event bubbling
                      // Load all notifications instead of closing
                      setNotifications([...mockNotifications]); // Create a copy to trigger re-render
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
              <Link
                to="/forgot-password"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3a1 1 0 011-1h2.586l6.243-6.243A6 6 0 0121 9z" />
                </svg>
                Quên mật khẩu
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
