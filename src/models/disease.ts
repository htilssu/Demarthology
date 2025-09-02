/**
 * Disease medication information
 */
export interface DiseaseMedication {
  "Tên thuốc": string;
  "Liều lượng": string;
  "Thời gian sử dụng": string;
}

/**
 * Disease information model matching the API response structure
 */
export interface DiseaseInfo {
  "Tên bệnh": string;
  "Tên khoa học": string;
  "Triệu chứng": string;
  "Vị trí xuất hiện": string;
  "Nguyên nhân": string;
  "Tiêu chí chẩn đoán": string;
  "Chẩn đoán phân biệt": string;
  "Điều trị": string;
  "Phòng bệnh": string;
  "Các loại thuốc": DiseaseMedication[];
}

/**
 * API response for disease knowledge lookup
 */
export interface DiseaseKnowledgeResponse {
  disease_info: DiseaseInfo[];
}

/**
 * Disease search request parameters
 */
export interface DiseaseSearchParams {
  disease_name: string;
}