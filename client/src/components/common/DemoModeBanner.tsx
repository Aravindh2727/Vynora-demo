import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, ShieldCheck, Info, X, CheckCircle2, Database, Layers } from 'lucide-react';
import { DemoStorage } from '../../services/demo/demoStorage';
import { isDemoMode, setAppMode, DEMO_USER } from '../../services/appMode';
import { ConfirmModal } from './ConfirmModal';

interface DemoModeBannerProps {
  onDataReset?: () => void;
}

export const DemoModeBanner: React.FC<DemoModeBannerProps> = ({ onDataReset }) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showArchModal, setShowArchModal] = useState(false);
  const [resetSuccessToast, setResetSuccessToast] = useState(false);

  if (!isDemoMode()) {
    return null;
  }

  const handleConfirmReset = () => {
    setShowResetConfirm(false);
    DemoStorage.resetStore();
    if (onDataReset) {
      onDataReset();
    }
    setResetSuccessToast(true);
    setTimeout(() => {
      setResetSuccessToast(false);
      window.location.reload();
    }, 900);
  };

  const handleSwitchToProduction = () => {
    setAppMode('production');
    window.location.href = '/login';
  };

  return (
    <>
      {/* Top Demo Showcase Banner */}
      <div className="w-full bg-gradient-to-r from-primary/15 via-surface to-accent/15 border-b border-primary/25 px-3 py-1.5 sm:px-6 sm:py-2 text-xs flex flex-wrap items-center justify-between gap-2 z-40 shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-primary/20 text-primary px-2.5 py-0.5 rounded-full font-semibold tracking-wide border border-primary/30 text-[11px] sm:text-xs">
            <Sparkles size={12} className="animate-pulse" />
            <span>DEMO MODE</span>
          </div>
          <span className="text-textMuted hidden md:inline">•</span>
          <span className="text-textMain font-medium hidden sm:inline">
            Recruiter & Portfolio Showcase — 18 Modules Populated
          </span>
          <span className="text-textMuted hidden lg:inline">
            (Viewing as <strong className="text-primary">{DEMO_USER.name}</strong>)
          </span>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Architecture / Tour Button */}
          <button
            onClick={() => setShowArchModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface hover:bg-surfaceLight text-textMuted hover:text-textMain border border-glass transition-colors text-[11px] font-medium"
            title="View Architecture & Technical Overview"
          >
            <Info size={13} className="text-primary" />
            <span className="hidden sm:inline">Technical Tour</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface hover:bg-surfaceLight text-textMuted hover:text-primary border border-glass transition-colors text-[11px] font-medium active:scale-95"
            title="Reset all sample data back to original demonstration state"
          >
            <RotateCcw size={12} className="text-amber-400" />
            <span>Reset Demo Data</span>
          </button>

          {/* Switch to Production Link */}
          <button
            onClick={handleSwitchToProduction}
            className="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface hover:bg-surfaceLight text-textMuted hover:text-textMain border border-glass transition-colors text-[11px]"
            title="Switch back to Firebase Production Mode"
          >
            <Database size={12} />
            <span>Switch to Production</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Resetting Demo Data */}
      <ConfirmModal
        isOpen={showResetConfirm}
        title="Reset Demonstration Data?"
        message="This will restore all 18 modules (finances, loans, tasks, cattle herd, farm parcels, vitals, vehicles, and documents) back to their fresh, realistic sample state. Any records you added or modified during your review will be re-seeded."
        confirmText="Yes, Reset Sample Data"
        cancelText="Keep Current Data"
        isDestructive={false}
        onConfirm={handleConfirmReset}
        onCancel={() => setShowResetConfirm(false)}
      />

      {/* Success Notification Toast */}
      <AnimatePresence>
        {resetSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-12 left-1/2 -translate-x-1/2 z-50 glass-panel px-4 py-2.5 border border-primary/40 shadow-neon-primary rounded-xl flex items-center gap-2 text-textMain text-sm"
          >
            <CheckCircle2 size={16} className="text-primary" />
            <span>Demo dataset restored successfully! Refreshing...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Technical Architecture Modal for Interviewers & Recruiters */}
      <AnimatePresence>
        {showArchModal && (
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setShowArchModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel max-w-2xl w-full p-6 border border-glass shadow-neon-primary rounded-2xl max-h-[85vh] overflow-y-auto custom-scrollbar space-y-4"
            >
              <div className="flex items-start justify-between border-b border-glass pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-textMain">Vynora Architecture & Demo Engine</h2>
                    <p className="text-xs text-primary font-medium">Smart AI Life Operating System • Recruiter Overview</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowArchModal(false)}
                  className="text-textMuted hover:text-textMain p-1 rounded-lg hover:bg-surface transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-textMuted leading-relaxed">
                <div>
                  <h4 className="font-semibold text-textMain text-sm mb-1 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-green-400" />
                    Strict Production & Demo Isolation
                  </h4>
                  <p>
                    Vynora features a clean service abstraction layer. In <strong>Demo Mode</strong>, 100% of network calls to Firebase Cloud Firestore and Cloudinary are safely bypassed. All CRUD operations, search queries, and real-time calculations operate against an isolated in-browser local storage persistence engine.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="p-3 rounded-xl bg-surface border border-glass">
                    <div className="font-semibold text-textMain mb-1">Production Mode</div>
                    <ul className="list-disc list-inside space-y-1 text-[11px]">
                      <li>Firebase Authentication (`auth.uid`)</li>
                      <li>Firestore multi-tab persistence</li>
                      <li>Cloudinary unsigned file uploads</li>
                      <li>Monotonic security rules enforced</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-surface border border-glass">
                    <div className="font-semibold text-textMain mb-1">Demo Mode</div>
                    <ul className="list-disc list-inside space-y-1 text-[11px]">
                      <li>Preloaded realistic fictional dataset</li>
                      <li>18 modules fully accessible without login</li>
                      <li>Local storage persistence across refreshes</li>
                      <li>Instant one-click demo data reset</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-textMain text-sm mb-1">Calculations & Algorithms Verified</h4>
                  <p>
                    All banking reducing-balance EMI formulas, amortization schedules, agricultural crop profit margins, daily dairy yields & revenues, vehicle fuel mileages, and WHO BMI classifications run the exact production algorithms with live reactivity.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-textMain flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-xs">Explore Freely</div>
                    <div className="text-[11px] text-textMuted">You can add, edit, or delete any record. Click &quot;Reset Demo Data&quot; anytime to restore original seed data.</div>
                  </div>
                  <button
                    onClick={() => setShowArchModal(false)}
                    className="px-3 py-1.5 rounded-lg bg-primary text-background font-bold text-xs shrink-0 shadow-neon-primary-sm hover:opacity-90 transition-opacity ml-3"
                  >
                    Got It!
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

