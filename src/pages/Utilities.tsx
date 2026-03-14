import { useState } from 'react';
import { formatNPR, numberToWordsNPR } from '../utils/formatters';
import { differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';

export default function Utilities() {
  const [amount, setAmount] = useState<number>(150000);
  const [vatAmount, setVatAmount] = useState<number>(1000);
  const [vatType, setVatType] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [dob, setDob] = useState<string>('1990-01-01');

  const calculateVat = () => {
    const rate = 0.13; // 13% VAT in Nepal
    if (vatType === 'exclusive') {
      const vat = vatAmount * rate;
      const total = vatAmount + vat;
      return { base: vatAmount, vat, total };
    } else {
      const base = vatAmount / (1 + rate);
      const vat = vatAmount - base;
      return { base, vat, total: vatAmount };
    }
  };

  const vatResult = calculateVat();

  const calculateAge = () => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    
    const years = differenceInYears(today, birthDate);
    const months = differenceInMonths(today, birthDate) % 12;
    const days = differenceInDays(today, new Date(today.getFullYear(), today.getMonth() - (months === 0 ? 0 : 1), birthDate.getDate()));
    
    return { years, months, days };
  };

  const ageResult = calculateAge();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Financial Utilities</h1>
        <p className="mt-1 text-sm text-slate-500">Quick tools for daily financial calculations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Amount to Words */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Amount to Words (NPR)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-3 border"
              />
            </div>
            <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
              <p className="text-sm font-medium text-teal-800 break-words">
                {numberToWordsNPR(amount)}
              </p>
            </div>
          </div>
        </div>

        {/* VAT Calculator */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">VAT Calculator (13%)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Amount</label>
              <input
                type="number"
                value={vatAmount}
                onChange={(e) => setVatAmount(Number(e.target.value))}
                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-3 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Calculation Type</label>
              <div className="mt-2 flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-teal-600"
                    value="exclusive"
                    checked={vatType === 'exclusive'}
                    onChange={() => setVatType('exclusive')}
                  />
                  <span className="ml-2 text-sm text-slate-700">Add VAT (Exclusive)</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-teal-600"
                    value="inclusive"
                    checked={vatType === 'inclusive'}
                    onChange={() => setVatType('inclusive')}
                  />
                  <span className="ml-2 text-sm text-slate-700">Remove VAT (Inclusive)</span>
                </label>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Taxable Amount:</span>
                <span className="font-medium text-slate-900">{formatNPR(vatResult.base)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">VAT (13%):</span>
                <span className="font-medium text-slate-900">{formatNPR(vatResult.vat)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-200">
                <span className="text-slate-700">Total Amount:</span>
                <span className="text-teal-600">{formatNPR(vatResult.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Age Calculator */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 md:col-span-2">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Age Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-3 border"
              />
            </div>
            <div className="flex items-center justify-center bg-teal-600 rounded-xl p-4 text-white">
              {ageResult ? (
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {ageResult.years} <span className="text-lg font-normal text-teal-200">Years</span>
                  </div>
                  <div className="text-sm text-teal-100 mt-1">
                    {ageResult.months} Months, {ageResult.days} Days
                  </div>
                </div>
              ) : (
                <span className="text-teal-200">Select Date of Birth</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
