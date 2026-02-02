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

interface FamilyMember {
  name: string;
  dob: string;
  employer: string;
  earnedIncome: string;
  unearnedIncome: string;
}

interface FormData {
  // Basic Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: string;
  sex: 'Male' | 'Female' | '';
  
  // Contact Information
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Demographics
  ethnicity: string;
  race: string;
  language: string;
  
  // Household & Financial
  householdSize: string;
  monthlyIncome: string;
  
  // Self Employment/Income
  selfEmployer: string;
  selfEarnedIncome: string;
  selfUnearnedIncome: string;
  
  // Spouse/Partner
  hasSpouse: boolean;
  spouseName: string;
  spouseDob: string;
  spouseEmployer: string;
  spouseEarnedIncome: string;
  spouseUnearnedIncome: string;
  
  // Children (up to 4)
  children: FamilyMember[];
}

export default function EligibilityChecker() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    age: '',
    sex: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    ethnicity: '',
    race: '',
    language: '',
    householdSize: '',
    monthlyIncome: '',
    selfEmployer: '',
    selfEarnedIncome: '',
    selfUnearnedIncome: '',
    hasSpouse: false,
    spouseName: '',
    spouseDob: '',
    spouseEmployer: '',
    spouseEarnedIncome: '',
    spouseUnearnedIncome: '',
    children: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }
    
    // Auto-calculate age from date of birth
    if (name === 'dateOfBirth' && value) {
      const birthDate = new Date(value);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        age: calculatedAge.toString()
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addChild = () => {
    if (formData.children.length < 4) {
      setFormData(prev => ({
        ...prev,
        children: [...prev.children, { name: '', dob: '', employer: '', earnedIncome: '', unearnedIncome: '' }]
      }));
    }
  };

  const removeChild = (index: number) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index)
    }));
  };

  const updateChild = (index: number, field: keyof FamilyMember, value: string) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.map((child, i) => 
        i === index ? { ...child, [field]: value } : child
      )
    }));
  };

  const checkEligibility = () => {
    const age = parseInt(formData.age);
    const householdSize = parseInt(formData.householdSize);
    const monthlyIncome = parseFloat(formData.monthlyIncome);

    // Check age requirement
    if (age < 18) {
      setStep(2); // Go to ineligibility page
      return;
    }

    // Check income requirement
    const threshold = INCOME_THRESHOLDS[householdSize] || INCOME_THRESHOLDS[10];
    if (monthlyIncome >= threshold) {
      setStep(2); // Go to ineligibility page
      return;
    }

    // Patient is eligible - store data and navigate to services page
    
    // Store patient data in sessionStorage for the next page
    sessionStorage.setItem('patientData', JSON.stringify({
      firstName: formData.firstName,
      lastName: formData.lastName,
      fullName: `${formData.firstName} ${formData.lastName}`,
      dateOfBirth: formData.dateOfBirth,
      age: formData.age,
      sex: formData.sex,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      ethnicity: formData.ethnicity,
      race: formData.race,
      language: formData.language,
      householdSize: formData.householdSize,
      monthlyIncome: formData.monthlyIncome,
      selfEmployer: formData.selfEmployer,
      selfEarnedIncome: formData.selfEarnedIncome,
      selfUnearnedIncome: formData.selfUnearnedIncome,
      hasSpouse: formData.hasSpouse,
      spouseName: formData.spouseName,
      spouseDob: formData.spouseDob,
      spouseEmployer: formData.spouseEmployer,
      spouseEarnedIncome: formData.spouseEarnedIncome,
      spouseUnearnedIncome: formData.spouseUnearnedIncome,
      children: formData.children,
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
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      age: '',
      sex: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      ethnicity: '',
      race: '',
      language: '',
      householdSize: '',
      monthlyIncome: '',
      selfEmployer: '',
      selfEarnedIncome: '',
      selfUnearnedIncome: '',
      hasSpouse: false,
      spouseName: '',
      spouseDob: '',
      spouseEmployer: '',
      spouseEarnedIncome: '',
      spouseUnearnedIncome: '',
      children: [],
    });
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
                {/* Personal Information Section */}
                <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                  <h3 className="text-lg font-bold text-[#0E1238] mb-4">Personal Information</h3>
                  
                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-semibold text-[#0E1238] mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-semibold text-[#0E1238] mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  {/* Date of Birth & Sex */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-[#0E1238] mb-2">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        required
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                      />
                      {formData.age && (
                        <p className="text-xs text-gray-500 mt-1">Age: {formData.age} years</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="sex" className="block text-sm font-semibold text-[#0E1238] mb-2">
                        Sex *
                      </label>
                      <select
                        id="sex"
                        name="sex"
                        value={formData.sex}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                      >
                        <option value="">Select...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                  <h3 className="text-lg font-bold text-[#0E1238] mb-4">Contact Information</h3>
                  
                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-[#0E1238] mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                      placeholder="(123) 456-7890"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-[#0E1238] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                      placeholder="john.doe@example.com"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-semibold text-[#0E1238] mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                      placeholder="123 Main Street"
                    />
                  </div>

                  {/* City, State, ZIP */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label htmlFor="city" className="block text-sm font-semibold text-[#0E1238] mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                        placeholder="Jacksonville"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-semibold text-[#0E1238] mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        maxLength={2}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors uppercase"
                        placeholder="FL"
                        style={{ textTransform: 'uppercase' }}
                      />
                    </div>
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-semibold text-[#0E1238] mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        maxLength={10}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                        placeholder="32246"
                      />
                    </div>
                  </div>
                </div>

                {/* Demographics Section */}
                <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                  <h3 className="text-lg font-bold text-[#0E1238] mb-4">Demographics</h3>
                  
                  {/* Ethnicity & Race */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ethnicity" className="block text-sm font-semibold text-[#0E1238] mb-2">
                        Ethnicity
                      </label>
                      <input
                        type="text"
                        id="ethnicity"
                        name="ethnicity"
                        value={formData.ethnicity}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                        placeholder="e.g., Hispanic or Latino"
                      />
                    </div>
                    <div>
                      <label htmlFor="race" className="block text-sm font-semibold text-[#0E1238] mb-2">
                        Race
                      </label>
                      <input
                        type="text"
                        id="race"
                        name="race"
                        value={formData.race}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                        placeholder="e.g., Asian, White, Black"
                      />
                    </div>
                  </div>

                  {/* Language */}
                  <div>
                    <label htmlFor="language" className="block text-sm font-semibold text-[#0E1238] mb-2">
                      Preferred Language
                    </label>
                    <input
                      type="text"
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                      placeholder="e.g., English, Spanish, Arabic"
                    />
                  </div>
                </div>

                {/* Financial Information Section */}
                <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                  <h3 className="text-lg font-bold text-[#0E1238] mb-4">Financial Information</h3>
                  
                  {/* Household Size & Monthly Income */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        placeholder="Number of people"
                      />
                    </div>
                    <div>
                      <label htmlFor="monthlyIncome" className="block text-sm font-semibold text-[#0E1238] mb-2">
                        Total Monthly Income *
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
                  </div>

                  {/* Self Employment/Income */}
                  <div className="border-t pt-4">
                    <h4 className="text-md font-semibold text-[#0E1238] mb-3">Your Employment & Income</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="selfEmployer" className="block text-sm font-semibold text-[#0E1238] mb-2">
                          Employer
                        </label>
                        <input
                          type="text"
                          id="selfEmployer"
                          name="selfEmployer"
                          value={formData.selfEmployer}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                          placeholder="Company name"
                        />
                      </div>
                      <div>
                        <label htmlFor="selfEarnedIncome" className="block text-sm font-semibold text-[#0E1238] mb-2">
                          Earned Income (Last 4 weeks)
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-3 text-gray-500">$</span>
                          <input
                            type="number"
                            id="selfEarnedIncome"
                            name="selfEarnedIncome"
                            value={formData.selfEarnedIncome}
                            onChange={handleInputChange}
                            min="0"
                            step="0.01"
                            className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="selfUnearnedIncome" className="block text-sm font-semibold text-[#0E1238] mb-2">
                          Unearned Income (Last 4 weeks)
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-3 text-gray-500">$</span>
                          <input
                            type="number"
                            id="selfUnearnedIncome"
                            name="selfUnearnedIncome"
                            value={formData.selfUnearnedIncome}
                            onChange={handleInputChange}
                            min="0"
                            step="0.01"
                            className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Family Members Section */}
                <div className="bg-blue-50 p-6 rounded-lg space-y-6">
                  <h3 className="text-lg font-bold text-[#0E1238] mb-4">Family Members</h3>
                  <p className="text-sm text-gray-600 mb-4">Please provide information about your spouse/partner and children (if applicable)</p>
                  
                  {/* Spouse/Partner Checkbox */}
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="hasSpouse"
                      name="hasSpouse"
                      checked={formData.hasSpouse}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37]"
                    />
                    <label htmlFor="hasSpouse" className="ml-3 text-sm font-semibold text-[#0E1238]">
                      I have a spouse/partner
                    </label>
                  </div>

                  {/* Spouse/Partner Information */}
                  {formData.hasSpouse && (
                    <div className="border-l-4 border-[#D4AF37] pl-4 space-y-4">
                      <h4 className="text-md font-semibold text-[#0E1238]">Spouse/Partner Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="spouseName" className="block text-sm font-semibold text-[#0E1238] mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="spouseName"
                            name="spouseName"
                            value={formData.spouseName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                            placeholder="First and Last Name"
                          />
                        </div>
                        <div>
                          <label htmlFor="spouseDob" className="block text-sm font-semibold text-[#0E1238] mb-2">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            id="spouseDob"
                            name="spouseDob"
                            value={formData.spouseDob}
                            onChange={handleInputChange}
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="spouseEmployer" className="block text-sm font-semibold text-[#0E1238] mb-2">
                            Employer
                          </label>
                          <input
                            type="text"
                            id="spouseEmployer"
                            name="spouseEmployer"
                            value={formData.spouseEmployer}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                            placeholder="Company name"
                          />
                        </div>
                        <div>
                          <label htmlFor="spouseEarnedIncome" className="block text-sm font-semibold text-[#0E1238] mb-2">
                            Earned Income (Last 4 weeks)
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-gray-500">$</span>
                            <input
                              type="number"
                              id="spouseEarnedIncome"
                              name="spouseEarnedIncome"
                              value={formData.spouseEarnedIncome}
                              onChange={handleInputChange}
                              min="0"
                              step="0.01"
                              className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="spouseUnearnedIncome" className="block text-sm font-semibold text-[#0E1238] mb-2">
                            Unearned Income (Last 4 weeks)
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-gray-500">$</span>
                            <input
                              type="number"
                              id="spouseUnearnedIncome"
                              name="spouseUnearnedIncome"
                              value={formData.spouseUnearnedIncome}
                              onChange={handleInputChange}
                              min="0"
                              step="0.01"
                              className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Children Section */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-md font-semibold text-[#0E1238]">Children</h4>
                      {formData.children.length < 4 && (
                        <button
                          type="button"
                          onClick={addChild}
                          className="bg-[#D4AF37] hover:bg-[#c49b2e] text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                          + Add Child
                        </button>
                      )}
                    </div>

                    {formData.children.length === 0 && (
                      <p className="text-sm text-gray-500 italic">No children added. Click "Add Child" to add children information.</p>
                    )}

                    {formData.children.map((child, index) => (
                      <div key={index} className="border-l-4 border-green-500 pl-4 mb-4 pb-4 border-b last:border-b-0">
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="text-sm font-semibold text-[#0E1238]">Child {index + 1}</h5>
                          <button
                            type="button"
                            onClick={() => removeChild(index)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <label className="block text-sm font-semibold text-[#0E1238] mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={child.name}
                              onChange={(e) => updateChild(index, 'name', e.target.value)}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                              placeholder="First and Last Name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#0E1238] mb-2">
                              Date of Birth
                            </label>
                            <input
                              type="date"
                              value={child.dob}
                              onChange={(e) => updateChild(index, 'dob', e.target.value)}
                              max={new Date().toISOString().split('T')[0]}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-[#0E1238] mb-2">
                              Employer (if applicable)
                            </label>
                            <input
                              type="text"
                              value={child.employer}
                              onChange={(e) => updateChild(index, 'employer', e.target.value)}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                              placeholder="Company name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#0E1238] mb-2">
                              Earned Income (Last 4 weeks)
                            </label>
                            <div className="relative">
                              <span className="absolute left-4 top-3 text-gray-500">$</span>
                              <input
                                type="number"
                                value={child.earnedIncome}
                                onChange={(e) => updateChild(index, 'earnedIncome', e.target.value)}
                                min="0"
                                step="0.01"
                                className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                                placeholder="0.00"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#0E1238] mb-2">
                              Unearned Income (Last 4 weeks)
                            </label>
                            <div className="relative">
                              <span className="absolute left-4 top-3 text-gray-500">$</span>
                              <input
                                type="number"
                                value={child.unearnedIncome}
                                onChange={(e) => updateChild(index, 'unearnedIncome', e.target.value)}
                                min="0"
                                step="0.01"
                                className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none text-gray-900 transition-colors"
                                placeholder="0.00"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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

