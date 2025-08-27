import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import MotionWrapper from "../components/MotionWrapper";
import MedicalParticles from "../components/MedicalParticles";
import "../styles/motion.css";

const Introduce: React.FC = () => {
  return (
    <div className="bg-white min-h-screen relative">
      <MedicalParticles density="medium" />
      <Navbar />

      <MotionWrapper animation="fadeIn" duration={0.8}>
        <div className="relative w-full h-64 bg-gray-200 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1521791055366-0d553872125f"
            alt="dermatology-banner"
            className="absolute w-full h-full object-cover"
          />
          <div className="absolute w-full h-full bg-black/40" />
          <MotionWrapper animation="zoomIn" delay={0.3}>
            <h1 className="relative text-white text-4xl font-bold z-10">
              CHẨN ĐOÁN DA LIỄU BẰNG AI
            </h1>
          </MotionWrapper>
        </div>
      </MotionWrapper>

      <div className="container mx-auto px-4 py-16 space-y-12 relative z-10">
        <MotionWrapper animation="slideUp" delay={0.2}>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <MotionWrapper animation="slideLeft" delay={0.4}>
              <img
                src="image6.png"
                alt="dermatology-check"
                className="rounded-lg shadow-md motion-card"
              />
            </MotionWrapper>
            <MotionWrapper animation="slideRight" delay={0.6}>
              <div>
              <h2 className="text-2xl font-semibold mb-4 text-[#145566]">
                Ứng dụng AI hỗ trợ chẩn đoán da liễu
                </h2>
                <p className="text-gray-600 mb-4">
                Ứng dụng của chúng tôi được phát triển dựa trên công nghệ Trí tuệ nhân tạo hiện đại,
                đã được huấn luyện trên bộ dữ liệu hơn <span className="font-semibold">200.000+</span> 
                hình ảnh da liễu đa dạng. 
                Nhờ đó, hệ thống có khả năng phân tích hình ảnh da một cách toàn diện, nhận diện chính xác 
                các vấn đề thường gặp như mụn trứng cá, viêm da, nấm da, dị ứng, cũng như hỗ trợ phát hiện 
                sớm các dấu hiệu nghi ngờ ung thư da.
                </p>
                <p className="text-gray-600 mb-4">
                Không chỉ dừng lại ở việc đưa ra gợi ý chẩn đoán, ứng dụng còn đóng vai trò như một 
                công cụ hỗ trợ đắc lực cho cả bác sĩ và bệnh nhân: giúp bác sĩ tiết kiệm thời gian 
                trong việc sàng lọc và theo dõi tiến triển bệnh, đồng thời mang lại cho bệnh nhân 
                sự an tâm nhờ việc được cảnh báo sớm các vấn đề tiềm ẩn. 
                </p>
                <button className="bg-[#145566] text-white px-6 py-3 rounded-lg hover:bg-[#0f3a44] transition motion-button">
                  Trải nghiệm ngay
                </button>
              </div>
            </MotionWrapper>
          </div>
        </MotionWrapper>

        <MotionWrapper animation="slideUp" delay={0.8}>
          <div className="grid md:grid-cols-2 gap-8 items-center">
          <MotionWrapper animation="slideLeft" delay={1.0}>
            <div>
                <h2 className="text-2xl font-semibold mb-4 text-[#145566]">
                Công nghệ sử dụng & Lợi ích
                </h2>
                <ul className="text-gray-600 space-y-2 list-disc pl-6">
                <li>
                    <strong>Multi-modal RAG:</strong> Kết hợp hình ảnh da liễu và dữ liệu văn bản y khoa để đưa ra chẩn đoán chính xác và có dẫn chứng.
                </li>
                <li>
                    <strong>Mô hình thị giác (ViT, CLIP):</strong> Trích xuất đặc trưng từ ảnh da liễu, phân biệt rõ ràng giữa các bệnh lý tương tự.
                </li>
                <li>
                    <strong>Anomaly Map & ROI Detection:</strong> Xác định vùng tổn thương trên ảnh để phân tích chi tiết và hỗ trợ bác sĩ.
                </li>
                <li>
                    <strong>Embedding & Vector Search:</strong> Tìm kiếm tri thức y khoa liên quan từ hơn 200.000+ dữ liệu bệnh án và nghiên cứu.
                </li>
                <li>
                    <strong>Lợi ích:</strong> Giúp phát hiện sớm, tiết kiệm thời gian chẩn đoán, tăng độ chính xác, và mang lại trải nghiệm y tế hiện đại cho bệnh nhân.
                </li>
                </ul>
            </div>
          </MotionWrapper>
          <MotionWrapper animation="slideRight" delay={1.2}>
            <img
              src="image.png"
              alt="dermatology-service"
              className="rounded-lg shadow-md motion-card"
            />
          </MotionWrapper>
          </div>
        </MotionWrapper>
      </div>

      <Footer />
    </div>
  );
};

export default Introduce;
