import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ChefHat } from 'lucide-react';
import type { Recipe, IndianRecipe } from '../types';

export default function Home() {
  const [dailySpecial, setDailySpecial] = useState<Recipe | null>(null);
  const [trendingRecipes, setTrendingRecipes] = useState<Recipe[]>([]);
  const [indianRecipes, setIndianRecipes] = useState<Recipe[]>([]);
  const [indianCuisines, setIndianCuisines] = useState<IndianRecipe[]>([]);

  useEffect(() => {
    // Fetch daily special from here from this and 
    fetch('/api/api/json/v1/1/random.php')
      .then(res => res.json())
      .then(data => setDailySpecial(data.meals[0]));

    // Fetch multiple recipes for trending section
    Promise.all([
      fetch('/api/api/json/v1/1/random.php'),
      fetch('/api/api/json/v1/1/random.php'),
      fetch('/api/api/json/v1/1/random.php')
    ]).then(responses => Promise.all(responses.map(res => res.json())))
      .then(data => setTrendingRecipes(data.map(d => d.meals[0])));

    // Fetch Indian recipes from MealDB
    Promise.all([
      fetch('/api/api/json/v1/1/search.php?s=butter chicken'),
      fetch('/api/api/json/v1/1/search.php?s=biryani'),
      fetch('/api/api/json/v1/1/search.php?s=dal'),
      fetch('/api/api/json/v1/1/search.php?s=tandoori'),
      fetch('/api/api/json/v1/1/search.php?s=korma')
    ]).then(responses => Promise.all(responses.map(res => res.json())))
      .then(data => {
        const recipes = data
          .filter(d => d.meals && d.meals.length > 0)
          .map(d => d.meals[0]);
        setIndianRecipes(recipes);
      });

    // Fetch Indian cuisines from Indian Food API
    fetch('/indian-food/api/getallcuisine')
      .then(res => res.json())
      .then(data => {
        // Take first 6 recipes
        setIndianCuisines(data.slice(0, 6));
      })
      .catch(error => console.error('Error fetching Indian cuisines:', error));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-screen flex items-center justify-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1543353071-873f17a7a088?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold mb-8"
          >
            DISCOVER THE MAGIC OF CUISINE WITH
          </motion.h1>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-7xl md:text-9xl font-bold text-orange-500 mb-12"
          >
            COOK COMPASS
          </motion.h2>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-6"
          >
            <a href="/search" className="bg-orange-500 text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2">
              <Search className="w-6 h-6" />
              Find Recipes
            </a>
            <a href="/about" className="bg-white text-black px-8 py-4 rounded-full text-xl font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
              <ChefHat className="w-6 h-6" />
              Learn More
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* Daily Special */}
      {dailySpecial && (
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Daily Special</h2>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl"
            >
              <div className="flex flex-col md:flex-row">
                <img 
                  src={dailySpecial.strMealThumb} 
                  alt={dailySpecial.strMeal}
                  className="w-full md:w-1/2 object-cover"
                />
                <div className="p-8">
                  <h3 className="text-3xl font-bold mb-4">{dailySpecial.strMeal}</h3>
                  <p className="text-gray-300 mb-6">{dailySpecial.strInstructions.slice(0, 200)}...</p>
                  <a 
                    href={`/recipe/${dailySpecial.idMeal}`}
                    className="bg-orange-500 text-white px-6 py-3 rounded-full inline-block hover:bg-orange-600 transition-colors"
                  >
                    View Recipe
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Indian Recipes from MealDB */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Popular Indian Recipes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {indianRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.idMeal}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-black rounded-xl overflow-hidden shadow-lg hover:transform hover:scale-105 transition-transform"
              >
                <img 
                  src={recipe.strMealThumb} 
                  alt={recipe.strMeal}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{recipe.strMeal}</h3>
                  <p className="text-gray-400 mb-4">{recipe.strInstructions.slice(0, 100)}...</p>
                  <a 
                    href={`/recipe/${recipe.idMeal}`}
                    className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
                  >
                    View Recipe →
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Authentic Indian Cuisines */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Authentic Indian Cuisines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {indianCuisines.map((recipe, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:transform hover:scale-105 transition-transform"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{recipe.name}</h3>
                  <p className="text-orange-500 mb-2">{recipe.cuisine} • {recipe.course}</p>
                  <div className="text-gray-400 mb-4">
                    <p className="mb-2">Prep Time: {recipe.prepTime}</p>
                    <p className="mb-2">Cook Time: {recipe.cookTime}</p>
                    <p>Servings: {recipe.servings}</p>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Key Ingredients:</h4>
                    <p className="text-gray-400">{recipe.ingredients.slice(0, 3).join(', ')}...</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Recipes */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Trending Recipes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trendingRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.idMeal}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-black rounded-xl overflow-hidden shadow-lg hover:transform hover:scale-105 transition-transform"
              >
                <img 
                  src={recipe.strMealThumb} 
                  alt={recipe.strMeal}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{recipe.strMeal}</h3>
                  <p className="text-gray-400 mb-4">{recipe.strInstructions.slice(0, 100)}...</p>
                  <a 
                    href={`/recipe/${recipe.idMeal}`}
                    className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
                  >
                    View Recipe →
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}