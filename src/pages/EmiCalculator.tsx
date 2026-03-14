import { useState } from 'react';
import { calculateEMI, nepaliMonths } from '../utils/calculations';
import { formatNPR, formatNumber } from '../utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function EmiCalculator() {
  const [principal, setPrincipal] = useState<number>(1000000);
  const [rate, setRate] = useState<number>(10);
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [startYear, setStartYear] = useState<number>(2081);
  const [startMonth, setStartMonth] = useState<number>(0);

  const result = calculateEMI(principal, rate, tenureYears * 12, startYear, startMonth);

  const data = [
    { name: 'Principal', value: principal },
    { name: 'Interest', value: result.totalInterest },
  ];
  const COLORS = ['#10b981', '#f59e0b'];

  const exportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('EMI Calculation Report', 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Loan Amount: ${formatNPR(principal)}`, 14, 32);
    doc.text(`Interest Rate: ${rate}%`, 14, 38);
    doc.text(`Tenure: ${tenureYears} Years`, 14, 44);
    
    doc.text(`Monthly EMI: ${formatNPR(result.emi)}`, 14, 54);
    doc.text(`Total Interest: ${formatNPR(result.totalInterest)}`, 14, 60);
    doc.text(`Total Payment: ${formatNPR(result.totalPayment)}`, 14, 66);

    const tableData = result.schedule.map(row => [
      row.month,
      row.date,
      formatNumber(row.emi),
      formatNumber(row.principal),
      formatNumber(row.interest),
      formatNumber(row.balance)
    ]);

    autoTable(doc, {
      startY: 76,
      head: [['Month', 'Date (BS)', 'EMI', 'Principal', 'Interest', 'Balance']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129] }
    });

    doc.save('emi_report.pdf');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">EMI Calculator</h1>
        <p className="mt-1 text-sm text-slate-500">Calculate Equated Monthly Installment (EMI) for Home, Auto, or Personal Loans.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <label className="block text-sm font-medium text-slate-700">Loan Amount (NPR)</label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Interest Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Start Year (BS)</label>
              <input
                type="number"
                value={startYear}
                onChange={(e) => setStartYear(Number(e.target.value))}
                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Start Month</label>
              <select
                value={startMonth}
                onChange={(e) => setStartMonth(Number(e.target.value))}
                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border bg-white"
              >
                {nepaliMonths.map((m, i) => (
                  <option key={m} value={i}>{m}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button 
            onClick={exportPDF}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center"
          >
            <FileText className="w-5 h-5 mr-2" />
            Export PDF Report
          </button>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-center space-y-6">
            <div>
              <h3 className="text-emerald-100 font-medium mb-1">Monthly EMI</h3>
              <div className="text-4xl font-bold">{formatNPR(result.emi)}</div>
            </div>
            
            <div className="pt-4 border-t border-emerald-500/50">
              <div className="text-sm text-emerald-100 mb-1">Total Principal</div>
              <div className="text-xl font-semibold">{formatNPR(principal)}</div>
            </div>
            
            <div className="pt-4 border-t border-emerald-500/50">
              <div className="text-sm text-emerald-100 mb-1">Total Interest</div>
              <div className="text-xl font-semibold">{formatNPR(result.totalInterest)}</div>
            </div>

            <div className="pt-4 border-t border-emerald-500/50">
              <div className="text-sm text-emerald-100 mb-1">Total Payment</div>
              <div className="text-xl font-semibold">{formatNPR(result.totalPayment)}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col items-center justify-center h-full min-h-[300px]">
            <h3 className="text-slate-700 font-medium mb-4">Payment Breakdown</h3>
            <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value: number) => formatNPR(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex space-x-4 mt-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                <span className="text-slate-600">Principal</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                <span className="text-slate-600">Interest</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-800">Amortization Schedule</h3>
        </div>
        <div className="overflow-x-auto max-h-[500px]">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 sticky top-0">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Month</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date (BS)</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">EMI</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Principal</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Interest</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Balance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {result.schedule.map((row) => (
                <tr key={row.month} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{row.month}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{row.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-right">{formatNumber(row.emi)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-600 text-right">{formatNumber(row.principal)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-600 text-right">{formatNumber(row.interest)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-right font-medium">{formatNumber(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
