
export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  UNSPECIFIED = 'Unspecified'
}

export interface ColorSwatch {
  name: string;
  hex: string;
  prompt: string;
}

export type CameraAngle = 'Front' | 'Side' | 'Back' | 'Close-up Detail' | '360 View';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  photoUrl: string | null;
  photoUploaded: boolean;
  createdAt: number;
}

export type AuthStatus = 'SIGN_IN' | 'SIGN_UP' | 'UPLOAD_REQUIRED' | 'AUTHENTICATED';

export interface BodyAnalysis {
  gender: Gender;
  skinTone: string;
  bodyShape: string;
  detectedFeatures: string[];
}

export interface ClothingItem {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  gender: Gender;
  description: string;
  suitableShapes: string[];
  availableColors?: ColorSwatch[];
}

export interface CartItem {
  cartId: string;
  item: ClothingItem;
  color: ColorSwatch | null;
}

export interface SavedTryOn {
  id: string;
  clothingItem: ClothingItem;
  resultImage: string;
  timestamp: number;
  notes?: string;
  tags?: string[];
  analysis?: BodyAnalysis;
  angle?: CameraAngle;
  selectedColor?: ColorSwatch | null;
}

export interface TryOnSession {
  id: string;
  clothingItems: ClothingItem[];
  resultImage: string;
  analysis: BodyAnalysis;
  timestamp: number;
}
