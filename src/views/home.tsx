import React, { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Medical3D from '../components/Medical3D';
import MotionWrapper from '../components/MotionWrapper';
import { MotionCard, MotionButton, MotionPulse, MotionFloat } from '../components/MotionComponents';
import '../styles/medical3d.css';

const HomeView: React.FC = () => {
  const [activeFAQ, setActiveFAQ] = useState(0);

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? -1 : index);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
    <section id="home" className="relative w-full h-screen overflow-hidden">
      <Medical3D />
       <div className="absolute top-0 left-0 w-full h-full bg-black/20 flex items-center justify-center">
         <div className="text-center text-white px-4 z-10">
           <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">Chẩn Đoán Da Liễu AI</h1>
           <p className="text-lg md:text-2xl mb-8 drop-shadow-md">Chăm sóc sức khỏe thông minh, giải pháp nhanh chóng</p>
           <button className="bg-[#145566] text-white px-6 py-3 rounded-lg hover:bg-[#0f3f44] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
             Bắt đầu chẩn đoán
           </button>
         </div>
       </div>
    </section>

    <section id="about" className="py-20 bg-white">
  <MotionWrapper animation="fadeIn" delay={0.2}>
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        
        <MotionWrapper animation="slideLeft" delay={0.4}>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <MotionCard className="bg-gray-200 h-64 rounded-lg">
                  <img src="image2.jpg" alt="about" className="w-full h-full object-cover" />
                </MotionCard>
                <MotionCard className="bg-gray-300 h-32 rounded-lg">
                  <img src="image3.jpg" alt="about" className="w-full h-full object-cover" />
                </MotionCard>
              </div>
              <div className="space-y-4 pt-8">
                <MotionCard className="bg-gray-300 h-32 rounded-lg">
                  <img src="image4.png" alt="about" className="w-full h-full object-cover" />
                </MotionCard>
                <MotionCard className="bg-gray-200 h-64 rounded-lg">
                  <img src="image5.webp" alt="about" className="w-full h-full object-cover" />
                </MotionCard>
              </div>
            </div>
            <MotionFloat className="absolute bottom-4 left-4 bg-[#145566] text-white p-4 rounded-lg">
              <div className="text-2xl font-bold">AI</div>
              <div className="text-sm">Dermatology</div>
            </MotionFloat>
          </div>
        </MotionWrapper>
      
      {/* Nội dung */}
      <MotionWrapper animation="slideRight" delay={0.6}>
        <div>
          <p className="text-[#145566] font-semibold mb-2">Công nghệ chẩn đoán thông minh</p>
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            HỆ THỐNG CHẨN ĐOÁN DA LIỄU AI ĐA MÔ HÌNH
          </h2>
          <p className="text-gray-600 mb-8">
            Chúng tôi phát triển hệ thống chẩn đoán dựa trên công nghệ AI đa mô hình (Multiple Models) 
            kết hợp với RAG (Retrieval-Augmented Generation) và tích hợp Gemini để mô tả bệnh, gợi ý 
            câu hỏi, cũng như hỗ trợ phân biệt bệnh tương tự một cách toàn diện.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {[
              "Pipeline chẩn đoán đa tầng",
              "Tích hợp Gemini & RAG",
              "Kết nối tri thức y khoa (Medline...)",
              "Theo dõi & cảnh báo thông minh",
              "Bảo mật dữ liệu tuyệt đối",
              "Thử nghiệm trên 5 bộ dữ liệu lớn"
            ].map((feature, index) => (
              <MotionWrapper key={index} animation="slideUp" delay={0.8 + index * 0.1}>
                <div className="flex items-center space-x-3">
                  <MotionPulse className="w-6 h-6 bg-[#145566] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </MotionPulse>
                  <span className="text-gray-700">{feature}</span>
                </div>
              </MotionWrapper>
            ))}
          </div>
          
          <MotionWrapper animation="slideUp" delay={1.4}>
            <div className="flex items-center space-x-4 mb-8">
              <div className="text-3xl font-bold text-[#145566]">200,000+</div>
              <div className="text-gray-600">Hình ảnh da liễu trong dataset</div>
            </div>
          </MotionWrapper>
          
          <MotionWrapper animation="slideUp" delay={1.6}>
            <MotionButton className="bg-[#145566] text-white px-6 py-3 rounded-lg hover:bg-[#0f3f44] transition-colors">
              Tìm hiểu thêm
            </MotionButton>
          </MotionWrapper>
        </div>
      </MotionWrapper>
      </div>
    </div>
  </MotionWrapper>
    </section>

    <section id="diagnosis">
         <div className="container mx-auto px-4">
           <div className="text-center mb-16">
             <p className="text-[#145566] font-semibold mb-2">Chẩn đoán nhanh chóng</p>
             <h2 className="text-4xl font-bold text-gray-800">BẮT ĐẦU CHẨN ĐOÁN NGAY</h2>
           </div>
           
           <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
             <div className="grid md:grid-cols-2 gap-8">
               <div className="text-center">
                 <div className="w-32 h-32 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                   <span className="text-6xl">📷</span>
                 </div>
                 <h3 className="text-2xl font-bold text-gray-800 mb-4">Tải ảnh lên</h3>
                 <p className="text-gray-600 mb-6">
                   Chụp ảnh hoặc tải ảnh vùng da cần chẩn đoán. Hệ thống sẽ phân tích và đưa ra kết quả chính xác.
                 </p>
               </div>
               
               <div className="text-center">
                 <div className="w-32 h-32 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                   <span className="text-6xl">🔍</span>
                 </div>
                 <h3 className="text-2xl font-bold text-gray-800 mb-4">Kết quả chẩn đoán</h3>
                 <p className="text-gray-600 mb-6">
                   Nhận kết quả chẩn đoán chi tiết với độ chính xác cao và khuyến nghị điều trị phù hợp.
                 </p>
               </div>
             </div>
           </div>
         </div>
    </section>

    <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-[#145566] font-semibold mb-2">Năng lực hệ thống</p>
            <h2 className="text-4xl font-bold text-gray-800">CÁC CHỨC NĂNG CHÍNH</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "Dataset 200.000 ảnh", 
                icon: "🗂️", 
                desc: "Xây dựng và huấn luyện trên bộ dữ liệu gần 200.000 ảnh da liễu đa dạng." 
              },
              { 
                title: "Tích hợp AI Agent", 
                icon: "🤖", 
                desc: "Sinh mô tả bệnh, gợi ý câu hỏi và hỗ trợ phân biệt các bệnh tương tự." 
              },
              { 
                title: "Kết nối tri thức y khoa", 
                icon: "📚", 
                desc: "Tích hợp nguồn tri thức chính thống vào chẩn đoán." 
              },
              { 
                title: "Tiện ích mở rộng", 
                icon: "⚙️", 
                desc: "Theo dõi tiến triển bệnh, cảnh báo UV, gợi ý bệnh viện, và nhiều hơn nữa." 
              },
              { 
                title: "9 phiên bản phát triển", 
                icon: "🚀", 
                desc: "Phát triển hệ thống chẩn đoán qua 8 phiên bản (V1 → V9)." 
              },
              { 
                title: "Thử nghiệm đa bộ dữ liệu", 
                icon: "🧪", 
                desc: "Đánh giá và thử nghiệm trên 5 bộ dữ liệu da liễu chính." 
              },
              { 
                title: "Pipeline đa tầng", 
                icon: "🔗", 
                desc: "Xây dựng pipeline chẩn đoán đa tầng, kết hợp nhiều mô hình và RAG." 
              }
            ].map((service, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
    </section>

    <section className="py-16 bg-gradient-to-r from-[#145566] to-[#0e3e46]">
        <div className="container mx-auto px-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg px-8 py-10 flex flex-col md:flex-row items-center justify-between text-center md:text-left">

            <h3 className="text-3xl font-bold text-white mb-6 md:mb-0">
              Hãy bắt đầu chẩn đoán da liễu ngay hôm nay
            </h3>

            <button className="bg-white text-[#145566] px-8 py-3 rounded-xl font-semibold shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300">
              Chẩn đoán ngay 🚀
            </button>
          </div>
        </div>
    </section>

    <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-[#145566] font-semibold mb-2">Đội ngũ phát triển</p>
            <h2 className="text-4xl font-bold text-gray-800">AILUSION</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                name: "Phạm Thị Anh Thư", 
                title: "Trưởng nhóm phát triển", 
                image: "https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-1/470179743_1851328095609817_8337973549559652488_n.jpg?stp=dst-jpg_s480x480_tt6&_nc_cat=106&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeHuLKLNmdSkF7uKjegH9OFaHL9-tIe8RA0cv360h7xEDethCfho04LbnWdBKIbXAqNi7i4qKVgL9ykla8hipnep&_nc_ohc=-R9j5OctcukQ7kNvwEfqEcR&_nc_oc=Adl_ScU-nK1Jr5EGq2JBBO0yi04WF9gXDluqrquqd1oktZci6AHHF4GQHJB-ZPfa9XsbsCk3eBFr8eVlNfdNlFoP&_nc_zt=24&_nc_ht=scontent-hkg4-1.xx&_nc_gid=zuUZ0cKX46cm4gi5jgTGXQ&oh=00_AfUtxznlaQQFa_YisiVvlX25ylZJTGOcIf-SF6CoZxDNXQ&oe=68B0D7D2", 
              },
              { 
                name: "Trần Trung Hiếu", 
                title: "Fullstack Developer", 
                image: "https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-1/479498955_3994010817542959_4766960977406040601_n.jpg?stp=cp6_dst-jpg_s480x480_tt6&_nc_cat=110&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeHjAndryBac-qISO4i16vYurLs0PEboFjesuzQ8RugWNxr1VcvklLiyb1JqygtdZ-5z8GiPtul15cAGyOC5emQC&_nc_ohc=vw3zCa_S6m4Q7kNvwGu6Nda&_nc_oc=AdmMqsxiNY5df-Fc4Au1y7Z23reGnYIfZMj5gT8CfEm2cjTvX37mu31lorD5e_6yDiA1SnokkZFkLIiz95wf2SCx&_nc_zt=24&_nc_ht=scontent-hkg4-1.xx&_nc_gid=4bk9gMIVhEKvIt_jMdkZ9w&oh=00_AfWQPkqYCfp1Z_60v5Q4gIhHbOoQS3-yEKB3GBEavKpRzQ&oe=68B0BF49", 
              },
              { 
                name: "Nguyễn Gia Khôi", 
                title: "Fullstack Developer", 
                image: "https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-1/292549145_1249577232527854_3055439233496618439_n.jpg?stp=dst-jpg_s480x480_tt6&_nc_cat=108&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeG0jW1yERt_eBKhJ9eupspvnG3FVFOS8QOcbcVUU5LxA1N7kp28aKrkBb0hxlks7I28b0TxWp_CXbekTt6AdeYn&_nc_ohc=-Z3MybsDjP4Q7kNvwH6uWny&_nc_oc=Adn0bqZ7QEfljgIOiKhqFoEhpEnOiyVPZbIvbDXr01HUXzsIerjtd2d2HCOwuBD7KCSyg2q2A0ZtwabuR2cB5tOh&_nc_zt=24&_nc_ht=scontent-hkg4-1.xx&_nc_gid=HuNpYuOSz78zvLXVOqI9cQ&oh=00_AfUUjG2qpFVCG37T8oF2H3NChiPUYf1xWWq4qPOAKqMDTA&oe=68B0C514", 
              },
              { 
                name: "Bùi Thị Thanh Tú", 
                title: "Mentor", 
                image: "https://scontent-hkg1-2.xx.fbcdn.net/v/t39.30808-1/468949609_10160891432918036_3359726745802613135_n.jpg?stp=dst-jpg_s480x480_tt6&_nc_cat=104&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeEyxkOk2u64f6M9mQU85DGL9WO-bkxb1nL1Y75uTFvWcgGIlBWD8wskI-WGbx2Qd8-9eYiPW2XOs5oeU3eMS6KU&_nc_ohc=EuQRpgmpa58Q7kNvwHohEYN&_nc_oc=AdkolhQ8hztTjVigeRwn1axMTq-84JIqSwvWGsd9gfEDedXMSWaplkaIKEyxgCQm0VAcPulf2T2Hn8uC-zOcih_F&_nc_zt=24&_nc_ht=scontent-hkg1-2.xx&_nc_gid=8lxMN7Z_q-tYmuuISbPu4w&oh=00_AfXwu-86MzUutcNmhXxKjMmC_r3wqjgP_fXCIc8w177HIA&oe=68B0CBEF", 
              }
            ].map((member, index) => (
              <div key={index} className="text-center bg-white p-6 rounded-lg shadow-lg">
                <div className="w-32 h-32 mx-auto mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-32 h-32 object-cover rounded-full shadow-md mx-auto" 
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                <p className="text-[#145566] font-semibold mb-2">{member.title}</p>
              </div>
            ))}
          </div>
        </div>
    </section>

    <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16">
              <div>
                <p className="text-[#145566] font-semibold mb-2">Câu hỏi thường gặp</p>
                <h2 className="text-4xl font-bold text-gray-800 mb-8">GIẢI ĐÁP THẮC MẮC</h2>
                
                <div className="space-y-4">
                  {[
                    {
                      question: "01. HỆ THỐNG SỬ DỤNG CÔNG NGHỆ GÌ?",
                      answer:
                        "Chúng tôi áp dụng AI đa mô hình (Multiple Models) kết hợp RAG và Gemini để phân tích ảnh da liễu, sinh mô tả bệnh, gợi ý câu hỏi và hỗ trợ phân biệt bệnh tương tự."
                    },
                    {
                      question: "02. HỆ THỐNG HOẠT ĐỘNG NHƯ THẾ NÀO?",
                      answer:
                        "Người dùng chỉ cần tải ảnh da lên. AI sẽ phân tích thông qua pipeline chẩn đoán đa tầng, đối chiếu với kho dữ liệu y khoa (Medline, Layer 1) và đưa ra kết quả chỉ trong vài giây."
                    },
                    {
                      question: "03. THÔNG TIN NGƯỜI DÙNG CÓ AN TOÀN KHÔNG?",
                      answer:
                        "Tất cả dữ liệu được bảo mật và chỉ phục vụ cho mục đích y tế. Hệ thống tuân thủ các tiêu chuẩn quốc tế về bảo mật y khoa."
                    }
                  ].map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg">
                      <button
                        className="w-full p-4 text-left font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                        onClick={() => toggleFAQ(index)}
                      >
                        {faq.question}
                      </button>
                      {activeFAQ === index && (
                        <div className="p-4 pt-0 text-gray-600">{faq.answer}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-blue-50 p-8 rounded-lg shadow-md">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Thống kê hệ thống</h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Dataset da liễu</span>
                      <span className="text-2xl font-bold text-[#145566]">200,000+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Độ chính xác</span>
                      <span className="text-2xl font-bold text-[#145566]">85%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Phiên bản phát triển</span>
                      <span className="text-2xl font-bold text-[#145566]">V1 → V9</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Bộ dữ liệu thử nghiệm</span>
                      <span className="text-2xl font-bold text-[#145566]">5+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Thời gian chẩn đoán</span>
                      <span className="text-2xl font-bold text-[#145566]">~3 phút</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    </section>
             <Footer/>
     </div>
   );
 };

 export default HomeView;
