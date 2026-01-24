
import React, { useState, useMemo, useEffect } from 'react';
import { BodyAnalysis, SavedTryOn, TryOnSession } from '../types';

interface ProfileProps {
  analysis: BodyAnalysis | null;
  savedTryOns: SavedTryOn[];
  sessionHistory: TryOnSession[];
  initialTab?: 'Closet' | 'History';
  onBack: () => void;
  onSelectSaved: (saved: SavedTryOn) => void;
  onRestoreSession: (session: TryOnSession) => void;
  onUpdateSaved: (id: string, updates: Partial<SavedTryOn>) => void;
  onDeleteSaved: (id: string) => void;
  onClearHistory: () => void;
}

const Profile: React.FC<ProfileProps> = ({ 
  analysis, 
  savedTryOns, 
  sessionHistory,
  initialTab = 'Closet',
  onBack, 
  onSelectSaved, 
  onRestoreSession,
  onUpdateSaved,
  onDeleteSaved,
  onClearHistory
}) => {
  const [activeTab, setActiveTab] = useState<'Closet' | 'History'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');
  const [tempTags, setTempTags] = useState('');

  // Update tab if initialTab changes (nav clicks)
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const filteredLooks = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return savedTryOns.filter(look => 
      look.clothingItem.name.toLowerCase().includes(q) ||
      look.clothingItem.category.toLowerCase().includes(q) ||
      look.notes?.toLowerCase().includes(q) ||
      look.tags?.some(tag => tag.toLowerCase().includes(q))
    );
  }, [savedTryOns, searchQuery]);

  const handleEdit = (look: SavedTryOn) => {
    setEditingId(look.id);
    setTempNotes(look.notes || '');
    setTempTags(look.tags?.join(', ') || '');
  };

  const handleSaveEdit = (id: string) => {
    const tags = tempTags.split(',').map(t => t.trim()).filter(t => t !== '');
    onUpdateSaved(id, { notes: tempNotes, tags });
    setEditingId(null);
  };

  const getTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${mins}m ago`;
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto py-8 px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-3 rounded-full bg-white shadow-sm hover:shadow-md transition-all text-gray-600 hover:text-orange-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-4xl font-serif font-bold text-gray-800">Your Virtual <span className="text-orange-600">Studio</span></h2>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 p-1 rounded-2xl flex">
            {(['Closet', 'History'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab === 'Closet' ? 'My Closet' : 'Activity History'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-orange-50 sticky top-24">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600 relative overflow-hidden group">
               <div className="absolute inset-0 bg-orange-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-center mb-8">Personal Silhouette</h3>
            {analysis ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                  <span className="text-xs font-black text-gray-400 uppercase">Gender</span>
                  <span className="font-bold text-gray-800">{analysis.gender}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                  <span className="text-xs font-black text-gray-400 uppercase">Body Shape</span>
                  <span className="font-bold text-gray-800">{analysis.bodyShape}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                  <span className="text-xs font-black text-gray-400 uppercase">Skin Tone</span>
                  <span className="font-bold text-gray-800">{analysis.skinTone}</span>
                </div>
                <div className="pt-4">
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center mb-4">Detected Features</p>
                   <div className="flex flex-wrap gap-2 justify-center">
                      {analysis.detectedFeatures.map((f, i) => (
                        <span key={i} className="px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-bold text-gray-600 shadow-sm">{f}</span>
                      ))}
                   </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400 text-sm">
                No silhouette analyzed yet. 
                <button onClick={onBack} className="block w-full mt-4 text-orange-600 font-bold hover:underline">Upload Photo</button>
              </div>
            )}
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-2">
          {activeTab === 'Closet' ? (
            <div className="space-y-8">
              <div className="relative mb-8">
                <input 
                  type="text"
                  placeholder="Search closet by name, tag or notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 outline-none font-medium text-sm transition-all"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {filteredLooks.length > 0 ? (
                <div className="space-y-8">
                  {filteredLooks.map((look) => (
                    <div 
                      key={look.id} 
                      className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row"
                    >
                      <div className="w-full md:w-64 aspect-[3/4] relative overflow-hidden group">
                        <img 
                          src={look.resultImage} 
                          alt={look.clothingItem.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <button 
                          onClick={() => onSelectSaved(look)}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span className="px-6 py-2 bg-white text-gray-900 rounded-full font-bold text-xs">RE-DRARE</span>
                        </button>
                      </div>
                      
                      <div className="flex-1 p-8 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="text-[10px] text-orange-600 font-black uppercase tracking-widest mb-1">{look.clothingItem.category}</div>
                            <h4 className="text-2xl font-serif font-bold text-gray-800">{look.clothingItem.name}</h4>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEdit(look)}
                              className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                              title="Edit organization tags/notes"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => onDeleteSaved(look.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className="flex-1 space-y-4">
                          {editingId === look.id ? (
                            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                              <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Notes</label>
                                <textarea 
                                  value={tempNotes}
                                  onChange={(e) => setTempNotes(e.target.value)}
                                  placeholder="E.g. Wear for Sarah's wedding cocktail night"
                                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-orange-200"
                                  rows={2}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Tags (comma separated)</label>
                                <input 
                                  type="text" 
                                  value={tempTags}
                                  onChange={(e) => setTempTags(e.target.value)}
                                  placeholder="Wedding, Summer, Fav"
                                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-orange-200"
                                />
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleSaveEdit(look.id)}
                                  className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition-all"
                                >
                                  Save Organization
                                </button>
                                <button 
                                  onClick={() => setEditingId(null)}
                                  className="px-4 py-2 bg-white border border-gray-100 text-gray-500 text-xs font-bold rounded-lg hover:bg-gray-50"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-4 mb-3">
                                 {look.selectedColor && (
                                   <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg border border-gray-100">
                                      <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: look.selectedColor.hex }}></div>
                                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">{look.selectedColor.name}</span>
                                   </div>
                                 )}
                                 {look.angle && (
                                   <div className="px-3 py-1 bg-gray-50 rounded-lg border border-gray-100">
                                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">{look.angle} View</span>
                                   </div>
                                 )}
                              </div>
                              {look.notes && (
                                <p className="text-gray-600 text-sm italic leading-relaxed">
                                  "{look.notes}"
                                </p>
                              )}
                              <div className="flex flex-wrap gap-2">
                                {look.tags && look.tags.length > 0 ? (
                                  look.tags.map((tag, i) => (
                                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-md uppercase">
                                      #{tag}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-[10px] text-gray-300 font-bold uppercase">No tags added</span>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-gray-400">
                          <span className="text-[10px] font-medium tracking-widest uppercase">
                            Saved on {new Date(look.timestamp).toLocaleDateString()}
                          </span>
                          <span className="text-xs font-bold text-gray-800">
                            {look.clothingItem.price > 0 ? `₹${look.clothingItem.price.toLocaleString()}` : 'Bespoke'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-[2.5rem] py-24 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  </div>
                  <p className="text-gray-400 font-medium">Your closet is empty. Start trying on outfits!</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-12 relative pb-20">
              <div className="flex justify-between items-center mb-8">
                 <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Chronological Log</h4>
                 <button onClick={onClearHistory} className="text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors">Clear History</button>
              </div>

              {sessionHistory.length > 0 ? (
                <div className="relative">
                  {/* Timeline Bar */}
                  <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-orange-200 via-orange-100 to-transparent"></div>
                  
                  <div className="space-y-16">
                    {sessionHistory.map((session, idx) => (
                      <div key={session.id} className="relative pl-16 group animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                        {/* Timeline Node */}
                        <div className="absolute left-0 top-0 w-12 h-12 flex items-center justify-center">
                           <div className="w-4 h-4 rounded-full bg-white border-2 border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)] z-10 group-hover:scale-125 transition-transform"></div>
                           <div className="absolute w-12 h-12 bg-orange-100/50 rounded-full animate-ping opacity-20"></div>
                        </div>

                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 hover:shadow-xl transition-all duration-500">
                          <div className="w-full md:w-44 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border-2 border-white relative group">
                             <img src={session.resultImage} className="w-full h-full object-cover" alt="History Result" />
                             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                  onClick={() => onRestoreSession(session)}
                                  className="px-5 py-2 bg-white text-gray-900 rounded-full text-[10px] font-black"
                                >
                                  RESTORE SESSION
                                </button>
                             </div>
                          </div>

                          <div className="flex-1">
                             <div className="flex items-center justify-between mb-4">
                               <div className="text-xs font-black text-orange-600 uppercase tracking-widest">
                                 {getTimeAgo(session.timestamp)}
                               </div>
                               <div className="text-[10px] text-gray-300 font-mono">#{session.id}</div>
                             </div>

                             <div className="mb-6">
                               <h5 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Outfit Elements</h5>
                               <div className="flex flex-wrap gap-2">
                                 {session.clothingItems.map(item => (
                                   <span key={item.id} className="px-3 py-1 bg-gray-50 text-gray-600 text-[10px] font-bold rounded-lg border border-gray-100">{item.name}</span>
                                 ))}
                               </div>
                             </div>

                             <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                               <h5 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-3">Analysis Context</h5>
                               <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <span className="text-[8px] text-gray-400 font-black uppercase block">Frame</span>
                                    <span className="text-xs font-bold text-gray-700">{session.analysis.bodyShape}</span>
                                  </div>
                                  <div>
                                    <span className="text-[8px] text-gray-400 font-black uppercase block">Tone</span>
                                    <span className="text-xs font-bold text-gray-700">{session.analysis.skinTone}</span>
                                  </div>
                               </div>
                             </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-24 text-center">
                   <p className="text-gray-400 italic">No activity recorded yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
