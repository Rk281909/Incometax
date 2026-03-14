export const nepaliMonths = ['Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'];

export const getNepaliDate = (startYear: number, startMonthIndex: number, addMonths: number) => {
  const totalMonths = startMonthIndex + addMonths;
  const year = startYear + Math.floor(totalMonths / 12);
  const month = nepaliMonths[totalMonths % 12];
  return `${month} ${year}`;
};

export interface AmortizationRow {
  month: number;
  date: string;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

export const calculateEMI = (principal: number, rate: number, tenureMonths: number, startYear: number = 2081, startMonth: number = 0): { emi: number, totalInterest: number, totalPayment: number, schedule: AmortizationRow[] } => {
  if (principal <= 0 || tenureMonths <= 0) return { emi: 0, totalInterest: 0, totalPayment: 0, schedule: [] };
  
  if (rate === 0) {
    const emi = principal / tenureMonths;
    return {
      emi,
      totalInterest: 0,
      totalPayment: principal,
      schedule: Array.from({ length: tenureMonths }, (_, i) => ({
        month: i + 1,
        date: getNepaliDate(startYear, startMonth, i),
        emi,
        principal: emi,
        interest: 0,
        balance: principal - emi * (i + 1)
      }))
    };
  }

  const monthlyRate = rate / 12 / 100;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  
  let balance = principal;
  let totalInterest = 0;
  const schedule: AmortizationRow[] = [];

  for (let i = 1; i <= tenureMonths; i++) {
    const interest = balance * monthlyRate;
    const principalPayment = emi - interest;
    balance -= principalPayment;
    totalInterest += interest;
    
    schedule.push({
      month: i,
      date: getNepaliDate(startYear, startMonth, i - 1),
      emi,
      principal: principalPayment,
      interest,
      balance: Math.max(0, balance)
    });
  }

  return {
    emi,
    totalInterest,
    totalPayment: principal + totalInterest,
    schedule
  };
};

export const calculateMicrofinance = (loanAmount: number, interestRate: number, tenureMonths: number, method: 'flat' | 'reducing', frequency: 'monthly' | 'weekly', startYear: number = 2081, startMonth: number = 0) => {
  const periods = frequency === 'monthly' ? tenureMonths : tenureMonths * 4;
  const schedule = [];
  let totalInterest = 0;
  let totalPayment = 0;
  let installment = 0;

  if (method === 'flat') {
    totalInterest = (loanAmount * interestRate * (tenureMonths / 12)) / 100;
    totalPayment = loanAmount + totalInterest;
    installment = totalPayment / periods;
    const principalPart = loanAmount / periods;
    const interestPart = totalInterest / periods;
    let balance = loanAmount;

    for (let i = 1; i <= periods; i++) {
      balance -= principalPart;
      schedule.push({
        period: i,
        date: frequency === 'monthly' ? getNepaliDate(startYear, startMonth, i - 1) : `Week ${i}`,
        installment,
        principal: principalPart,
        interest: interestPart,
        balance: Math.max(0, balance)
      });
    }
  } else {
    const ratePerPeriod = frequency === 'monthly' ? (interestRate / 12 / 100) : (interestRate / 52 / 100);
    installment = (loanAmount * ratePerPeriod * Math.pow(1 + ratePerPeriod, periods)) / (Math.pow(1 + ratePerPeriod, periods) - 1);
    let balance = loanAmount;

    for (let i = 1; i <= periods; i++) {
      const interestPart = balance * ratePerPeriod;
      const principalPart = installment - interestPart;
      balance -= principalPart;
      totalInterest += interestPart;
      schedule.push({
        period: i,
        date: frequency === 'monthly' ? getNepaliDate(startYear, startMonth, i - 1) : `Week ${i}`,
        installment,
        principal: principalPart,
        interest: interestPart,
        balance: Math.max(0, balance)
      });
    }
    totalPayment = loanAmount + totalInterest;
  }

  return { installment, totalInterest, totalPayment, periods, schedule };
};

export const calculateEligibility = (
  monthlyIncome: number,
  otherIncome: number,
  existingEmi: number,
  interestRate: number,
  tenureYears: number,
  foirPercentage: number = 50
) => {
  const totalIncome = monthlyIncome + otherIncome;
  const maxEmiCapacity = (totalIncome * foirPercentage) / 100;
  const eligibleEmi = maxEmiCapacity - existingEmi;

  if (eligibleEmi <= 0) {
    return { eligibleLoanAmount: 0, eligibleEmi: 0, maxEmiCapacity, foirPercentage };
  }

  const monthlyRate = interestRate / 12 / 100;
  const tenureMonths = tenureYears * 12;
  
  const eligibleLoanAmount = eligibleEmi / ((monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1));

  return {
    eligibleLoanAmount,
    eligibleEmi,
    maxEmiCapacity,
    foirPercentage
  };
};

export const calculateSIP = (monthlyInvestment: number, expectedReturnRate: number, tenureYears: number, startYear: number = 2081) => {
  const monthlyRate = expectedReturnRate / 12 / 100;
  let currentBalance = 0;
  let totalInvestment = 0;
  const schedule = [];

  for (let i = 1; i <= tenureYears; i++) {
    for(let m = 1; m <= 12; m++) {
      currentBalance = (currentBalance + monthlyInvestment) * (1 + monthlyRate);
      totalInvestment += monthlyInvestment;
    }
    schedule.push({
      year: startYear + i - 1,
      investment: totalInvestment,
      returns: currentBalance - totalInvestment,
      balance: currentBalance
    });
  }

  const maturityAmount = currentBalance;
  const estimatedReturns = maturityAmount - totalInvestment;

  return {
    maturityAmount,
    totalInvestment,
    estimatedReturns,
    schedule
  };
};
