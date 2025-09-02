import React, { useState } from "react";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage("Vui lòng nhập địa chỉ email");
      return;
    }

    if (!email.includes('@')) {
      setStatus('error');
      setMessage("Vui lòng nhập địa chỉ email hợp lệ");
      return;
    }

    setIsLoading(true);
    setStatus('idle');
    setMessage("");

    try {
      // Call the forgot password API
      const response = await fetch(`/api/forgot-password?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setStatus('success');
        setMessage("Đã gửi email hướng dẫn reset mật khẩu đến địa chỉ email của bạn.");
        setEmail("");
      } else {
        setStatus('error');
        setMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } catch (error) {
      setStatus('error');
      setMessage("Không thể kết nối đến server. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 mt-16">
        <div className="max-w-md mx-auto">
          {/* Back Link */}
          <Link 
            to="/" 
            className="flex items-center text-[#145566] hover:text-[#0f3f44] mb-6 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Quay lại trang chủ
          </Link>

          {/* Form Container */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#145566] rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Quên mật khẩu</h1>
              <p className="text-gray-600">
                Nhập địa chỉ email của bạn và chúng tôi sẽ gửi hướng dẫn reset mật khẩu
              </p>
            </div>

            {/* Status Messages */}
            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-green-700 text-sm">{message}</p>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{message}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#145566] focus:border-transparent"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#145566] text-white py-3 px-4 rounded-lg hover:bg-[#0f3f44] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Đang gửi...
                  </div>
                ) : (
                  "Gửi email reset mật khẩu"
                )}
              </button>
            </form>

            {/* Additional Links */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Nhớ mật khẩu rồi?{" "}
                <Link to="/" className="text-[#145566] hover:text-[#0f3f44] font-medium">
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ForgotPassword;