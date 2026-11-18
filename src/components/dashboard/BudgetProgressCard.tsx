import React from 'react';
import { AlertCircle, Plus, PieChart, ArrowUpRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

interface BudgetProgressCardProps {
  onManageBudgets: () => void;
  onAddBudget: () => void;
}

export const BudgetProgressCard: React.FC<BudgetProgressCardProps> = ({
  onManageBudgets,
  onAddBudget
}) => {
  const { budgets, transactions, selectedMonth } = useFinance();

  const monthExpenses = transactions.filter(
    (t) => t.date.startsWith(selectedMonth) && t.type === 'expense'
  );

  const budgetProgress = budgets.map((b) => {
    const spent = monthExpenses
      .filter((t) => t.category === b.category)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const percentage = Math.min(100, Math.round((spent / (b.monthly_limit || 1)) * 100));
    const isOver = spent > b.monthly_limit;
    const isNear = percentage >= 85 && !isOver;

    return {
      ...b,
      spent,
      percentage,
      isOver,
      isNear
    };
  });

  return (
    <div className="rounded-2xl bg-[#0F1422] border border-slate-800 p-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">Active Budget Limits</h3>
          <p className="text-xs text-slate-400">Monthly budget thresholds for {selectedMonth}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onAddBudget}
            className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/30 text-xs font-medium flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Limit</span>
          </button>
          <button
            onClick={onManageBudgets}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center space-x-0.5"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {budgetProgress.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400 space-y-2">
          <PieChart className="w-8 h-8 text-slate-600 mx-auto" />
          <p>No budget caps configured yet.</p>
          <button
            onClick={onAddBudget}
            className="text-xs font-semibold text-indigo-400 hover:underline"
          >
            Set your first category budget
          </button>
        </div>
      ) : (
        <div className="space-y-4 pt-4">
          {budgetProgress.slice(0, 4).map((b) => {
            let barColor = 'bg-emerald-500';
            if (b.isOver) barColor = 'bg-rose-500';
            else if (b.isNear) barColor = 'bg-amber-500';

            return (
              <div key={b.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200 flex items-center gap-1.5">
                    {b.isOver && <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                    {b.category}
                  </span>
                  <div className="text-right">
                    <span className={`font-semibold ${b.isOver ? 'text-rose-400' : 'text-slate-200'}`}>
                      ${b.spent.toLocaleString()}
                    </span>
                    <span className="text-slate-400"> / ${b.monthly_limit.toLocaleString()}</span>
                  </div>
                </div>

                {/* Progress track */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${barColor} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${b.percentage}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>{b.percentage}% utilized</span>
                  {b.isOver ? (
                    <span className="text-rose-400 font-semibold">Over by ${(b.spent - b.monthly_limit).toFixed(2)}</span>
                  ) : (
                    <span>${(b.monthly_limit - b.spent).toFixed(2)} remaining</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
