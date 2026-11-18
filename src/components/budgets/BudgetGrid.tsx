import React from 'react';
import { Plus, AlertTriangle, CheckCircle2, Trash2, PieChart, TrendingUp } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../lib/formatters';

interface BudgetGridProps {
  onAddBudget: () => void;
}

export const BudgetGrid: React.FC<BudgetGridProps> = ({ onAddBudget }) => {
  const { budgets, transactions, selectedMonth, deleteBudget } = useFinance();

  const monthExpenses = transactions.filter(
    (t) => t.date.startsWith(selectedMonth) && t.type === 'expense'
  );

  const budgetStats = budgets.map((b) => {
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

  const totalBudgeted = budgets.reduce((acc, b) => acc + Number(b.monthly_limit), 0);
  const totalSpentInBudgetedCategories = budgetStats.reduce((acc, b) => acc + b.spent, 0);

  return (
    <div className="space-y-5">
      {/* Overview Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-[#0F1422] to-slate-900 border border-slate-800 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Budget Health • {selectedMonth}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            {formatINR(totalSpentInBudgetedCategories, false)} spent of {formatINR(totalBudgeted, false)} limit
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {budgets.length} category budgets actively monitored
          </p>
        </div>

        <button
          onClick={onAddBudget}
          className="flex items-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Budget Limit</span>
        </button>
      </div>

      {/* Grid of Budgets */}
      {budgetStats.length === 0 ? (
        <div className="rounded-2xl bg-[#0F1422] border border-slate-800 p-12 text-center space-y-3">
          <PieChart className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Category Budgets Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Setting monthly budgets for categories like Groceries, Dining, and Entertainment helps SmartSpend AI detect overspending before it occurs.
          </p>
          <button
            onClick={onAddBudget}
            className="mt-2 inline-flex items-center space-x-1.5 py-2 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Budget</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgetStats.map((b) => {
            let barColor = 'bg-emerald-500';
            let statusBadge = (
              <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                On Track
              </span>
            );

            if (b.isOver) {
              barColor = 'bg-rose-500';
              statusBadge = (
                <span className="text-[10px] font-semibold text-rose-300 bg-rose-500/15 px-2 py-0.5 rounded-full border border-rose-500/30 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                  Overbudget
                </span>
              );
            } else if (b.isNear) {
              barColor = 'bg-amber-500';
              statusBadge = (
                <span className="text-[10px] font-semibold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  Nearing Limit
                </span>
              );
            }

            return (
              <div
                key={b.id}
                className="rounded-2xl bg-[#0F1422] border border-slate-800 p-5 hover:border-slate-700 transition-all space-y-4 group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white">{b.category}</h4>
                    <p className="text-[11px] text-slate-400">{b.month}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {statusBadge}
                    <button
                      onClick={() => deleteBudget(b.id)}
                      title="Delete budget"
                      className="p-1 text-slate-500 hover:text-rose-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-xl font-extrabold text-white">
                      {formatINR(b.spent, false)}
                    </span>
                    <span className="text-xs text-slate-400">
                      Cap: {formatINR(b.monthly_limit, false)}
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`${barColor} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${b.percentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                  <span>{b.percentage}% spent</span>
                  {b.isOver ? (
                    <span className="text-rose-400 font-semibold">
                      Exceeded by {formatINR(b.spent - b.monthly_limit)}
                    </span>
                  ) : (
                    <span>{formatINR(b.monthly_limit - b.spent)} available</span>
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
