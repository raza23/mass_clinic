'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ApplicationData {
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
  service?: string;
  serviceName?: string;
  symptoms?: string[];
  otherSymptom?: string | null;
  reason: string;
  aiResponse?: string;
  timestamp?: string;
}

export default function ConfirmationPage() {
  const router = useRouter();
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Get complete application data from sessionStorage
    const storedData = sessionStorage.getItem('applicationData');
    if (storedData) {
      setApplicationData(JSON.parse(storedData));
      
      // Here you would typically send the data to your backend/API
      console.log('Application submitted:', JSON.parse(storedData));
      
      // Clear the session data after successful submission
      // sessionStorage.removeItem('patientData');
      // sessionStorage.removeItem('applicationData');
    } else {
      // If no data, redirect back to home
      router.push('/');
    }
  }, [router]);

  const handleNewApplication = () => {
    // Clear session storage
    sessionStorage.removeItem('patientData');
    sessionStorage.removeItem('applicationData');
    sessionStorage.removeItem('selectedService');
    sessionStorage.removeItem('symptomsData');
    
    // Navigate back to home
    router.push('/');
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    
    try {
      // Get patient data from session storage
      const patientDataStr = sessionStorage.getItem('patientData');
      const patientData = patientDataStr ? JSON.parse(patientDataStr) : {};
      
      // Combine all data for PDF generation
      const pdfData = {
        ...patientData,
        ...applicationData,
      };
      
      // Call the PDF generation API
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pdfData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }
      
      // Get the PDF blob
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `patient-application-${applicationData.name || 'form'}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!applicationData) {
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
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            {/* Confirmation Message */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#0E1238] mb-3">
                Application Submitted Successfully!
              </h1>
              <p className="text-gray-600 text-lg">
                Thank you, {applicationData.fullName || applicationData.name || `${applicationData.firstName} ${applicationData.lastName}`}
              </p>
            </div>
            
            {/* Confirmation Details */}
            <div className="bg-blue-50 border-l-4 border-[#0E1238] p-6 text-left">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                📋 Application Summary
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{applicationData.fullName || applicationData.name || `${applicationData.firstName} ${applicationData.lastName}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Age:</span>
                  <span>{applicationData.age} years</span>
                </div>
                {applicationData.dateOfBirth && (
                  <div className="flex justify-between">
                    <span className="font-medium">Date of Birth:</span>
                    <span>{new Date(applicationData.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                )}
                {applicationData.phone && (
                  <div className="flex justify-between">
                    <span className="font-medium">Phone:</span>
                    <span>{applicationData.phone}</span>
                  </div>
                )}
                {applicationData.email && (
                  <div className="flex justify-between">
                    <span className="font-medium">Email:</span>
                    <span>{applicationData.email}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-medium">Household Size:</span>
                  <span>{applicationData.householdSize} people</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Monthly Income:</span>
                  <span>${parseFloat(applicationData.monthlyIncome).toLocaleString()}</span>
                </div>
                {applicationData.serviceName && (
                  <div className="flex justify-between">
                    <span className="font-medium">Service Requested:</span>
                    <span>{applicationData.serviceName}</span>
                  </div>
                )}
                {applicationData.symptoms && applicationData.symptoms.length > 0 && (
                  <div className="pt-2 border-t border-gray-300">
                    <span className="font-medium">Symptoms:</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {applicationData.symptoms.map((symptom, index) => (
                        <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-300">
                  <span className="font-medium">Submission Date:</span>
                  <span className="ml-2">{new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              </div>
            </div>

            {/* AI Response from Clinic Admin */}
            {applicationData.aiResponse && (
              <div className="bg-blue-50 border-l-4 border-[#0E1238] p-6 text-left">
                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#0E1238]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Message from Clinic Administrator
                </p>
                <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {applicationData.aiResponse}
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-green-50 border-l-4 border-green-500 p-6 text-left">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                ✅ What Happens Next?
              </p>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">1.</span>
                  <span>Our team will review your application within <strong>2-3 business days</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">2.</span>
                  <span>You will receive a <strong>confirmation call or email</strong> with your appointment details</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">3.</span>
                  <span>Please bring the following to your first appointment:
                    <ul className="list-disc list-inside ml-4 mt-1">
                      <li>Valid government-issued ID</li>
                      <li>Proof of income (pay stubs, tax returns, etc.)</li>
                      <li>List of current medications (if any)</li>
                    </ul>
                  </span>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 p-6 rounded-lg text-left">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                📞 Need Help?
              </p>
              <p className="text-sm text-gray-600">
                If you have any questions or need to update your information, please contact us:
              </p>
              <div className="mt-3 space-y-1 text-sm text-gray-600">
                <p><strong>Phone:</strong> (XXX) XXX-XXXX</p>
                <p><strong>Email:</strong> info@muslimamericanservices.org</p>
                <p><strong>Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 space-y-4">
              {/* Download PDF Button - Only show for doctor appointments */}
              {applicationData.service === 'doctor' && (
                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="w-full bg-[#D4AF37] hover:bg-[#c49b2e] text-white font-bold py-4 px-8 rounded-lg transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isDownloading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      📄 Download Patient Application Form (PDF)
                    </>
                  )}
                </button>
              )}
              
              {/* Submit Another Application */}
              <button
                onClick={handleNewApplication}
                className="w-full bg-[#0E1238] hover:bg-[#1a2050] text-white font-bold py-4 px-8 rounded-lg transition-colors shadow-lg"
              >
                Submit Another Application
              </button>
            </div>

            {/* Print Option */}
            <div className="pt-4">
              <button
                onClick={() => window.print()}
                className="text-[#0E1238] hover:text-[#1a2050] font-medium text-sm underline"
              >
                🖨️ Print this confirmation
              </button>
            </div>
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

