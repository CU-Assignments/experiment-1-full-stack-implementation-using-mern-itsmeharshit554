import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogOut, User, School, Calendar } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  college: string;
  created_at: string;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/login');
          return;
        }

        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="gradient-bg shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white animate-slide-in">
                Welcome, {profile.name}
              </h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white transition-all duration-300 transform hover:scale-105"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow-xl rounded-xl p-8 animate-fade-in transform transition-all duration-300 hover:shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Your Profile
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="bg-gray-50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105">
                <div className="flex items-center space-x-3">
                  <User className="h-6 w-6 text-indigo-600" />
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                </div>
                <dd className="mt-3 text-lg font-semibold text-gray-900">{profile.name}</dd>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105">
                <div className="flex items-center space-x-3">
                  <School className="h-6 w-6 text-indigo-600" />
                  <dt className="text-sm font-medium text-gray-500">College</dt>
                </div>
                <dd className="mt-3 text-lg font-semibold text-gray-900">{profile.college}</dd>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-6 w-6 text-indigo-600" />
                  <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                </div>
                <dd className="mt-3 text-lg font-semibold text-gray-900">
                  {new Date(profile.created_at).toLocaleDateString()}
                </dd>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}