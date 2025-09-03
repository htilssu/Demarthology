import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, Loader2, CheckCircle, ArrowRight, ArrowLeft, AlertCircle, X, BookOpen, MapPin, Bug, Target, Stethoscope, Heart, Shield, Pill, Microscope } from 'lucide-react';
import { DiagnosisService } from '../services/diagnosis';
import { DiagnosisState, InitialDiagnosisResponse, FinalDiagnosisResponse } from '../models/diagnosis';
import { AuthService } from '../services/auth';
import { DiseaseKnowledgeService } from '../services/disease-knowledge';
import { DiseaseInfo, DiseaseSearchParams } from '../models/disease';

const diagnosisService = DiagnosisService.getInstance();
const authService = AuthService.getInstance();
const diseaseKnowledgeService = DiseaseKnowledgeService.getInstance();

// Helper function to generate or get user ID
const generateUserId = async (): Promise<string> => {
  try {
    // First try to get user profile directly from localStorage to access _id field
    const userProfile = await authService.getCurrentUser();
    if (userProfile && userProfile._id) {
      return userProfile._id;
    }
  } catch (error) {
    console.warn('Could not get user profile from localStorage:', error);
  }
  
  // Fallback: Generate a unique session ID for anonymous users
  // Use a combination of timestamp and random string for uniqueness
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `anonymous-${timestamp}-${randomStr}`;
};

const Diagnosis: React.FC = () => {
  const [state, setState] = useState<DiagnosisState>({
    step: 'upload',
    userId: '', // Will be set on component mount
    loading: false,
    error: undefined
  });

  // Disease information modal state
  const [showDiseaseInfo, setShowDiseaseInfo] = useState(false);

  // Initialize user ID on component mount
  useEffect(() => {
    const initializeUserId = async () => {
      try {
        const userId = await generateUserId();
        setState(prev => ({ ...prev, userId }));
      } catch (error) {
        console.error('Failed to initialize user ID:', error);
        // Fallback to timestamp-based ID if generation fails
        const fallbackId = `user-${Date.now()}`;
        setState(prev => ({ ...prev, userId: fallbackId }));
      }
    };

    initializeUserId();
  }, []);

  const handleImageUpload = async (file: File) => {
    if (!file || !state.userId) return;

    setState(prev => ({ ...prev, loading: true, error: undefined }));

    try {
      const result = await diagnosisService.startDiagnosis(state.userId, file);
      setState(prev => ({
        ...prev,
        uploadedImage: file,
        initialResult: result,
        step: 'initial',
        loading: false
      }));
    } catch (error: any) {
      // Use the actual error message from the API if available
      const errorMessage = error?.message || 'Có lỗi xảy ra khi phân tích ảnh. Vui lòng thử lại.';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false
      }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleContinueToQuestions = async () => {
    if (!state.userId) return;

    setState(prev => ({ ...prev, loading: true }));

    try {
      const result = await diagnosisService.getQuestions(state.userId);
      setState(prev => ({
        ...prev,
        questions: result.questions,
        answers: new Array(result.questions.length).fill(''),
        currentQuestionIndex: 0,
        step: 'questions',
        loading: false
      }));
    } catch (error: any) {
      // Use the actual error message from the API if available
      const errorMessage = error?.message || 'Không thể tải câu hỏi. Vui lòng thử lại.';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false
      }));
    }
  };

  const handleAnswerChange = (index: number, value: string) => {
    setState(prev => ({
      ...prev,
      answers: prev.answers?.map((answer, i) => i === index ? value : answer)
    }));
  };

  const handleNextQuestion = () => {
    setState(prev => ({
      ...prev,
      currentQuestionIndex: (prev.currentQuestionIndex || 0) + 1
    }));
  };

  const handlePreviousQuestion = () => {
    setState(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(0, (prev.currentQuestionIndex || 0) - 1)
    }));
  };

  const handleSubmitAnswers = async () => {
    if (!state.userId || !state.answers) return;

    setState(prev => ({ ...prev, loading: true }));

    try {
      // Get the diagnosis result
      const result = await diagnosisService.submitAnswers(state.userId, state.answers);
      
      // Update state with diagnosis result and move to final step
      setState(prev => ({
        ...prev,
        finalResult: result,
        loading: false,
        step: 'final'
      }));
    } catch (error: any) {
      // Use the actual error message from the API if available
      const errorMessage = error?.message || 'Không thể gửi câu trả lời. Vui lòng thử lại.';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false
      }));
    }
  };

  const resetDiagnosis = async () => {
    try {
      const userId = await generateUserId();
      setState({
        step: 'upload',
        userId,
        loading: false
      });
      // Reset disease info modal state
      setShowDiseaseInfo(false);
    } catch (error) {
      console.error('Failed to reset with new user ID:', error);
      // Fallback to timestamp-based ID if generation fails
      const fallbackId = `user-${Date.now()}`;
      setState({
        step: 'upload',
        userId: fallbackId,
        loading: false
      });
      // Reset disease info modal state
      setShowDiseaseInfo(false);
    }
  };

  // Function to show disease information modal and load disease info
  const handleViewDiseaseInfo = async () => {
    if (!state.finalResult) return;

    // Show modal and start loading
    setShowDiseaseInfo(true);
    setState(prev => ({ 
      ...prev, 
      diseaseInfoLoading: true,
      diseaseInfoError: undefined 
    }));

    try {
      const params: DiseaseSearchParams = {
        disease_name: state.finalResult.final_diagnosis.trim()
      };

      const diseaseResponse = await diseaseKnowledgeService.searchDisease(params);
      
      setState(prev => ({
        ...prev,
        diseaseInfo: diseaseResponse.disease_info || [],
        diseaseInfoLoading: false,
        diseaseInfoError: diseaseResponse.disease_info && diseaseResponse.disease_info.length > 0 
          ? undefined 
          : 'Không tìm thấy thông tin chi tiết về bệnh này.'
      }));
    } catch (diseaseError: any) {
      setState(prev => ({
        ...prev,
        diseaseInfoLoading: false,
        diseaseInfoError: diseaseError?.message || 'Có lỗi xảy ra khi tải thông tin bệnh'
      }));
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Chẩn đoán bệnh da liễu</h1>
              <p className="text-gray-600">Tải ảnh lên để nhận được chẩn đoán chính xác từ AI</p>
            </div>

            <AnimatePresence mode="wait">
              {state.step === 'upload' && (
                <UploadStep
                  loading={state.loading}
                  error={state.error}
                  onFileChange={handleFileChange}
                />
              )}

              {state.step === 'initial' && state.initialResult && (
                <InitialResultStep
                  result={state.initialResult}
                  uploadedImage={state.uploadedImage}
                  loading={state.loading}
                  onContinue={handleContinueToQuestions}
                />
              )}

              {state.step === 'questions' && state.questions && (
                <QuestionsStep
                  questions={state.questions}
                  answers={state.answers || []}
                  currentQuestionIndex={state.currentQuestionIndex || 0}
                  loading={state.loading}
                  error={state.error}
                  onAnswerChange={handleAnswerChange}
                  onNextQuestion={handleNextQuestion}
                  onPreviousQuestion={handlePreviousQuestion}
                  onSubmit={handleSubmitAnswers}
                />
              )}

              {state.step === 'final' && state.finalResult && (
                <FinalResultStep
                  result={state.finalResult}
                  onReset={resetDiagnosis}
                  onViewDiseaseInfo={handleViewDiseaseInfo}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Disease Information Modal */}
        <AnimatePresence>
          {showDiseaseInfo && (
            <DiseaseInfoModal
              diseaseInfo={state.diseaseInfo || []}
              loading={state.diseaseInfoLoading || false}
              error={state.diseaseInfoError || null}
              onClose={() => setShowDiseaseInfo(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Upload Step Component
const UploadStep: React.FC<{
  loading: boolean;
  error?: string;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ loading, error, onFileChange }) => (
  <motion.div
    key="upload"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white rounded-xl shadow-lg p-8"
  >
    <div className="text-center">
      <div className="mb-6">
        <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Upload className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Tải ảnh da liễu</h2>
        <p className="text-gray-600">Chọn ảnh vùng da cần chẩn đoán để bắt đầu</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors">
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
          id="image-upload"
          disabled={loading}
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-gray-600">Đang phân tích...</span>
            </div>
          ) : (
            <div>
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">Nhấp để chọn ảnh</p>
              <p className="text-sm text-gray-500">Hỗ trợ JPG, PNG (tối đa 10MB)</p>
            </div>
          )}
        </label>
      </div>
    </div>
  </motion.div>
);

// Initial Result Step Component
const InitialResultStep: React.FC<{
  result: InitialDiagnosisResponse;
  uploadedImage?: File;
  loading: boolean;
  onContinue: () => void;
}> = ({ result, uploadedImage, loading, onContinue }) => (
  <motion.div
    key="initial"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white rounded-xl shadow-lg p-8"
  >
    <div className="flex items-center gap-2 mb-6">
      <CheckCircle className="w-6 h-6 text-green-600" />
      <h2 className="text-2xl font-bold text-gray-800">Kết quả phân tích ban đầu</h2>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      <div>
        {uploadedImage && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Ảnh đã tải lên</h3>
            <img
              src={URL.createObjectURL(uploadedImage)}
              alt="Uploaded"
              className="w-full h-64 object-cover rounded-lg border"
            />
          </div>
        )}
      </div>

      <div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Mô tả tổn thương</h3>
          <p className="text-gray-600 leading-relaxed">{result.description}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Chẩn đoán sơ bộ</h3>
          <div className="flex flex-wrap gap-2">
            {result.disease_primary.map((disease, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {disease}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Nhóm bệnh</h3>
          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
            {result.normalized_group_name}
          </span>
        </div>

        <motion.button
          onClick={onContinue}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-[#145566] to-[#1c6b84] text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang tải câu hỏi...
            </>
          ) : (
            <>
              Tiếp tục trả lời câu hỏi
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  </motion.div>
);

// Questions Step Component
const QuestionsStep: React.FC<{
  questions: string[];
  answers: string[];
  currentQuestionIndex: number;
  loading: boolean;
  error?: string;
  onAnswerChange: (index: number, value: string) => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  onSubmit: () => void;
}> = ({ 
  questions, 
  answers, 
  currentQuestionIndex, 
  loading, 
  error, 
  onAnswerChange, 
  onNextQuestion, 
  onPreviousQuestion, 
  onSubmit 
}) => {
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const hasAnswered = currentAnswer && currentAnswer.trim() !== '';
  const allAnswered = answers.every(answer => answer.trim() !== '');

  return (
    <motion.div
      key="questions"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Câu hỏi bổ sung</h2>
        <div className="text-sm text-gray-500">
          {currentQuestionIndex + 1} / {questions.length}
        </div>
      </div>
      
      <p className="text-gray-600 mb-8">Vui lòng trả lời các câu hỏi sau để có kết quả chẩn đoán chính xác hơn</p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-[#145566] to-[#1c6b84] h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Current Question */}
      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="border border-gray-200 rounded-lg p-6 mb-8"
      >
        <h3 className="text-lg font-medium text-gray-800 mb-6">
          Câu {currentQuestionIndex + 1}: {currentQuestion}
        </h3>
        <div className="space-y-3">
          {['Có', 'Không', 'Không chắc chắn'].map((option) => (
            <label key={option} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={option}
                checked={currentAnswer === option}
                onChange={(e) => onAnswerChange(currentQuestionIndex, e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-gray-700 font-medium">{option}</span>
            </label>
          ))}
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <motion.button
          onClick={onPreviousQuestion}
          disabled={isFirstQuestion}
          whileHover={{ scale: !isFirstQuestion ? 1.02 : 1 }}
          whileTap={{ scale: !isFirstQuestion ? 0.98 : 1 }}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Câu trước
        </motion.button>

        {isLastQuestion ? (
          <motion.button
            onClick={onSubmit}
            disabled={!allAnswered || loading}
            whileHover={{ scale: allAnswered && !loading ? 1.02 : 1 }}
            whileTap={{ scale: allAnswered && !loading ? 0.98 : 1 }}
            className="px-6 py-3 bg-gradient-to-r from-[#145566] to-[#1c6b84] text-white rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                Hoàn thành chẩn đoán
                <CheckCircle className="w-5 h-5" />
              </>
            )}
          </motion.button>
        ) : (
          <motion.button
            onClick={onNextQuestion}
            disabled={!hasAnswered}
            whileHover={{ scale: hasAnswered ? 1.02 : 1 }}
            whileTap={{ scale: hasAnswered ? 0.98 : 1 }}
            className="px-6 py-3 bg-gradient-to-r from-[#145566] to-[#1c6b84] text-white rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Câu tiếp theo
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

// Final Result Step Component
const FinalResultStep: React.FC<{
  result: FinalDiagnosisResponse;
  onReset: () => void;
  onViewDiseaseInfo: () => void;
}> = ({ result, onReset, onViewDiseaseInfo }) => (
  <motion.div
    key="final"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white rounded-xl shadow-lg p-8"
  >
    <div className="text-center">
      <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>
      
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Kết quả chẩn đoán</h2>
      
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-green-800 mb-2">
          {result.final_diagnosis}
        </h3>
        <p className="text-green-700">
          Đây là kết quả chẩn đoán dựa trên phân tích ảnh và câu trả lời của bạn
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <motion.button
          onClick={onReset}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Chẩn đoán mới
        </motion.button>
        
        <motion.button
          onClick={onViewDiseaseInfo}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 bg-gradient-to-r from-[#145566] to-[#1c6b84] text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <BookOpen className="w-5 h-5" />
          Xem thông tin bệnh
        </motion.button>
      </div>
    </div>
  </motion.div>
);

// Disease Information Modal Component
const DiseaseInfoModal: React.FC<{
  diseaseInfo: DiseaseInfo[];
  loading: boolean;
  error: string | null;
  onClose: () => void;
}> = ({ diseaseInfo, loading, error, onClose }) => {
  
  /**
   * Render disease information card
   */
  const renderDiseaseInfo = (disease: DiseaseInfo, index: number) => (
    <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#145566] to-[#1e6b7a] text-white p-6">
        <h2 className="text-2xl font-bold mb-2">{disease["Tên bệnh"]}</h2>
        <p className="text-blue-100 flex items-center">
          <Microscope className="w-4 h-4 mr-2" />
          {disease["Tên khoa học"]}
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Symptoms */}
        <div className="space-y-3">
          <h3 className="flex items-center text-lg font-semibold text-gray-800">
            <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
            Triệu chứng
          </h3>
          <p className="text-gray-700 leading-relaxed bg-red-50 p-4 rounded-lg border-l-4 border-red-200">
            {disease["Triệu chứng"]}
          </p>
        </div>

        {/* Location */}
        <div className="space-y-3">
          <h3 className="flex items-center text-lg font-semibold text-gray-800">
            <MapPin className="w-5 h-5 mr-2 text-orange-500" />
            Vị trí xuất hiện
          </h3>
          <p className="text-gray-700 leading-relaxed bg-orange-50 p-4 rounded-lg border-l-4 border-orange-200">
            {disease["Vị trí xuất hiện"]}
          </p>
        </div>

        {/* Causes */}
        <div className="space-y-3">
          <h3 className="flex items-center text-lg font-semibold text-gray-800">
            <Bug className="w-5 h-5 mr-2 text-purple-500" />
            Nguyên nhân
          </h3>
          <p className="text-gray-700 leading-relaxed bg-purple-50 p-4 rounded-lg border-l-4 border-purple-200">
            {disease["Nguyên nhân"]}
          </p>
        </div>

        {/* Diagnostic Criteria */}
        <div className="space-y-3">
          <h3 className="flex items-center text-lg font-semibold text-gray-800">
            <Target className="w-5 h-5 mr-2 text-blue-500" />
            Tiêu chí chẩn đoán
          </h3>
          <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg border-l-4 border-blue-200">
            {disease["Tiêu chí chẩn đoán"]}
          </p>
        </div>

        {/* Differential Diagnosis */}
        <div className="space-y-3">
          <h3 className="flex items-center text-lg font-semibold text-gray-800">
            <Stethoscope className="w-5 h-5 mr-2 text-indigo-500" />
            Chẩn đoán phân biệt
          </h3>
          <p className="text-gray-700 leading-relaxed bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-200">
            {disease["Chẩn đoán phân biệt"]}
          </p>
        </div>

        {/* Treatment */}
        <div className="space-y-3">
          <h3 className="flex items-center text-lg font-semibold text-gray-800">
            <Heart className="w-5 h-5 mr-2 text-green-500" />
            Điều trị
          </h3>
          <p className="text-gray-700 leading-relaxed bg-green-50 p-4 rounded-lg border-l-4 border-green-200">
            {disease["Điều trị"]}
          </p>
        </div>

        {/* Prevention */}
        <div className="space-y-3">
          <h3 className="flex items-center text-lg font-semibold text-gray-800">
            <Shield className="w-5 h-5 mr-2 text-teal-500" />
            Phòng bệnh
          </h3>
          <p className="text-gray-700 leading-relaxed bg-teal-50 p-4 rounded-lg border-l-4 border-teal-200">
            {disease["Phòng bệnh"]}
          </p>
        </div>

        {/* Medications */}
        {disease["Các loại thuốc"] && disease["Các loại thuốc"].length > 0 && (
          <div className="space-y-3">
            <h3 className="flex items-center text-lg font-semibold text-gray-800">
              <Pill className="w-5 h-5 mr-2 text-pink-500" />
              Các loại thuốc
            </h3>
            <div className="space-y-3">
              {disease["Các loại thuốc"].map((medication, medIndex) => (
                <div key={medIndex} className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                  <h4 className="font-semibold text-pink-800 mb-2">{medication["Tên thuốc"]}</h4>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p><span className="font-medium">Liều lượng:</span> {medication["Liều lượng"]}</p>
                    <p><span className="font-medium">Thời gian sử dụng:</span> {medication["Thời gian sử dụng"]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-[#145566]" />
            Thông tin chi tiết bệnh
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#145566] mr-3" />
              <span className="text-gray-600">Đang tải thông tin bệnh...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {!loading && !error && diseaseInfo.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy thông tin</h3>
              <p className="text-gray-500">Không tìm thấy thông tin chi tiết về bệnh này.</p>
            </div>
          )}

          {!loading && diseaseInfo.length > 0 && (
            <div className="space-y-6">
              {diseaseInfo.map((disease, index) => renderDiseaseInfo(disease, index))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Diagnosis;
