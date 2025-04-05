import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Filter, Wine } from 'lucide-react';
import type { Recipe, IndianRecipe, Category, Area, Ingredient, Mocktail } from '../types';

/**
 * Search component that allows users to search for recipes, mocktails, and Indian cuisine
 * using multiple APIs and search criteria.
 */
export default function Search() {
  // State management for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'ingredient' | 'letter' | 'indian' | 'mocktail'>('name');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [indianRecipes, setIndianRecipes] = useState<IndianRecipe[]>([]);
  const [mocktails, setMocktails] = useState<Mocktail[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch initial data for categories, areas, and ingredients on component mount
  useEffect(() => {
    Promise.all([
      fetch('/api/api/json/v1/1/list.php?c=list'),
      fetch('/api/api/json/v1/1/list.php?a=list'),
      fetch('/api/api/json/v1/1/list.php?i=list')
    ]).then(responses => Promise.all(responses.map(res => res.json())))
      .then(([categoriesData, areasData, ingredientsData]) => {
        setCategories(categoriesData.meals);
        setAreas(areasData.meals);
        setIngredients(ingredientsData.meals);
      })
      .catch(error => console.error('Error fetching lists:', error));
  }, []);

  /**
   * Main search function that handles different types of searches
   * based on the selected search type (name, ingredient, letter, etc.)
   */
  async function searchRecipes() {
    if (!searchTerm) return;
    setLoading(true);
    try {
      switch (searchType) {
        case 'name':
          // Search recipes by name using MealDB API
          const nameResponse = await fetch(`/api/api/json/v1/1/search.php?s=${searchTerm}`);
          const nameData = await nameResponse.json();
          setRecipes(nameData.meals || []);
          setIndianRecipes([]);
          setMocktails([]);
          break;

        case 'letter':
          // Search recipes by first letter
          if (searchTerm.length === 1) {
            const letterResponse = await fetch(`/api/api/json/v1/1/search.php?f=${searchTerm[0]}`);
            const letterData = await letterResponse.json();
            setRecipes(letterData.meals || []);
          }
          setIndianRecipes([]);
          setMocktails([]);
          break;

        case 'ingredient':
          // Search recipes by ingredient in both MealDB and Indian Food API
          const [mealDBResponse, indianFoodResponse] = await Promise.all([
            fetch(`/api/api/json/v1/1/filter.php?i=${searchTerm}`),
            fetch(`/indian-food/api/getmealbyingredient?ingredient=${searchTerm}`)
          ]);

          const mealDBData = await mealDBResponse.json();
          const indianFoodData = await indianFoodResponse.json();

          // Fetch detailed recipe information for each result
          if (mealDBData.meals) {
            const detailedRecipes = await Promise.all(
              mealDBData.meals.map(async (meal: any) => {
                const detailResponse = await fetch(`/api/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
                const detailData = await detailResponse.json();
                return detailData.meals[0];
              })
            );
            setRecipes(detailedRecipes);
          } else {
            setRecipes([]);
          }

          setIndianRecipes(indianFoodData || []);
          setMocktails([]);
          break;

        case 'indian':
          // Search Indian cuisine recipes
          const indianResponse = await fetch('/indian-food/api/cuisine/indian');
          const indianData = await indianResponse.json();
          setIndianRecipes(indianData.filter((recipe: IndianRecipe) => 
            recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.ingredients.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()))
          ));
          setRecipes([]);
          setMocktails([]);
          break;

        case 'mocktail':
          // Search non-alcoholic beverages
          const mocktailResponse = await fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic');
          const mocktailData = await mocktailResponse.json();
          if (mocktailData.drinks) {
            const detailedMocktails = await Promise.all(
              mocktailData.drinks.map(async (drink: any) => {
                const detailResponse = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drink.idDrink}`);
                const detailData = await detailResponse.json();
                return detailData.drinks[0];
              })
            );
            setMocktails(detailedMocktails);
          }
          setRecipes([]);
          setIndianRecipes([]);
          break;
      }
    } catch (error) {
      console.error('Error searching:', error);
      setRecipes([]);
      setIndianRecipes([]);
      setMocktails([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Search Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-center mb-8">Find Your Perfect Recipe</h1>
          
          {/* Search Input and Controls */}
          <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchRecipes()}
                placeholder={searchType === 'letter' ? 'Enter a single letter...' : 'Search recipes...'}
                maxLength={searchType === 'letter' ? 1 : undefined}
                className="w-full pl-12 pr-4 py-3 bg-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            {/* Search Type Selector */}
            <div className="flex gap-4">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as typeof searchType)}
                className="px-6 py-3 bg-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="name">Search by Name</option>
                <option value="letter">Search by First Letter</option>
                <option value="ingredient">Search by Ingredient</option>
                <option value="indian">Indian Recipes</option>
                <option value="mocktail">Mocktails</option>
              </select>
              
              <button
                onClick={searchRecipes}
                className="px-8 py-3 bg-orange-500 rounded-full hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                Search
              </button>
            </div>
          </div>

          {/* Quick Filter Categories */}
          <div className="mt-8">
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.slice(0, 5).map((category) => (
                <button
                  key={category.strCategory}
                  onClick={() => {
                    setSearchTerm(category.strCategory);
                    setSearchType('name');
                    searchRecipes();
                  }}
                  className="px-4 py-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                >
                  {category.strCategory}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Search Results Section */}
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            {/* Regular Recipe Results */}
            {recipes.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Recipes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {recipes.map((recipe) => (
                    <motion.div
                      key={recipe.idMeal}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gray-900 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-transform"
                    >
                      <img
                        src={recipe.strMealThumb}
                        alt={recipe.strMeal}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-4">{recipe.strMeal}</h3>
                        <div className="flex justify-between items-center">
                          <span className="text-orange-500">{recipe.strArea} Cuisine</span>
                          <a
                            href={`/recipe/${recipe.idMeal}`}
                            className="bg-orange-500 px-4 py-2 rounded-full hover:bg-orange-600 transition-colors"
                          >
                            View Recipe
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Indian Recipe Results */}
            {indianRecipes.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Authentic Indian Recipes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {indianRecipes.map((recipe, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gray-900 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-transform"
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
            )}

            {/* Mocktail Results */}
            {mocktails.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Mocktails</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {mocktails.map((mocktail) => (
                    <motion.div
                      key={mocktail.idDrink}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gray-900 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-transform"
                    >
                      <img
                        src={mocktail.strDrinkThumb}
                        alt={mocktail.strDrink}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-4">{mocktail.strDrink}</h3>
                        <div className="flex items-center gap-2 text-orange-500 mb-4">
                          <Wine className="w-5 h-5" />
                          <span>{mocktail.strCategory}</span>
                        </div>
                        <p className="text-gray-400 line-clamp-3">{mocktail.strInstructions}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results Message */}
            {recipes.length === 0 && indianRecipes.length === 0 && mocktails.length === 0 && (
              <div className="text-center text-gray-400">
                No results found. Try a different search term.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}