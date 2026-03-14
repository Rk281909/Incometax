import { useState } from 'react';
import { calculateEligibility } from '../utils/calculations';
import { formatNPR, numberToWordsNPR } from '../utils/formatters';
import { Calculator, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';

export default function LoanEligibility() {
  const [income, setIncome] = useState<number>(50000);
  const [otherIncome, setOtherIncome] = useState<number>(0);
  const [existingEmi, setExistingEmi] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(12);
  const [tenureYears, setTenureYears] = useState<number>(15);
  const [foir, setFoir] = useState<number>(50);

  const result = calculateEligibility(income, otherIncome, existingEmi, interestRate, tenureYears, foir);

  const exportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Loan Eligibility Report', 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Monthly Net Income: ${formatNPR(income)}`, 14, 32);
    doc.text(`Other Monthly Income: ${formatNPR(otherIncome)}`, 14, 38);
    doc.text(`Existing Monthly EMI: ${formatNPR(existingEmi)}`, 14, 44);
    doc.text(`Interest Rate: ${interestRate}%`, 14, 50);
    doc.text(`Loan Tenure: ${tenureYears} Years`, 14, 56);
    doc.text(`FOIR: ${foir}%`, 14, 62);
    
    doc.setFontSize(14);
    doc.text('Eligibility Results', 14, 76);
    
    doc.setFontSize(12);
    doc.text(`Eligible Loan Amount: ${formatNPR(result.eligibleLoanAmount)}`, 14, 86);
    doc.text(`In Words: ${numberToWordsNPR(result.eligibleLoanAmount)}`, 14, 92);
    doc.text(`Max Eligible EMI: ${formatNPR(result.eligibleEmi)}`, 14, 98);
    doc.text(`Total FOIR Limit: ${formatNPR(result.maxEmiCapacity)}`, 14, 104);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Note: This is an approximate calculation based on standard FOIR.', 14, 120);
    doc.text('Actual loan eligibility depends on the bank\'s internal policies.', 14, 126);

    doc.save('eligibility_report.pdf');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Loan Eligibility Calculator</h1>
        <p className="mt-1 text-sm text-slate-500">Calculate maximum eligible loan amount based on FOIR (Fixed Obligation to Income Ratio).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">Monthly Net Income (NPR)</label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Other Monthly Income (NPR)</label>
              <input
                type="number"
                value={otherIncome}
                onChange={(e) => setOtherIncome(Number(e.target.value))}
                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Existing Monthly EMI (NPR)</label>
              <input
                type="number"
                value={existingEmi}
                onChange={(e) => setExistingEmi(Number(e.target.value))}
                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Loan Tenure (Years)</label>
              <input
                type="number"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">FOIR (%)</label>
              <input
                type="number"
                value={foir}
                onChange={(e) => setFoir(Number(e.target.value))}
                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
              />
              <p className="text-xs text-slate-500 mt-1">Nepal standard is usually 50%</p>
            </div>
          </div>
        </div>

        <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-emerald-100 font-medium mb-1">Eligible Loan Amount</h3>
            <div className="text-3xl font-bold">{formatNPR(result.eligibleLoanAmount)}</div>
            <p className="text-xs text-emerald-200 mt-1">{numberToWordsNPR(result.eligibleLoanAmount)}</p>
          </div>

          <div className="space-y-4 mt-8">
            <div className="bg-emerald-700/50 p-4 rounded-xl">
              <div className="text-sm text-emerald-100">Max Eligible EMI</div>
              <div className="text-xl font-semibold">{formatNPR(result.eligibleEmi)}</div>
            </div>
            
            <div className="bg-emerald-700/50 p-4 rounded-xl">
              <div className="text-sm text-emerald-100">Total FOIR Limit</div>
              <div className="text-xl font-semibold">{formatNPR(result.maxEmiCapacity)}</div>
            </div>
          </div>

          <button 
            onClick={exportPDF}
            className="mt-8 w-full bg-white text-emerald-700 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-colors flex items-center justify-center"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start">
        <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3 shrink-0" />
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This is an approximate calculation based on standard FOIR. Actual loan eligibility depends on the bank's internal policies, credit score (CIB report), property valuation, and other factors.
        </p>
      </div>
    </div>
  );
}
