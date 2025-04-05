import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChefHat, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black text-white py-4 px-6 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <ChefHat className="w-8 h-8 text-orange-500" />
          <span className="text-2xl font-bold text-orange-500">CookCompass</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <Link to="/search" className="hover:text-orange-500 transition-colors">Search</Link>
          <Link to="/meal-planner" className="hover:text-orange-500 transition-colors flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Meal Planner
          </Link>
          <Link to="/about" className="hover:text-orange-500 transition-colors">About Us</Link>
          <Link to="/order" className="hover:text-orange-500 transition-colors">Order Food</Link>
          <Link to="/profile" className="hover:text-orange-500 transition-colors">Profile</Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-black"
          >
            <div className="flex flex-col space-y-4 p-4">
              <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
              <Link to="/search" className="hover:text-orange-500 transition-colors">Search</Link>
              <Link to="/meal-planner" className="hover:text-orange-500 transition-colors flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Meal Planner
              </Link>
              <Link to="/about" className="hover:text-orange-500 transition-colors">About Us</Link>
              <Link to="/order" className="hover:text-orange-500 transition-colors">Order Food</Link>
              <Link to="/profile" className="hover:text-orange-500 transition-colors">Profile</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}