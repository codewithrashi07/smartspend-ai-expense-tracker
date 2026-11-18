import React from 'react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  PieChart, 
  Sparkles, 
  BarChart3, 
  Settings, 
  Zap, 
  LogOut, 
  LogIn, 
  ShieldCheck, 
  X 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../lib/formatters';

export type NavView = 'dashboard' | 'transactions' | 'budgets' | 'insights' | 'analytics' | 'settings';

interface SidebarProps {
  currentView: NavView;
  setCurrentView: (view: NavView) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  onOpenAuth: () => void;
  onOpenAddModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  isOpenMobile,
  setIsOpenMobile,
  onOpenAuth,
  onOpenAddModal
}) => {
  const { user, isDemoMode, signOut } = useAuth();
  const { healthMetric } = useFinance();

  interface NavItem {
    id: NavView;
    label: string;
    icon: any;
    badge?: string;
  }

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'budgets', label: 'Budgets & Limits', icon: PieChart },
    { id: 'insights', label: 'AI Intelligence', icon: Sparkles, badge: 'Smart' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (view: NavView) => {
    setCurrentView(view);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0B0F19]/95 backdrop-blur-xl border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  SmartSpend
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wide font-medium">Fintech Financial OS</p>
            </div>
          </div>
          <button 
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            onClick={() => setIsOpenMobile(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Add Action */}
        <div className="px-5 pt-5 pb-2">
          <button
            onClick={() => {
              onOpenAddModal();
              setIsOpenMobile(false);
            }}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/35 transition-all duration-200 active:scale-[0.98]"
          >
            <Zap className="w-4 h-4 fill-current text-indigo-200" />
            <span>+ Add Transaction</span>
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as NavView)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Financial Health Mini Banner */}
        <div className="px-4 py-3 mx-4 mb-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800/90 border border-slate-700/60 shadow-inner">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Health Score
            </span>
            <span className="text-xs font-bold text-emerald-400">{healthMetric.score}/100</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${healthMetric.score}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">
            Estimated Score • Safe daily: <span className="text-slate-200 font-semibold">{formatINR(healthMetric.dailySafeSpend, false)}</span>
          </p>
        </div>

        {/* Auth / User Status footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                  {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-200 truncate">{user.name || 'Personal Account'}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={signOut}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg">
                <span className="font-medium">Demo Mode</span>
                <span className="text-[10px] bg-amber-400/20 px-1.5 py-0.5 rounded text-amber-200">Active</span>
              </div>
              <button
                onClick={onOpenAuth}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Create Account</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
