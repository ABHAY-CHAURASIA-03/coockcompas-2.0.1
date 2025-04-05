// User related types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  banner_url?: string;
  preferences?: {
    dietaryRestrictions: string[];
    allergies: string[];
    cuisinePreferences: string[];
  };
}

// Recipe related types
export interface Recipe {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube?: string;
  ingredients: string[];
  measures: string[];
  nutrition?: NutritionInfo;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  vitamins?: {
    [key: string]: number;
  };
  minerals?: {
    [key: string]: number;
  };
}

export interface IndianRecipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  cuisine: string;
  course: string;
  diet: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  image?: string;
  nutrition?: NutritionInfo;
}

export interface Category {
  strCategory: string;
}

export interface Area {
  strArea: string;
}

export interface Ingredient {
  strIngredient: string;
  strDescription: string;
  strType: string;
}

export interface Mocktail {
  idDrink: string;
  strDrink: string;
  strCategory: string;
  strInstructions: string;
  strDrinkThumb: string;
  ingredients: string[];
  measures: string[];
}

// Meal planning types
export interface MealPlan {
  id: string;
  userId: string;
  date: string;
  meals: {
    breakfast?: PlannedMeal;
    lunch?: PlannedMeal;
    dinner?: PlannedMeal;
    snacks?: PlannedMeal[];
  };
  totalNutrition: NutritionInfo;
}

export interface PlannedMeal {
  recipeId: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  servings: number;
  notes?: string;
}