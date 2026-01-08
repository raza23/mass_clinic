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

export default function ServicesPage() {
  const router = useRouter();
  const [patientData, setPatientData] = useState<PatientData | null>(null);

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

  const handleServiceSelection = (service: string) => {
    // Store the selected service
    sessionStorage.setItem('selectedService', service);

    if (service === 'doctor') {
      // Go to symptoms page for doctor appointments
      router.push('/symptoms');
    } else {
      // Go directly to appointment booking for other services
      router.push('/appointment');
    }
  };

  if (!patientData) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl">
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
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#0E1238] mb-3">
              Welcome, {patientData.name}!
            </h1>
            <p className="text-gray-600 text-lg">
              What do you need assistance with?
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Make an Appointment with a Doctor */}
            <button
              onClick={() => handleServiceSelection('doctor')}
              className="bg-gray-200 hover:bg-gray-300 text-[#0E1238] font-bold py-12 px-8 rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-xl"
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                <svg className="w-16 h-16 text-[#0E1238]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-xl text-center">
                  Make an appointment with a doctor
                </span>
              </div>
            </button>

            {/* Food Pantry */}
            <button
              onClick={() => handleServiceSelection('food')}
              className="bg-gray-200 hover:bg-gray-300 text-[#0E1238] font-bold py-12 px-8 rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-xl"
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                <svg className="w-16 h-16 text-[#0E1238]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-xl text-center">
                  Food Pantry
                </span>
              </div>
            </button>

            {/* Prescription Help */}
            <button
              onClick={() => handleServiceSelection('prescription')}
              className="bg-gray-200 hover:bg-gray-300 text-[#0E1238] font-bold py-12 px-8 rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-xl"
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                <svg className="w-16 h-16 text-[#0E1238]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span className="text-xl text-center">
                  Prescription Help
                </span>
              </div>
            </button>

            {/* Pain Help */}
            <button
              onClick={() => handleServiceSelection('pain')}
              className="bg-gray-200 hover:bg-gray-300 text-[#0E1238] font-bold py-12 px-8 rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-xl"
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                <svg className="w-16 h-16 text-[#0E1238]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-xl text-center">
                  Pain Help
                </span>
              </div>
            </button>
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-[#0E1238] hover:text-[#1a2050] font-medium underline"
            >
              ← Back to Home
            </button>
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

