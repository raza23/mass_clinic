# System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Home Page   │  │ Eligible Page│  │ Confirmation │        │
│  │      /       │→ │   /eligible  │→ │ /confirmation│        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│         ↓                  ↓                                    │
│    [Form Data]    [Medical Reason]                            │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                    [HTTP POST Request]
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS SERVER                             │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  API Route: /api/process-application                     │ │
│  │                                                           │ │
│  │  1. Validate patient data                                │ │
│  │  2. Check eligibility (age ≥ 18, income < threshold)    │ │
│  │  3. Construct system prompt with patient data            │ │
│  │  4. Call OpenAI API                                      │ │
│  │  5. Return AI response                                   │ │
│  └──────────────────────────────────────────────────────────┘ │
│                            ↓                                    │
│                   [OpenAI API Call]                            │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                      OPENAI API                                 │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Model: GPT-4o-mini                                      │ │
│  │                                                           │ │
│  │  System Prompt:                                          │ │
│  │  "Play the role of an admin of a free healthcare        │ │
│  │   clinic..."                                             │ │
│  │                                                           │ │
│  │  + Patient Data:                                         │ │
│  │    - Name, Age, Household Size                           │ │
│  │    - Monthly Income, Income Threshold                    │ │
│  │    - Medical Reason                                      │ │
│  │                                                           │ │
│  │  → Generates personalized response                       │ │
│  └──────────────────────────────────────────────────────────┘ │
│                            ↓                                    │
│                   [AI Response]                                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                    [Return to Browser]
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CONFIRMATION PAGE                            │
│                                                                 │
│  ✅ Application Summary                                        │
│  💬 AI Response from Clinic Administrator                      │
│  📋 Next Steps                                                 │
│  📞 Contact Information                                        │
│  🖨️ Print Option                                              │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### 1. Initial Form Submission (Home Page)

```
User Input:
  ├─ name: "John Doe"
  ├─ age: 35
  ├─ householdSize: 4
  └─ monthlyIncome: 3500

↓ [Client-side validation]

Eligibility Check:
  ├─ Age check: 35 ≥ 18 ✅
  ├─ Income threshold for household of 4: $5,000
  └─ Income check: $3,500 < $5,000 ✅

↓ [Store in sessionStorage]

sessionStorage.setItem('patientData', {
  name: "John Doe",
  age: "35",
  householdSize: "4",
  monthlyIncome: "3500"
})

↓ [Navigate to /eligible]
```

### 2. Medical Reason Submission (Eligible Page)

```
User Input:
  └─ reason: "I have been experiencing persistent back pain..."

↓ [Combine with stored data]

Complete Data:
  ├─ name: "John Doe"
  ├─ age: 35
  ├─ householdSize: 4
  ├─ monthlyIncome: 3500
  └─ reason: "I have been experiencing persistent back pain..."

↓ [POST to /api/process-application]
```

### 3. API Processing

```
API Route receives:
{
  name: "John Doe",
  age: "35",
  householdSize: "4",
  monthlyIncome: "3500",
  reason: "I have been experiencing persistent back pain..."
}

↓ [Validate fields]

↓ [Double-check eligibility]

↓ [Construct prompts]

System Prompt:
  "Play the role of an admin of a free healthcare clinic.
   
   Patient Information:
   - Name: John Doe
   - Age: 35 years old
   - Household Size: 4 people
   - Monthly Income: $3,500
   - Income Threshold: $5,000
   - Eligibility Status: ELIGIBLE
   
   [Instructions for AI...]"

User Message:
  "My name is John Doe. I am 35 years old with 4 people 
   in my household. My monthly income is $3,500.
   
   Here is my medical concern:
   I have been experiencing persistent back pain..."

↓ [Call OpenAI API]

OpenAI Request:
{
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: [System Prompt] },
    { role: "user", content: [User Message] }
  ],
  temperature: 0.7,
  max_tokens: 1000
}

↓ [OpenAI processes]

OpenAI Response:
  "Thank you for your application, John. I'm glad to confirm 
   that you are eligible for our free healthcare services.
   
   Based on your description of persistent back pain, I'd like 
   to schedule you for an evaluation with one of our physicians.
   
   [Detailed response with next steps...]"

↓ [Return to client]

API Response:
{
  eligible: true,
  aiResponse: "[OpenAI response]",
  patientData: { ... },
  timestamp: "2025-01-07T12:00:00.000Z"
}
```

### 4. Confirmation Display

```
Frontend receives API response

↓ [Store in sessionStorage]

sessionStorage.setItem('applicationData', {
  name: "John Doe",
  age: "35",
  householdSize: "4",
  monthlyIncome: "3500",
  reason: "I have been experiencing persistent back pain...",
  aiResponse: "[OpenAI response]",
  timestamp: "2025-01-07T12:00:00.000Z"
})

↓ [Navigate to /confirmation]

↓ [Display on confirmation page]

Confirmation Page Shows:
  ├─ Application Summary (all patient data)
  ├─ AI Response (in special blue box)
  ├─ Next Steps
  ├─ Contact Information
  └─ Print/Submit Another options
```

## 🗂️ File Structure & Responsibilities

```
mass_clinic/
│
├── app/
│   │
│   ├── page.tsx                          # Home Page
│   │   └─ Renders: EligibilityChecker component
│   │
│   ├── components/
│   │   └── EligibilityChecker.tsx        # Main Form Component
│   │       ├─ Collects: name, age, household, income
│   │       ├─ Validates: eligibility criteria
│   │       ├─ Shows: ineligible message (if not eligible)
│   │       └─ Navigates: to /eligible (if eligible)
│   │
│   ├── eligible/
│   │   └── page.tsx                      # Eligible Patient Page
│   │       ├─ Retrieves: patient data from sessionStorage
│   │       ├─ Collects: medical reason
│   │       ├─ Calls: /api/process-application
│   │       ├─ Shows: loading state during API call
│   │       ├─ Handles: errors with retry option
│   │       └─ Navigates: to /confirmation on success
│   │
│   ├── confirmation/
│   │   └── page.tsx                      # Confirmation Page
│   │       ├─ Retrieves: application data from sessionStorage
│   │       ├─ Displays: patient information summary
│   │       ├─ Displays: AI response in special section
│   │       ├─ Shows: next steps and contact info
│   │       └─ Provides: print and restart options
│   │
│   ├── api/
│   │   └── process-application/
│   │       └── route.ts                  # API Route
│   │           ├─ Validates: request data
│   │           ├─ Checks: eligibility criteria
│   │           ├─ Constructs: system prompt with patient data
│   │           ├─ Calls: OpenAI API
│   │           ├─ Handles: API errors
│   │           └─ Returns: AI response to client
│   │
│   ├── globals.css                       # Global Styles
│   │   ├─ Background: #0E1238 (dark blue)
│   │   ├─ Accent: #D4AF37 (gold)
│   │   └─ Custom scrollbar styling
│   │
│   └── layout.tsx                        # Root Layout
│       └─ Wraps all pages with consistent structure
│
├── public/
│   └── clinic-logo.png                   # Clinic Logo
│
├── .env.local                            # Environment Variables
│   └── OPENAI_API_KEY=sk-...
│
└── Documentation files...
```

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                         │
│                                                             │
│  ❌ NO API Key Access                                      │
│  ❌ NO Direct OpenAI Calls                                 │
│  ✅ Only calls internal API routes                         │
│  ✅ Data stored in sessionStorage (temporary)              │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    [HTTPS Request]
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    SERVER (Next.js)                         │
│                                                             │
│  ✅ API Key stored in environment variables                │
│  ✅ API routes validate all input                          │
│  ✅ Error messages don't expose sensitive data             │
│  ✅ Rate limiting (future enhancement)                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    [Secure API Call]
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    OPENAI API                               │
│                                                             │
│  ✅ Authenticated with API key                             │
│  ✅ HTTPS encrypted                                        │
│  ✅ Rate limited by OpenAI                                 │
└─────────────────────────────────────────────────────────────┘
```

## 📊 State Management

### Client-Side State (React)

```typescript
// EligibilityChecker.tsx
const [step, setStep] = useState(1);           // Current step
const [formData, setFormData] = useState({     // Form inputs
  name: '',
  age: '',
  householdSize: '',
  monthlyIncome: '',
  reason: ''
});
const [isEligible, setIsEligible] = useState(null);  // Eligibility status

// eligible/page.tsx
const [patientData, setPatientData] = useState(null);  // From sessionStorage
const [reason, setReason] = useState('');              // Medical reason
const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
const [error, setError] = useState(null);              // Error message

// confirmation/page.tsx
const [applicationData, setApplicationData] = useState(null); // Complete data
```

### Session Storage (Cross-Page)

```typescript
// After eligibility check (Home → Eligible)
sessionStorage.setItem('patientData', JSON.stringify({
  name: "John Doe",
  age: "35",
  householdSize: "4",
  monthlyIncome: "3500"
}));

// After API call (Eligible → Confirmation)
sessionStorage.setItem('applicationData', JSON.stringify({
  name: "John Doe",
  age: "35",
  householdSize: "4",
  monthlyIncome: "3500",
  reason: "Medical reason...",
  aiResponse: "AI response...",
  timestamp: "2025-01-07T12:00:00.000Z"
}));
```

## 🎨 Component Hierarchy

```
App (layout.tsx)
│
├─ Home Page (page.tsx)
│  └─ EligibilityChecker (components/EligibilityChecker.tsx)
│     ├─ Logo (Image)
│     ├─ Form
│     │  ├─ Name Input
│     │  ├─ Age Input
│     │  ├─ Household Size Input
│     │  ├─ Monthly Income Input
│     │  └─ Submit Button
│     └─ Ineligible Message (conditional)
│
├─ Eligible Page (eligible/page.tsx)
│  ├─ Logo (Image)
│  ├─ Success Icon
│  ├─ Patient Summary
│  ├─ Error Message (conditional)
│  └─ Form
│     ├─ Medical Reason Textarea
│     ├─ Back Button
│     └─ Submit Button (with loading state)
│
└─ Confirmation Page (confirmation/page.tsx)
   ├─ Logo (Image)
   ├─ Success Icon
   ├─ Application Summary
   ├─ AI Response Section (conditional)
   ├─ Next Steps Section
   ├─ Contact Information
   ├─ Submit Another Button
   └─ Print Link
```

## 🔄 API Request/Response Flow

### Request Flow

```
Client                    Server                    OpenAI
  │                         │                         │
  │  POST /api/process-     │                         │
  │  application            │                         │
  ├────────────────────────>│                         │
  │                         │                         │
  │                         │  Validate data          │
  │                         │  Check eligibility      │
  │                         │  Build prompts          │
  │                         │                         │
  │                         │  POST /chat/completions │
  │                         ├────────────────────────>│
  │                         │                         │
  │                         │                         │  Process with
  │                         │                         │  GPT-4o-mini
  │                         │                         │
  │                         │  AI Response            │
  │                         │<────────────────────────┤
  │                         │                         │
  │                         │  Format response        │
  │                         │  Add metadata           │
  │                         │                         │
  │  JSON Response          │                         │
  │<────────────────────────┤                         │
  │                         │                         │
  │  Display on             │                         │
  │  confirmation page      │                         │
  │                         │                         │
```

### Response Structure

```typescript
// Success Response
{
  eligible: true,
  aiResponse: "Thank you for your application, John...",
  patientData: {
    name: "John Doe",
    age: "35",
    householdSize: "4",
    monthlyIncome: "3500",
    reason: "I have been experiencing..."
  },
  timestamp: "2025-01-07T12:00:00.000Z"
}

// Error Response
{
  error: "Invalid OpenAI API key",
  details: "Additional error information"
}
```

## 💾 Data Persistence

```
┌─────────────────────────────────────────────────────────────┐
│                    CURRENT STATE                            │
│                                                             │
│  Storage: sessionStorage (temporary, browser-based)         │
│  Duration: Until browser tab is closed                      │
│  Scope: Single browser tab only                            │
│                                                             │
│  Stored Data:                                               │
│  ├─ patientData (after eligibility check)                  │
│  └─ applicationData (after API call)                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    FUTURE ENHANCEMENT                       │
│                                                             │
│  Storage: Database (PostgreSQL, Supabase, etc.)            │
│  Duration: Permanent                                        │
│  Scope: All users, all sessions                            │
│                                                             │
│  Would Store:                                               │
│  ├─ All application data                                   │
│  ├─ AI responses                                           │
│  ├─ Timestamps                                             │
│  ├─ Application status                                     │
│  └─ Follow-up notes                                        │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         VERCEL                              │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Next.js Application                                │  │
│  │  ├─ Static Pages (pre-rendered)                     │  │
│  │  ├─ API Routes (serverless functions)              │  │
│  │  └─ Environment Variables (OPENAI_API_KEY)         │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  CDN (Content Delivery Network)                     │  │
│  │  ├─ Static assets (images, CSS, JS)                │  │
│  │  └─ Cached pages for fast loading                  │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    [HTTPS Connection]
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      USER BROWSER                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Summary

This architecture provides:
- ✅ **Separation of Concerns**: Frontend, API, and AI processing are separate
- ✅ **Security**: API keys never exposed to client
- ✅ **Scalability**: Serverless functions scale automatically
- ✅ **Performance**: Static pages load instantly
- ✅ **User Experience**: Smooth page transitions and loading states
- ✅ **Cost Efficiency**: Pay only for what you use
- ✅ **Maintainability**: Clear structure and documentation

**Built for Muslim American Social Services** 💚


