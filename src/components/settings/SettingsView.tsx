import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Database, 
  Key, 
  RefreshCw, 
  User, 
  DollarSign, 
  Sparkles, 
  Check, 
  Cpu 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { INITIAL_DEMO_TRANSACTIONS, INITIAL_DEMO_BUDGETS, INITIAL_DEMO_SAVINGS_GOALS } from '../../lib/demoData';

export const SettingsView: React.FC = () => {
  const { user, profile, updateProfile, isDemoMode } = useAuth();
  const { refreshData } = useFinance();

  const [currency, setCurrency] = useState(profile?.currency || 'USD');
  const [incomeTarget, setIncomeTarget] = useState(profile?.monthly_income_target || 5000);
  const [savingsTarget, setSavingsTarget] = useState(profile?.monthly_savings_target || 1500);
  const [customApiKey, setCustomApiKey] = useState(() => localStorage.getItem('smartspend_custom_ai_key') || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      currency,
      monthly_income_target: Number(incomeTarget),
      monthly_savings_target: Number(savingsTarget)
    });

    if (customApiKey) {
      localStorage.setItem('smartspend_custom_ai_key', customApiKey);
    } else {
      localStorage.removeItem('smartspend_custom_ai_key');
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetDemoData = () => {
    if (confirm('Reset workspace with standard realistic sample financial data?')) {
      localStorage.setItem('smartspend_demo_tx', JSON.stringify(INITIAL_DEMO_TRANSACTIONS));
      localStorage.setItem('smartspend_demo_budgets', JSON.stringify(INITIAL_DEMO_BUDGETS));
      localStorage.setItem('smartspend_demo_goals', JSON.stringify(INITIAL_DEMO_SAVINGS_GOALS));
      refreshData();
      alert('Demo data successfully refreshed!');
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Profile & Currency Target Form */}
      <form onSubmit={handleSaveProfile} className="rounded-2xl bg-[#0F1422] border border-slate-800 p-6 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-base text-white">Financial Profile & Targets</h3>
            <p className="text-xs text-slate-400">Set baseline currency and monthly planning goals</p>
          </div>
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              Settings Saved
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Preferred Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="USD">USD ($ - US Dollar)</option>
              <option value="EUR">EUR (€ - Euro)</option>
              <option value="GBP">GBP (£ - British Pound)</option>
              <option value="INR">INR (₹ - Indian Rupee)</option>
              <option value="CAD">CAD ($ - Canadian Dollar)</option>
              <option value="AUD">AUD ($ - Australian Dollar)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Monthly Income Benchmark ($)</label>
            <input
              type="number"
              value={incomeTarget}
              onChange={(e) => setIncomeTarget(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Savings Goal ($)</label>
            <input
              type="number"
              value={savingsTarget}
              onChange={(e) => setSavingsTarget(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Optional AI Key Input */}
        <div className="pt-2">
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Optional OpenRouter / AI API Key</span>
            <span className="text-[10px] text-slate-400 font-normal">(Leave blank to use SmartSpend Rule Engine)</span>
          </label>
          <input
            type="password"
            value={customApiKey}
            onChange={(e) => setCustomApiKey(e.target.value)}
            placeholder="sk-or-v1-..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-md shadow-indigo-600/25"
          >
            Save Profile Preferences
          </button>
        </div>
      </form>

      {/* InsForge Backend Infrastructure Status */}
      <div className="rounded-2xl bg-[#0F1422] border border-slate-800 p-6 space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white">InsForge PostgreSQL Cloud Status</h3>
            <p className="text-xs text-slate-400">Database, authentication, and security isolation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
            <span className="text-slate-400">Project Name:</span>
            <span className="font-mono text-white">smartspend-ai</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
            <span className="text-slate-400">Database Engine:</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              PostgreSQL 16 (RLS Active)
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
            <span className="text-slate-400">Endpoint Region:</span>
            <span className="font-mono text-slate-300">us-east (InsForge Host)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
            <span className="text-slate-400">User Data Isolation:</span>
            <span className="font-semibold text-indigo-300">Multi-Tenant (auth.uid())</span>
          </div>
        </div>
      </div>

      {/* Demo Controls */}
      <div className="rounded-2xl bg-[#0F1422] border border-slate-800 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm text-white">Reset Sample Data</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Reload sample transactions, category caps, and wealth goals for demonstration purposes.
          </p>
        </div>
        <button
          onClick={handleResetDemoData}
          className="flex items-center space-x-2 py-2 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload Demo Data</span>
        </button>
      </div>
    </div>
  );
};
