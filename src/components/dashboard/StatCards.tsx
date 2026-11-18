import React from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  ShieldCheck, 
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../lib/formatters';

export const StatCards: React.FC = () => {
  const { transactions, healthMetric, selectedMonth } = useFinance();

  // Current month filter
  const monthTransactions = transactions.filter((t) => t.date.startsWith(selectedMonth));

  const totalIncome = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  // Overall balance across all transactions
  const totalAllTimeIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  const totalAllTimeExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalBalance = totalAllTimeIncome - totalAllTimeExpenses;
  const netMonthlySavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round((Math.max(0, netMonthlySavings) / totalIncome) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Balance */}
      <div className="relative group overflow-hidden rounded-2xl bg-[#0F1422] border border-slate-800 p-5 hover:border-slate-700 transition-all duration-200">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/15 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-400">Total Net Worth</span>
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {formatINR(totalBalance)}
          </span>
        </div>
        <div className="mt-3 flex items-center text-xs text-slate-400">
          <span className="inline-flex items-center text-indigo-400 mr-1.5 font-medium">
            <Sparkles className="w-3 h-3 mr-0.5" />
            Live Balance
          </span>
          <span>across all accounts</span>
        </div>
      </div>

      {/* 2. Monthly Income */}
      <div className="relative group overflow-hidden rounded-2xl bg-[#0F1422] border border-slate-800 p-5 hover:border-slate-700 transition-all duration-200">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/15 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-400">Monthly Income</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
            +{formatINR(totalIncome)}
          </span>
        </div>
        <div className="mt-3 flex items-center text-xs text-emerald-400/90">
          <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
          <span className="font-semibold">{monthTransactions.filter(t => t.type === 'income').length} deposits</span>
          <span className="text-slate-400 ml-1.5">this month</span>
        </div>
      </div>

      {/* 3. Monthly Expenses */}
      <div className="relative group overflow-hidden rounded-2xl bg-[#0F1422] border border-slate-800 p-5 hover:border-slate-700 transition-all duration-200">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/15 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-400">Monthly Expenses</span>
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-rose-400 tracking-tight">
            -{formatINR(totalExpenses)}
          </span>
        </div>
        <div className="mt-3 flex items-center text-xs text-rose-400/90">
          <ArrowDownRight className="w-3.5 h-3.5 mr-1" />
          <span className="font-semibold">{monthTransactions.filter(t => t.type === 'expense').length} debits</span>
          <span className="text-slate-400 ml-1.5">outflow tracked</span>
        </div>
      </div>

      {/* 4. Net Savings & Rate */}
      <div className="relative group overflow-hidden rounded-2xl bg-[#0F1422] border border-slate-800 p-5 hover:border-slate-700 transition-all duration-200">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/15 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-400">Net Savings (Rate)</span>
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <PiggyBank className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${netMonthlySavings >= 0 ? 'text-white' : 'text-amber-400'}`}>
            {formatINR(netMonthlySavings)}
          </span>
          <span className="text-xs font-bold text-purple-400 bg-purple-500/15 px-2 py-0.5 rounded-full border border-purple-500/30">
            {savingsRate}%
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>Safe Daily: <strong className="text-slate-200">{formatINR(healthMetric.dailySafeSpend, false)}</strong></span>
          <span className="text-[11px] text-emerald-400 font-semibold">{healthMetric.daysRemainingInMonth}d left</span>
        </div>
      </div>
    </div>
  );
};
