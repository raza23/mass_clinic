'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Income thresholds based on household size (200% FPL)
const INCOME_THRESHOLDS: { [key: number]: number } = {
  1: 2430,
  2: 3287,
  3: 4143,
  4: 5000,
  5: 5857,
  6: 6713,
  7: 7570,
  8: 8427,
  9: 9283,
  10: 10140,
};

interface FormData {
  name: string;
  age: string;
  householdSize: string;
  monthlyIncome: string;
  reason: string;
}

export default function EligibilityChecker() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    householdSize: '',
    monthlyIncome: '',
    reason: '',
  });
  const [isEligible, setIsEligible] = useState<boolean | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const checkEligibility = () => {
    const age = parseInt(formData.age);
    const householdSize = parseInt(formData.householdSize);
    const monthlyIncome = parseFloat(formData.monthlyIncome);

    // Check age requirement
    if (age < 18) {
      setIsEligible(false);
      setStep(2); // Go to ineligibility page
      return;
    }

    // Check income requirement
    const threshold = INCOME_THRESHOLDS[householdSize] || INCOME_THRESHOLDS[10];
    if (monthlyIncome >= threshold) {
      setIsEligible(false);
      setStep(2); // Go to ineligibility page
      return;
    }

    // Patient is eligible - store data and navigate to services page
    setIsEligible(true);
    
    // Store patient data in sessionStorage for the next page
    sessionStorage.setItem('patientData', JSON.stringify({
      name: formData.name,
      age: formData.age,
      householdSize: formData.householdSize,
      monthlyIncome: formData.monthlyIncome,
    }));
    
    // Navigate to the services selection page
    router.push('/services');
  };

  const handleSubmitInitial = (e: React.FormEvent) => {
    e.preventDefault();
    checkEligibility();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      householdSize: '',
      monthlyIncome: '',
      reason: '',
    });
    setIsEligible(null);
    setStep(1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-4 shadow-lg">
            <Image
              src="/clinic-logo.png"
              alt="Muslim American Social Services"
              width={600}
              height={600}
              className="rounded-full"
              priority
            />
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Step 1: Initial Eligibility Check */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-[#0E1238] mb-3">
                  Healthcare Eligibility Checker
                </h1>
                <p className="text-gray-600 text-lg">
                  Please provide your information to check eligibility for free healthcare services
                </p>
              </div>

              <form onSubmit={handleSubmitInitial} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[#0E1238] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Age */}
                <div>
                  <label htmlFor="age" className="block text-sm font-semibold text-[#0E1238] mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max="120"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                    placeholder="Enter your age"
                  />
                </div>

                {/* Household Size */}
                <div>
                  <label htmlFor="householdSize" className="block text-sm font-semibold text-[#0E1238] mb-2">
                    Household Size *
                  </label>
                  <input
                    type="number"
                    id="householdSize"
                    name="householdSize"
                    value={formData.householdSize}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="20"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                    placeholder="Number of people in household"
                  />
                </div>

                {/* Monthly Income */}
                <div>
                  <label htmlFor="monthlyIncome" className="block text-sm font-semibold text-[#0E1238] mb-2">
                    Monthly Income *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500 text-lg">$</span>
                    <input
                      type="number"
                      id="monthlyIncome"
                      name="monthlyIncome"
                      value={formData.monthlyIncome}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[#D4AF37] hover:bg-[#c49b2e] text-white font-bold py-4 px-6 rounded-lg transition-colors shadow-lg text-lg"
                >
                  Check Eligibility
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Ineligible (only shown if not eligible) */}
          {step === 2 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold text-[#0E1238]">
                Not Eligible
              </h2>
              
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                Unfortunately, based on the information provided, you do not meet the eligibility requirements for our free healthcare services at this time.
              </p>

              <div className="bg-blue-50 border-l-4 border-[#0E1238] p-4 text-left">
                <p className="text-sm text-gray-700">
                  <strong>Eligibility Requirements:</strong>
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                  <li>Must be 18 years or older</li>
                  <li>Monthly income must be below the threshold for your household size</li>
                </ul>
              </div>

              <button
                onClick={resetForm}
                className="bg-[#0E1238] hover:bg-[#1a2050] text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Start Over
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/80 text-sm">
          <p>Muslim American Social Services</p>
          <p className="mt-1">Providing compassionate healthcare to those in need</p>
        </div>
      </div>
    </div>
  );
}

