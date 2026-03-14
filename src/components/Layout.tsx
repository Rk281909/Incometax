import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Calculator, 
  Home, 
  Briefcase, 
  PieChart, 
  Menu, 
  X, 
  Settings, 
  TrendingUp,
  Wallet,
  Users,
  Landmark,
  ArrowLeft
} from 'lucide-react';
import { cn } from '../utils/cn';

const navItems = [
  { name: 'Dashboard', path: '/', icon: Home },
  { name: 'Loan Eligibility', path: '/eligibility', icon: Briefcase },
  { name: 'EMI Calculator', path: '/emi', icon: Calculator },
  { name: 'Microfinance', path: '/microfinance', icon: Users },
  { name: 'Investments', path: '/investments', icon: TrendingUp },
  { name: 'Tax & Finance', path: '/tax', icon: PieChart },
  { name: 'Utilities', path: '/utilities', icon: Wallet },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
          <div className="flex items-center">
            <Landmark className="text-emerald-600 mr-2" size={24} />
            <span className="text-lg font-bold text-emerald-600 tracking-tight">RAKESH FINCALC</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500">
            <X size={24} />
          </button>
        </div>
        
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors",
                  isActive 
                    ? "bg-emerald-50 text-emerald-700" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-emerald-600" : "text-slate-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
          <div className="flex items-center">
            {location.pathname !== '/' && (
              <button 
                onClick={() => navigate(-1)} 
                className="mr-4 p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                title="Go Back"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="lg:hidden text-slate-500 hover:text-slate-700 focus:outline-none"
            >
              <Menu size={24} />
            </button>
          </div>
          
          <div className="flex-1 flex justify-end">
            <div className="flex items-center space-x-4">
              <button className="text-slate-400 hover:text-slate-500">
                <Settings size={20} />
              </button>
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                RC
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
