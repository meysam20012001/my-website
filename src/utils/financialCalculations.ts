/**
 * Financial and percentage calculation utilities
 * Includes Central Bank of Iran formulas for bank deposits and loans.
 */

export interface DepositCalculationResult {
  principal: number;
  annualRate: number;
  periodMonths: number;
  monthlyInterest: number;
  yearlyInterest: number;
  dailyInterest: number;
  totalInterest: number;
  finalBalance: number;
  compoundFinalBalance?: number;
  compoundTotalInterest?: number;
}

export interface LoanInstallmentRow {
  month: number;
  monthlyPayment: number;
  principalPayment: number;
  interestPayment: number;
  remainingBalance: number;
}

export interface LoanCalculationResult {
  loanAmount: number;
  annualRate: number;
  termMonths: number;
  monthlyPayment: number;
  totalRepayment: number;
  totalInterest: number;
  schedule: LoanInstallmentRow[];
}

/**
 * Calculates bank deposit interest (simple and compound).
 * @param principal Principal amount in Tomans
 * @param annualRate Annual interest percentage (e.g. 22.5)
 * @param periodMonths Deposit duration in months (e.g. 12)
 */
export function calculateDepositInterest(
  principal: number,
  annualRate: number,
  periodMonths: number = 12
): DepositCalculationResult {
  if (principal <= 0 || annualRate <= 0) {
    return {
      principal: 0,
      annualRate: 0,
      periodMonths: 12,
      monthlyInterest: 0,
      yearlyInterest: 0,
      dailyInterest: 0,
      totalInterest: 0,
      finalBalance: 0
    };
  }

  // Iranian banking 30-day month convention: (Principal * Rate * 30) / 36500
  // Or direct monthly rate: (Principal * Rate) / 1200
  const monthlyInterest = Math.round((principal * annualRate * 30) / 36500);
  const yearlyInterest = Math.round((principal * annualRate) / 100);
  const dailyInterest = Math.round((principal * annualRate) / 36500);
  const totalInterest = monthlyInterest * periodMonths;
  const finalBalance = principal + totalInterest;

  // Compound interest calculation (if monthly interest is reinvested at same rate)
  const monthlyRate = annualRate / 100 / 12;
  const compoundFinal = principal * Math.pow(1 + monthlyRate, periodMonths);
  const compoundTotalInterest = Math.round(compoundFinal - principal);

  return {
    principal,
    annualRate,
    periodMonths,
    monthlyInterest,
    yearlyInterest,
    dailyInterest,
    totalInterest,
    finalBalance,
    compoundFinalBalance: Math.round(compoundFinal),
    compoundTotalInterest
  };
}

/**
 * Calculates bank loan monthly installments and creates an amortization table
 * according to Central Bank of Iran official formula.
 *
 * Formula: Payment = [P * r * (1 + r)^n] / [(1 + r)^n - 1]
 * where P = principal, r = monthly rate (annualRate / 1200), n = months.
 */
export function calculateLoanInstallments(
  loanAmount: number,
  annualRate: number,
  termMonths: number
): LoanCalculationResult {
  if (loanAmount <= 0 || annualRate <= 0 || termMonths <= 0) {
    return {
      loanAmount: 0,
      annualRate: 0,
      termMonths: 0,
      monthlyPayment: 0,
      totalRepayment: 0,
      totalInterest: 0,
      schedule: []
    };
  }

  const monthlyRate = annualRate / 1200;
  const factor = Math.pow(1 + monthlyRate, termMonths);
  const monthlyPayment = Math.round((loanAmount * monthlyRate * factor) / (factor - 1));
  const totalRepayment = monthlyPayment * termMonths;
  const totalInterest = totalRepayment - loanAmount;

  // Build amortization schedule
  const schedule: LoanInstallmentRow[] = [];
  let remaining = loanAmount;

  for (let month = 1; month <= termMonths; month++) {
    const interestPart = Math.round(remaining * monthlyRate);
    let principalPart = monthlyPayment - interestPart;

    if (month === termMonths) {
      principalPart = remaining;
    }

    remaining = Math.max(0, remaining - principalPart);

    schedule.push({
      month,
      monthlyPayment,
      principalPayment: principalPart,
      interestPayment: interestPart,
      remainingBalance: remaining
    });
  }

  return {
    loanAmount,
    annualRate,
    termMonths,
    monthlyPayment,
    totalRepayment,
    totalInterest,
    schedule
  };
}

/**
 * Percentage calculation operations
 */
export const PercentageTools = {
  /**
   * What is X percent of Y? (e.g. 15% of 2,000,000 = 300,000)
   */
  percentOfNumber(percentage: number, baseNumber: number): number {
    return (percentage / 100) * baseNumber;
  },

  /**
   * X is what percent of Y? (e.g. 500,000 is what percent of 2,000,000 = 25%)
   */
  whatPercentIs(part: number, whole: number): number {
    if (whole === 0) return 0;
    return (part / whole) * 100;
  },

  /**
   * Percentage change between old value and new value: ((new - old) / old) * 100
   */
  percentageChange(oldValue: number, newValue: number): { percent: number; isIncrease: boolean; diff: number } {
    if (oldValue === 0) return { percent: 0, isIncrease: newValue >= 0, diff: newValue };
    const diff = newValue - oldValue;
    const percent = (diff / Math.abs(oldValue)) * 100;
    return {
      percent: Math.abs(percent),
      isIncrease: diff >= 0,
      diff: Math.abs(diff)
    };
  },

  /**
   * Value increased by X% (e.g. 1,000,000 + 20% = 1,200,000)
   */
  increaseByPercent(base: number, percent: number): { result: number; addedAmount: number } {
    const addedAmount = (base * percent) / 100;
    return {
      result: base + addedAmount,
      addedAmount
    };
  },

  /**
   * Value discounted by X% (e.g. 1,000,000 - 15% = 850,000)
   */
  discountByPercent(base: number, percent: number): { result: number; discountAmount: number } {
    const discountAmount = (base * percent) / 100;
    return {
      result: Math.max(0, base - discountAmount),
      discountAmount
    };
  },

  /**
   * Value Added Tax (VAT / ارزش افزوده) calculation (Standard is 10% in Iran)
   */
  calculateVat(baseAmount: number, vatRate: number = 10): { vatAmount: number; totalWithVat: number } {
    const vatAmount = (baseAmount * vatRate) / 100;
    return {
      vatAmount,
      totalWithVat: baseAmount + vatAmount
    };
  },

  /**
   * Extract base price from total price that already includes VAT
   * Base = Total / (1 + Rate/100)
   */
  extractBaseFromVat(totalWithVat: number, vatRate: number = 10): { baseAmount: number; vatAmount: number } {
    if (vatRate === 0) return { baseAmount: totalWithVat, vatAmount: 0 };
    const baseAmount = totalWithVat / (1 + vatRate / 100);
    const vatAmount = totalWithVat - baseAmount;
    return {
      baseAmount: Math.round(baseAmount),
      vatAmount: Math.round(vatAmount)
    };
  },

  /**
   * Profit Margin & Markup calculation
   */
  calculateProfitMargin(costPrice: number, sellingPrice: number) {
    const profit = sellingPrice - costPrice;
    const markupPercent = costPrice > 0 ? (profit / costPrice) * 100 : 0;
    const marginPercent = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
    return {
      profit,
      isProfitable: profit >= 0,
      markupPercent,
      marginPercent
    };
  }
};
