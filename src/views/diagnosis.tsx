import React, { useState } from 'react';
import Navbar from '../components/navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, Loader2, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { DiagnosisService } from '../services/diagnosis';
import { DiagnosisState, InitialDiagnosisResponse, FinalDiagnosisResponse } from '../models/diagnosis';

const diagnosisService = DiagnosisService.getInstance();

const Diagnosis: React.FC = () => {
  const [state, setState] = useState<DiagnosisState>({
    step: 'upload',
    userId: '123', // Could be generated or from auth context
    loading: false,
    error: undefined
  });

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
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Có lỗi xảy ra khi phân tích ảnh. Vui lòng thử lại.',
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
        step: 'questions',
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Không thể tải câu hỏi. Vui lòng thử lại.',
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

  const handleSubmitAnswers = async () => {
    if (!state.userId || !state.answers) return;

    setState(prev => ({ ...prev, loading: true }));

    try {
      const result = await diagnosisService.submitAnswers(state.userId, state.answers);
      setState(prev => ({
        ...prev,
        finalResult: result,
        step: 'final',
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Không thể gửi câu trả lời. Vui lòng thử lại.',
        loading: false
      }));
    }
  };

  const resetDiagnosis = () => {
    setState({
      step: 'upload',
      userId: '123',
      loading: false
    });
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
                  loading={state.loading}
                  error={state.error}
                  onAnswerChange={handleAnswerChange}
                  onSubmit={handleSubmitAnswers}
                />
              )}

              {state.step === 'final' && state.finalResult && (
                <FinalResultStep
                  result={state.finalResult}
                  onReset={resetDiagnosis}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
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
  loading: boolean;
  error?: string;
  onAnswerChange: (index: number, value: string) => void;
  onSubmit: () => void;
}> = ({ questions, answers, loading, error, onAnswerChange, onSubmit }) => {
  const allAnswered = answers.every(answer => answer.trim() !== '');

  return (
    <motion.div
      key="questions"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg p-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Câu hỏi bổ sung</h2>
      <p className="text-gray-600 mb-8">Vui lòng trả lời các câu hỏi sau để có kết quả chẩn đoán chính xác hơn</p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Câu {index + 1}: {question}
            </h3>
            <div className="space-y-2">
              {['Có', 'Không', 'Không chắc chắn'].map((option) => (
                <label key={option} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    checked={answers[index] === option}
                    onChange={(e) => onAnswerChange(index, e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <motion.button
        onClick={onSubmit}
        disabled={!allAnswered || loading}
        whileHover={{ scale: allAnswered && !loading ? 1.02 : 1 }}
        whileTap={{ scale: allAnswered && !loading ? 0.98 : 1 }}
        className="w-full mt-8 bg-gradient-to-r from-[#145566] to-[#1c6b84] text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Đang xử lý...
          </>
        ) : (
          <>
            Hoàn thành chẩn đoán
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </motion.button>
    </motion.div>
  );
};

// Final Result Step Component
const FinalResultStep: React.FC<{
  result: FinalDiagnosisResponse;
  onReset: () => void;
}> = ({ result, onReset }) => (
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
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 bg-gradient-to-r from-[#145566] to-[#1c6b84] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          Xem thông tin bệnh
        </motion.button>
      </div>
    </div>
  </motion.div>
);

export default Diagnosis;
