import React from 'react';
import { 
  Menu, 
  Download, 
  Plus, 
  Calendar, 
  ShieldCheck, 
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { NavView } from './Sidebar';

interface HeaderProps {
  currentView: NavView;
  onOpenMobileMenu: () => void;
  onOpenAddModal: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onOpenMobileMenu,
  onOpenAddModal,
  onOpenAuth
}) => {
  const { user, isDemoMode } = useAuth();
  const { selectedMonth, setSelectedMonth, exportTransactionsCSV, healthMetric } = useFinance();

  const titles: Record<NavView, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Financial Overview',
      subtitle: 'Real-time AI balance, cashflow analytics and spending velocity'
    },
    transactions: {
      title: 'Smart Transactions',
      subtitle: 'Comprehensive ledger with AI automatic categorization and filters'
    },
    budgets: {
      title: 'Budget Controls',
      subtitle: 'Category-wise spending limits with automated overspending alerts'
    },
    insights: {
      title: 'AI Financial Intelligence',
      subtitle: 'Deep pattern recognition, subscription audits, and wealth tips'
    },
    analytics: {
      title: 'Performance & Analytics',
      subtitle: 'Comparative income, expense ratios and savings trajectory'
    },
    settings: {
      title: 'Preferences & Workspace',
      subtitle: 'Manage currency, targets, and InsForge cloud sync settings'
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#080B11]/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 border border-slate-700/60"
            aria-label="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                {titles[currentView].title}
              </h1>
              {isDemoMode && (
                <span className="hidden sm:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Demo Workspace
                </span>
              )}
            </div>
            <p className="hidden md:block text-xs text-slate-400 mt-0.5">
              {titles[currentView].subtitle}
            </p>
          </div>
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {/* Month Selector */}
          <div className="hidden sm:flex items-center space-x-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
            />
          </div>

          {/* Export CSV Button */}
          <button
            onClick={exportTransactionsCSV}
            title="Download CSV Report"
            className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center space-x-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Export CSV</span>
          </button>

          {/* New Transaction Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center space-x-1.5 py-2 px-3.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/25 transition-all duration-150"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>

          {/* Auth Button or User Badge */}
          {!user ? (
            <button
              onClick={onOpenAuth}
              className="hidden lg:flex items-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-indigo-300 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 transition-all"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
          ) : (
            <div className="hidden lg:flex items-center space-x-2 bg-indigo-950/40 border border-indigo-500/20 px-2.5 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-indigo-200">InsForge Cloud Connected</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
