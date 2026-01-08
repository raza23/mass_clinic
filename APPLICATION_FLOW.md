# Healthcare Eligibility Checker - Application Flow

## Complete User Journey

### 🏠 Page 1: Home Page (`/`)

**URL**: `http://localhost:3000/`

**Purpose**: Initial eligibility screening

**Form Fields**:
- Full Name (text input)
- Age (number input)
- Household Size (number input)
- Monthly Income (number input with $ prefix)

**Validation**:
- All fields are required
- Age must be 18 or older
- Monthly income must be below threshold for household size

**User Actions**:
- Fill out form
- Click "Check Eligibility" button

---

### 📋 Page 2A: Ineligible (Same Page)

**Displayed When**: 
- Age < 18, OR
- Monthly income ≥ threshold for household size

**Content**:
- ❌ Red X icon
- "Not Eligible" heading
- Explanation message
- Eligibility requirements reminder
- "Start Over" button

**User Actions**:
- Click "Start Over" to reset form and try again

---

### ✅ Page 2B: Eligible Page (`/eligible`)

**URL**: `http://localhost:3000/eligible`

**Displayed When**: 
- Age ≥ 18, AND
- Monthly income < threshold for household size

**Content**:
- ✅ Green checkmark icon
- "Congratulations, [Name]!" heading
- Patient information summary (age, household size, income)
- Large textarea for reason for seeking healthcare

**Form Fields**:
- Reason for seeking healthcare assistance (required, textarea)

**User Actions**:
- Click "← Back" to return to home page
- Fill out reason and click "Submit Application →"

**Data Flow**:
- Patient data stored in sessionStorage
- If user refreshes or accesses directly without data, redirects to home

---

### 🎉 Page 3: Confirmation Page (`/confirmation`)

**URL**: `http://localhost:3000/confirmation`

**Displayed When**: 
- User successfully submits application from eligible page

**Content**:
- ✅ Large green checkmark icon
- "Application Submitted Successfully!" heading
- Thank you message with patient name
- Complete application summary:
  - Name
  - Age
  - Household Size
  - Monthly Income
  - Submission Date
- "What Happens Next?" section with timeline
- Required documents list for first visit
- Contact information section
- "Submit Another Application" button
- "Print this confirmation" link

**User Actions**:
- Print confirmation (window.print())
- Submit another application (clears data, returns to home)

**Data Flow**:
- Application data retrieved from sessionStorage
- If no data found, redirects to home page
- Console logs complete application data (ready for backend integration)

---

## Technical Implementation

### State Management
- **Home Page**: React state for form data and step tracking
- **Between Pages**: sessionStorage for data persistence
  - `patientData`: Basic info from initial form
  - `applicationData`: Complete info including reason

### Navigation
- Uses Next.js `useRouter()` for programmatic navigation
- `router.push('/eligible')` when eligible
- `router.push('/confirmation')` after submission
- `router.push('/')` to start over

### Data Validation

**Age Check**:
```typescript
if (age < 18) {
  // Show ineligible message
}
```

**Income Check**:
```typescript
const threshold = INCOME_THRESHOLDS[householdSize];
if (monthlyIncome >= threshold) {
  // Show ineligible message
}
```

### Income Thresholds (200% FPL)
```typescript
{
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
}
```

---

## Design Specifications

### Color Palette
- **Primary Background**: `#0E1238` (Dark Navy Blue)
- **Accent Color**: `#D4AF37` (Gold)
- **Success**: Green (#10B981)
- **Error**: Red (#DC2626)
- **Text on Cards**: Dark gray (#0E1238)
- **Text on Background**: White

### Layout
- Centered content with max-width: 2xl (672px)
- White cards with rounded corners (rounded-2xl)
- Shadow effects (shadow-2xl)
- Responsive padding (p-4 on mobile, p-8 on desktop)

### Typography
- Headings: 3xl-4xl, bold, #0E1238
- Body text: base-lg, gray-600
- Labels: sm, semibold, #0E1238

### Interactive Elements
- Buttons: Full width on mobile, flex on desktop
- Hover effects on all buttons
- Focus states with gold border (#D4AF37)
- Smooth transitions (transition-colors)

---

## Future Enhancements

### Backend Integration
- [ ] Create API endpoint for form submission
- [ ] Store applications in database
- [ ] Generate unique application ID
- [ ] Send confirmation email to patient

### GPT-4 Integration
- [ ] Process patient's reason text with AI
- [ ] Extract key medical concerns
- [ ] Categorize urgency level
- [ ] Suggest appropriate services

### Additional Features
- [ ] Multi-language support (Arabic, Spanish)
- [ ] SMS confirmation option
- [ ] Upload documents (ID, proof of income)
- [ ] Schedule appointment directly
- [ ] Admin dashboard for reviewing applications
- [ ] Email/SMS reminders for appointments

---

## Testing Checklist

### Eligible Patient Flow
- [ ] Enter valid data (age ≥ 18, income below threshold)
- [ ] Verify navigation to `/eligible` page
- [ ] Verify patient data displays correctly
- [ ] Submit reason and verify navigation to `/confirmation`
- [ ] Verify all data displays on confirmation page
- [ ] Test print functionality
- [ ] Test "Submit Another Application" button

### Ineligible Patient Flow
- [ ] Test with age < 18
- [ ] Test with income above threshold
- [ ] Verify ineligible message displays
- [ ] Test "Start Over" button

### Edge Cases
- [ ] Access `/eligible` directly without data → redirects to home
- [ ] Access `/confirmation` directly without data → redirects to home
- [ ] Refresh page on `/eligible` → should maintain data
- [ ] Browser back button behavior
- [ ] Form validation (empty fields)
- [ ] Very large household sizes (>10)
- [ ] Decimal income values

### Responsive Design
- [ ] Test on mobile (320px - 480px)
- [ ] Test on tablet (768px - 1024px)
- [ ] Test on desktop (1280px+)
- [ ] Test landscape orientation
- [ ] Test with browser zoom (50% - 200%)

---

## Browser Compatibility

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
✅ Mobile Safari (iOS 14+)
✅ Chrome Mobile (Android 10+)

---

## Accessibility Features

- ✅ Semantic HTML5 elements
- ✅ Proper form labels with `htmlFor` attributes
- ✅ ARIA attributes for icons
- ✅ Keyboard navigation support
- ✅ Focus visible states
- ✅ High contrast colors (WCAG AA compliant)
- ✅ Responsive text sizing
- ✅ Screen reader friendly error messages

---

## Performance Optimizations

- ✅ Next.js Image component for logo optimization
- ✅ Client-side navigation (no full page reloads)
- ✅ Minimal JavaScript bundle size
- ✅ CSS-in-JS with Tailwind (purged unused styles)
- ✅ sessionStorage for fast data access
- ✅ No external API calls (yet)

