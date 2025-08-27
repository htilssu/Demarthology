import React from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import MotionWrapper from '../components/MotionWrapper';
import MedicalParticles from '../components/MedicalParticles';
import '../styles/motion.css';

const Diagnosis: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 relative">
            <MedicalParticles density="medium" />
            <Navbar />
            
            <div className="container mx-auto px-4 py-8 relative z-10">
                <MotionWrapper animation="slideUp" delay={0.1}>
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-[#145566] mb-4">Chẩn Đoán Da Liễu AI</h1>
                        <p className="text-gray-600 text-lg">Tải ảnh lên để nhận chẩn đoán chính xác từ hệ thống AI</p>
                    </div>
                </MotionWrapper>

                <MotionWrapper animation="zoomIn" delay={0.3}>
                    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 motion-card">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-[#145566] rounded-full mx-auto mb-6 flex items-center justify-center motion-pulse">
                                <span className="text-white text-4xl">🔬</span>
                            </div>
                            
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Bắt đầu chẩn đoán</h2>
                            <p className="text-gray-600 mb-6">
                                Chụp ảnh hoặc tải ảnh vùng da cần chẩn đoán. Hệ thống AI sẽ phân tích và đưa ra kết quả chi tiết.
                            </p>
                            
                            <MotionWrapper animation="slideUp" delay={0.5}>
                                <div className="border-2 border-dashed border-[#145566] rounded-lg p-8 mb-6 hover:bg-gray-50 transition-colors motion-card">
                                    <div className="text-center">
                                        <span className="text-6xl mb-4 block">📷</span>
                                        <p className="text-gray-600 mb-4">Kéo thả ảnh vào đây hoặc click để chọn file</p>
                                        <button className="bg-[#145566] text-white px-6 py-3 rounded-lg hover:bg-[#0f3f44] transition-colors motion-button">
                                            Chọn ảnh
                                        </button>
                                    </div>
                                </div>
                            </MotionWrapper>
                            
                            <MotionWrapper animation="slideUp" delay={0.7}>
                                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                                    <div className="motion-card p-4 bg-blue-50 rounded-lg">
                                        <span className="block text-2xl mb-2">🎯</span>
                                        <strong>Độ chính xác cao</strong>
                                        <p>AI được huấn luyện trên 200,000+ ảnh</p>
                                    </div>
                                    <div className="motion-card p-4 bg-green-50 rounded-lg">
                                        <span className="block text-2xl mb-2">⚡</span>
                                        <strong>Kết quả nhanh</strong>
                                        <p>Chỉ trong vài giây</p>
                                    </div>
                                    <div className="motion-card p-4 bg-purple-50 rounded-lg">
                                        <span className="block text-2xl mb-2">🔒</span>
                                        <strong>Bảo mật tuyệt đối</strong>
                                        <p>Dữ liệu được mã hóa</p>
                                    </div>
                                </div>
                            </MotionWrapper>
                        </div>
                    </div>
                </MotionWrapper>
            </div>
            
            <Footer />
        </div>
    );
};

export default Diagnosis;