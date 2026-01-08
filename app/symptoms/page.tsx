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

// Common symptoms list
const SYMPTOMS = [
  { id: 'fever', label: 'Fever', icon: '🌡️' },
  { id: 'cough', label: 'Cough', icon: '🤧' },
  { id: 'headache', label: 'Headache', icon: '🤕' },
  { id: 'back_pain', label: 'Back Pain', icon: '🔙' },
  { id: 'chest_pain', label: 'Chest Pain', icon: '💔' },
  { id: 'stomach_pain', label: 'Stomach Pain', icon: '🤢' },
  { id: 'fatigue', label: 'Fatigue', icon: '😴' },
  { id: 'shortness_breath', label: 'Shortness of Breath', icon: '😮‍💨' },
  { id: 'dizziness', label: 'Dizziness', icon: '😵' },
  { id: 'nausea', label: 'Nausea', icon: '🤮' },
  { id: 'joint_pain', label: 'Joint Pain', icon: '🦴' },
  { id: 'skin_issues', label: 'Skin Issues', icon: '🩹' },
  { id: 'anxiety', label: 'Anxiety/Depression', icon: '😰' },
  { id: 'vision', label: 'Vision Problems', icon: '👁️' },
  { id: 'hearing', label: 'Hearing Problems', icon: '👂' },
  { id: 'other', label: 'Other', icon: '❓' },
];

export default function SymptomsPage() {
  const router = useRouter();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [otherSymptom, setOtherSymptom] = useState('');

  useEffect(() => {
    // Get patient data from sessionStorage
    const storedData = sessionStorage.getItem('patientData');
    const selectedService = sessionStorage.getItem('selectedService');
    
    if (!storedData || selectedService !== 'doctor') {
      // If no data or wrong service, redirect
      router.push('/');
      return;
    }
    
    setPatientData(JSON.parse(storedData));
  }, [router]);

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptomId)) {
        return prev.filter(id => id !== symptomId);
      } else {
        return [...prev, symptomId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedSymptoms.length === 0) {
      alert('Please select at least one symptom');
      return;
    }

    // Store selected symptoms
    const symptomsData = {
      symptoms: selectedSymptoms.map(id => {
        const symptom = SYMPTOMS.find(s => s.id === id);
        return symptom?.label || id;
      }),
      otherSymptom: selectedSymptoms.includes('other') ? otherSymptom : null,
    };

    sessionStorage.setItem('symptomsData', JSON.stringify(symptomsData));

    // Navigate to appointment booking
    router.push('/appointment');
  };

  if (!patientData) {
    return null;
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
            <h1 className="text-3xl md:text-4xl font-bold text-[#0E1238] mb-3">
              What symptoms are you experiencing?
            </h1>
            <p className="text-gray-600 text-lg">
              Select all that apply
            </p>
          </div>

          {/* Symptoms Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {SYMPTOMS.map((symptom) => (
              <button
                key={symptom.id}
                onClick={() => toggleSymptom(symptom.id)}
                className={`p-6 rounded-lg border-2 transition-all transform hover:scale-105 ${
                  selectedSymptoms.includes(symptom.id)
                    ? 'border-[#D4AF37] bg-[#D4AF37] text-white shadow-lg'
                    : 'border-gray-300 bg-white text-[#0E1238] hover:border-[#D4AF37]'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-3xl">{symptom.icon}</span>
                  <span className="text-sm font-semibold text-center">
                    {symptom.label}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Other Symptom Input */}
          {selectedSymptoms.includes('other') && (
            <div className="mb-8">
              <label htmlFor="otherSymptom" className="block text-sm font-semibold text-[#0E1238] mb-2">
                Please describe your symptom:
              </label>
              <textarea
                id="otherSymptom"
                value={otherSymptom}
                onChange={(e) => setOtherSymptom(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors resize-none"
                placeholder="Describe your symptoms..."
              />
            </div>
          )}

          {/* Selected Count */}
          {selectedSymptoms.length > 0 && (
            <div className="bg-blue-50 border-l-4 border-[#0E1238] p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>{selectedSymptoms.length}</strong> symptom{selectedSymptoms.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push('/services')}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-4 px-6 rounded-lg transition-colors"
            >
              ← Back to Services
            </button>
            <button
              onClick={handleContinue}
              disabled={selectedSymptoms.length === 0}
              className="flex-1 bg-[#D4AF37] hover:bg-[#c49b2e] text-white font-bold py-4 px-6 rounded-lg transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Continue to Appointment →
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

