import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  ShoppingBag, 
  Coffee, 
  Home, 
  Zap, 
  Car, 
  Tv, 
  HeartPulse, 
  MoreVertical,
  Trash2,
  Edit2
} from 'lucide-react';
import { Transaction } from '../../types';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../lib/formatters';

interface RecentTransactionsProps {
  onViewAll: () => void;
  onEditTransaction: (tx: Transaction) => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  onViewAll,
  onEditTransaction
}) => {
  const { transactions, deleteTransaction } = useFinance();
  const recent = transactions.slice(0, 5);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Food & Dining':
        return <Coffee className="w-4 h-4 text-amber-400" />;
      case 'Groceries':
      case 'Shopping & Retail':
        return <ShoppingBag className="w-4 h-4 text-purple-400" />;
      case 'Housing & Rent':
        return <Home className="w-4 h-4 text-blue-400" />;
      case 'Utilities & Bills':
        return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'Transportation':
        return <Car className="w-4 h-4 text-cyan-400" />;
      case 'Entertainment & Subscriptions':
        return <Tv className="w-4 h-4 text-pink-400" />;
      case 'Healthcare & Wellness':
        return <HeartPulse className="w-4 h-4 text-emerald-400" />;
      default:
        return <CreditCard className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="rounded-2xl bg-[#0F1422] border border-slate-800 p-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">Recent Transactions</h3>
          <p className="text-xs text-slate-400">Latest recorded income and expenses</p>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center space-x-0.5"
        >
          <span>View All ({transactions.length})</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          No transactions yet. Click "+ Add Transaction" above!
        </div>
      ) : (
        <div className="divide-y divide-slate-800/50">
          {recent.map((tx) => {
            const isIncome = tx.type === 'income';
            return (
              <div 
                key={tx.id} 
                className="py-3 flex items-center justify-between hover:bg-slate-800/30 px-2 rounded-xl transition-colors group"
              >
                <div className="flex items-center space-x-3 truncate">
                  <div className={`p-2.5 rounded-xl border shrink-0 ${
                    isIncome 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-slate-800/80 border-slate-700/80'
                  }`}>
                    {isIncome ? <ArrowDownLeft className="w-4 h-4" /> : getCategoryIcon(tx.category)}
                  </div>
                  <div className="truncate">
                    <p className="text-xs sm:text-sm font-semibold text-white truncate">{tx.title}</p>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                      <span>{tx.category}</span>
                      <span>•</span>
                      <span>{tx.date}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline text-slate-400">{tx.payment_method}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span className={`text-xs sm:text-sm font-bold tracking-tight ${
                    isIncome ? 'text-emerald-400' : 'text-slate-200'
                  }`}>
                    {isIncome ? '+' : '-'}{formatINR(Number(tx.amount))}
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 transition-opacity">
                    <button
                      onClick={() => onEditTransaction(tx)}
                      title="Edit"
                      className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-slate-700/50 rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      title="Delete"
                      className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
