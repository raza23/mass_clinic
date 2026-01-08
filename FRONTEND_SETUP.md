# Healthcare Eligibility Checker - Frontend Setup

## Overview
A multi-step eligibility checker application for Muslim American Social Services clinic to help potential patients determine if they qualify for free healthcare services.

## Features Implemented

### ✅ Step 1: Initial Eligibility Check
- Collects patient information:
  - Full Name
  - Age
  - Household Size
  - Monthly Income
- Validates eligibility based on:
  - Age requirement (must be 18+)
  - Income thresholds based on household size (200% FPL)

### ✅ Step 2: Conditional Flow
**If Ineligible:**
- Shows clear ineligibility message on the same page
- Explains eligibility requirements
- Provides option to start over

**If Eligible:**
- Navigates to a new page (`/eligible`)
- Shows personalized success message with patient's name
- Displays patient information summary
- Collects additional information:
  - Reason for seeking healthcare assistance (detailed textarea)
- Provides back button and submit button

### ✅ Step 3: Confirmation Page (`/confirmation`)
- Separate confirmation page after successful submission
- Displays complete application summary
- Shows next steps and what to expect
- Lists required documents for first visit
- Contact information for questions
- Print confirmation option
- Option to submit another application

## Design Features

### Color Scheme
- **Primary Background**: #0E1238 (Dark Navy Blue)
- **Accent Color**: #D4AF37 (Gold)
- **Text**: White on dark backgrounds, dark on light cards

### UI/UX Elements
- Responsive design (mobile-first approach)
- Clean white cards on dark blue background
- Clinic logo prominently displayed
- Clear visual feedback (checkmarks, X icons)
- Smooth transitions and hover effects
- Custom scrollbar styling
- Accessible form inputs with proper labels

## Income Thresholds (200% FPL)

| Household Size | Monthly Income Limit |
|----------------|---------------------|
| 1              | $2,430              |
| 2              | $3,287              |
| 3              | $4,143              |
| 4              | $5,000              |
| 5              | $5,857              |
| 6              | $6,713              |
| 7              | $7,570              |
| 8              | $8,427              |
| 9              | $9,283              |
| 10             | $10,140             |

## File Structure

```
mass_clinic/
├── app/
│   ├── components/
│   │   └── EligibilityChecker.tsx  # Main eligibility checker component
│   ├── eligible/
│   │   └── page.tsx                 # Eligible patient page (collects reason)
│   ├── confirmation/
│   │   └── page.tsx                 # Confirmation page after submission
│   ├── globals.css                  # Global styles with clinic branding
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Home page
├── public/
│   └── clinic-logo.png              # Clinic logo
└── package.json
```

## Page Flow

1. **Home Page (`/`)**: Initial eligibility check form
   - Collects: name, age, household size, monthly income
   - Validates eligibility criteria
   
2. **Ineligible Flow**: Stays on home page, shows ineligibility message

3. **Eligible Flow**: 
   - Redirects to `/eligible` page
   - Shows success message with patient data
   - Collects reason for seeking healthcare
   - Submits to `/confirmation` page

4. **Confirmation Page (`/confirmation`)**: Final success page with application summary

## Running the Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser to http://localhost:3000
```

## Next Steps

1. **Upload Actual Clinic Logo**: Replace `/public/clinic-logo.png` with the actual clinic logo
2. **GPT-4 Integration**: Add AI-powered processing for patient information
3. **Backend API**: Create endpoints for form submission
4. **Database**: Store patient applications
5. **Email Notifications**: Send confirmation emails to patients
6. **Admin Dashboard**: Review and manage applications

## Technologies Used

- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Image Optimization**: Next.js Image component

## Accessibility Features

- Semantic HTML
- Proper form labels
- Keyboard navigation support
- ARIA attributes for screen readers
- High contrast color scheme
- Clear error messaging

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

