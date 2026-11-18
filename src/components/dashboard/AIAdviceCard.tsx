import React from 'react';
import { Sparkles, ArrowRight, TrendingDown, Lightbulb, AlertTriangle } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../lib/formatters';

interface AIAdviceCardProps {
  onNavigateToInsights: () => void;
}

export const AIAdviceCard: React.FC<AIAdviceCardProps> = ({ onNavigateToInsights }) => {
  const { insights } = useFinance();
  const topInsight = insights[0];

  if (!topInsight) {
    return (
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/30 p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">AI Engine Initializing</h4>
            <p className="text-xs text-slate-400">Add transactions to receive automated intelligent suggestions.</p>
          </div>
        </div>
      </div>
    );
  }

  const isAlert = topInsight.type === 'alert';

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-5 transition-all ${
      isAlert 
        ? 'bg-gradient-to-r from-rose-950/30 via-slate-900 to-[#0F1422] border-rose-500/40' 
        : 'bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900 border-indigo-500/30 shadow-lg shadow-indigo-950/40'
    }`}>
      {/* Background Glow */}
      <div className="absolute -right-8 -top-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start space-x-3.5">
          <div className={`p-3 rounded-xl shrink-0 ${
            isAlert 
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
              : 'bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/30'
          }`}>
            {isAlert ? <AlertTriangle className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI Recommendation • {topInsight.category || 'General'}
              </span>
              {topInsight.potentialSavings && (
                <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Save ~{formatINR(topInsight.potentialSavings, false)}/mo
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-white mt-1">{topInsight.title}</h4>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">{topInsight.description}</p>
            {topInsight.actionableStep && (
              <p className="text-xs font-semibold text-indigo-300 mt-2 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                Action: {topInsight.actionableStep}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onNavigateToInsights}
          className="shrink-0 flex items-center space-x-1.5 text-xs font-semibold text-white bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 px-3.5 py-2 rounded-xl transition-all active:scale-[0.98]"
        >
          <span>View All Insights ({insights.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
