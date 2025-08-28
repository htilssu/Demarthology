import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import MotionWrapper from "../components/MotionWrapper";
import MedicalParticles from "../components/MedicalParticles";
import { MotionCard, MotionButton } from "../components/MotionComponents";
const Contact: React.FC = () => {
  return (
    <div className="bg-white min-h-screen relative">
      <MedicalParticles density="light" />
      {/* Navbar */}
      <Navbar />

      {/* Banner */}
      <MotionWrapper animation="fadeIn" duration={0.8}>
        <div className="relative w-full h-64 bg-gray-200 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1521791055366-0d553872125f"
            alt="banner-vị-trí"
            className="absolute w-full h-full object-cover"
          />
          <div className="absolute w-full h-full bg-black/40" />
          <MotionWrapper animation="zoomIn" delay={0.3}>
            <h1 className="relative text-white text-4xl font-bold z-10">
              ĐỊA CHỈ
            </h1>
          </MotionWrapper>
        </div>
      </MotionWrapper>

      {/* Bản đồ + Form liên hệ */}
      <div className="container mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 relative z-10">
        {/* Google Map */}
        <MotionWrapper animation="slideLeft" delay={0.2}>
          <MotionCard className="w-full h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.9654069380636!2d106.72187861526066!3d10.729257492352708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317525408c5820a3%3A0xc57a52e96aa0b8a1!2zUXXhuq1uIDcsIFRQLiBIQ00!5e0!3m2!1svi!2s!4v1692872390030!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              title="Google Map Quận 7"
            ></iframe>
          </MotionCard>
        </MotionWrapper>

        {/* Form liên hệ */}
        <MotionWrapper animation="slideRight" delay={0.4}>
          <MotionCard className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Liên hệ với chúng tôi!</h2>
            <p className="text-gray-600 mb-6">
              Hãy cho chúng tôi biết thông tin để được hỗ trợ tốt nhất.
            </p>
            <form className="space-y-4">
              <MotionWrapper animation="slideUp" delay={0.6}>
                <input
                  type="text"
                  placeholder="Họ và tên"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#145566] transition-all"
                />
              </MotionWrapper>
              <MotionWrapper animation="slideUp" delay={0.7}>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#145566] transition-all"
                />
              </MotionWrapper>
              <MotionWrapper animation="slideUp" delay={0.8}>
                <input
                  type="tel"
                  placeholder="Số điện thoại"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#145566] transition-all"
                />
              </MotionWrapper>
              <MotionWrapper animation="slideUp" delay={0.9}>
                <textarea
                  placeholder="Nội dung..."
                  rows={4}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#145566] transition-all"
                ></textarea>
              </MotionWrapper>
              <MotionWrapper animation="slideUp" delay={1.0}>
                <MotionButton
                  type="submit"
                  className="bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition"
                >
                  Gửi ngay
                </MotionButton>
              </MotionWrapper>
            </form>
          </MotionCard>
        </MotionWrapper>
      </div>

      <div className="container mx-auto px-4 py-12 text-center grid md:grid-cols-3 gap-8">
        <div>
          <p className="font-semibold">Địa chỉ</p>
          <p>Quận 7, TP Hồ Chí Minh, Việt Nam</p>
        </div>
        <div>
          <p className="font-semibold">Email</p>
          <p>lienhe@ivyhealthgroup.vn</p>
        </div>
        <div>
          <p className="font-semibold">Điện thoại</p>
          <p>+84 28 1234 5678</p>
        </div>
      </div>
        <Footer/>
    
    </div>
  );
};

export default Contact;
