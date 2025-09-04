export interface CreateCheckProcessRequest {
  user_id: string;
  image: File;
}

export interface CreateCheckProcessResponse {
  id: string;
  userId: string;
  imageUrl: string[];
}

export interface TrackCheckProcessRequest {
  user_id: string;
  image: File;
}

export interface TrackCheckProcessResponse {
  first_image: string;
  latest_image: string;
}

export interface CheckProcessHistory {
  id: string;
  userId: string;
  processId: string;
  firstImage: string;
  latestImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckProcessState {
  isLoading: boolean;
  currentProcess: CreateCheckProcessResponse | null;
  comparison: TrackCheckProcessResponse | null;
  history: CheckProcessHistory[];
  error: string | null;
}