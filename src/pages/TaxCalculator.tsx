import { useState } from 'react';
import { formatNPR } from '../utils/formatters';
import { PieChart, AlertCircle } from 'lucide-react';

export default function TaxCalculator() {
  const [annualIncome, setAnnualIncome] = useState<number>(1200000);
  const [maritalStatus, setMaritalStatus] = useState<'single' | 'married'>('single');
  const [pfContribution, setPfContribution] = useState<number>(0);
  const [citContribution, setCitContribution] = useState<number>(0);
  const [lifeInsurance, setLifeInsurance] = useState<number>(0);

  // Simplified Nepal Tax Calculation (FY 2080/81 approx)
  const calculateTax = () => {
    let taxableIncome = annualIncome - pfContribution - citContribution - Math.min(lifeInsurance, 40000);
    let tax = 0;
    let remainingIncome = taxableIncome;

    const brackets = maritalStatus === 'single' 
      ? [
          { limit: 500000, rate: 0.01 },
          { limit: 200000, rate: 0.10 },
          { limit: 300000, rate: 0.20 },
          { limit: 1000000, rate: 0.30 },
          { limit: Infinity, rate: 0.36 }
        ]
      : [
          { limit: 600000, rate: 0.01 },
          { limit: 200000, rate: 0.10 },
          { limit: 300000, rate: 0.20 },
          { limit: 900000, rate: 0.30 },
          { limit: Infinity, rate: 0.36 }
        ];

    const breakdown = [];

    for (const bracket of brackets) {
      if (remainingIncome > 0) {
        const amountInBracket = Math.min(remainingIncome, bracket.limit);
        const taxForBracket = amountInBracket * bracket.rate;
        tax += taxForBracket;
        breakdown.push({
          rate: bracket.rate * 100,
          amount: amountInBracket,
          tax: taxForBracket
        });
        remainingIncome -= amountInBracket;
      } else {
        break;
      }
    }

    return { tax, taxableIncome, breakdown };
  };

  const result = calculateTax();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Nepal Income Tax Calculator</h1>
        <p className="mt-1 text-sm text-slate-500">Calculate estimated income tax based on Nepal Government tax brackets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">Annual Income (NPR)</label>
              <input
                type="number"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(Number(e.target.value))}
                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm p-3 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Marital Status</label>
              <select
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value as 'single' | 'married')}
                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm p-3 border bg-white"
              >
                <option value="single">Single / Unmarried</option>
                <option value="married">Married / Couple</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">PF Contribution (Annual)</label>
              <input
                type="number"
                value={pfContribution}
                onChange={(e) => setPfContribution(Number(e.target.value))}
                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm p-3 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">CIT Contribution (Annual)</label>
              <input
                type="number"
                value={citContribution}
                onChange={(e) => setCitContribution(Number(e.target.value))}
                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm p-3 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Life Insurance Premium</label>
              <input
                type="number"
                value={lifeInsurance}
                onChange={(e) => setLifeInsurance(Number(e.target.value))}
                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm p-3 border"
              />
              <p className="text-xs text-slate-500 mt-1">Max deduction allowed: 40,000</p>
            </div>
          </div>
        </div>

        <div className="bg-rose-600 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-rose-100 font-medium mb-1">Estimated Annual Tax</h3>
            <div className="text-4xl font-bold">{formatNPR(result.tax)}</div>
            <p className="text-xs text-rose-200 mt-1">Monthly Tax: {formatNPR(result.tax / 12)}</p>
          </div>

          <div className="space-y-4 mt-8">
            <div className="bg-rose-700/50 p-4 rounded-xl">
              <div className="text-sm text-rose-100">Taxable Income</div>
              <div className="text-xl font-semibold">{formatNPR(result.taxableIncome)}</div>
            </div>
            
            <div className="bg-rose-700/50 p-4 rounded-xl">
              <div className="text-sm text-rose-100">Net Take Home (Annual)</div>
              <div className="text-xl font-semibold">{formatNPR(annualIncome - result.tax - pfContribution - citContribution)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-800">Tax Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tax Slab</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Taxable Amount</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Tax Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {result.breakdown.map((row, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{row.rate}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-right">{formatNPR(row.amount)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-rose-600 text-right font-medium">{formatNPR(row.tax)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start">
        <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3 shrink-0" />
        <p className="text-sm text-blue-800">
          <strong>Disclaimer:</strong> This is a simplified tax calculation for estimation purposes only. Actual tax liability may vary based on specific exemptions, rebates, and recent changes in tax laws by the Inland Revenue Department (IRD) of Nepal.
        </p>
      </div>
    </div>
  );
}
