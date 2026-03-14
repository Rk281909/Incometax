/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LoanEligibility from './pages/LoanEligibility';
import EmiCalculator from './pages/EmiCalculator';
import Microfinance from './pages/Microfinance';
import Investments from './pages/Investments';
import TaxCalculator from './pages/TaxCalculator';
import Utilities from './pages/Utilities';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="eligibility" element={<LoanEligibility />} />
          <Route path="emi" element={<EmiCalculator />} />
          <Route path="microfinance" element={<Microfinance />} />
          <Route path="investments" element={<Investments />} />
          <Route path="tax" element={<TaxCalculator />} />
          <Route path="utilities" element={<Utilities />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
