import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Camera, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import type { User } from '../types';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        if (data) {
          setUser(data);
          setName(data.name || '');
          setAvatarUrl(data.avatar_url || '');
          setBannerUrl(data.banner_url || '');
        }
      }
    } catch (error) {
      console.error('Error loading user data!');
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('No user logged in');

      const updates = {
        id: authUser.id,
        name,
        avatar_url: avatarUrl,
        banner_url: bannerUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates);

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile!');
      toast.error('Failed to update profile');
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-black text-white pt-24 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-gray-900 rounded-xl overflow-hidden"
      >
        <div 
          className="h-48 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${bannerUrl || 'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'})` }}
        >
          <button className="absolute bottom-4 right-4 bg-black bg-opacity-50 p-2 rounded-full">
            <Camera className="w-6 h-6" />
          </button>
        </div>

        <div className="px-8 py-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <img
                src={avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-orange-500"
              />
              <button className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="bg-transparent text-2xl font-bold border-b border-gray-700 focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          <button
            onClick={updateProfile}
            className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
}