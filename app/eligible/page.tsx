'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface PatientData {
  name: string;
  age: string;
  householdSize: string;
  monthlyIncome: string;
}

export default function EligiblePage() {
  const router = useRouter();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get patient data from sessionStorage
    const storedData = sessionStorage.getItem('patientData');
    if (storedData) {
      setPatientData(JSON.parse(storedData));
    } else {
      // If no data, redirect back to home
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Combine all data
      const fullData = {
        ...patientData,
        reason,
      };

      // Call the OpenAI API to process the application
      const response = await fetch('/api/process-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process application');
      }

      if (!data.eligible) {
        throw new Error('Eligibility check failed');
      }

      // Store complete data including AI response
      sessionStorage.setItem('applicationData', JSON.stringify({
        ...fullData,
        aiResponse: data.aiResponse,
        timestamp: data.timestamp,
      }));
      
      // Navigate to confirmation page
      router.push('/confirmation');
    } catch (err: any) {
      console.error('Error submitting application:', err);
      setError(err.message || 'Failed to submit application. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  if (!patientData) {
    return null; // or a loading spinner
  }

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
          <div className="space-y-6">
            {/* Success Header */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#0E1238] mb-2">
                Congratulations, {patientData.name}!
              </h1>
              <p className="text-gray-600 text-lg">
                You are eligible for our free healthcare services
              </p>
            </div>

            {/* Patient Summary */}
            <div className="bg-blue-50 border-l-4 border-[#0E1238] p-4 mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Your Information:
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Age:</span> {patientData.age} years
                </div>
                <div>
                  <span className="font-medium">Household Size:</span> {patientData.householdSize}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Monthly Income:</span> ${parseFloat(patientData.monthlyIncome).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-red-800">Error</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Form for Additional Information */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="reason" className="block text-sm font-semibold text-[#0E1238] mb-2">
                  Please tell us why you are seeking healthcare assistance *
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Describe your healthcare needs, symptoms, or medical concerns. This information helps us prepare for your visit and ensure we can provide the best care possible.
                </p>
                <textarea
                  id="reason"
                  name="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors resize-none"
                  placeholder="Example: I have been experiencing chest pain and shortness of breath for the past week. I don't have health insurance and cannot afford to see a doctor..."
                />
                <p className="text-xs text-gray-500 mt-2">
                  Minimum 20 characters required
                </p>
              </div>

              {/* Information Box */}
              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  What happens after you submit?
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Your application will be reviewed within 2-3 business days</li>
                  <li>We will contact you via phone or email to confirm your appointment</li>
                  <li>Please bring a valid ID and proof of income to your first visit</li>
                  <li>All services are provided free of charge to eligible patients</li>
                </ul>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-4 px-6 rounded-lg transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#D4AF37] hover:bg-[#c49b2e] text-white font-bold py-4 px-6 rounded-lg transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Submit Application →'
                  )}
                </button>
              </div>
            </form>
          </div>
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

