import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { DEMO_USER } from '../services/appMode';
import { GlobalSearchService } from '../services/firestoreService';
import { useContextEngineStore } from '../store/useContextEngineStore';

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useContextEngineStore();

  const handleEnterDemo = () => {
    setUser(DEMO_USER);
    GlobalSearchService.prewarmUserDatasets(DEMO_USER.id);
    navigate('/');
  };

  useEffect(() => {
    // Automatically transition to demo workspace
    const timer = setTimeout(() => {
      handleEnterDemo();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 text-textMain font-sans">
      <div className="w-full max-w-md glass-panel p-8 text-center border border-glass shadow-neon-primary rounded-3xl">
        <div className="w-16 h-16 rounded-full shadow-neon-primary mx-auto mb-4 overflow-hidden border border-primary/40 bg-surface flex items-center justify-center">
          <img src="/vynora_icon_circle.png" alt="Vynora Logo" className="w-full h-full object-cover" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-3 border border-primary/30">
          <Sparkles size={13} className="animate-pulse" />
          <span>Demo Mode Active</span>
        </div>
        <h2 className="text-xl font-bold mb-2">No Registration Required</h2>
        <p className="text-xs text-textMuted mb-6 leading-relaxed">
          Vynora is operating in recruiter demonstration mode with all 18 modules unlocked and preloaded. Launching workspace...
        </p>
        <button
          type="button"
          onClick={handleEnterDemo}
          className="w-full bg-gradient-to-r from-primary to-accent text-background font-bold py-3 px-6 rounded-xl shadow-neon-primary hover:opacity-95 transition-all flex items-center justify-center gap-2 text-sm"
        >
          <span>Enter Workspace Now</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
