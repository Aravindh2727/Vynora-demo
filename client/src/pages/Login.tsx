import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, RotateCcw, CheckCircle2, ShieldCheck, Layers, Cpu, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DEMO_USER } from '../services/appMode';
import { DemoStorage } from '../services/demo/demoStorage';
import { GlobalSearchService } from '../services/firestoreService';
import { useContextEngineStore } from '../store/useContextEngineStore';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContextEngineStore();
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleEnterDemo = () => {
    setUser(DEMO_USER);
    GlobalSearchService.prewarmUserDatasets(DEMO_USER.id);
    navigate('/');
  };

  const handleResetAndEnter = () => {
    DemoStorage.resetStore();
    setUser(DEMO_USER);
    GlobalSearchService.prewarmUserDatasets(DEMO_USER.id);
    setResetSuccess(true);
    setTimeout(() => {
      navigate('/');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden text-textMain font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/20 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg glass-panel p-8 relative z-10 border border-glass shadow-neon-primary rounded-3xl"
      >
        {/* App Branding */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-20 h-20 rounded-full shadow-neon-primary mb-4 overflow-hidden flex items-center justify-center border-2 border-primary/40 bg-surface">
            <img src="/vynora_icon_circle.png" alt="Vynora Logo" className="w-full h-full object-cover" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2 border border-primary/30">
            <Sparkles size={13} className="animate-pulse" />
            <span>Recruiter & Technical Showcase</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1 text-textMain">Vynora</h1>
          <p className="text-textMuted text-sm">Smart AI Life Operating System • 18 Unified Domains</p>
        </div>

        {/* Recruiter Persona Card */}
        <div className="p-4 rounded-2xl bg-surface/80 border border-glass mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
              <img src={DEMO_USER.avatarUrl} alt="Persona" className="w-10 h-10 rounded-lg object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-textMain truncate">{DEMO_USER.name}</span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  Ready to Explore
                </span>
              </div>
              <p className="text-xs text-textMuted truncate">{DEMO_USER.role} • {DEMO_USER.location}</p>
            </div>
          </div>
        </div>

        {/* Feature Grid Summary */}
        <div className="grid grid-cols-2 gap-2.5 mb-6 text-xs">
          <div className="p-3 rounded-xl bg-surface border border-glass flex items-start gap-2">
            <Layers size={16} className="text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-textMain block">18 Modules</span>
              <span className="text-textMuted text-[11px]">Finance, Agri, Dairy, Health, Vault & more</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-glass flex items-start gap-2">
            <Database size={16} className="text-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-textMain block">Local Persistence</span>
              <span className="text-textMuted text-[11px]">Full CRUD, search & browser persistence</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-glass flex items-start gap-2">
            <Cpu size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-textMain block">Real Calculations</span>
              <span className="text-textMuted text-[11px]">Banking EMI, crop ROI, cattle yields</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-glass flex items-start gap-2">
            <ShieldCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-textMain block">Zero Friction</span>
              <span className="text-textMuted text-[11px]">No login, passwords, or setup needed</span>
            </div>
          </div>
        </div>

        {/* Notification Toast */}
        <AnimatePresence>
          {resetSuccess && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2"
            >
              <CheckCircle2 size={16} />
              <span>Sample data reset to original demonstration state! Launching...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="space-y-3">
          <button 
            type="button" 
            onClick={handleEnterDemo}
            className="w-full bg-gradient-to-r from-primary to-accent text-background font-bold py-3.5 px-6 rounded-2xl shadow-neon-primary hover:opacity-95 transition-all active:scale-98 flex items-center justify-center gap-2 text-sm tracking-wide"
          >
            <span>Enter Demo Workspace</span>
            <ArrowRight size={18} />
          </button>

          <button
            type="button"
            onClick={handleResetAndEnter}
            className="w-full bg-surface border border-glass hover:bg-surfaceLight text-textMuted hover:text-textMain py-2.5 px-4 rounded-xl transition-colors text-xs font-medium flex items-center justify-center gap-2 active:scale-98"
          >
            <RotateCcw size={14} className="text-amber-400" />
            <span>Reset Demo Data & Enter</span>
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-textMuted">
          Built with React 19, TypeScript, and Tailwind CSS. All changes persist locally in your browser.
        </p>
      </motion.div>
    </div>
  );
}
