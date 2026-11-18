import React from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  ShieldCheck, 
  Zap, 
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../lib/formatters';

export const AIInsightsView: React.FC = () => {
  const { insights, healthMetric, transactions, selectedMonth } = useFinance();

  const handleDownloadSummary = () => {
    const summaryLines = [
      `=== SMARTSPEND AI FINANCIAL SUMMARY (${selectedMonth}) ===`,
      `Generated on: ${new Date().toLocaleString()}`,
      `Financial Health Score: ${healthMetric.score}/100 (${healthMetric.label})`,
      `Savings Rate: ${healthMetric.savingsRate}%`,
      `Budget Adherence: ${healthMetric.budgetAdherence}%`,
      `Daily Safe Spend: ${formatINR(healthMetric.dailySafeSpend, false)}`,
      `Days Remaining in Month: ${healthMetric.daysRemainingInMonth}`,
      `Top Expense Category: ${healthMetric.topExpenseCategory}`,
      ``,
      `--- KEY RECOMMENDATIONS & AUDITS ---`,
      ...insights.map((ins, i) => `${i + 1}. [${ins.type.toUpperCase()}] ${ins.title}\n   ${ins.description}\n   Action: ${ins.actionableStep || 'N/A'}\n`)
    ];

    const blob = new Blob([summaryLines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smartspend_ai_summary_${selectedMonth}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950/60 via-[#0F1422] to-purple-950/40 border border-indigo-500/30 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white tracking-tight">SmartSpend Financial Intelligence</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Rule-Based Engine Active
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Real-time heuristic behavioral pattern analysis detecting recurring waste, category overspending, and high-impact saving opportunities.
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadSummary}
          className="flex items-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 shadow transition-all shrink-0"
        >
          <Download className="w-4 h-4 text-indigo-400" />
          <span>Download AI Report</span>
        </button>
      </div>

      {/* Intelligence Score Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-[#0F1422] border border-slate-800 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Spending Health Score</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{healthMetric.score}</span>
            <span className="text-xs font-bold text-emerald-400">/ 100 ({healthMetric.label})</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Clearly calculated based on 50/30/20 split, budget adherence, and savings velocity.
          </p>
        </div>

        <div className="rounded-2xl bg-[#0F1422] border border-slate-800 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Daily Safe Velocity</span>
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-indigo-400">{formatINR(healthMetric.dailySafeSpend, false)}</span>
            <span className="text-xs text-slate-400">/ day</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Maximum spend per day for next {healthMetric.daysRemainingInMonth} days without depleting your monthly surplus.
          </p>
        </div>

        <div className="rounded-2xl bg-[#0F1422] border border-slate-800 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Highest Burn Category</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-extrabold text-white truncate">{healthMetric.topExpenseCategory}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Represents the largest chunk of your monthly outflows. Focus reduction here first.
          </p>
        </div>
      </div>

      {/* Actionable Insights List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span>Actionable Intelligence Feed</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            {insights.length} Detected
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((item) => {
            const isAlert = item.type === 'alert';
            const isOpp = item.type === 'opportunity';
            const isAchieve = item.type === 'achievement';

            let borderTheme = 'border-slate-800';
            let iconBg = 'bg-indigo-600/20 text-indigo-400';
            let Icon = Sparkles;

            if (isAlert) {
              borderTheme = 'border-rose-500/30 bg-rose-950/10';
              iconBg = 'bg-rose-500/20 text-rose-400';
              Icon = AlertTriangle;
            } else if (isOpp) {
              borderTheme = 'border-purple-500/30 bg-purple-950/10';
              iconBg = 'bg-purple-500/20 text-purple-400';
              Icon = TrendingDown;
            } else if (isAchieve) {
              borderTheme = 'border-emerald-500/30 bg-emerald-950/10';
              iconBg = 'bg-emerald-500/20 text-emerald-400';
              Icon = CheckCircle2;
            }

            return (
              <div
                key={item.id}
                className={`rounded-2xl bg-[#0F1422] border p-5 space-y-3 transition-all ${borderTheme}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-xl border border-white/5 ${iconBg}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {item.type} • {item.category || 'General'}
                      </span>
                      <h4 className="font-bold text-sm text-white">{item.title}</h4>
                    </div>
                  </div>
                  {item.potentialSavings && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      +{formatINR(item.potentialSavings, false)}/mo
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

                {item.actionableStep && (
                  <div className="pt-2 border-t border-slate-800/80 flex items-start space-x-2 text-xs text-indigo-300">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="font-medium">Action: {item.actionableStep}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Transparency Note */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 text-xs text-slate-400 flex items-start space-x-3">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-300">Transparency Guarantee:</strong> This application utilizes high-performance heuristic categorization and statistical rule engines locally. When InsForge cloud OpenRouter credentials are configured, advanced generative LLM evaluations can also be toggled in Settings.
        </div>
      </div>
    </div>
  );
};
