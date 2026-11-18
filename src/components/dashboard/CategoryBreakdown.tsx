import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip 
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../lib/formatters';

const COLORS = [
  '#6366F1', // Indigo
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F43F5E', // Rose
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#64748B'  // Slate
];

export const CategoryBreakdown: React.FC = () => {
  const { transactions, selectedMonth } = useFinance();

  const data = React.useMemo(() => {
    const monthExpenses = transactions.filter(
      (t) => t.date.startsWith(selectedMonth) && t.type === 'expense'
    );

    const totals: Record<string, number> = {};
    let sum = 0;
    for (const t of monthExpenses) {
      totals[t.category] = (totals[t.category] || 0) + Number(t.amount);
      sum += Number(t.amount);
    }

    const items = Object.entries(totals).map(([name, value]) => ({
      name,
      value: Math.round(value * 100) / 100,
      percentage: sum > 0 ? Math.round((value / sum) * 100) : 0
    })).sort((a, b) => b.value - a.value);

    return items.length > 0 ? items : [
      { name: 'Housing & Rent', value: 1450, percentage: 52 },
      { name: 'Groceries', value: 380, percentage: 14 },
      { name: 'Food & Dining', value: 310, percentage: 11 },
      { name: 'Utilities', value: 240, percentage: 9 },
      { name: 'Other', value: 400, percentage: 14 }
    ];
  }, [transactions, selectedMonth]);

  const totalExpense = data.reduce((acc, item) => acc + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-[#0B0F19] border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-bold text-slate-100">{item.name}</p>
          <p className="text-indigo-400 font-semibold">{formatINR(item.value, false)} ({item.percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-[#0F1422] border border-slate-800 p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">Category Breakdown</h3>
          <p className="text-xs text-slate-400">Expense distribution for {selectedMonth}</p>
        </div>
        <span className="text-xs font-semibold text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-lg">
          {formatINR(totalExpense, false)}
        </span>
      </div>

      <div className="h-52 w-full my-2 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[11px] text-slate-400">Top Spent</span>
          <span className="text-xs font-bold text-white truncate max-w-[90px] text-center">
            {data[0]?.name || 'N/A'}
          </span>
        </div>
      </div>

      {/* Top 4 Categories List */}
      <div className="space-y-2 pt-2 border-t border-slate-800/60">
        {data.slice(0, 4).map((item, idx) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 truncate">
              <span 
                className="w-2.5 h-2.5 rounded-full shrink-0" 
                style={{ backgroundColor: COLORS[idx % COLORS.length] }} 
              />
              <span className="text-slate-300 truncate">{item.name}</span>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-slate-400">{item.percentage}%</span>
              <span className="font-semibold text-white">{formatINR(item.value, false)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
