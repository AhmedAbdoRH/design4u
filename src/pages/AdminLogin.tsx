import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Define the dark brown color used in the gradient
const brownDark = '#3d2c1d'; // Dark brown color

// Define the light gold color using the hex code
const lightGold = '#FFD700'; // Standard gold color

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      navigate('/admin/dashboard');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError('');

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.session) {
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      // Enhance error message if it's authentication related
      let userFriendlyError = err.message;
      if (err.message.includes('Invalid login credentials')) {
          userFriendlyError = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
      } else if (err.message.includes('Email not confirmed')) {
           userFriendlyError = 'البريد الإلكتروني غير مؤكد. يرجى التحقق من صندوق الوارد الخاص بك.';
      }
      setError(userFriendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Apply the dark gradient background to the main container
    <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundColor: '#2a2a2a'}}>
      {/* Form container with Glassmorphism style */}
      {/* Replaced solid dark background with transparent background, blur, and subtle border */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl shadow-black/40 w-full max-w-md border border-white/10 text-gray-200">
        {/* Title with light gold color */}
        <h2 className={`text-2xl font-bold mb-6 text-center text-[${lightGold}]`}>تسجيل الدخول للوحة التحكم</h2>
        {/* Error message styling */}
        {error && (
          <div className="bg-red-800/30 border border-red-700 text-red-300 p-3 rounded mb-4">
            {error}
          </div>
        )}
        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            {/* Label with light text color */}
            <label className="block text-gray-300 mb-2">البريد الإلكتروني</label>
            {/* Input with Glassmorphism style and gold focus ring */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[${lightGold}] focus:border-transparent bg-black/20 backdrop-blur-sm border border-white/10`}
              required
            />
          </div>
          <div>
            {/* Label with light text color */}
            <label className="block text-gray-300 mb-2">كلمة المرور</label>
             {/* Input with Glassmorphism style and gold focus ring */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[${lightGold}] focus:border-transparent bg-black/20 backdrop-blur-sm border border-white/10`}
              required
            />
          </div>
          {/* Login Button with gold style */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[${lightGold}] text-black py-3 rounded hover:bg-yellow-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold`}
          >
            {isLoading ? 'جاري تسجيل الدخول...' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  );
}