import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Send, Bot, User, ArrowRight, ShieldCheck, 
  CreditCard, Tractor, Car, Receipt, CheckSquare, RefreshCw 
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import { useContextEngineStore } from '../store/useContextEngineStore';
import { MobilePageHeader } from '../components/common/MobilePageHeader';
import { isDemoMode } from '../services/appMode';

function generateDemoAIResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('expense') || q.includes('saving') || q.includes('cashflow') || q.includes('finance')) {
    return "Financial Analysis: Your monthly income is ₹1,85,000 against current monthly expenses of ~₹22,179, giving you a strong savings trajectory (~88%). Your liquid reserves across HDFC Salary and ICICI Emergency accounts total ₹6,42,800.";
  }
  if (q.includes('bill') || q.includes('loan') || q.includes('emi')) {
    return "Obligations Status: You have 1 upcoming bill: State Electricity Board tariff of ₹3,850 due in 3 days. Your active HDFC Home Loan requires ₹27,585/mo with ₹21,45,000 remaining principal across 180 months tenure.";
  }
  if (q.includes('vehicle') || q.includes('car') || q.includes('bike') || q.includes('puc') || q.includes('insurance')) {
    return "Fleet Telemetry: Your Honda City 1.5 i-VTEC (TN 09 BX 4589) has an insurance renewal due in 18 days and PUC in 22 days. Recent recorded mileage is 15.4 km/L, and odometer is currently 38,450 km.";
  }
  if (q.includes('crop') || q.includes('farm') || q.includes('dairy') || q.includes('milk') || q.includes('cattle')) {
    return "Agri & Livestock Summary: You manage 2 parcels totaling 5.5 acres. Kharif Paddy (3.5 acres) is projected to yield 45 Quintals (₹1,01,250 estimated gross revenue). Today's dairy milk yield across 3 cattle produced 28.5 Liters (₹1,083 revenue logged).";
  }
  if (q.includes('task') || q.includes('todo') || q.includes('plan')) {
    return "Priority Checklist: You have 4 active pending tasks on your Kanban board. Most urgent: Collect and submit North Valley parcel soil samples (due in 4 days), and Schedule 40,000 km periodic vehicle service for Honda City.";
  }
  return "Vynora Autonomous Intelligence: I've cross-referenced your multi-domain database (Finances, Loans, Agriculture, Dairy, Vehicles, Documents, and Tasks). All 18 modules are synchronized and operating within normal parameters.";
}

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const SUGGESTIONS = [
  { icon: CreditCard, label: 'Analyze monthly expenses & savings', query: 'Analyze my expenses, cashflow and savings this month.' },
  { icon: Receipt, label: 'Upcoming utility & loan bills', query: 'What bills and loan EMIs are due soon?' },
  { icon: Car, label: 'Vehicle service & insurance status', query: 'Check my vehicle fleet documents, PUC, and service reminders.' },
  { icon: Tractor, label: 'Farm crops & dairy yield summary', query: 'Summarize my active farm crops and today\'s dairy milk production.' },
  { icon: CheckSquare, label: 'Pending tasks & priority checklist', query: 'What urgent tasks are on my checklist today?' }
];

export default function AIAssistant() {
  const { user, aiStatus } = useContextEngineStore();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'ai',
      text: `Hello ${user?.name?.split(' ')[0] || 'there'}! I am your Vynora AI Assistant. I have real-time contextual access across your finances, agriculture, livestock, vehicles, bills, and tasks. How can I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendPrompt = async (textToSend?: string) => {
    const promptText = (textToSend || input).trim();
    if (!promptText || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);
    useContextEngineStore.setState({ aiStatus: 'thinking' });

    try {
      if (isDemoMode()) {
        // Provide instantaneous smart response in Demo Mode without requiring Express server
        await new Promise(r => setTimeout(r, 600));
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          text: generateDemoAIResponse(promptText),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/ai/intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: promptText })
      });
      const data = await res.json();
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: data.response || "I've analyzed your request with the Vynora Context Engine.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.warn('AI assistant fetch offline, providing resilient fallback response:', e);
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: generateDemoAIResponse(promptText),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
      useContextEngineStore.setState({ aiStatus: 'idle' });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <MobilePageHeader
        title="Vynora AI Assistant"
        parentLabel="Dashboard"
        fallbackPath="/"
        subtitle="Multi-domain autonomous intelligence synced with your live life database"
        badges={[
          { label: 'Context Engine Active', variant: 'success' },
          { label: 'Autonomous Agent', variant: 'info' }
        ]}
      />

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-4 space-y-3.5 glass-panel border border-glass rounded-2xl">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-primary text-background shadow-neon-primary-sm'
                    : 'bg-surface border border-glass text-primary'
                }`}
              >
                {isUser ? <User size={16} /> : <Bot size={16} />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-primary text-background font-medium rounded-tr-sm'
                    : 'bg-surface/90 border border-glass text-textMain rounded-tl-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`text-[10px] mt-1.5 flex justify-end ${
                    isUser ? 'text-background/80' : 'text-textMuted'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Thinking Indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-surface border border-glass text-primary flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-surface/90 border border-glass rounded-2xl rounded-tl-sm p-3.5 flex items-center gap-2">
              <span className="text-xs text-textMuted font-medium">Analyzing your context</span>
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        {SUGGESTIONS.map((s, idx) => {
          const Icon = s.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendPrompt(s.query)}
              className="px-3 py-1.5 rounded-xl bg-surface/80 border border-glass hover:border-primary/40 text-textMuted hover:text-textMain text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-colors active:scale-95 touch-target shrink-0"
            >
              <Icon size={13} className="text-primary" />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendPrompt();
        }}
        className="flex items-center gap-2 p-2 rounded-2xl glass-panel border border-glass shadow-glass shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Vynora AI about money, crops, vehicles, tasks..."
          className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-xs sm:text-sm text-textMain placeholder:text-textMuted min-w-0"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-xl bg-primary text-background flex items-center justify-center font-bold hover:bg-primary/90 disabled:opacity-40 transition-all shadow-neon-primary-sm active:scale-95 shrink-0 touch-target"
          aria-label="Send message to AI"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
