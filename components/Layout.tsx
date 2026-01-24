
import React from 'react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onNavigate: (view: 'HOME' | 'COLLECTIONS' | 'WATCHLIST' | 'PROFILE' | 'DESIGNER' | 'CART' | 'UPLOAD') => void;
  onSignOut?: () => void;
  user?: User | null;
  cartCount?: number;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeView,
  onNavigate, 
  onSignOut,
  user,
  cartCount = 0
}) => {
  const navItems = [
    { 
      id: 'HOME', 
      label: 'Home', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      id: 'DESIGNER', 
      label: 'Designer', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.477 2.387a2 2 0 00.547 1.022l1.625 1.625a2 2 0 002.828 0l1.625-1.625a2 2 0 00.547-1.022l.477-2.387a2 2 0 00-1.414-1.96l-2.387-.477z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2" />
        </svg>
      )
    },
    { 
      id: 'COLLECTIONS', 
      label: 'Catalog', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    { 
      id: 'WATCHLIST', 
      label: 'Closet', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    }
  ];

  const handleLogoClick = () => {
    if (user) {
      onNavigate(user.photoUploaded ? 'HOME' : 'UPLOAD');
    } else {
      onNavigate('HOME'); // Landing
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-gray-900 relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 mandala-bg pointer-events-none"></div>
      
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleLogoClick}>
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-200 group-hover:scale-105 transition-transform">V</div>
            <h1 className="text-2xl font-serif font-bold tracking-tight text-gray-800 hidden sm:block">Vastra <span className="text-orange-600">AI</span></h1>
          </div>
          
          <nav className="flex items-center gap-2 md:gap-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center bg-gray-50/50 p-1 rounded-2xl border border-gray-100 mr-2">
                  {navItems.map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => onNavigate(item.id as any)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        activeView === item.id 
                          ? 'bg-white text-orange-600 shadow-sm border border-orange-100' 
                          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="h-8 w-px bg-gray-100 mx-2 hidden md:block"></div>

                {/* Cart Button */}
                <button 
                  onClick={() => onNavigate('CART')}
                  className={`relative p-2.5 rounded-xl transition-all ${activeView === 'CART' ? 'bg-orange-50 text-orange-600' : 'text-gray-400 hover:text-orange-600 hover:bg-orange-50/50'}`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                      {cartCount}
                    </span>
                  )}
                </button>

                <button onClick={() => onNavigate('PROFILE')} className="hover:opacity-80 transition-opacity flex items-center gap-3 ml-2">
                  <div className="hidden lg:block text-right">
                    <p className="text-[8px] font-black text-gray-400 uppercase leading-none mb-1">Authenticated</p>
                    <p className="text-xs font-bold text-gray-900">{user.name.split(' ')[0]}</p>
                  </div>
                  {user.photoUrl ? (
                    <img src={user.photoUrl} className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-md ring-1 ring-orange-100" alt="Profile" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                  )}
                </button>
                
                <button 
                  onClick={onSignOut}
                  className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all ml-1"
                  title="Sign Out"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('nav-login'))}
                  className="px-5 py-2.5 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all"
                >
                  Login
                </button>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('nav-register'))}
                  className="px-6 py-2.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-lg shadow-gray-200"
                >
                  Register
                </button>
              </div>
            )}
          </nav>
        </div>
        
        {/* Mobile Nav for User */}
        {user && (
          <div className="md:hidden flex justify-around gap-2 mt-4 pt-4 border-t border-gray-50">
             {navItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => onNavigate(item.id as any)}
                  className={`flex flex-col items-center gap-1.5 py-1 px-3 transition-all ${
                    activeView === item.id ? 'text-orange-600 scale-110' : 'text-gray-400'
                  }`}
                >
                  {item.icon}
                  <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
                </button>
             ))}
             <button 
                onClick={() => onNavigate('CART')}
                className={`flex flex-col items-center gap-1.5 py-1 px-3 transition-all ${
                  activeView === 'CART' ? 'text-orange-600 scale-110' : 'text-gray-400'
                }`}
              >
                <div className="relative">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  {cartCount > 0 && <span className="absolute -top-2 -right-2 w-3.5 h-3.5 bg-orange-600 text-white text-[7px] font-black rounded-full flex items-center justify-center">{cartCount}</span>}
                </div>
                <span className="text-[8px] font-black uppercase tracking-tighter">Cart</span>
             </button>
          </div>
        )}
      </header>

      <main className="relative z-10 flex-1">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-100 text-gray-400 py-16 px-6 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 font-bold text-sm">V</div>
              <h2 className="text-xl font-serif font-bold text-gray-800 tracking-tight">Vastra AI</h2>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm mb-6">
              Revolutionizing Indian traditional fashion through advanced silhouette mapping and seamless virtual try-on technology.
            </p>
            <div className="flex gap-4">
               {['Twitter', 'Instagram', 'Pinterest'].map(social => (
                 <a key={social} href="#" className="text-[10px] font-black uppercase tracking-widest hover:text-orange-600 transition-colors">{social}</a>
               ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-[10px] font-black text-gray-800 uppercase tracking-[0.3em] mb-6">Explore</h4>
            <ul className="space-y-3 text-xs font-bold">
              <li><button onClick={() => onNavigate('COLLECTIONS')} className="hover:text-orange-600 transition-colors">Men's Ethnic</button></li>
              <li><button onClick={() => onNavigate('COLLECTIONS')} className="hover:text-orange-600 transition-colors">Women's Bridal</button></li>
              <li><button onClick={() => onNavigate('DESIGNER')} className="hover:text-orange-600 transition-colors">AI Designer</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-gray-800 uppercase tracking-[0.3em] mb-6">Company</h4>
            <ul className="space-y-3 text-xs font-bold">
              <li><a href="#" className="hover:text-orange-600 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-orange-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-orange-600 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-50 pt-10 mt-16">
          <div className="text-center text-gray-400 text-[10px] uppercase tracking-[0.3em] font-bold">
            © 2024 Vastra AI • Premium Virtual Try-On Studio
          </div>
          <p className="text-[10px] font-bold text-gray-300">Handcrafted for Royal Silhouettes</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
