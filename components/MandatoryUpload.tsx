
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';

interface MandatoryUploadProps {
  user: User | null;
  onComplete: (imageUrl: string) => void;
}

const MandatoryUpload: React.FC<MandatoryUploadProps> = ({ user, onComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState<string>("");
  const [progress, setProgress] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const scanSteps = [
    "Mapping Silhouette...",
    "Analyzing Proportions...",
    "Detecting Skin Tone...",
    "Finalizing AI Profile..."
  ];

  useEffect(() => {
    let interval: any;
    if (isUploading && !isSuccess) {
      interval = setInterval(() => {
        const stepIndex = Math.floor((progress / 100) * scanSteps.length);
        const currentStep = scanSteps[Math.min(stepIndex, scanSteps.length - 1)];
        setScanStatus(currentStep);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isUploading, isSuccess, progress]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file (JPG/PNG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
      setIsConfirmed(false);
      setError(null);
      setProgress(0);
    };
    reader.onerror = () => setError("Failed to read file.");
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (err) {
      setError("Camera access denied. Please check your browser permissions or upload a file.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setPreview(dataUrl);
        setIsConfirmed(false);
        setProgress(0);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    handleFinalize();
  };

  const handleFinalize = () => {
    if (!preview) {
      setError("Please provide a photo first.");
      return;
    }
    setIsUploading(true);
    setProgress(0);

    const duration = 2800;
    const intervalTime = 40;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsSuccess(true);
          setScanStatus("Analysis Complete!");
          
          setTimeout(() => {
            onComplete(preview);
            setIsUploading(false);
            setIsSuccess(false);
          }, 1200);
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);
  };

  const handleRetake = () => {
    setPreview(null);
    setIsConfirmed(false);
    setProgress(0);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 mandala-bg pointer-events-none opacity-5"></div>
      
      <div className="bg-white w-full max-w-2xl rounded-[4rem] p-10 md:p-16 shadow-2xl relative z-10 border border-gray-100 text-center animate-in fade-in duration-700">
        <div className="mb-10">
          <span className="px-5 py-2 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">
            {preview ? 'Review Mode' : 'AI Calibration'}
          </span>
          <h2 className="text-4xl font-serif font-bold text-gray-800 mb-4">
            {preview ? 'Verify Portrait' : 'Activate Your Studio'}
          </h2>
          <p className="text-gray-500 max-w-md mx-auto leading-relaxed h-12">
            {isUploading 
              ? `Authenticating ${user?.name}...` 
              : preview 
                ? "Ensure your shoulders and posture are clearly visible." 
                : `Welcome, ${user?.name}. We need a portrait to map your silhouette.`}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100 animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <div className="max-w-sm mx-auto mb-10">
          {showCamera ? (
            <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden bg-black shadow-2xl border-4 border-white">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover -scale-x-100" 
              />
              <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-6">
                <button 
                  onClick={stopCamera} 
                  className="p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <button 
                  onClick={capturePhoto} 
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-orange-500 active:scale-90 transition-transform"
                >
                  <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                  </div>
                </button>
                <div className="w-12"></div>
              </div>
            </div>
          ) : preview ? (
            <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden border-[10px] border-white shadow-[0_40px_100px_rgba(0,0,0,0.15)] group animate-in zoom-in-95 relative">
               <img src={preview} className={`w-full h-full object-cover transition-all duration-700 ${isUploading ? 'grayscale blur-sm contrast-125' : ''}`} alt="Preview" />
               
               {/* CORNER DECORATION FOR REVIEW */}
               <div className="absolute inset-0 border-[2px] border-white/10 m-4 rounded-[2rem] pointer-events-none"></div>
               <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-white/40 rounded-tl-2xl"></div>
               <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-white/40 rounded-tr-2xl"></div>
               <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-white/40 rounded-bl-2xl"></div>
               <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-white/40 rounded-br-2xl"></div>

               {/* SCANNING OVERLAY */}
               {isUploading && (
                 <div className={`absolute inset-0 ${isSuccess ? 'bg-green-600/40' : 'bg-orange-600/30'} backdrop-blur-[2px] flex flex-col items-center justify-center transition-colors duration-500`}>
                    {!isSuccess && (
                      <div className="absolute top-0 left-0 right-0 h-3 bg-orange-500 shadow-[0_0_30px_#f97316] animate-[scan_2.5s_ease-in-out_infinite]"></div>
                    )}
                    
                    <div className={`relative z-10 ${isSuccess ? 'bg-green-600' : 'bg-black/80'} px-10 py-8 rounded-[2.5rem] border border-white/20 shadow-3xl flex flex-col items-center gap-5 animate-in zoom-in-90 w-[85%]`}>
                      {isSuccess ? (
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-green-600 animate-in bounce-in shadow-2xl">
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                      ) : (
                        <div className="w-full flex flex-col items-center gap-4">
                           <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden border border-white/10">
                              <div 
                                className="h-full bg-orange-600 transition-all duration-500 ease-linear shadow-[0_0_20px_#f97316]"
                                style={{ width: `${progress}%` }}
                              ></div>
                           </div>
                           <span className="text-white text-[12px] font-black tracking-[0.2em]">{Math.round(progress)}% MAPPED</span>
                        </div>
                      )}
                      <p className="text-white text-[10px] font-black uppercase tracking-[0.4em] text-center leading-relaxed">{scanStatus}</p>
                    </div>
                 </div>
               )}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="relative aspect-[3/4] border-4 border-dashed border-gray-100 rounded-[3rem] bg-gray-50/30 flex flex-col items-center justify-center p-12 hover:border-orange-300 hover:bg-orange-50/40 transition-all group overflow-hidden cursor-pointer shadow-inner">
                <input 
                  type="file" 
                  onChange={handleFile} 
                  className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                  accept="image/png, image/jpeg" 
                />
                <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center text-orange-600 shadow-xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all border border-gray-50">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <p className="text-xl font-bold text-gray-800 mb-2">Upload Portrait</p>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">High-Res Portrait Recommended</p>
              </div>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-gray-100"></div>
                <span className="flex-shrink mx-6 text-[11px] font-black text-gray-300 uppercase tracking-[0.5em]">OR</span>
                <div className="flex-grow border-t border-gray-100"></div>
              </div>

              <button 
                onClick={startCamera}
                className="w-full py-6 bg-white border-2 border-gray-100 rounded-[2.5rem] flex items-center justify-center gap-4 text-sm font-black text-gray-800 hover:border-orange-200 hover:bg-orange-50/30 transition-all shadow-sm group uppercase tracking-[0.2em]"
              >
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 group-hover:bg-orange-100 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                Live Capture
              </button>
            </div>
          )}
        </div>

        <div className="w-full max-w-sm mx-auto">
          {preview && !isConfirmed && !isUploading && (
            <div className="flex flex-col gap-5 animate-in slide-in-from-bottom-6 duration-700">
              <button 
                onClick={handleConfirm}
                className="w-full py-7 bg-orange-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] hover:bg-orange-700 transition-all shadow-2xl shadow-orange-100 group flex items-center justify-center gap-4"
              >
                Confirm & Map Portrait
                <svg className="w-6 h-6 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
              <button 
                onClick={handleRetake}
                className="w-full py-6 bg-gray-50 text-gray-400 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] hover:bg-gray-100 hover:text-gray-600 transition-all border border-gray-100 flex items-center justify-center gap-3"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Retake Portrait
              </button>
            </div>
          )}

          {isSuccess && (
             <div className="w-full py-7 bg-green-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-5 shadow-2xl shadow-green-100 animate-in zoom-in">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                Profile Activated
             </div>
          )}

          {!preview && !showCamera && (
            <div className="mt-10 p-8 bg-blue-50/40 rounded-[2.5rem] border border-blue-100/50 text-left relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/20 rounded-full -mr-12 -mt-12"></div>
               <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 Success Tips
               </h4>
               <ul className="text-[12px] text-blue-500/80 font-semibold space-y-2 list-none">
                  <li className="flex gap-2"><span>•</span> Use a well-lit environment</li>
                  <li className="flex gap-2"><span>•</span> Ensure neutral, upright posture</li>
                  <li className="flex gap-2"><span>•</span> Avoid hats or oversized accessories</li>
               </ul>
            </div>
          )}
        </div>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
      
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
        .bounce-in {
          animation: bounce-in 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.15); opacity: 1; }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        .shadow-3xl { box-shadow: 0 50px 120px -30px rgba(0,0,0,0.3); }
      `}</style>
    </div>
  );
};

export default MandatoryUpload;
