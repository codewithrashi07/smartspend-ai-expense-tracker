import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';

export const CashflowChart: React.FC = () => {
  const { transactions } = useFinance();
  const [viewType, setViewType] = useState<'monthly' | 'daily'>('monthly');

  // Group transactions for chart
  const chartData = React.useMemo(() => {
    if (viewType === 'daily') {
      // Last 14 days
      const daysMap: Record<string, { date: string; income: number; expense: number }> = {};
      const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));

      for (const t of sorted.slice(-25)) {
        const shortDate = t.date.slice(5); // MM-DD
        if (!daysMap[shortDate]) {
          daysMap[shortDate] = { date: shortDate, income: 0, expense: 0 };
        }
        if (t.type === 'income') {
          daysMap[shortDate].income += Number(t.amount);
        } else {
          daysMap[shortDate].expense += Number(t.amount);
        }
      }
      return Object.values(daysMap);
    } else {
      // Last 6 months
      const monthMap: Record<string, { month: string; income: number; expense: number }> = {};
      for (const t of transactions) {
        const m = t.date.slice(0, 7); // YYYY-MM
        if (!monthMap[m]) {
          monthMap[m] = { month: m, income: 0, expense: 0 };
        }
        if (t.type === 'income') {
          monthMap[m].income += Number(t.amount);
        } else {
          monthMap[m].expense += Number(t.amount);
        }
      }

      const list = Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month));
      return list.length > 0 ? list : [
        { month: '2026-09', income: 4200, expense: 2800 },
        { month: '2026-10', income: 4500, expense: 3100 },
        { month: '2026-11', income: 4300, expense: 2350 }
      ];
    }
  }, [transactions, viewType]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0B0F19] border border-slate-700/80 p-3 rounded-xl shadow-xl text-xs space-y-1.5">
          <p className="font-bold text-slate-200">{label}</p>
          <div className="flex items-center space-x-2 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Income: ${payload[0]?.value?.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>Expense: ${payload[1]?.value?.toLocaleString()}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-[#0F1422] border border-slate-800 p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">Cash Flow Trend</h3>
          <p className="text-xs text-slate-400">Income vs outflow analysis over time</p>
        </div>
        <div className="flex p-0.5 bg-slate-900 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setViewType('monthly')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              viewType === 'monthly' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setViewType('daily')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              viewType === 'daily' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Recent Activity
          </button>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis 
              dataKey={viewType === 'monthly' ? 'month' : 'date'} 
              stroke="#64748B" 
              fontSize={11}
              tickLine={false}
            />
            <YAxis 
              stroke="#64748B" 
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => `$${v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="income" 
              stroke="#10B981" 
              strokeWidth={2.5} 
              fillOpacity={1} 
              fill="url(#incomeGrad)" 
            />
            <Area 
              type="monotone" 
              dataKey="expense" 
              stroke="#F43F5E" 
              strokeWidth={2.5} 
              fillOpacity={1} 
              fill="url(#expenseGrad)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center space-x-6 pt-3 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>Total Income</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-rose-500" />
          <span>Total Expenses</span>
        </div>
      </div>
    </div>
  );
};
