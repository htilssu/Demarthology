import React from "react";

const Introduce: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">

      <div className="relative w-full h-64 bg-gray-200 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1521791055366-0d553872125f"
          alt="dermatology-banner"
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute w-full h-full bg-black/40" />
        <h1 className="relative text-white text-4xl font-bold z-10">
          CHẨN ĐOÁN DA LIỄU BẰNG AI
        </h1>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <img
            src="image6.png"
            alt="dermatology-check"
            className="rounded-lg shadow-md"
          />
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
            <button className="bg-[#145566] text-white px-6 py-3 rounded-lg hover:bg-[#0f3a44] transition">
              Trải nghiệm ngay
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
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
          <img
            src="image.png"
            alt="dermatology-service"
            className="rounded-lg shadow-md"
          />
        </div>
      </div>
 

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

    </div>
  );
};

export default Introduce;
