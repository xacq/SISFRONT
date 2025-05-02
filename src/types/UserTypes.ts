// types/UserTypes.ts
export type Gender = 'hombre' | 'mujer' | 'otro' | 'prefiero no decir';
export type ActivityLevel = 'sedentario' | 'moderado' | 'activo' | 'muy activo';
export type TrainingFrequency = '1-2' | '3-4' | '5+' | 'ocacional';
export type PrimaryGoal = 'mejor rendimiento' | 'perder peso' | 'ganar musculo' | 'resistencia' | 'recuperacion' | 'por salud';
export type SweatLevel = 'bajo' | 'medio' | 'alto';
export type CaffeineTolerance = 'no' | 'bajo' | 'medio' | 'alto';
export type DietaryRestriction = 'vegetariano' | 'vegano' | 'libre de gluten' | 'libre de lactosa' | 'libre de frutos secos' | 'no';

export interface UserProfileData {
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  activity_level: ActivityLevel;
  training_frequency: TrainingFrequency;
  primary_goal: PrimaryGoal;
  sweat_level: SweatLevel;
  caffeine_tolerance: CaffeineTolerance;
  dietary_restrictions: DietaryRestriction;
}

export interface UserData {
  id?: number;
  username: string;
  email: string;
  password?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  profile: UserProfileData;
}

// Tipos para productos (añadidos para soportar la nueva funcionalidad)
export interface ProductCategory {
  category_id: number;
  name: string;
  description: string;
  usage_context: string;
}

export interface ProductType {
  type_id: number;
  category_id: number;
  name: string;
  description: string;
}

export interface Product {
  product_id: number;
  type_id: number;
  name: string;
  description: string;
  image_url: string;
  usage_recommendation: string;
  is_active: boolean;
  type_name?: string;
  type_description?: string;
}

export interface ProductFlavor {
  flavor_id: number;
  product_id: number;
  name: string;
}

export interface ProductNutrition {
  nutrition_id: number;
  product_id: number;
  serving_size: string;
  energy_kcal: number;
  protein_g: number;
  carbs_g: number;
  sugars_g: number;
  sodium_mg: number;
  potassium_mg: number;
  magnesium_mg: number;
  caffeine_mg: number;
  other_components: string;
}

export interface ProductAttribute {
  attribute_id: number;
  name: string;
  description: string;
}

export interface ProductDetail {
  product: Product;
  nutrition: ProductNutrition;
  flavors: ProductFlavor[];
  attributes: ProductAttribute[];
}

// Tipo para el contexto de autenticación
export interface AuthContextType {
  user: UserData | null;
  login: (userData: UserData) => void;
  logout: () => void;
}
