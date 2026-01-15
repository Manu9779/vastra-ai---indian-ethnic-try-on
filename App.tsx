
import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import Landing from './components/Landing';
import AuthForms from './components/AuthForms';
import MandatoryUpload from './components/MandatoryUpload';
import Profile from './components/Profile';
import { User, BodyAnalysis, ClothingItem, SavedTryOn, TryOnSession, Gender, CameraAngle, ColorSwatch, CartItem } from './types';
import { CLOTHING_DATABASE, ETHNIC_COLORS } from './constants';
import { analyzeUserImage, generateTryOnImage, generateClothingImage } from './services/geminiService';

type ActiveView = 'LANDING' | 'LOGIN' | 'REGISTER' | 'UPLOAD' | 'HOME' | 'COLLECTIONS' | 'WATCHLIST' | 'PROFILE' | 'DESIGNER' | 'CART';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('vastra_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeView, setActiveView] = useState<ActiveView>(() => {
    const saved = localStorage.getItem('vastra_current_user');
    if (!saved) return 'LANDING';
    const user = JSON.parse(saved) as User;
    return user.photoUploaded ? 'HOME' : 'UPLOAD';
  });

  const [userImage, setUserImage] = useState<string | null>(currentUser?.photoUrl || null);
  const [analysis, setAnalysis] = useState<BodyAnalysis | null>(() => {
    const saved = localStorage.getItem('vastra_analysis');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [selectedClothes, setSelectedClothes] = useState<ClothingItem[]>([]);
  const [selectedColor, setSelectedColor] = useState<ColorSwatch | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [tryOnResults, setTryOnResults] = useState<Partial<Record<CameraAngle, string>>>({});
  const [activeAngle, setActiveAngle] = useState<CameraAngle>('Front');
  const [isTryingOn, setIsTryingOn] = useState(false);
  const [generatingAngles, setGeneratingAngles] = useState<Set<CameraAngle>>(new Set());
  
  const [catalogGender, setCatalogGender] = useState<Gender>(Gender.FEMALE);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (analysis?.gender && analysis.gender !== Gender.UNSPECIFIED) {
      setCatalogGender(analysis.gender);
    }
  }, [analysis]);
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('vastra_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [error, setError] = useState<string | null>(null);

  const [savedTryOns, setSavedTryOns] = useState<SavedTryOn[]>(() => {
    const saved = localStorage.getItem('vastra_saved_looks');
    return saved ? JSON.parse(saved) : [];
  });
  const [sessionHistory, setSessionHistory] = useState<TryOnSession[]>(() => {
    const saved = localStorage.getItem('vastra_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('vastra_current_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    if (analysis) localStorage.setItem('vastra_analysis', JSON.stringify(analysis));
  }, [analysis]);

  useEffect(() => {
    localStorage.setItem('vastra_saved_looks', JSON.stringify(savedTryOns));
  }, [savedTryOns]);

  useEffect(() => {
    localStorage.setItem('vastra_history', JSON.stringify(sessionHistory));
  }, [sessionHistory]);

  useEffect(() => {
    localStorage.setItem('vastra_cart', JSON.stringify(cart));
  }, [cart]);

  const handleSignOut = () => {
    setCurrentUser(null);
    setActiveView('LANDING');
    setUserImage(null);
    setAnalysis(null);
    setTryOnResults({});
    setSelectedClothes([]);
    setCart([]);
    localStorage.clear();
  };

  const addToCart = (item: ClothingItem, color: ColorSwatch | null = null) => {
    const newItem: CartItem = {
      cartId: Math.random().toString(36).substring(2, 9),
      item,
      color
    };
    setCart(prev => [...prev, newItem]);
  };

  const calculateMatchScore = (item: ClothingItem, analysis: BodyAnalysis | null) => {
    if (!analysis) return 0;
    let score = 0;
    if (item.gender !== analysis.gender && item.gender !== Gender.UNSPECIFIED) return 15;
    if (item.suitableShapes.includes(analysis.bodyShape)) score += 60; else score += 25;
    const skin = (analysis.skinTone || "").toLowerCase();
    const isFair = skin.includes('fair') || skin.includes('light');
    const isDeep = skin.includes('dusky') || skin.includes('deep') || skin.includes('wheatish');
    const desc = (item.description || "").toLowerCase();
    const coolTones = ['emerald', 'ruby', 'navy', 'maroon', 'royal', 'indigo', 'burgundy'];
    const warmTones = ['peach', 'ivory', 'mint', 'pastel', 'saffron', 'gold', 'tangerine'];
    if (isFair && coolTones.some(c => desc.includes(c))) score += 20;
    else if (isDeep && warmTones.some(c => desc.includes(c))) score += 20;
    else score += 12;
    return Math.min(99, score);
  };

  const recommendedItems = useMemo(() => {
    const combined = [...CLOTHING_DATABASE];
    if (!analysis) return combined;
    return combined
      .filter(item => item.gender === analysis.gender || item.gender === Gender.UNSPECIFIED)
      .sort((a, b) => calculateMatchScore(b, analysis) - calculateMatchScore(a, analysis));
  }, [analysis]);

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.photoUploaded) {
      setActiveView('HOME');
      setUserImage(user.photoUrl);
      if (user.photoUrl) triggerBodyAnalysis(user.photoUrl);
    } else {
      setActiveView('UPLOAD');
    }
  };

  const triggerBodyAnalysis = async (imageUrl: string) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeUserImage(imageUrl);
      setAnalysis(result);
    } catch (e) { setError("Biometric scan sequence failed."); } finally { setIsAnalyzing(false); }
  };

  const handleUploadComplete = (imageUrl: string) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, photoUrl: imageUrl, photoUploaded: true };
    setCurrentUser(updatedUser);
    setUserImage(imageUrl);
    setActiveView('HOME');
    triggerBodyAnalysis(imageUrl);
  };

  const handleTryOn = async (targetAngle: CameraAngle = 'Front', itemToTry?: ClothingItem, overrideColor?: ColorSwatch) => {
    if (!userImage) return;
    const items = itemToTry ? [itemToTry] : selectedClothes;
    if (items.length === 0) return;
    const activeColor = overrideColor || selectedColor;
    
    setIsTryingOn(true);
    setActiveAngle(targetAngle);
    setGeneratingAngles(prev => new Set(prev).add(targetAngle));
    setError(null);

    try {
      const result = await generateTryOnImage(userImage, items.map(i => i.name), targetAngle, analysis, activeColor?.prompt);
      setTryOnResults(prev => ({ ...prev, [targetAngle]: result }));
      if (targetAngle === 'Front' && analysis) {
        const newSession: TryOnSession = { 
          id: Math.random().toString(36).substring(2, 8).toUpperCase(), 
          clothingItems: items, 
          resultImage: result, 
          analysis: analysis, 
          timestamp: Date.now() 
        };
        setSessionHistory(prev => [newSession, ...prev]);
      }
    } catch (e: any) { 
      setError(`${e.message}`); 
    } finally { 
      setIsTryingOn(false); 
      setGeneratingAngles(prev => { const next = new Set(prev); next.delete(targetAngle); return next; }); 
    }
  };

  const handleSelectItem = (item: ClothingItem) => {
    setSelectedClothes([item]);
    setSelectedColor(null);
    setTryOnResults({});
    setActiveView('HOME');
    handleTryOn('Front', item);
  };

  const handleColorChange = (color: ColorSwatch) => {
    setSelectedColor(color);
    handleTryOn(activeAngle, undefined, color);
  };

  const handleSaveToCloset = () => {
    const currentImg = tryOnResults[activeAngle];
    if (!currentImg || !selectedClothes[0]) return;
    const newSavedLook: SavedTryOn = { 
      id: Math.random().toString(36).substring(2, 11), 
      clothingItem: selectedClothes[0], 
      resultImage: currentImg, 
      timestamp: Date.now(), 
      angle: activeAngle, 
      selectedColor: selectedColor 
    };
    setSavedTryOns(prev => [newSavedLook, ...prev]);
  };

  const renderView = () => {
    switch (activeView) {
      case 'LANDING': return <Landing onRegister={() => setActiveView('REGISTER')} onLogin={() => setActiveView('LOGIN')} />;
      case 'LOGIN': return <AuthForms initialMode="signin" onSuccess={handleAuthSuccess} onSwitchMode={(m) => setActiveView(m === 'signin' ? 'LOGIN' : 'REGISTER')} />;
      case 'REGISTER': return <AuthForms initialMode="signup" onSuccess={handleAuthSuccess} onSwitchMode={(m) => setActiveView(m === 'signin' ? 'LOGIN' : 'REGISTER')} />;
      case 'UPLOAD': return <MandatoryUpload user={currentUser} onComplete={handleUploadComplete} />;
      case 'COLLECTIONS': 
        const catalogItems = CLOTHING_DATABASE.filter(item => {
          const genderMatch = item.gender === catalogGender || item.gender === Gender.UNSPECIFIED;
          const searchMatch = !catalogSearch || item.name.toLowerCase().includes(catalogSearch.toLowerCase());
          const categoryMatch = !selectedCategory || item.category === selectedCategory;
          return genderMatch && searchMatch && categoryMatch;
        });

        return (
          <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
              <div>
                <h2 className="text-4xl font-serif font-bold text-gray-800 tracking-tight">The <span className="text-orange-600">Vault</span></h2>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-3">Curated ethnic collections</p>
              </div>
              
              <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                <button onClick={() => setCatalogGender(Gender.FEMALE)} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${catalogGender === Gender.FEMALE ? 'bg-orange-600 text-white shadow-xl' : 'text-gray-400'}`}>Womenswear</button>
                <button onClick={() => setCatalogGender(Gender.MALE)} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${catalogGender === Gender.MALE ? 'bg-orange-600 text-white shadow-xl' : 'text-gray-400'}`}>Menswear</button>
              </div>

              <div className="flex gap-4 flex-1 max-w-sm">
                <input type="text" placeholder="Search archive..." value={catalogSearch} onChange={(e) => setCatalogSearch(e.target.value)} className="w-full pl-6 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm outline-none shadow-sm" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {catalogItems.map(item => (
                <div key={item.id} className="group bg-white rounded-[3rem] overflow-hidden border border-gray-100 transition-all hover:shadow-4xl flex flex-col hover:-translate-y-2 cursor-pointer" onClick={() => handleSelectItem(item)}>
                  <div className="aspect-[3/4] overflow-hidden relative">
                    <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={item.name} />
                    <div className="absolute top-8 right-8 bg-white/95 backdrop-blur px-5 py-2.5 rounded-2xl text-[12px] font-black shadow-2xl text-gray-900">₹{item.price.toLocaleString()}</div>
                  </div>
                  <div className="p-10 flex-1">
                    <h4 className="font-bold text-gray-900 text-xl leading-snug mb-4 line-clamp-1">{item.name}</h4>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'HOME':
      default: return (
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-12 animate-in fade-in duration-700">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-5xl font-serif font-bold text-gray-800 tracking-tight">Studio <span className="text-orange-600">Interface</span></h2>
              <p className="text-gray-500 mt-3 text-lg">{isAnalyzing ? "Biometric mapping in progress..." : analysis ? `Precision silhouette mapping active for ${analysis.bodyShape} frame.` : "Identity ready for high-fidelity drapping."}</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setActiveView('UPLOAD')} className="px-10 py-5 bg-white text-gray-600 border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:border-orange-200 transition-all shadow-md">Recalibrate Biometrics</button>
            </div>
          </div>
          
          <div className="flex flex-col gap-24">
            <div className="w-full">
              <div className="bg-white p-8 md:p-16 rounded-[6rem] shadow-5xl border border-gray-50 overflow-hidden relative">
                <div className="flex flex-col xl:flex-row gap-24">
                   <div className="xl:col-span-10 flex-1">
                      <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                        <div>
                          <h3 className="text-4xl font-serif font-bold text-gray-800 tracking-tight">H-Drape <span className="text-orange-600">Master</span></h3>
                          <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] mt-3">High-Fidelity Neural Garment Integration</p>
                        </div>
                        {selectedClothes.length > 0 && (
                          <div className="flex flex-wrap gap-4">
                             {(['Front', 'Side', 'Back', 'Close-up Detail', '360 View'] as CameraAngle[]).map((angle) => (
                               <button key={angle} onClick={() => handleTryOn(angle)} className={`px-10 py-5 rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] transition-all border ${activeAngle === angle ? 'bg-orange-600 text-white border-orange-600 shadow-2xl' : 'bg-gray-50 text-gray-400 border-gray-100 hover:border-orange-200'}`}>
                                 {generatingAngles.has(angle) && <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-3"></span>}
                                 {angle}
                               </button>
                             ))}
                          </div>
                        )}
                      </div>

                      {/* ENLARGED DISPLAY FRAME */}
                      <div className={`${activeAngle === '360 View' ? 'aspect-video' : 'aspect-[3/4.5]'} max-w-7xl mx-auto rounded-[6rem] overflow-hidden border-[30px] border-white shadow-5xl relative bg-[#f9f8f6] group transition-all duration-1000 ease-out`}>
                        {isTryingOn ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-3xl z-40">
                             <div className="relative">
                               <div className="w-32 h-32 border-[10px] border-orange-50 rounded-full"></div>
                               <div className="absolute inset-0 w-32 h-32 border-[10px] border-orange-600 animate-spin border-t-transparent rounded-full shadow-[0_0_50px_rgba(249,115,22,0.3)]"></div>
                             </div>
                             <p className="text-4xl font-serif italic text-gray-900 mt-16 tracking-wide">Syncing Photorealistic Drape...</p>
                          </div>
                        ) : tryOnResults[activeAngle] ? (
                          <div className="h-full w-full relative">
                            {/* OBJECT-CONTAIN ENSURES NO CROPPING ON THE LARGE FRAME */}
                            <img src={tryOnResults[activeAngle]} className="w-full h-full object-contain bg-transparent animate-in fade-in duration-[1.5s]" alt="High Fidelity Result" />
                            
                            <div className="absolute bottom-16 left-16 right-16 z-30 pointer-events-none">
                               <div className="p-12 rounded-[5rem] bg-white/80 backdrop-blur-3xl border border-white/80 shadow-6xl flex items-center justify-between pointer-events-auto max-w-5xl mx-auto">
                                  <div className="flex gap-12 items-center">
                                     <div className="w-24 h-32 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                                        <img src={selectedClothes[0].imageUrl} className="w-full h-full object-cover" />
                                     </div>
                                     <div>
                                        <h4 className="text-4xl font-serif font-bold text-gray-900 tracking-tight">{selectedClothes[0].name}</h4>
                                        <div className="flex gap-6 mt-4">
                                           <span className="px-6 py-2 bg-orange-600 text-white text-[11px] font-black rounded-xl uppercase tracking-[0.2em]">₹{selectedClothes[0].price.toLocaleString()}</span>
                                           <span className="px-6 py-2 bg-gray-900/5 text-gray-500 text-[11px] font-black rounded-xl uppercase tracking-[0.2em]">Studio Confirmed</span>
                                        </div>
                                     </div>
                                  </div>
                                  <div className="flex gap-6">
                                     <button onClick={handleSaveToCloset} className="p-8 bg-white text-gray-400 hover:text-orange-600 rounded-[3rem] border border-gray-100 shadow-lg transition-all active:scale-90">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                     </button>
                                     <button onClick={() => addToCart(selectedClothes[0], selectedColor)} className="px-16 py-8 bg-gray-900 text-white rounded-[3rem] font-black text-[13px] uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl active:scale-95">Acquire Ensemble</button>
                                  </div>
                               </div>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full w-full flex flex-col items-center justify-center p-24 text-center bg-gray-50/20">
                             <div className="w-48 h-48 bg-white rounded-[6rem] flex items-center justify-center shadow-4xl mb-16 text-gray-200">
                                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                             </div>
                             <h4 className="text-gray-400 font-serif text-6xl mb-8 italic tracking-tight">Identity Ready for Mapping</h4>
                             <p className="text-[13px] font-black text-gray-300 uppercase tracking-[0.6em] max-w-xl mx-auto leading-loose">Select a target ensemble from the curated archive to initialize high-fidelity neural fitting.</p>
                          </div>
                        )}
                      </div>
                   </div>

                   <div className="xl:w-[500px] space-y-20">
                      <div className="bg-[#fcfcfb] p-16 rounded-[6rem] border border-gray-100 shadow-inner">
                        <h5 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.5em] mb-12 flex items-center justify-between">
                           Source Portrait
                           <div className={`w-4 h-4 rounded-full ${userImage ? 'bg-green-500 animate-pulse shadow-[0_0_20px_rgba(34,197,94,0.6)]' : 'bg-gray-200'}`}></div>
                        </h5>
                        <div className="aspect-[3/4.5] rounded-[5rem] overflow-hidden border-[10px] border-white shadow-5xl bg-gray-100 relative">
                           {userImage ? (
                             <>
                               <img src={userImage} className={`w-full h-full object-cover transition-all duration-[1.5s] ${isTryingOn ? 'grayscale blur-md opacity-30' : ''}`} alt="Profile" />
                               {isTryingOn && (
                                 <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-24 h-24 border-t-8 border-orange-600 rounded-full animate-spin"></div>
                                 </div>
                               )}
                             </>
                           ) : (
                             <div className="w-full h-full flex items-center justify-center opacity-20"><svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>
                           )}
                        </div>
                        <p className="text-[12px] font-bold text-gray-300 uppercase text-center mt-12 tracking-[0.5em]">Identity Target Calibrated</p>
                      </div>

                      {selectedClothes.length > 0 && (
                        <div className="bg-white p-16 rounded-[6rem] shadow-5xl border border-orange-50/50">
                           <h5 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.5em] mb-14 text-center">Spectral Variants</h5>
                           <div className="grid grid-cols-4 gap-8">
                              <button onClick={() => handleColorChange(null as any)} className={`aspect-square rounded-[2rem] border-4 flex items-center justify-center text-[11px] font-black uppercase tracking-tighter transition-all ${!selectedColor ? 'border-orange-500 bg-white shadow-2xl scale-110' : 'border-gray-50 bg-gray-50 text-gray-300'}`}>Native</button>
                              {(selectedClothes[0].availableColors || ETHNIC_COLORS).map(color => (
                                <button key={color.name} onClick={() => handleColorChange(color)} className={`aspect-square rounded-[2rem] border-4 transition-all duration-700 ${selectedColor?.name === color.name ? 'border-orange-500 scale-125 shadow-3xl z-10' : 'border-white hover:border-orange-100'}`} style={{ backgroundColor: color.hex }}></button>
                              ))}
                           </div>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-24 px-8">
                 <div>
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-[1.2em] mb-8">Curated Archives</h3>
                    <p className="text-7xl font-serif font-bold text-gray-800 tracking-tight">Elite <span className="text-orange-600">Ensembles</span></p>
                 </div>
                 <button onClick={() => setActiveView('COLLECTIONS')} className="px-14 py-8 bg-white border border-gray-100 rounded-[3.5rem] text-[15px] font-black uppercase tracking-[0.4em] hover:border-orange-200 transition-all shadow-6xl flex items-center gap-8 group">Explore Archive <svg className="w-8 h-8 group-hover:translate-x-4 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24 px-4">
                {recommendedItems.slice(0, 4).map(item => {
                  const score = calculateMatchScore(item, analysis);
                  return (
                    <div key={item.id} className="group bg-white rounded-[6rem] overflow-hidden border border-gray-100 transition-all duration-700 hover:shadow-6xl flex flex-col cursor-pointer relative" onClick={() => handleSelectItem(item)}>
                      <div className={`absolute top-12 left-12 z-20 ${score >= 90 ? 'bg-orange-600' : 'bg-gray-800'} text-white px-8 py-6 rounded-[2.5rem] shadow-4xl border border-white/20`}>
                         <div className="flex flex-col items-center">
                            <span className="text-4xl font-black leading-none">{score}%</span>
                            <span className="text-[10px] font-black uppercase tracking-widest mt-2 opacity-60">Match</span>
                         </div>
                      </div>
                      <div className="aspect-[3/4.5] overflow-hidden relative">
                        <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[5s] ease-out" alt={item.name} />
                        <div className="absolute top-12 right-12 bg-white/95 backdrop-blur px-8 py-5 rounded-[2rem] text-[16px] font-black shadow-5xl text-gray-900 border border-white/50">₹{item.price.toLocaleString()}</div>
                      </div>
                      <div className="p-16">
                        <h4 className="font-bold text-gray-900 text-4xl mb-6 leading-tight group-hover:text-orange-600 transition-colors duration-500">{item.name}</h4>
                        <p className="text-[13px] text-gray-400 font-black uppercase tracking-[0.5em]">{item.category}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <Layout user={currentUser} activeView={activeView} onSignOut={handleSignOut} onNavigate={(v) => setActiveView(v as any)} cartCount={cart.length}>
      <div className="relative">
        {error && <div className="max-w-7xl mx-auto mt-12 px-6"><div className="p-10 bg-red-50 border-l-[12px] border-red-500 text-red-900 rounded-[3rem] shadow-2xl flex justify-between items-center animate-in slide-in-from-top-8"><span className="text-xl font-bold flex items-center gap-6"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" /></svg>{error}</span><button onClick={() => setError(null)} className="p-4 hover:bg-red-100 rounded-full transition-colors"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg></button></div></div>}
        {renderView()}
      </div>
      <style>{`
        .shadow-5xl { box-shadow: 0 100px 200px -50px rgba(0,0,0,0.15); }
        .shadow-6xl { box-shadow: 0 120px 250px -60px rgba(0,0,0,0.25); }
      `}</style>
    </Layout>
  );
};

export default App;
