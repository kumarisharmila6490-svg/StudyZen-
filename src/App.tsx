/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Timer, 
  Calendar, 
  BarChart2, 
  StopCircle, 
  ChevronLeft, 
  CheckCircle2, 
  Plus, 
  ArrowRight,
  LayoutDashboard
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { cn } from './lib/utils';

// --- Types ---
type Screen = 'home' | 'focus' | 'planner' | 'screentime';

interface Task {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

// --- App Component ---
export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isFocusActive, setIsFocusActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);

  // Timer logic for Focus Mode
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFocusActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsFocusActive(false);
    }
    return () => clearInterval(interval);
  }, [isFocusActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const navigateTo = (screen: Screen) => setCurrentScreen(screen);

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4">
      {/* Mobile-style Container with Glass Effect */}
      <div className="w-full max-w-md h-[800px] glass rounded-[40px] relative overflow-hidden flex flex-col overflow-y-auto">
        
        {/* Notch simulation for polish */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-slate-900/10 rounded-full z-20 backdrop-blur-sm" />

        <AnimatePresence mode="wait">
          {currentScreen === 'home' && (
            <HomeScreen key="home" onNavigate={navigateTo} />
          )}

          {currentScreen === 'focus' && (
            <FocusScreen 
              key="focus" 
              active={isFocusActive}
              timeLeft={timeLeft}
              formatTime={formatTime}
              onBack={() => navigateTo('home')}
              onToggle={() => setIsFocusActive(!isFocusActive)}
              onReset={() => {
                setIsFocusActive(false);
                setTimeLeft(25 * 60);
              }}
            />
          )}

          {currentScreen === 'planner' && (
            <PlannerScreen key="planner" onBack={() => navigateTo('home')} />
          )}

          {currentScreen === 'screentime' && (
            <ScreenTimeScreen key="screentime" onBack={() => navigateTo('home')} />
          )}
        </AnimatePresence>

        {/* Global Bottom Tab Bar - Glassy and floating */}
        {currentScreen !== 'focus' && (
          <div className="absolute bottom-6 left-6 right-6 h-16 bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl flex justify-around items-center px-4 shadow-lg z-50">
            <button 
              onClick={() => navigateTo('home')}
              className={cn("p-2 rounded-xl transition-all", currentScreen === 'home' ? "bg-blue-500 text-white shadow-md shadow-blue-200" : "text-slate-400 hover:text-blue-500")}
            >
              <LayoutDashboard size={22} />
            </button>
            <button 
              onClick={() => navigateTo('focus')}
              className={cn("p-2 rounded-xl transition-all", currentScreen === 'focus' ? "bg-blue-500 text-white shadow-md shadow-blue-200" : "text-slate-400 hover:text-blue-500")}
            >
              <Timer size={22} />
            </button>
            <button 
              onClick={() => navigateTo('planner')}
              className={cn("p-2 rounded-xl transition-all", currentScreen === 'planner' ? "bg-blue-500 text-white shadow-md shadow-blue-200" : "text-slate-400 hover:text-blue-500")}
            >
              <Calendar size={22} />
            </button>
            <button 
              onClick={() => navigateTo('screentime')}
              className={cn("p-2 rounded-xl transition-all", currentScreen === 'screentime' ? "bg-blue-500 text-white shadow-md shadow-blue-200" : "text-slate-400 hover:text-blue-500")}
            >
              <BarChart2 size={22} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Screens ---

const HomeScreen: React.FC<{ onNavigate: (s: Screen) => void }> = ({ onNavigate }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-8 h-full flex flex-col pt-16"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4">
          <CheckCircle2 color="white" size={32} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">StudyZen</h1>
        <p className="text-slate-500 text-sm mt-1">Less distraction, more focus</p>
      </div>

      <div className="space-y-4">
        <HomeButton 
          title="Start Focus Mode" 
          subtitle="Enter Pomodoro flow"
          icon={<Timer size={24} />}
          onClick={() => onNavigate('focus')}
          variant="primary"
        />
        <HomeButton 
          title="Study Planner" 
          subtitle="Organize your tasks"
          icon={<Calendar size={24} />}
          onClick={() => onNavigate('planner')}
          variant="secondary"
        />
        <HomeButton 
          title="Screen Time Report" 
          subtitle="Analyze your usage"
          icon={<BarChart2 size={24} />}
          onClick={() => onNavigate('screentime')}
          variant="secondary"
        />
      </div>

      <div className="mt-auto pb-24">
        <div className="bg-blue-50/50 backdrop-blur-sm p-5 rounded-2xl border border-blue-100/50 text-center">
          <p className="text-[11px] text-blue-700 font-bold italic">
            "Your mind is for having ideas, not holding them."
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function HomeButton({ title, subtitle, icon, onClick, variant }: { 
  title: string, 
  subtitle: string,
  icon: React.ReactNode, 
  onClick: () => void,
  variant: 'primary' | 'secondary'
}) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full text-left p-5 rounded-2xl flex items-center gap-4 transition-all active:scale-95",
        variant === 'primary' 
          ? "bg-blue-500 text-white shadow-lg shadow-blue-200" 
          : "bg-white/60 hover:bg-white text-slate-900 border border-white shadow-sm"
      )}
    >
      <div className={cn(
        "p-3 rounded-xl",
        variant === 'primary' ? "bg-white/20" : "bg-blue-50"
      )}>
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-base">{title}</h3>
        <p className={cn(
          "text-xs",
          variant === 'primary' ? "text-white/70" : "text-slate-400"
        )}>{subtitle}</p>
      </div>
      <ArrowRight size={18} className="ml-auto opacity-30" />
    </button>
  );
}

const FocusScreen: React.FC<{ 
  timeLeft: number, 
  formatTime: (s: number) => string,
  onBack: () => void,
  onToggle: () => void,
  active: boolean,
  onReset: () => void
}> = ({ timeLeft, formatTime, onBack, onToggle, active, onReset }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="p-8 h-full bg-slate-900/5 flex flex-col items-center justify-center text-center pt-16"
    >
      <button 
        onClick={onBack}
        className="absolute top-10 left-8 p-3 rounded-xl bg-white/40 hover:bg-white/60 transition-colors border border-white/50"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="mb-12">
        <div className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-2">Focus Mode ON</div>
        <p className="text-slate-500 text-sm">Stay away from distractions</p>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center mb-12">
        <div className="absolute inset-0 rounded-full border-4 border-blue-500/10" />
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <motion.circle 
            cx="128" cy="128" r="120" 
            className="stroke-blue-500 fill-none" 
            strokeWidth="6"
            strokeDasharray="754"
            animate={{ strokeDashoffset: (1 - timeLeft / (25 * 60)) * 754 }}
            strokeLinecap="round"
          />
        </svg>
        <div className="text-6xl font-light text-slate-900 tabular-nums">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 w-full px-4">
        <button 
          onClick={onToggle}
          className={cn(
            "w-full py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-lg",
            active ? "bg-white/60 text-slate-900 border border-white" : "bg-blue-500 text-white shadow-blue-200"
          )}
        >
          {active ? "Pause" : "Start Session"}
        </button>
        <button 
          onClick={onReset}
          className="text-red-500 font-bold uppercase tracking-widest text-[11px]"
        >
          Stop
        </button>
      </div>
    </motion.div>
  );
}

const PlannerScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [tasks] = useState<Task[]>([
    { id: '1', title: 'Math', duration: '1 hour', completed: true },
    { id: '2', title: 'Science', duration: '2 hours', completed: false },
    { id: '3', title: 'Revision', duration: '30 mins', completed: false },
  ]);

  const colors = ["bg-blue-500", "bg-indigo-400", "bg-teal-400"];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-8 h-full flex flex-col pt-16"
    >
      <header className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 rounded-xl bg-white/40 text-slate-900 border border-white/50">
          <ChevronLeft size={18} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 leading-tight">Today's Plan</h2>
          <p className="text-[11px] text-slate-400 font-medium">Personalized study sessions</p>
        </div>
      </header>

      <div className="space-y-3">
        {tasks.map((task, idx) => (
          <div 
            key={task.id} 
            className="flex items-center justify-between p-4 rounded-2xl bg-white/60 border border-white shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={cn("w-1.5 h-10 rounded-full", task.completed ? "bg-emerald-400" : colors[idx % colors.length])} />
              <div>
                <h4 className={cn("font-bold text-sm", task.completed && "line-through text-slate-400")}>{task.title}</h4>
                <p className="text-[10px] text-slate-400 font-medium">
                  {task.id === '1' ? 'Calculus Practice' : task.id === '2' ? 'Biology Notes' : 'History'}
                </p>
              </div>
            </div>
            <p className="text-xs font-bold text-slate-900">{task.duration}</p>
          </div>
        ))}
        
        <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-400 font-bold text-sm hover:border-blue-300 hover:text-blue-500 transition-all">
          <Plus size={18} />
          Add Task
        </button>
      </div>
    </motion.div>
  );
}

const ScreenTimeScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const data = [
    { name: 'Total', value: 5, color: '#3B82F6' },
    { name: 'Productive', value: 2, color: '#10B981' },
    { name: 'Distracting', value: 3, color: '#FB7185' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-8 h-full flex flex-col pt-16"
    >
      <header className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-2 rounded-xl bg-white/40 text-slate-900 border border-white/50">
          <ChevronLeft size={18} />
        </button>
        <h2 className="text-2xl font-bold text-slate-900">Screen Usage</h2>
      </header>

      <div className="text-center mb-10">
        <div className="text-4xl font-bold text-blue-600">5.0<span className="text-lg text-slate-400 ml-1 font-medium">hrs</span></div>
        <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter mt-1">Total Time Today</p>
      </div>

      <div className="space-y-6 flex-1">
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Productive</span>
            <span className="text-sm font-bold text-blue-600">2 hrs</span>
          </div>
          <div className="w-full bg-slate-200/50 h-2.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[40%] rounded-full shadow-sm" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Distracting</span>
            <span className="text-sm font-bold text-rose-500">3 hrs</span>
          </div>
          <div className="w-full bg-slate-200/50 h-2.5 rounded-full overflow-hidden">
            <div className="bg-rose-400 h-full w-[60%] rounded-full shadow-sm" />
          </div>
        </div>
      </div>

      <div className="mt-auto pb-24">
        <div className="p-5 bg-blue-600 rounded-[24px] text-white shadow-xl shadow-blue-200 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-2">Coach Tip</p>
            <p className="text-[12px] leading-relaxed font-medium">
              Reduce social media usage by setting a 15m limit for Instagram. You'll gain <span className="underline font-bold">45m</span> of focus.
            </p>
          </div>
          {/* Decorative background circle */}
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}
