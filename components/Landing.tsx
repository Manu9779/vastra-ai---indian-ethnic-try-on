
import React from 'react';

interface LandingProps {
  onRegister: () => void;
  onLogin: () => void;
}

const Landing: React.FC<LandingProps> = ({ onRegister, onLogin }) => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://i.pinimg.com/1200x/8e/23/d4/8e23d4a915084616c498172370795fdd.jpg" 
            className="w-full h-full object-cover opacity-40"
            alt="Traditional Fashion"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/60 to-gray-900"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <span className="inline-block px-5 py-2 bg-orange-600/20 backdrop-blur-md border border-orange-500/30 text-orange-400 rounded-full text-xs font-black uppercase tracking-[0.4em] mb-8">
            The Future of Ethnic Fashion
          </span>
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-8 tracking-tight">
            Vastra <span className="text-orange-500">AI</span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto">
            Experience virtual draping like never before. Our advanced AI maps your silhouette to deliver perfect ethnic recommendations.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button 
              onClick={onRegister}
              className="px-10 py-5 bg-orange-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-700 transition-all transform hover:scale-105 shadow-2xl shadow-orange-900/40"
            >
              Start Free Registration
            </button>
            <button 
              onClick={onLogin}
              className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all"
            >
              Sign In to Studio
            </button>
          </div>
        </div>
      </section>

      {/* Feature Preview (Locked) */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-gray-800 mb-4">AI Studio Preview</h2>
          <p className="text-gray-500">Registration and photo-upload required to unlock these features.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Virtual Try-On", desc: "Perfectly draped sarees and sherwanis.", icon: "✨" },
            { title: "Body Analysis", desc: "AI mapping of your personal silhouette.", icon: "📐" },
            { title: "Smart Wardrobe", desc: "Save and organize your favorite looks.", icon: "👔" }
          ].map((feature, i) => (
            <div key={i} className="relative group overflow-hidden bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm transition-all">
              <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center opacity-100 group-hover:bg-gray-50/60 transition-all">
                <div className="w-16 h-16 bg-white shadow-xl rounded-full flex items-center justify-center text-2xl mb-4">🔒</div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Feature Locked</p>
              </div>
              <div className="text-4xl mb-6">{feature.icon}</div>
              <h3 className="text-2xl font-serif font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
