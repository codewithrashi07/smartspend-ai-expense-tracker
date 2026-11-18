import React, { useState } from 'react';
import { X, PieChart, IndianRupee, Tag } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
}

const CATEGORIES = [
  'Food & Dining',
  'Groceries',
  'Housing & Rent',
  'Utilities & Bills',
  'Transportation',
  'Shopping & Retail',
  'Entertainment & Subscriptions',
  'Healthcare & Wellness',
  'Education & Learning',
  'Investments & Savings',
  'Miscellaneous'
];

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  initialCategory
}) => {
  const { saveBudget, selectedMonth } = useFinance();
  const [category, setCategory] = useState(initialCategory || CATEGORIES[0]);
  const [limit, setLimit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!limit || isNaN(Number(limit)) || Number(limit) <= 0) return;

    setIsSubmitting(true);
    await saveBudget(category, Number(limit), selectedMonth);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-[#0F1422] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Set Category Budget</h3>
              <p className="text-xs text-slate-400">Target for {selectedMonth}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Monthly Limit (₹ INR)</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="number"
                step="1"
                min="1"
                required
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="400"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              SmartSpend will alert you when spending reaches 85% and 100% of this limit.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Set Budget Limit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
