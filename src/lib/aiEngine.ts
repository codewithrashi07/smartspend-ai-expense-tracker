import { Transaction, Budget, AIInsight, FinancialHealthMetric } from '../types';
import { formatINR } from './formatters';

// Intelligent category keyword dictionary
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Food & Dining': [
    'starbucks', 'coffee', 'cafe', 'mcdonald', 'burger', 'pizza', 'restaurant',
    'diner', 'subway', 'chipotle', 'taco', 'bakery', 'doordash', 'ubereats',
    'grubhub', 'swiggy', 'zomato', 'bistro', 'bar', 'pub', 'sushi'
  ],
  'Groceries': [
    'walmart', 'costco', 'trader joe', 'whole foods', 'kroger', 'safeway',
    'target grocery', 'supermarket', 'market', 'aldi', 'sprouts', 'groceries',
    'instacart', 'fruits', 'vegetables', 'milk'
  ],
  'Housing & Rent': [
    'rent', 'mortgage', 'lease', 'landlord', 'apartment', 'housing', 'condo',
    'maintenance fee', 'property tax', 'home insurance'
  ],
  'Utilities & Bills': [
    'electric', 'electricity', 'water bill', 'gas bill', 'internet', 'wifi',
    'verizon', 'at&t', 't-mobile', 'comcast', 'xfinity', 'trash', 'utility', 'broadband'
  ],
  'Transportation': [
    'uber', 'lyft', 'gas station', 'shell', 'chevron', 'chevron gas', 'fuel',
    'parking', 'toll', 'metro', 'subway pass', 'train', 'bus', 'flight',
    'airline', 'delta', 'united', 'car wash', 'tesla charging', 'oil change'
  ],
  'Shopping & Retail': [
    'amazon', 'target', 'ebay', 'best buy', 'clothing', 'zara', 'h&m',
    'nike', 'shoes', 'electronics', 'apple store', 'nordstrom', 'walmart retail'
  ],
  'Entertainment & Subscriptions': [
    'netflix', 'spotify', 'apple tv', 'hulu', 'disney+', 'youtube premium',
    'cinema', 'movies', 'amc', 'steam', 'playstation', 'xbox', 'nintendo',
    'patreon', 'audible', 'hbo max', 'prime video'
  ],
  'Healthcare & Wellness': [
    'pharmacy', 'cvs', 'walgreens', 'doctor', 'clinic', 'hospital', 'dentist',
    'gym', 'fitness', 'planet fitness', 'equinox', 'yoga', 'medicine', 'therapy'
  ],
  'Education & Learning': [
    'coursera', 'udemy', 'books', 'kindle', 'tuition', 'university', 'college',
    'school', 'course', 'chegg', 'datacamp'
  ],
  'Investments & Savings': [
    'vanguard', 'fidelity', 'robinhood', 'coinbase', 'crypto', 'stocks',
    'etf', 'roth ira', '401k', 'savings deposit'
  ],
  'Salary & Wages': [
    'salary', 'payroll', 'direct deposit', 'paycheck', 'employer', 'bonus', 'stipend'
  ],
  'Freelance & Side Hustle': [
    'upwork', 'fiverr', 'client invoice', 'contract', 'consulting', 'freelance'
  ]
};

/**
 * Heuristically suggests category and payment method from a title or description.
 */
export function suggestCategoryAndType(title: string): {
  category: string;
  type: 'income' | 'expense';
  confidence: number;
} {
  const clean = title.toLowerCase().trim();

  // Check income keywords
  if (
    clean.includes('salary') ||
    clean.includes('payroll') ||
    clean.includes('dividend') ||
    clean.includes('interest income') ||
    clean.includes('freelance payment') ||
    clean.includes('consulting fee') ||
    clean.includes('bonus')
  ) {
    if (clean.includes('freelance') || clean.includes('upwork') || clean.includes('fiverr')) {
      return { category: 'Freelance & Side Hustle', type: 'income', confidence: 0.95 };
    }
    return { category: 'Salary & Wages', type: 'income', confidence: 0.95 };
  }

  // Scan category keywords
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (clean.includes(kw)) {
        return {
          category,
          type: category === 'Salary & Wages' || category === 'Freelance & Side Hustle' ? 'income' : 'expense',
          confidence: 0.9
        };
      }
    }
  }

  return { category: 'Miscellaneous', type: 'expense', confidence: 0.4 };
}

/**
 * Calculates financial health metric based on transactions and budgets.
 */
export function calculateHealthMetric(
  transactions: Transaction[],
  budgets: Budget[],
  monthlyIncomeTarget = 5000
): FinancialHealthMetric {
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  // Current month transactions
  const monthTransactions = transactions.filter(t => t.date.startsWith(currentMonthStr));
  
  const totalIncome = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const totalExpense = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const effectiveIncome = totalIncome > 0 ? totalIncome : monthlyIncomeTarget;
  const netSavings = Math.max(0, effectiveIncome - totalExpense);
  const savingsRate = Math.min(100, Math.round((netSavings / effectiveIncome) * 100));

  // Category breakdown
  const categoryTotals: Record<string, number> = {};
  for (const t of monthTransactions) {
    if (t.type === 'expense') {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
    }
  }

  let topCategory = 'None';
  let maxSpent = 0;
  for (const [cat, spent] of Object.entries(categoryTotals)) {
    if (spent > maxSpent) {
      maxSpent = spent;
      topCategory = cat;
    }
  }

  // Budget Adherence
  let budgetScore = 100;
  if (budgets.length > 0) {
    let overspentCount = 0;
    for (const b of budgets) {
      const spent = categoryTotals[b.category] || 0;
      if (spent > b.monthly_limit) {
        overspentCount++;
      }
    }
    budgetScore = Math.max(0, 100 - (overspentCount / budgets.length) * 40);
  }

  // Days remaining in month calculation
  const totalDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysPassed = now.getDate();
  const daysRemaining = Math.max(1, totalDaysInMonth - daysPassed);

  // Safe daily spend calculation
  const remainingBudget = Math.max(0, effectiveIncome - totalExpense);
  const dailySafeSpend = Math.round((remainingBudget / daysRemaining) * 100) / 100;

  // Composite health score (0-100)
  // Weighted: 45% savings rate, 35% budget adherence, 20% expense-to-income ratio
  const expenseRatio = Math.min(1, totalExpense / (effectiveIncome || 1));
  const expenseScore = Math.max(0, 100 - expenseRatio * 80);
  
  let score = Math.round((savingsRate * 0.45) + (budgetScore * 0.35) + (expenseScore * 0.20));
  score = Math.max(15, Math.min(99, score)); // reasonable bounds

  let label: FinancialHealthMetric['label'] = 'Good';
  if (score >= 80) label = 'Excellent';
  else if (score >= 65) label = 'Good';
  else if (score >= 50) label = 'Fair';
  else label = 'Needs Attention';

  return {
    score,
    label,
    savingsRate,
    budgetAdherence: Math.round(budgetScore),
    dailySafeSpend,
    daysRemainingInMonth: daysRemaining,
    topExpenseCategory: topCategory
  };
}

/**
 * Intelligent Pattern Analysis and Saving Recommendations
 */
export function generateAIInsights(
  transactions: Transaction[],
  budgets: Budget[],
  apiKey?: string
): AIInsight[] {
  const insights: AIInsight[] = [];
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthExpenses = transactions.filter(t => t.date.startsWith(currentMonthStr) && t.type === 'expense');

  // 1. Identify recurring subscriptions
  const subscriptions = monthExpenses.filter(t => 
    t.is_recurring || 
    t.category === 'Entertainment & Subscriptions' ||
    ['netflix', 'spotify', 'hulu', 'gym', 'prime', 'apple', 'audible', 'chatgpt'].some(k => t.title.toLowerCase().includes(k))
  );
  
  const totalSubSpend = subscriptions.reduce((sum, t) => sum + Number(t.amount), 0);
  if (totalSubSpend > 40) {
    insights.push({
      id: 'sub-audit',
      type: 'opportunity',
      title: 'Subscription Audit Opportunity',
      description: `You are spending ${formatINR(totalSubSpend)} on ${subscriptions.length} recurring subscriptions this month. Reviewing unused services could free up capital immediately.`,
      potentialSavings: Math.round(totalSubSpend * 0.35),
      category: 'Entertainment & Subscriptions',
      actionableStep: 'Audit active digital memberships and cancel at least one unused recurring plan.',
      date: new Date().toISOString()
    });
  }

  // 2. Budget threshold alerts
  for (const b of budgets) {
    const spent = monthExpenses
      .filter(t => t.category === b.category)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const ratio = spent / (b.monthly_limit || 1);
    if (ratio >= 1.0) {
      insights.push({
        id: `budget-over-${b.id}`,
        type: 'alert',
        title: `Overbudget Alert: ${b.category}`,
        description: `You have spent ${formatINR(spent)} which exceeds your ${formatINR(b.monthly_limit)} budget limit by ${( (ratio - 1) * 100).toFixed(0)}%.`,
        potentialSavings: Math.round(spent - b.monthly_limit),
        category: b.category,
        actionableStep: `Pause discretionary transactions in ${b.category} until next month.`,
        date: new Date().toISOString()
      });
    } else if (ratio >= 0.85) {
      insights.push({
        id: `budget-warn-${b.id}`,
        type: 'alert',
        title: `Nearing Limit: ${b.category}`,
        description: `You've utilized ${(ratio * 100).toFixed(0)}% of your ${formatINR(b.monthly_limit)} monthly budget for ${b.category}. Only ${formatINR(b.monthly_limit - spent)} remains.`,
        category: b.category,
        actionableStep: 'Consider slowing down purchases in this category for the remaining days.',
        date: new Date().toISOString()
      });
    }
  }

  // 3. Dining out / Food impulse spending
  const diningSpent = monthExpenses
    .filter(t => t.category === 'Food & Dining')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  if (diningSpent > 250) {
    insights.push({
      id: 'dining-insight',
      type: 'tip',
      title: 'Dining & Delivery Optimization',
      description: `Dining out accounts for ${formatINR(diningSpent)} this month. Preparing meals at home 2 extra nights a week could save around ₹120/month.`,
      potentialSavings: 120,
      category: 'Food & Dining',
      actionableStep: 'Meal prep for Monday through Wednesday to easily pocket ₹30–₹40 each week.',
      date: new Date().toISOString()
    });
  }

  // 4. Savings milestone or recommendation
  const incomeTotal = transactions
    .filter(t => t.date.startsWith(currentMonthStr) && t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenseTotal = monthExpenses.reduce((sum, t) => sum + Number(t.amount), 0);

  if (incomeTotal > expenseTotal && incomeTotal > 0) {
    const netSaved = incomeTotal - expenseTotal;
    insights.push({
      id: 'savings-boost',
      type: 'achievement',
      title: 'Positive Cash Flow Milestone',
      description: `You have maintained a surplus of ${formatINR(netSaved)} this month! Directing this toward a high-yield emergency fund or ETF accelerates financial freedom.`,
      potentialSavings: Math.round(netSaved),
      category: 'Investments & Savings',
      actionableStep: 'Transfer 50% of this month’s surplus to your primary savings goal today.',
      date: new Date().toISOString()
    });
  } else {
    insights.push({
      id: 'cashflow-check',
      type: 'tip',
      title: '50/30/20 Rule Alignment',
      description: 'Strive to allocate 50% of your earnings to Essentials, 30% to Lifestyle, and 20% to Wealth Building for optimal financial resilience.',
      actionableStep: 'Tag your expenses to review if discretionary lifestyle spending exceeds 30%.',
      date: new Date().toISOString()
    });
  }

  return insights;
}
