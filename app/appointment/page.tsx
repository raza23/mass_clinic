'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface PatientData {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  name?: string;
  age: string;
  dateOfBirth?: string;
  sex?: string;
  phone?: string;
  email?: string;
  address?: string;
  ethnicity?: string;
  race?: string;
  language?: string;
  householdSize: string;
  monthlyIncome: string;
}

interface SymptomsData {
  symptoms: string[];
  otherSymptom: string | null;
}

export default function AppointmentPage() {
  const router = useRouter();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [selectedService, setSelectedService] = useState<string>('');
  const [symptomsData, setSymptomsData] = useState<SymptomsData | null>(null);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get all stored data
    const storedPatientData = sessionStorage.getItem('patientData');
    const storedService = sessionStorage.getItem('selectedService');
    const storedSymptoms = sessionStorage.getItem('symptomsData');

    if (!storedPatientData || !storedService) {
      router.push('/');
      return;
    }

    setPatientData(JSON.parse(storedPatientData));
    setSelectedService(storedService);

    if (storedSymptoms) {
      setSymptomsData(JSON.parse(storedSymptoms));
    }
  }, [router]);

  const getServiceName = (service: string) => {
    const serviceNames: { [key: string]: string } = {
      doctor: 'Doctor Appointment',
      food: 'Food Pantry',
      prescription: 'Prescription Help',
      pain: 'Pain Help',
    };
    return serviceNames[service] || service;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare the complete data
      const appointmentData = {
        ...patientData,
        service: selectedService,
        serviceName: getServiceName(selectedService),
        symptoms: symptomsData?.symptoms || [],
        otherSymptom: symptomsData?.otherSymptom || null,
        reason,
      };

      // Call the OpenAI API to process the appointment
      const response = await fetch('/api/process-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...patientData,
          reason: `Service Requested: ${getServiceName(selectedService)}\n\n${
            symptomsData?.symptoms.length
              ? `Symptoms: ${symptomsData.symptoms.join(', ')}\n${
                  symptomsData.otherSymptom ? `Other: ${symptomsData.otherSymptom}\n` : ''
                }\n`
              : ''
          }Additional Information:\n${reason}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process appointment');
      }

      // Store complete data including AI response
      sessionStorage.setItem('applicationData', JSON.stringify({
        ...appointmentData,
        aiResponse: data.aiResponse,
        timestamp: data.timestamp,
      }));

      // Navigate to confirmation page
      router.push('/confirmation');
    } catch (err: any) {
      console.error('Error submitting appointment:', err);
      setError(err.message || 'Failed to submit appointment. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!patientData) {
    return null;
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
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-[#0E1238] mb-2">
                Book Your Appointment
              </h1>
              <p className="text-gray-600">
                {getServiceName(selectedService)}
              </p>
            </div>

            {/* Patient Summary */}
            <div className="bg-blue-50 border-l-4 border-[#0E1238] p-4 mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Your Information:
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Name:</span> {patientData.fullName || patientData.name || `${patientData.firstName} ${patientData.lastName}`}
                </div>
                <div>
                  <span className="font-medium">Age:</span> {patientData.age} years
                </div>
                <div>
                  <span className="font-medium">Service:</span> {getServiceName(selectedService)}
                </div>
                {symptomsData && symptomsData.symptoms.length > 0 && (
                  <div className="col-span-2">
                    <span className="font-medium">Symptoms:</span> {symptomsData.symptoms.join(', ')}
                  </div>
                )}
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="reason" className="block text-sm font-semibold text-[#0E1238] mb-2">
                  Additional Information *
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Please provide any additional details about your situation or specific needs for this appointment.
                </p>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors resize-none"
                  placeholder={
                    selectedService === 'doctor'
                      ? "Example: I've been experiencing these symptoms for about 2 weeks. They are worse in the morning..."
                      : selectedService === 'food'
                      ? "Example: I need assistance with groceries for my family of 4..."
                      : selectedService === 'prescription'
                      ? "Example: I need help refilling my blood pressure medication..."
                      : "Example: I need assistance with managing chronic pain..."
                  }
                />
              </div>

              {/* Information Box */}
              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  What happens after you submit?
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Your appointment request will be reviewed within 2-3 business days</li>
                  <li>We will contact you via phone or email to confirm your appointment</li>
                  <li>Please bring a valid ID and proof of income to your visit</li>
                  <li>All services are provided free of charge to eligible patients</li>
                </ul>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedService === 'doctor' && symptomsData) {
                      router.push('/symptoms');
                    } else {
                      router.push('/services');
                    }
                  }}
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
                    'Submit Appointment Request →'
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

