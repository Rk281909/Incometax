import { useState } from 'react';
import { calculateSIP, nepaliMonths } from '../utils/calculations';
import { formatNPR, formatNumber } from '../utils/formatters';
import { TrendingUp, PieChart as PieChartIcon, Download, Eye } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Investments() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [expectedReturnRate, setExpectedReturnRate] = useState<number>(12);
  const [tenureYears, setTenureYears] = useState<number>(10);
  const [startYear, setStartYear] = useState<number>(2081);
  const [startMonth, setStartMonth] = useState<number>(0);
  const [showPlan, setShowPlan] = useState(false);

  const result = calculateSIP(monthlyInvestment, expectedReturnRate, tenureYears, startYear);

  const data = [
    { name: 'Total Investment', value: result.totalInvestment },
    { name: 'Estimated Returns', value: result.estimatedReturns },
  ];
  const COLORS = ['#f97316', '#10b981'];

  const exportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('SIP Investment Plan', 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Monthly Investment: ${formatNPR(monthlyInvestment)}`, 14, 32);
    doc.text(`Expected Return Rate: ${expectedReturnRate}% p.a.`, 14, 38);
    doc.text(`Time Period: ${tenureYears} Years`, 14, 44);
    
    doc.text(`Total Investment: ${formatNPR(result.totalInvestment)}`, 14, 54);
    doc.text(`Estimated Returns: ${formatNPR(result.estimatedReturns)}`, 14, 60);
    doc.text(`Total Value: ${formatNPR(result.maturityAmount)}`, 14, 66);

    const tableData = result.schedule.map(row => [
      row.year,
      formatNumber(row.investment),
      formatNumber(row.returns),
      formatNumber(row.balance)
    ]);

    autoTable(doc, {
      startY: 76,
      head: [['Year', 'Invested Amount', 'Returns', 'Balance']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [249, 115, 22] } // orange-500
    });

    doc.save('sip_investment_plan.pdf');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">SIP & Investment Calculator</h1>
        <p className="mt-1 text-sm text-slate-500">Calculate returns on Systematic Investment Plans (SIP), Fixed Deposits, and Recurring Deposits.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <label className="block text-sm font-medium text-slate-700">Monthly Investment (NPR)</label>
            <input
              type="number"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
              className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-3 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Expected Return Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={expectedReturnRate}
              onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
              className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-3 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Time Period (Years)</label>
            <input
              type="number"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-3 border"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Start Year (BS)</label>
              <input
                type="number"
                value={startYear}
                onChange={(e) => setStartYear(Number(e.target.value))}
                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-3 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Start Month</label>
              <select
                value={startMonth}
                onChange={(e) => setStartMonth(Number(e.target.value))}
                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-3 border bg-white"
              >
                {nepaliMonths.map((m, i) => (
                  <option key={m} value={i}>{m}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button 
            onClick={() => setShowPlan(!showPlan)}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center"
          >
            <Eye className="w-5 h-5 mr-2" />
            {showPlan ? 'Hide Detailed Plan' : 'View Detailed Plan'}
          </button>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-orange-600 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-center space-y-6">
            <div>
              <h3 className="text-orange-100 font-medium mb-1">Total Value</h3>
              <div className="text-4xl font-bold">{formatNPR(result.maturityAmount)}</div>
            </div>
            
            <div className="pt-4 border-t border-orange-500/50">
              <div className="text-sm text-orange-100 mb-1">Total Investment</div>
              <div className="text-xl font-semibold">{formatNPR(result.totalInvestment)}</div>
            </div>
            
            <div className="pt-4 border-t border-orange-500/50">
              <div className="text-sm text-orange-100 mb-1">Estimated Returns</div>
              <div className="text-xl font-semibold">{formatNPR(result.estimatedReturns)}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col items-center justify-center h-full min-h-[300px]">
            <h3 className="text-slate-700 font-medium mb-4">Investment Breakdown</h3>
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
                <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                <span className="text-slate-600">Investment</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                <span className="text-slate-600">Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPlan && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800">Yearly Investment Schedule</h3>
            <button onClick={exportPDF} className="text-orange-600 hover:text-orange-700 flex items-center text-sm font-medium">
              <Download className="w-4 h-4 mr-1" /> Export PDF
            </button>
          </div>
          <div className="overflow-x-auto max-h-[500px]">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Year</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Invested Amount</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Returns</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Balance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {result.schedule.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{row.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-right">{formatNumber(row.investment)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-600 text-right">{formatNumber(row.returns)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-right font-medium">{formatNumber(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
