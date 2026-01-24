
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface AuthFormsProps {
  initialMode: 'signin' | 'signup';
  onSuccess: (user: User) => void;
  onSwitchMode: (mode: 'signin' | 'signup') => void;
}

const AuthForms: React.FC<AuthFormsProps> = ({ initialMode, onSuccess, onSwitchMode }) => {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleLogNav = () => {
      setMode('signin');
      setSuccessMessage('');
      setError('');
    };
    const handleRegNav = () => {
      setMode('signup');
      setSuccessMessage('');
      setError('');
    };
    window.addEventListener('nav-login', handleLogNav);
    window.addEventListener('nav-register', handleRegNav);
    return () => {
      window.removeEventListener('nav-login', handleLogNav);
      window.removeEventListener('nav-register', handleRegNav);
    };
  }, []);

  const generateMockJWT = (userId: string) => {
    // Generate a simple base64-like string to simulate a JWT structure
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({ sub: userId, iat: Date.now(), exp: Date.now() + 86400000 }));
    const signature = "vastra_studio_signature";
    return `${header}.${payload}.${signature}`;
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      // Fix: Explicitly type the users array from localStorage
      const users: User[] = JSON.parse(localStorage.getItem('vastra_users') || '[]');

      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }
        if (users.find((u: User) => u.email === formData.email)) {
          setError('An account with this email already exists.');
          setIsLoading(false);
          return;
        }

        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: formData.name,
          email: formData.email,
          password: formData.password, // In a real app, this would be hashed
          photoUrl: null,
          photoUploaded: false,
          createdAt: Date.now()
        };

        localStorage.setItem('vastra_users', JSON.stringify([...users, newUser]));
        
        setSuccessMessage('Registration successful! Securely encrypting your profile...');
        setTimeout(() => {
          setMode('signin');
          onSwitchMode('signin');
          setIsLoading(false);
          setFormData({ ...formData, password: '', confirmPassword: '' });
        }, 1500);
      } else {
        const user = users.find((u: User) => u.email === formData.email && u.password === formData.password);
        
        if (!user) {
          setError('Invalid credentials. Please verify your email and password.');
          setIsLoading(false);
          return;
        }

        // Add a mock token to the user object before passing it back
        const authenticatedUser = {
          ...user,
          token: generateMockJWT(user.id)
        };

        onSuccess(authenticatedUser as any);
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 mandala-bg pointer-events-none opacity-5"></div>
      
      <div className="bg-white w-full max-w-md rounded-[3rem] p-10 md:p-14 shadow-2xl relative z-10 border border-gray-100 animate-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6 shadow-xl shadow-orange-100">V</div>
          <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">
            {mode === 'signup' ? 'Join the Studio' : 'Welcome Back'}
          </h2>
          <p className="text-gray-500 text-sm">Secure biometric & identity verification</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 animate-in slide-in-from-top-1">
            <div className="flex gap-2 items-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              {error}
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 text-xs font-bold rounded-xl border border-green-100 animate-in slide-in-from-top-1">
            <div className="flex gap-2 items-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              {successMessage}
            </div>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-black outline-none focus:border-orange-200 focus:bg-white transition-all font-semibold"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-black outline-none focus:border-orange-200 focus:bg-white transition-all font-semibold"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-black outline-none focus:border-orange-200 focus:bg-white transition-all font-semibold"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Confirm Password</label>
              <input 
                type="password" 
                required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-black outline-none focus:border-orange-200 focus:bg-white transition-all font-semibold"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-orange-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-700 transition-all transform hover:-translate-y-1 shadow-xl shadow-orange-100 mt-4 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Authenticating...
              </>
            ) : (
              mode === 'signup' ? 'Create Account' : 'Secure Sign In'
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
            <button 
              disabled={isLoading}
              onClick={() => {
                const nextMode = mode === 'signup' ? 'signin' : 'signup';
                setMode(nextMode);
                onSwitchMode(nextMode);
                setSuccessMessage('');
                setError('');
              }}
              className="ml-2 font-bold text-orange-600 hover:underline disabled:opacity-30"
            >
              {mode === 'signup' ? 'Sign In' : 'Sign Up Free'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForms;
