import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { MealPlan, Recipe } from '../types';
import toast from 'react-hot-toast';

/**
 * MealPlanner component for planning meals and tracking nutrition
 */
export default function MealPlanner() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch meal plan for selected date
  useEffect(() => {
    fetchMealPlan();
  }, [selectedDate]);

  /**
   * Fetch meal plan from Supabase for the selected date
   */
  async function fetchMealPlan() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('meal_plans')
        .select(`
          *,
          planned_meals (*)
        `)
        .eq('user_id', user.id)
        .eq('date', selectedDate.toISOString().split('T')[0])
        .single();

      if (error) throw error;
      setMealPlan(data);
    } catch (error) {
      console.error('Error fetching meal plan:', error);
      toast.error('Failed to load meal plan');
    }
  }

  /**
   * Search for recipes to add to the meal plan
   */
  async function searchRecipes() {
    if (!searchTerm) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/api/json/v1/1/search.php?s=${searchTerm}`);
      const data = await response.json();
      setSearchResults(data.meals || []);
    } catch (error) {
      console.error('Error searching recipes:', error);
      toast.error('Failed to search recipes');
    } finally {
      setLoading(false);
    }
  }

  /**
   * Add a recipe to the meal plan
   */
  async function addToMealPlan(recipe: Recipe, mealType: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to create a meal plan');
        return;
      }

      // Create or update meal plan
      const { data: mealPlanData, error: mealPlanError } = await supabase
        .from('meal_plans')
        .upsert({
          user_id: user.id,
          date: selectedDate.toISOString().split('T')[0],
        })
        .select()
        .single();

      if (mealPlanError) throw mealPlanError;

      // Add planned meal
      const { error: plannedMealError } = await supabase
        .from('planned_meals')
        .insert({
          meal_plan_id: mealPlanData.id,
          recipe_id: recipe.idMeal,
          meal_type: mealType,
          servings: 1,
        });

      if (plannedMealError) throw plannedMealError;

      toast.success('Recipe added to meal plan');
      fetchMealPlan();
    } catch (error) {
      console.error('Error adding to meal plan:', error);
      toast.error('Failed to add recipe to meal plan');
    }
  }

  /**
   * Remove a planned meal from the meal plan
   */
  async function removePlannedMeal(mealId: string) {
    try {
      const { error } = await supabase
        .from('planned_meals')
        .delete()
        .eq('id', mealId);

      if (error) throw error;
      toast.success('Meal removed from plan');
      fetchMealPlan();
    } catch (error) {
      console.error('Error removing planned meal:', error);
      toast.error('Failed to remove meal from plan');
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-center mb-8">Meal Planner</h1>

          {/* Date Selection */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-900 p-4 rounded-xl">
              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="bg-transparent border-none text-white"
              />
            </div>
          </div>

          {/* Recipe Search */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex gap-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search recipes to add..."
                className="flex-1 px-4 py-2 bg-gray-900 rounded-lg"
              />
              <button
                onClick={searchRecipes}
                className="px-6 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Search
              </button>
            </div>

            {/* Search Results */}
            {loading ? (
              <div className="text-center mt-4">Searching...</div>
            ) : (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((recipe) => (
                  <motion.div
                    key={recipe.idMeal}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gray-900 p-4 rounded-xl flex gap-4"
                  >
                    <img
                      src={recipe.strMealThumb}
                      alt={recipe.strMeal}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{recipe.strMeal}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => addToMealPlan(recipe, 'breakfast')}
                          className="px-3 py-1 bg-blue-500 rounded-full text-sm"
                        >
                          + Breakfast
                        </button>
                        <button
                          onClick={() => addToMealPlan(recipe, 'lunch')}
                          className="px-3 py-1 bg-green-500 rounded-full text-sm"
                        >
                          + Lunch
                        </button>
                        <button
                          onClick={() => addToMealPlan(recipe, 'dinner')}
                          className="px-3 py-1 bg-purple-500 rounded-full text-sm"
                        >
                          + Dinner
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Meal Plan Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['breakfast', 'lunch', 'dinner'].map((mealType) => (
              <div key={mealType} className="bg-gray-900 rounded-xl p-6">
                <h2 className="text-xl font-bold capitalize mb-4">{mealType}</h2>
                {mealPlan?.meals[mealType] ? (
                  <div className="space-y-4">
                    {mealPlan.meals[mealType]?.map((meal) => (
                      <motion.div
                        key={meal.id}
                        className="bg-gray-800 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold">{meal.recipe.strMeal}</h3>
                          <button
                            onClick={() => removePlannedMeal(meal.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-2 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>30 mins</span>
                          </div>
                          {meal.recipe.nutrition && (
                            <div className="mt-2">
                              <p>Calories: {meal.recipe.nutrition.calories}kcal</p>
                              <p>Protein: {meal.recipe.nutrition.protein}g</p>
                              <p>Carbs: {meal.recipe.nutrition.carbohydrates}g</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Plus className="w-8 h-8 mx-auto mb-2" />
                    <p>No meals planned</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Nutrition Summary */}
          {mealPlan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 bg-gray-900 rounded-xl p-6"
            >
              <h2 className="text-2xl font-bold mb-4">Daily Nutrition Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-sm text-gray-400">Total Calories</h3>
                  <p className="text-2xl font-bold">{mealPlan.totalNutrition.calories}kcal</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-sm text-gray-400">Protein</h3>
                  <p className="text-2xl font-bold">{mealPlan.totalNutrition.protein}g</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-sm text-gray-400">Carbohydrates</h3>
                  <p className="text-2xl font-bold">{mealPlan.totalNutrition.carbohydrates}g</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-sm text-gray-400">Fat</h3>
                  <p className="text-2xl font-bold">{mealPlan.totalNutrition.fat}g</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}