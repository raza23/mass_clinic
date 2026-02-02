# PDF Form Filling Implementation Guide

This document explains how the automated PDF form filling feature works in the Mass Clinic application.

## Overview

The application now collects comprehensive patient information through an expanded frontend form and automatically fills the `new_patient.pdf` form with the collected data. Patients can download a completed PDF application form from the confirmation page.

## Features

✅ **Expanded Data Collection** - Collects all necessary patient information
✅ **Auto-fill PDF Form** - Automatically populates PDF fields with patient data
✅ **Download Capability** - Patients can download their completed application
✅ **Auto-calculate Age** - Automatically calculates age from date of birth
✅ **Form Validation** - Ensures required fields are filled out

## Data Collected

### Personal Information
- **First Name** (required)
- **Last Name** (required)
- **Date of Birth** (required) - Auto-calculates age
- **Sex** (required) - Male/Female dropdown
- **Age** (auto-calculated from DOB)

### Contact Information
- **Phone Number** (required)
- **Email Address** (required)
- **Street Address** (required)

### Demographics (Optional)
- **Ethnicity**
- **Race**
- **Preferred Language**

### Financial Information
- **Household Size** (required)
- **Monthly Income** (required)

### Optional Information
- **Social Security Number** (optional, secure)

## PDF Field Mapping

The application maps frontend data to PDF form fields as follows:

| Frontend Data | PDF Field Name | Type |
|--------------|----------------|------|
| First Name + Last Name | `Patients_Name` | Text |
| First Name | `PATIENTFIRSTNAME` | Text |
| Last Name | `PATIENTLASTNAME` | Text |
| Date of Birth | `PATIENTDOB` | Text |
| Age | `AGE` | Text |
| Sex | `PATIENTSEX` | Text/Checkbox |
| Phone | `PATIENTPHONENUMBERS` | Text |
| Email | `ptEmail` | Text |
| Address | `PATIENTADDRESSBLOCK` | Text |
| Ethnicity | `PATIENTETHNICITY` | Text |
| Race | `PATIENTRACE` | Text |
| Language | `PATIENTLANGchar` | Text |
| Household Size | `FamilySize` | Text |
| Monthly Income | `Total Gross` | Text |
| SSN | `PATIENTSSN` | Text |
| Today's Date | `TODAY` | Text |
| Service Type | `AppointmentType` | Text |
| Reason/Symptoms | `CLINICALSECTION_ENCOUNTERREASON` | Text |
| Clinic Name | `MASS_Txt` | Text |

## How It Works

### 1. Frontend Form Collection

The `EligibilityChecker` component (`app/components/EligibilityChecker.tsx`) now includes multiple sections:

```typescript
interface FormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: string;
  sex: 'Male' | 'Female' | '';
  phone: string;
  email: string;
  address: string;
  ethnicity: string;
  race: string;
  language: string;
  householdSize: string;
  monthlyIncome: string;
  ssn: string;
}
```

### 2. Data Flow

```
User fills form → Eligibility check → Services selection → 
Appointment details → Confirmation page → Download PDF
```

### 3. PDF Generation API

**Endpoint:** `/api/generate-pdf`  
**Method:** `POST`  
**Location:** `app/api/generate-pdf/route.ts`

The API:
1. Receives patient data as JSON
2. Loads the template PDF (`new_patient.pdf`)
3. Fills form fields using `pdf-lib`
4. Returns the completed PDF for download

Example request:
```typescript
const response = await fetch('/api/generate-pdf', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(patientData),
});
```

### 4. Download on Confirmation Page

The confirmation page (`app/confirmation/page.tsx`) includes a "Download PDF" button that:
1. Retrieves all patient data from sessionStorage
2. Calls the `/api/generate-pdf` API
3. Downloads the completed PDF to the user's device

## File Structure

```
mass_clinic/
├── app/
│   ├── api/
│   │   └── generate-pdf/
│   │       └── route.ts              # PDF generation API
│   ├── components/
│   │   └── EligibilityChecker.tsx    # Expanded form with all fields
│   ├── confirmation/
│   │   └── page.tsx                  # Added PDF download button
│   └── appointment/
│       └── page.tsx                  # Updated to handle new data structure
├── new_patient.pdf                   # Template PDF with 94 fillable fields
├── extract-pdf-fields.js             # Utility to extract PDF field names
└── pdf-fields-list.txt               # List of all PDF fields (reference)
```

## Dependencies

The PDF generation feature requires:

```json
{
  "dependencies": {
    "pdf-lib": "^1.17.1"
  }
}
```

Install with:
```bash
npm install pdf-lib
```

## Usage Example

### For Patients

1. Fill out the eligibility form with all required information
2. Complete the service selection and appointment details
3. On the confirmation page, click "📄 Download Completed Application Form (PDF)"
4. The filled PDF will download automatically

### For Developers

To add new PDF field mappings:

```typescript
// In app/api/generate-pdf/route.ts

// Add new field mapping
setTextField('NEW_PDF_FIELD_NAME', data.newFieldFromFrontend || '');
```

## Extracting PDF Fields

To see all available PDF form fields, run:

```bash
node extract-pdf-fields.js
```

This will:
- Display all 94 fields in the console
- Save a complete list to `pdf-fields-list.txt`
- Categorize fields by type (text, checkbox, dropdown, etc.)

## Security Considerations

✅ **SSN Encryption** - Consider encrypting SSN data in production
✅ **Server-Side Processing** - PDF generation happens server-side (API route)
✅ **No Client Exposure** - Template PDF is never exposed to client
✅ **Session Storage** - Patient data stored temporarily in browser session
✅ **Clear After Download** - Option to clear session data after PDF download

## Testing

### Test the PDF Generation

1. Start the development server:
```bash
npm run dev
```

2. Navigate to `http://localhost:3000`

3. Fill out the form with test data:
```
First Name: John
Last Name: Doe
Date of Birth: 01/01/1990
Sex: Male
Phone: (123) 456-7890
Email: john.doe@example.com
Address: 123 Main St, Jacksonville, FL 32246
Household Size: 4
Monthly Income: 3500
```

4. Complete the eligibility flow and download the PDF

5. Open the PDF and verify all fields are filled correctly

### Expected Output

- ✅ Patient name appears in multiple fields
- ✅ Date of birth is formatted correctly
- ✅ Age is calculated and displayed
- ✅ Contact information is populated
- ✅ Financial information is filled
- ✅ Today's date is automatically set
- ✅ Service type is included (if applicable)

## Troubleshooting

### PDF Not Downloading

**Issue:** PDF generation fails or doesn't download

**Solutions:**
1. Check that `new_patient.pdf` exists in the project root
2. Verify `pdf-lib` is installed: `npm list pdf-lib`
3. Check browser console for errors
4. Ensure API route is accessible: `/api/generate-pdf`

### Fields Not Filling

**Issue:** Some PDF fields remain empty

**Solutions:**
1. Verify field names match the PDF: run `node extract-pdf-fields.js`
2. Check that frontend data property names match the API mapping
3. Ensure data is being passed correctly in sessionStorage
4. Add console logging in the API route to debug

### Browser Compatibility

The PDF download feature works in:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Future Enhancements

Potential improvements:

- [ ] Add signature field capture
- [ ] Support multiple pages/forms
- [ ] Email PDF to patient and clinic
- [ ] Save PDF to database/cloud storage
- [ ] Add PDF preview before download
- [ ] Support family member information (spouse, children)
- [ ] Auto-fill employment/income details
- [ ] Multi-language PDF generation

## API Reference

### POST `/api/generate-pdf`

Generates a filled PDF from template with patient data.

**Request Body:**
```typescript
{
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: string;
  sex: string;
  phone: string;
  email: string;
  address: string;
  ethnicity?: string;
  race?: string;
  language?: string;
  householdSize: string;
  monthlyIncome: string;
  ssn?: string;
  serviceName?: string;
  reason?: string;
}
```

**Response:**
- **Success (200):** PDF file (application/pdf)
- **Error (500):** JSON with error details

**Headers:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="patient-application-{lastName}-{timestamp}.pdf"
```

## Support

For questions or issues:
- Check the console logs for detailed error messages
- Verify all dependencies are installed
- Ensure the PDF template is not corrupted
- Review the field mapping in the API route

---

**Last Updated:** February 2026  
**Version:** 1.0.0  
**Maintainer:** Mass Clinic Development Team
