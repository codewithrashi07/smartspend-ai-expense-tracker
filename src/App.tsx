import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Sidebar, NavView } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { StatCards } from './components/dashboard/StatCards';
import { CashflowChart } from './components/dashboard/CashflowChart';
import { CategoryBreakdown } from './components/dashboard/CategoryBreakdown';
import { AIAdviceCard } from './components/dashboard/AIAdviceCard';
import { BudgetProgressCard } from './components/dashboard/BudgetProgressCard';
import { RecentTransactions } from './components/dashboard/RecentTransactions';
import { TransactionTable } from './components/transactions/TransactionTable';
import { BudgetGrid } from './components/budgets/BudgetGrid';
import { AIInsightsView } from './components/ai/AIInsightsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { AuthModal } from './components/auth/AuthModal';
import { TransactionModal } from './components/transactions/TransactionModal';
import { BudgetModal } from './components/budgets/BudgetModal';
import { SavingsGoalModal } from './components/savings/SavingsGoalModal';
import { Transaction } from './types';
import { Loader2 } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [isGoalOpen, setIsGoalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const { isLoading: authLoading } = useAuth();
  const { isLoading: financeLoading } = useFinance();

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsAddTxOpen(true);
  };

  const handleCloseTxModal = () => {
    setIsAddTxOpen(false);
    setEditingTransaction(null);
  };

  if (authLoading && financeLoading) {
    return (
      <div className="min-h-screen bg-[#080B11] flex flex-col items-center justify-center text-slate-400 space-y-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-xs font-medium tracking-wide">Connecting to SmartSpend Cloud...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 flex">
      {/* Navigation Sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAddModal={() => setIsAddTxOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <Header
          currentView={currentView}
          onOpenMobileMenu={() => setIsOpenMobile(true)}
          onOpenAddModal={() => setIsAddTxOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {currentView === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Financial Summary Cards */}
              <StatCards />

              {/* AI Advice Card */}
              <AIAdviceCard onNavigateToInsights={() => setCurrentView('insights')} />

              {/* Charts Section: Cashflow & Category Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <CashflowChart />
                </div>
                <div>
                  <CategoryBreakdown />
                </div>
              </div>

              {/* Lower Section: Budget Controls & Recent Transactions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BudgetProgressCard
                  onManageBudgets={() => setCurrentView('budgets')}
                  onAddBudget={() => setIsBudgetOpen(true)}
                />
                <RecentTransactions
                  onViewAll={() => setCurrentView('transactions')}
                  onEditTransaction={handleEditTransaction}
                />
              </div>
            </div>
          )}

          {currentView === 'transactions' && (
            <div className="animate-in fade-in duration-200">
              <TransactionTable
                onAddTransaction={() => setIsAddTxOpen(true)}
                onEditTransaction={handleEditTransaction}
              />
            </div>
          )}

          {currentView === 'budgets' && (
            <div className="animate-in fade-in duration-200">
              <BudgetGrid onAddBudget={() => setIsBudgetOpen(true)} />
            </div>
          )}

          {currentView === 'insights' && (
            <div className="animate-in fade-in duration-200">
              <AIInsightsView />
            </div>
          )}

          {currentView === 'analytics' && (
            <div className="animate-in fade-in duration-200">
              <AnalyticsView onAddSavingsGoal={() => setIsGoalOpen(true)} />
            </div>
          )}

          {currentView === 'settings' && (
            <div className="animate-in fade-in duration-200">
              <SettingsView />
            </div>
          )}
        </main>
      </div>

      {/* Global Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <TransactionModal
        isOpen={isAddTxOpen}
        onClose={handleCloseTxModal}
        editingTransaction={editingTransaction}
      />
      <BudgetModal isOpen={isBudgetOpen} onClose={() => setIsBudgetOpen(false)} />
      <SavingsGoalModal isOpen={isGoalOpen} onClose={() => setIsGoalOpen(false)} />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <DashboardContent />
      </FinanceProvider>
    </AuthProvider>
  );
}

export default App;
