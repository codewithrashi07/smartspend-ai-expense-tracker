import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Percent, 
  Award, 
  Plus, 
  DollarSign 
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { SavingsGoal } from '../../types';

interface AnalyticsViewProps {
  onAddSavingsGoal: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onAddSavingsGoal }) => {
  const { transactions, savingsGoals, updateSavingsGoal, deleteSavingsGoal } = useFinance();
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');

  // Chart aggregated data
  const comparisonData = useMemo(() => {
    if (timeRange === 'weekly') {
      return [
        { label: 'Week 1', income: 1200, expense: 650, savings: 550 },
        { label: 'Week 2', income: 1000, expense: 800, savings: 200 },
        { label: 'Week 3', income: 1150, expense: 520, savings: 630 },
        { label: 'Week 4', income: 1400, expense: 780, savings: 620 }
      ];
    } else if (timeRange === 'yearly') {
      return [
        { label: '2024', income: 48000, expense: 34000, savings: 14000 },
        { label: '2025', income: 54000, expense: 36500, savings: 17500 },
        { label: '2026', income: 61000, expense: 38200, savings: 22800 }
      ];
    } else {
      // Monthly
      const map: Record<string, { label: string; income: number; expense: number; savings: number }> = {};
      for (const t of transactions) {
        const m = t.date.slice(0, 7);
        if (!map[m]) {
          map[m] = { label: m, income: 0, expense: 0, savings: 0 };
        }
        if (t.type === 'income') {
          map[m].income += Number(t.amount);
        } else {
          map[m].expense += Number(t.amount);
        }
      }
      for (const k in map) {
        map[k].savings = Math.max(0, map[k].income - map[k].expense);
      }
      const list = Object.values(map).sort((a, b) => a.label.localeCompare(b.label));
      return list.length > 0 ? list : [
        { label: '2026-08', income: 3800, expense: 2500, savings: 1300 },
        { label: '2026-09', income: 4200, expense: 2800, savings: 1400 },
        { label: '2026-10', income: 4500, expense: 3100, savings: 1400 },
        { label: '2026-11', income: 4300, expense: 2350, savings: 1950 }
      ];
    }
  }, [transactions, timeRange]);

  // Overall totals
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Time Range Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Comparative Analytics</h2>
          <p className="text-xs text-slate-400">Deep financial metrics & savings trajectory</p>
        </div>
        <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setTimeRange('weekly')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              timeRange === 'weekly' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeRange('monthly')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              timeRange === 'monthly' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeRange('yearly')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              timeRange === 'yearly' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-[#0F1422] border border-slate-800 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Overall Savings Rate</span>
            <Percent className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-purple-400">{savingsRate}%</div>
          <p className="text-[11px] text-slate-400 mt-2">
            Target benchmark: 20%+ recommended by financial planners.
          </p>
        </div>

        <div className="rounded-2xl bg-[#0F1422] border border-slate-800 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Gross Cash Inflow</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">
            ${totalIncome.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Cumulative income recorded in SmartSpend ledger.
          </p>
        </div>

        <div className="rounded-2xl bg-[#0F1422] border border-slate-800 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Gross Cash Outflow</span>
            <TrendingDown className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400">
            ${totalExpense.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Total expenses accounted for across all methods.
          </p>
        </div>
      </div>

      {/* Income vs Expense Bar Chart */}
      <div className="rounded-2xl bg-[#0F1422] border border-slate-800 p-5">
        <h3 className="font-bold text-sm text-white mb-1">Inflow vs Outflow vs Net Retained</h3>
        <p className="text-xs text-slate-400 mb-4">Comparison view across intervals</p>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="label" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#334155', borderRadius: 12, fontSize: 12 }} 
                formatter={(val: any) => [`$${val.toLocaleString()}`, '']}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#F43F5E" radius={[4, 4, 0, 0]} />
              <Bar dataKey="savings" name="Net Saved" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Savings Goals Section */}
      <div className="rounded-2xl bg-[#0F1422] border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" />
              <span>Target Savings Goals</span>
            </h3>
            <p className="text-xs text-slate-400">Milestone funds with dynamic completion trackers</p>
          </div>
          <button
            onClick={onAddSavingsGoal}
            className="flex items-center space-x-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Goal</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savingsGoals.map((g) => {
            const pct = Math.min(100, Math.round((g.current_amount / (g.target_amount || 1)) * 100));
            return (
              <div key={g.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-white">{g.name}</h4>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full mt-1 inline-block">
                      {g.category || 'General'}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20">
                    {pct}%
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>${g.current_amount.toLocaleString()}</span>
                    <span className="text-slate-400">Target: ${g.target_amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => {
                      const deposit = prompt(`Deposit amount into ${g.name}:`, '100');
                      if (deposit && !isNaN(Number(deposit))) {
                        updateSavingsGoal(g.id, { current_amount: g.current_amount + Number(deposit) });
                      }
                    }}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    + Add Deposit
                  </button>
                  <button
                    onClick={() => deleteSavingsGoal(g.id)}
                    className="text-[11px] text-slate-500 hover:text-rose-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
