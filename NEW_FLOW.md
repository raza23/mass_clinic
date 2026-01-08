# Updated Application Flow

## 🎯 New Multi-Service Flow

The application now supports multiple services with conditional routing based on user selection!

---

## 📊 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: HOME PAGE (/)                                      │
│  • Collect patient information                              │
│  • Check eligibility (age ≥ 18, income < threshold)        │
└─────────────────────────────────────────────────────────────┘
                          ↓
                    [Eligible?]
                    ↙         ↘
              YES ↙             ↘ NO
                ↙                 ↘
┌──────────────────────┐   ┌──────────────────────┐
│  STEP 2: SERVICES    │   │  INELIGIBLE MESSAGE  │
│  (/services)         │   │  (Same Page)         │
│                      │   │  • Show reason       │
│  What do you need    │   │  • Start over button │
│  assistance with?    │   └──────────────────────┘
│                      │
│  ┌────────────────┐ │
│  │ Make appt with │ │
│  │ a doctor       │ │
│  └────────────────┘ │
│  ┌────────────────┐ │
│  │ Food Pantry    │ │
│  └────────────────┘ │
│  ┌────────────────┐ │
│  │ Prescription   │ │
│  │ Help           │ │
│  └────────────────┘ │
│  ┌────────────────┐ │
│  │ Pain Help      │ │
│  └────────────────┘ │
└──────────────────────┘
          ↓
    [User Selection]
          ↓
    ┌─────────────┐
    │   Doctor?   │
    └─────────────┘
      ↙         ↘
  YES ↙           ↘ NO (Food/Prescription/Pain)
    ↙               ↘
┌──────────────────────┐   ┌──────────────────────┐
│  STEP 3A: SYMPTOMS   │   │  STEP 3B: APPOINTMENT│
│  (/symptoms)         │   │  (/appointment)      │
│                      │   │                      │
│  Select symptoms:    │   │  • Service summary   │
│  • Fever             │   │  • Additional info   │
│  • Cough             │   │  • Submit request    │
│  • Headache          │   │  • AI processing     │
│  • Back Pain         │   └──────────────────────┘
│  • Chest Pain        │              ↓
│  • Stomach Pain      │              │
│  • Fatigue           │              │
│  • Shortness Breath  │              │
│  • Dizziness         │              │
│  • Nausea            │              │
│  • Joint Pain        │              │
│  • Skin Issues       │              │
│  • Anxiety/Depression│              │
│  • Vision Problems   │              │
│  • Hearing Problems  │              │
│  • Other (describe)  │              │
│                      │              │
│  [Multiple select]   │              │
└──────────────────────┘              │
          ↓                           │
┌──────────────────────┐              │
│  STEP 4: APPOINTMENT │              │
│  (/appointment)      │              │
│                      │              │
│  • Patient summary   │◄─────────────┘
│  • Service type      │
│  • Selected symptoms │
│  • Additional info   │
│  • Submit request    │
│  • AI processing     │
└──────────────────────┘
          ↓
┌──────────────────────┐
│  STEP 5: CONFIRMATION│
│  (/confirmation)     │
│                      │
│  • Application       │
│    summary           │
│  • Service requested │
│  • Symptoms (if any) │
│  • AI response from  │
│    clinic admin      │
│  • Next steps        │
│  • Contact info      │
│  • Print option      │
└──────────────────────┘
```

---

## 🔄 Detailed Flow by Service Type

### 🩺 Doctor Appointment Flow

```
Home → Eligible → Services → "Make appointment with doctor"
                                      ↓
                              Symptoms Selection
                                      ↓
                              Appointment Booking
                                      ↓
                                Confirmation
```

**Pages:**
1. `/` - Eligibility check
2. `/services` - Service selection
3. `/symptoms` - Symptom selection (16 options)
4. `/appointment` - Appointment details
5. `/confirmation` - Final confirmation with AI response

**Data Collected:**
- Patient info (name, age, household, income)
- Selected symptoms (multiple choice)
- Additional information
- AI-generated response

---

### 🍎 Food Pantry Flow

```
Home → Eligible → Services → "Food Pantry"
                                      ↓
                              Appointment Booking
                                      ↓
                                Confirmation
```

**Pages:**
1. `/` - Eligibility check
2. `/services` - Service selection
3. `/appointment` - Appointment details (no symptoms)
4. `/confirmation` - Final confirmation with AI response

**Data Collected:**
- Patient info (name, age, household, income)
- Additional information about food needs
- AI-generated response

---

### 💊 Prescription Help Flow

```
Home → Eligible → Services → "Prescription Help"
                                      ↓
                              Appointment Booking
                                      ↓
                                Confirmation
```

**Pages:**
1. `/` - Eligibility check
2. `/services` - Service selection
3. `/appointment` - Appointment details (no symptoms)
4. `/confirmation` - Final confirmation with AI response

**Data Collected:**
- Patient info (name, age, household, income)
- Additional information about prescription needs
- AI-generated response

---

### 💔 Pain Help Flow

```
Home → Eligible → Services → "Pain Help"
                                      ↓
                              Appointment Booking
                                      ↓
                                Confirmation
```

**Pages:**
1. `/` - Eligibility check
2. `/services` - Service selection
3. `/appointment` - Appointment details (no symptoms)
4. `/confirmation` - Final confirmation with AI response

**Data Collected:**
- Patient info (name, age, household, income)
- Additional information about pain management needs
- AI-generated response

---

## 📝 Symptom Selection (Doctor Appointments Only)

### Available Symptoms

| Icon | Symptom | ID |
|------|---------|-----|
| 🌡️ | Fever | `fever` |
| 🤧 | Cough | `cough` |
| 🤕 | Headache | `headache` |
| 🔙 | Back Pain | `back_pain` |
| 💔 | Chest Pain | `chest_pain` |
| 🤢 | Stomach Pain | `stomach_pain` |
| 😴 | Fatigue | `fatigue` |
| 😮‍💨 | Shortness of Breath | `shortness_breath` |
| 😵 | Dizziness | `dizziness` |
| 🤮 | Nausea | `nausea` |
| 🦴 | Joint Pain | `joint_pain` |
| 🩹 | Skin Issues | `skin_issues` |
| 😰 | Anxiety/Depression | `anxiety` |
| 👁️ | Vision Problems | `vision` |
| 👂 | Hearing Problems | `hearing` |
| ❓ | Other | `other` |

**Features:**
- Multiple selection allowed
- Visual feedback (gold highlight when selected)
- "Other" option includes text area for description
- Shows count of selected symptoms
- Responsive grid layout

---

## 💾 Data Storage (sessionStorage)

### After Eligibility Check
```javascript
sessionStorage.setItem('patientData', {
  name: "John Doe",
  age: "35",
  householdSize: "4",
  monthlyIncome: "3500"
});
```

### After Service Selection
```javascript
sessionStorage.setItem('selectedService', 'doctor');
// Options: 'doctor', 'food', 'prescription', 'pain'
```

### After Symptom Selection (Doctor only)
```javascript
sessionStorage.setItem('symptomsData', {
  symptoms: ["Back Pain", "Fatigue", "Headache"],
  otherSymptom: null // or description if "Other" selected
});
```

### After Appointment Submission
```javascript
sessionStorage.setItem('applicationData', {
  name: "John Doe",
  age: "35",
  householdSize: "4",
  monthlyIncome: "3500",
  service: "doctor",
  serviceName: "Doctor Appointment",
  symptoms: ["Back Pain", "Fatigue"],
  reason: "Additional information...",
  aiResponse: "AI response from clinic admin...",
  timestamp: "2025-01-07T12:00:00.000Z"
});
```

---

## 🤖 AI Integration

### System Prompt Enhancement

The AI receives different context based on the service:

**For Doctor Appointments:**
```
Service Requested: Doctor Appointment

Symptoms: Back Pain, Fatigue, Headache

Additional Information:
[Patient's additional details]
```

**For Other Services:**
```
Service Requested: Food Pantry

Additional Information:
[Patient's needs description]
```

The AI then provides personalized guidance based on:
- Service type
- Symptoms (if doctor appointment)
- Patient's specific situation
- Eligibility confirmation

---

## 🎨 UI/UX Features

### Services Page
- **Layout**: 2x2 grid on desktop, 1 column on mobile
- **Cards**: Large, clickable cards with icons
- **Hover Effect**: Scale up, change shadow
- **Icons**: Custom SVG icons for each service
- **Colors**: Gray cards, gold on hover

### Symptoms Page
- **Layout**: 4 columns on desktop, 2 on mobile
- **Selection**: Toggle on/off with visual feedback
- **Selected State**: Gold background, white text
- **Counter**: Shows number of symptoms selected
- **Other Option**: Expands to show textarea

### Appointment Page
- **Summary Box**: Shows patient info and service
- **Symptoms Display**: Pills/badges for selected symptoms
- **Textarea**: Context-specific placeholder text
- **Loading State**: Spinner with "Processing..." text

### Confirmation Page
- **Enhanced Summary**: Includes service and symptoms
- **Symptom Pills**: Blue badges for easy reading
- **AI Response**: Highlighted in blue box
- **Print Option**: Browser print dialog

---

## 🚀 Testing Guide

### Test 1: Doctor Appointment with Symptoms

1. **Home Page**
   - Name: John Doe
   - Age: 35
   - Household: 4
   - Income: 3500
   - Click "Check Eligibility"

2. **Services Page**
   - Click "Make an appointment with a doctor"

3. **Symptoms Page**
   - Select: Back Pain, Fatigue, Headache
   - Click "Continue to Appointment"

4. **Appointment Page**
   - Enter additional info
   - Click "Submit Appointment Request"

5. **Confirmation Page**
   - Verify symptoms display
   - Check AI response

### Test 2: Food Pantry (Direct to Appointment)

1. **Home Page**
   - Fill eligibility form
   - Click "Check Eligibility"

2. **Services Page**
   - Click "Food Pantry"

3. **Appointment Page** (skips symptoms)
   - Enter food needs
   - Click "Submit Appointment Request"

4. **Confirmation Page**
   - Verify service type
   - Check AI response

### Test 3: Prescription Help

1. **Home Page** → Eligible
2. **Services Page** → "Prescription Help"
3. **Appointment Page** → Enter prescription details
4. **Confirmation Page** → Verify

### Test 4: Pain Help

1. **Home Page** → Eligible
2. **Services Page** → "Pain Help"
3. **Appointment Page** → Enter pain details
4. **Confirmation Page** → Verify

---

## 📁 New File Structure

```
mass_clinic/
├── app/
│   ├── services/
│   │   └── page.tsx              # NEW: Service selection page
│   ├── symptoms/
│   │   └── page.tsx              # NEW: Symptom selection page
│   ├── appointment/
│   │   └── page.tsx              # NEW: Appointment booking page
│   ├── confirmation/
│   │   └── page.tsx              # UPDATED: Shows service & symptoms
│   ├── components/
│   │   └── EligibilityChecker.tsx # UPDATED: Routes to /services
│   └── eligible/
│       └── page.tsx              # OLD: No longer used (kept for reference)
```

---

## ✅ Implementation Complete!

### New Features
- ✅ Multi-service selection page
- ✅ Conditional routing (doctor → symptoms, others → appointment)
- ✅ 16 symptom options with icons
- ✅ Multiple symptom selection
- ✅ Service-specific AI prompts
- ✅ Enhanced confirmation page
- ✅ Responsive design for all new pages

### Updated Features
- ✅ EligibilityChecker routes to services page
- ✅ Confirmation page shows service and symptoms
- ✅ AI receives service-specific context

---

## 🎊 Ready to Test!

Start the server and test the new flow:

```bash
npm run dev
```

Visit: **http://localhost:3000**

Try all four service types to see the different flows!

