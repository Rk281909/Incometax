import { useState } from 'react';
import { calculateMicrofinance, nepaliMonths } from '../utils/calculations';
import { formatNPR, formatNumber } from '../utils/formatters';
import { Users, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Microfinance() {
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(15);
  const [tenureMonths, setTenureMonths] = useState<number>(12);
  const [method, setMethod] = useState<'flat' | 'reducing'>('flat');
  const [frequency, setFrequency] = useState<'monthly' | 'weekly'>('monthly');
  const [startYear, setStartYear] = useState<number>(2081);
  const [startMonth, setStartMonth] = useState<number>(0);

  const result = calculateMicrofinance(loanAmount, interestRate, tenureMonths, method, frequency, startYear, startMonth);

  const exportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Microfinance Loan Schedule', 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Loan Amount: ${formatNPR(loanAmount)}`, 14, 32);
    doc.text(`Interest Rate: ${interestRate}% (${method === 'flat' ? 'Flat' : 'Reducing'})`, 14, 38);
    doc.text(`Tenure: ${tenureMonths} Months`, 14, 44);
    
    doc.text(`${frequency === 'monthly' ? 'Monthly' : 'Weekly'} Installment: ${formatNPR(result.installment)}`, 14, 54);
    doc.text(`Total Interest: ${formatNPR(result.totalInterest)}`, 14, 60);
    doc.text(`Total Payment: ${formatNPR(result.totalPayment)}`, 14, 66);

    const tableData = result.schedule.map(row => [
      row.period,
      row.date,
      formatNumber(row.installment),
      formatNumber(row.principal),
      formatNumber(row.interest),
      formatNumber(row.balance)
    ]);

    autoTable(doc, {
      startY: 76,
      head: [['Period', 'Date', 'Installment', 'Principal', 'Interest', 'Balance']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [147, 51, 234] } // purple-600
    });

    doc.save('microfinance_schedule.pdf');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Microfinance Loan Calculator</h1>
        <p className="mt-1 text-sm text-slate-500">Calculate group loans, weekly/monthly installments with flat or reducing balance methods.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">Loan Amount (NPR)</label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-3 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-3 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Tenure (Months)</label>
              <input
                type="number"
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-3 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Calculation Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as 'flat' | 'reducing')}
                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-3 border bg-white"
              >
                <option value="flat">Flat Rate</option>
                <option value="reducing">Reducing Balance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Installment Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as 'monthly' | 'weekly')}
                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-3 border bg-white"
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Start Year (BS)</label>
                <input
                  type="number"
                  value={startYear}
                  onChange={(e) => setStartYear(Number(e.target.value))}
                  className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-3 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Start Month</label>
                <select
                  value={startMonth}
                  onChange={(e) => setStartMonth(Number(e.target.value))}
                  className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-3 border bg-white"
                >
                  {nepaliMonths.map((m, i) => (
                    <option key={m} value={i}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-600 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-purple-100 font-medium mb-1 capitalize">{frequency} Installment</h3>
            <div className="text-4xl font-bold">{formatNPR(result.installment)}</div>
            <p className="text-xs text-purple-200 mt-1">For {result.periods} periods</p>
          </div>

          <div className="space-y-4 mt-8">
            <div className="bg-purple-700/50 p-4 rounded-xl">
              <div className="text-sm text-purple-100">Total Interest</div>
              <div className="text-xl font-semibold">{formatNPR(result.totalInterest)}</div>
            </div>
            
            <div className="bg-purple-700/50 p-4 rounded-xl">
              <div className="text-sm text-purple-100">Total Payment</div>
              <div className="text-xl font-semibold">{formatNPR(result.totalPayment)}</div>
            </div>
          </div>

          <button 
            onClick={exportPDF}
            className="mt-8 w-full bg-white text-purple-700 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors flex items-center justify-center"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Schedule
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-800">Repayment Schedule</h3>
        </div>
        <div className="overflow-x-auto max-h-[500px]">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 sticky top-0">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Period</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Installment</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Principal</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Interest</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Balance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {result.schedule.map((row) => (
                <tr key={row.period} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{row.period}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{row.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-right">{formatNumber(row.installment)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 text-right">{formatNumber(row.principal)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-600 text-right">{formatNumber(row.interest)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-right font-medium">{formatNumber(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-purple-600" />
          Group Loan Splitter
        </h3>
        <p className="text-sm text-slate-500 mb-4">Quickly calculate individual liability for a group loan.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700">Number of Members</label>
            <input
              type="number"
              defaultValue={5}
              id="groupMembers"
              className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-3 border"
            />
          </div>
          <div className="md:col-span-2 bg-purple-50 p-4 rounded-xl border border-purple-100 flex justify-between items-center">
             <div>
               <div className="text-sm text-purple-800 font-medium">Per Member Liability</div>
               <div className="text-xs text-purple-600">Total Payment / Members</div>
             </div>
             <div className="text-xl font-bold text-purple-700">
               {formatNPR(result.totalPayment / 5)}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
