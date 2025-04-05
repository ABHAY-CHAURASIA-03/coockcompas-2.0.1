import { useState } from 'react';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { User } from '../types';

/**
 * Enhanced authentication page with additional user preferences
 */
export default function Auth() {
  // State for user preferences during signup
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    dietaryRestrictions: [] as string[],
    allergies: [] as string[],
    cuisinePreferences: [] as string[],
  });

  /**
   * Handle user signup completion and save additional preferences
   */
  const handleSignUpComplete = async (user: User) => {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          dietary_restrictions: preferences.dietaryRestrictions,
          allergies: preferences.allergies,
          cuisine_preferences: preferences.cuisinePreferences,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-gray-900 p-8 rounded-xl"
      >
        <h1 className="text-3xl font-bold text-center mb-8">Welcome to CookCompass</h1>
        
        {/* Supabase Auth UI with custom styling */}
        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#f97316',
                  brandAccent: '#ea580c',
                }
              }
            },
            // Enhanced style classes for form elements
            className: {
              container: 'auth-container',
              button: 'auth-button',
              input: 'auth-input',
              label: 'auth-label',
            }
          }}
          providers={[]}
          // Customize auth flow
          localization={{
            variables: {
              sign_in: {
                email_label: 'Your Email',
                password_label: 'Your Password',
              },
              sign_up: {
                email_label: 'Email Address',
                password_label: 'Create Password',
                button_label: 'Create Account',
              },
            },
          }}
          onlyThirdPartyProviders={false}
        />

        {/* Additional preferences form for new users */}
        {showPreferences && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-8 border-t border-gray-700 pt-8"
          >
            <h2 className="text-xl font-semibold mb-4">Customize Your Experience</h2>
            
            {/* Dietary Restrictions */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Dietary Restrictions
              </label>
              <div className="space-y-2">
                {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'].map((diet) => (
                  <label key={diet} className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox text-orange-500"
                      checked={preferences.dietaryRestrictions.includes(diet)}
                      onChange={(e) => {
                        const newRestrictions = e.target.checked
                          ? [...preferences.dietaryRestrictions, diet]
                          : preferences.dietaryRestrictions.filter(d => d !== diet);
                        setPreferences({ ...preferences, dietaryRestrictions: newRestrictions });
                      }}
                    />
                    <span className="ml-2">{diet}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Allergies */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Food Allergies
              </label>
              <input
                type="text"
                placeholder="Enter allergies, separated by commas"
                className="w-full px-4 py-2 bg-gray-800 rounded-lg"
                onChange={(e) => {
                  const allergies = e.target.value.split(',').map(a => a.trim());
                  setPreferences({ ...preferences, allergies });
                }}
              />
            </div>

            {/* Cuisine Preferences */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Favorite Cuisines
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Italian', 'Indian', 'Chinese', 'Mexican', 'Japanese', 'Thai'].map((cuisine) => (
                  <label key={cuisine} className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox text-orange-500"
                      checked={preferences.cuisinePreferences.includes(cuisine)}
                      onChange={(e) => {
                        const newPreferences = e.target.checked
                          ? [...preferences.cuisinePreferences, cuisine]
                          : preferences.cuisinePreferences.filter(c => c !== cuisine);
                        setPreferences({ ...preferences, cuisinePreferences: newPreferences });
                      }}
                    />
                    <span className="ml-2">{cuisine}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleSignUpComplete}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Complete Profile
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}