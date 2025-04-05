import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, Youtube } from 'lucide-react';
import type { Recipe } from '../types';

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const response = await fetch(
          `/api/api/json/v1/1/lookup.php?i=${id}`
        );
        const data = await response.json();
        if (data.meals) {
          const meal = data.meals[0];
          // Extract ingredients and measures
          const ingredients = [];
          const measures = [];
          for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`]) {
              ingredients.push(meal[`strIngredient${i}`]);
              measures.push(meal[`strMeasure${i}`]);
            }
          }
          setRecipe({ ...meal, ingredients, measures });
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipe();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-black text-white pt-24 flex items-center justify-center">Loading...</div>;
  if (!recipe) return <div className="min-h-screen bg-black text-white pt-24 flex items-center justify-center">Recipe not found</div>;

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-xl overflow-hidden"
        >
          <div className="relative h-96">
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <h1 className="text-4xl font-bold mb-2">{recipe.strMeal}</h1>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  30 mins
                </span>
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  4 servings
                </span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold mb-4">Instructions</h2>
                {recipe.strInstructions.split('\r\n').filter(Boolean).map((step, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="font-bold text-orange-500 mb-2">Step {index + 1}</h3>
                    <p>{step}</p>
                  </div>
                ))}
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
                <div className="bg-black rounded-xl p-6">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex justify-between items-center mb-2">
                      <span>{ingredient}</span>
                      <span className="text-orange-500">{recipe.measures[index]}</span>
                    </div>
                  ))}
                </div>

                {recipe.strYoutube && (
                  <div className="mt-8">
                    <a
                      href={recipe.strYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Youtube className="w-5 h-5" />
                      Watch Video
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}