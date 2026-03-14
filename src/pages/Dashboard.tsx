import { Link } from 'react-router-dom';
import { Calculator, Briefcase, TrendingUp, Users, PieChart, Wallet } from 'lucide-react';

const tools = [
  { name: 'Loan Eligibility', path: '/eligibility', icon: Briefcase, color: 'bg-blue-500', desc: 'Check FOIR & Max Loan' },
  { name: 'EMI Calculator', path: '/emi', icon: Calculator, color: 'bg-emerald-500', desc: 'Home, Auto, Personal' },
  { name: 'Microfinance', path: '/microfinance', icon: Users, color: 'bg-purple-500', desc: 'Group Loans & Collections' },
  { name: 'Investments', path: '/investments', icon: TrendingUp, color: 'bg-orange-500', desc: 'SIP, FD, RD' },
  { name: 'Tax Calculator', path: '/tax', icon: PieChart, color: 'bg-rose-500', desc: 'Nepal Income Tax' },
  { name: 'Utilities', path: '/utilities', icon: Wallet, color: 'bg-teal-500', desc: 'VAT, Age, Converter' },
];

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome to RAKESH FINANCIAL CALCULATOR</h1>
        <p className="mt-1 text-sm text-slate-500">
          Professional financial tools for Nepalese banks, cooperatives, and individuals.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.name}
              to={tool.path}
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-emerald-500 rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100"
            >
              <div>
                <span
                  className={`inline-flex rounded-lg p-3 ring-4 ring-white ${tool.color} text-white`}
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-slate-900">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {tool.name}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  {tool.desc}
                </p>
              </div>
              <span
                className="pointer-events-none absolute right-6 top-6 text-slate-300 group-hover:text-slate-400"
                aria-hidden="true"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
              </span>
            </Link>
          );
        })}
      </div>

      <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
        <h2 className="text-lg font-semibold text-emerald-800 mb-2">Nepal Rastra Bank Guidelines</h2>
        <p className="text-emerald-700 text-sm">
          Calculations are based on standard banking practices in Nepal. FOIR is typically capped at 50% for personal loans. Interest rates are calculated on a reducing balance method unless specified otherwise.
        </p>
      </div>
    </div>
  );
}
