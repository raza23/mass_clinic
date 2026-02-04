import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Read the template PDF
    const pdfPath = path.join(process.cwd(), 'new_patient.pdf');
    const existingPdfBytes = fs.readFileSync(pdfPath);
    
    // Load the PDF
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();
    
    // Helper function to safely set text field
    const setTextField = (fieldName: string, value: string, options?: { multiline?: boolean }) => {
      try {
        const field = form.getTextField(fieldName);
        
        // Enable multiline if specified (must be done before setText)
        if (options?.multiline) {
          field.enableMultiline();
        }
        
        // Set text
        field.setText(value || '');
      } catch {
        console.log(`Field "${fieldName}" not found or error setting value`);
      }
    };
    
    // Helper function to safely check checkbox
    const setCheckBox = (fieldName: string, shouldCheck: boolean) => {
      try {
        const field = form.getCheckBox(fieldName);
        if (shouldCheck) {
          field.check();
        } else {
          field.uncheck();
        }
        console.log(`✓ Checkbox "${fieldName}" set to ${shouldCheck}`);
      } catch (error) {
        console.log(`✗ Checkbox "${fieldName}" not found or error:`, error);
      }
    };
    
    // Helper function to format date as mm/dd/yy (2-digit year to fit in PDF fields)
    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2); // Last 2 digits of year
      return `${month}/${day}/${year}`;
    };
    
    // Fill in the form fields
    // Basic Patient Information
    setTextField('Patients_Name', `${data.firstName} ${data.lastName}`);
    setTextField('PATIENTFIRSTNAME', data.firstName || '');
    setTextField('PATIENTLASTNAME', data.lastName || '');
    setTextField('PATIENTDOB', formatDate(data.dateOfBirth) || '');
    setTextField('AGE', data.age || '');
    
    // Contact Information
    setTextField('PATIENTPHONENUMBERS', data.phone || '');
    setTextField('ptEmail', data.email || '');
    
    // Full address with city, state, zip
    const fullAddress = [
      data.address,
      data.city,
      data.state,
      data.zipCode
    ].filter(Boolean).join(', ');
    setTextField('PATIENTADDRESSBLOCK', fullAddress || data.address || '');
    
    // Demographics
    setTextField('PATIENTETHNICITY', data.ethnicity || '');
    setTextField('PATIENTRACE', data.race || '');
    setTextField('PATIENTLANGchar', data.language || '');
    
    // Gender/Sex - Using PDFRadioGroup (updated PDF)
    if (data.sex) {
      try {
        const sexRadioGroup = form.getRadioGroup('PATIENTSEX');
        
        console.log('Setting gender:', data.sex);
        
        // Get available options from the radio group
        const options = sexRadioGroup.getOptions();
        console.log('Available gender options:', options);
        
        // Set the radio button based on gender
        if (data.sex.toLowerCase() === 'male') {
          if (options.includes('Male')) {
            sexRadioGroup.select('Male');
            console.log('✓ Selected "Male" radio button');
          } else if (options.includes('M')) {
            sexRadioGroup.select('M');
            console.log('✓ Selected "M" radio button');
          } else if (options.includes('male')) {
            sexRadioGroup.select('male');
            console.log('✓ Selected "male" radio button');
          } else if (options.length > 0) {
            sexRadioGroup.select(options[0]);
            console.log(`✓ Selected first option: "${options[0]}"`);
          }
        } else if (data.sex.toLowerCase() === 'female') {
          if (options.includes('Female')) {
            sexRadioGroup.select('Female');
            console.log('✓ Selected "Female" radio button');
          } else if (options.includes('F')) {
            sexRadioGroup.select('F');
            console.log('✓ Selected "F" radio button');
          } else if (options.includes('female')) {
            sexRadioGroup.select('female');
            console.log('✓ Selected "female" radio button');
          } else if (options.length > 1) {
            sexRadioGroup.select(options[1]);
            console.log(`✓ Selected second option: "${options[1]}"`);
          }
        }
        
        // Verify selection
        const selected = sexRadioGroup.getSelected();
        console.log('✓ Gender radio button selected:', selected);
      } catch (error) {
        console.log('❌ Error setting gender radio button:', error);
      }
    }
    
    // Financial Information
    setTextField('FamilySize', data.householdSize || '');
    setTextField('Total Gross', data.monthlyIncome || '');
    
    // Self (Patient) Employment/Income - Section 2
    setTextField('Employer1', data.selfEmployer || '');
    setTextField('EarnedGross1', data.selfEarnedIncome || '');
    setTextField('unEarnedGross1', data.selfUnearnedIncome || '');
    
    // Spouse/Partner Information - Section 2
    if (data.hasSpouse && data.spouseName) {
      setTextField('Spouse Name', data.spouseName);
      setTextField('SpouseDOB', formatDate(data.spouseDob) || '');
      setTextField('Employer2', data.spouseEmployer || '');
      setTextField('EarnedGross2', data.spouseEarnedIncome || '');
      setTextField('unEarnedGross2', data.spouseUnearnedIncome || '');
    }
    
    // Children Information - Section 2 (up to 4 children)
    if (data.children && Array.isArray(data.children)) {
      data.children.forEach((child: any, index: number) => {
        if (index < 4) { // PDF only has 4 child rows
          const childNum = index + 1;
          setTextField(`Child${childNum} Name`, child.name || '');
          setTextField(`Child${childNum}DOB`, formatDate(child.dob) || '');
          setTextField(`Employer${childNum + 2}`, child.employer || ''); // Employer3-6
          setTextField(`EarnedGross${childNum + 2}`, child.earnedIncome || ''); // EarnedGross3-6
          setTextField(`unEarnedGross${childNum + 2}`, child.unearnedIncome || ''); // unEarnedGross3-6
        }
      });
    }
    
    // Family Size Breakdown
    if (data.householdSize) {
      const totalSize = parseInt(data.householdSize) || 0;
      let adults = 1; // Self
      if (data.hasSpouse) adults += 1;
      const childrenCount = data.children ? data.children.length : 0;
      
      setTextField('FamilySizeAdult', adults.toString());
      setTextField('FamilySizeUnder18', childrenCount.toString());
      setTextField('FamilySize', totalSize.toString());
    }
    
    // NOTE: SSN field is intentionally not collected for patient privacy and security
    
    // Set today's date
    const today = new Date().toLocaleDateString('en-US');
    setTextField('TODAY', today);
    
    // Top 3 Reason / Main Concern (Page 3)
    // Combine symptoms and additional information for the main concern field
    let mainConcern = '';
    
    if (data.symptoms && Array.isArray(data.symptoms) && data.symptoms.length > 0) {
      mainConcern = `Symptoms: ${data.symptoms.join(', ')}`;
      if (data.otherSymptom) {
        mainConcern += ` (Other: ${data.otherSymptom})`;
      }
      if (data.reason) {
        mainConcern += `\n\nAdditional Information:\n${data.reason}`;
      }
    } else if (data.reason) {
      mainConcern = data.reason;
    }
    
    if (mainConcern) {
      setTextField('CLINICALSECTION_ENCOUNTERREASON', mainConcern, { 
        multiline: true
      });
    }
    
    // NOTE: Other Page 3 fields (vitals, medications, PHQ-9 scores, etc.) are intentionally left blank
    // These will be filled out by the doctor during the actual patient visit
    
    // Clinic name
    setTextField('MASS_Txt', 'Muslim American Social Services');
    setTextField('PATIENTDEPARTMENTNAMEc', 'Muslim American Social Services');
    
    // Add signatures if provided
    if (data.signature) {
      try {
        // Extract base64 data from data URL
        const base64Data = data.signature.split(',')[1];
        const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        
        // Embed the signature image
        const signatureImage = await pdfDoc.embedPng(imageBytes);
        
        // Get all pages
        const pages = pdfDoc.getPages();
        const signatureDate = new Date().toLocaleDateString('en-US');
        
        // Define signature locations for all 8 signature spots
        // Note: PDF coordinates start from bottom-left corner
        // Y coordinates are measured from the bottom of the page
        const signatureLocations = [
          // Page 1 (index 0) - Section 4 - Bottom signature box (SIGNATURE OF CLIENT/PATIENT/PARENT OR GUARDIAN AND DATE)
          { page: 0, x: 45, y: 60, width: 185, height: 40, label: 'SIGNATURE OF CLIENT/PATIENT' },
          // Page 2 (index 1) - Top signature - "Signature of Patient or Legal Representative:"
          { page: 1, x: 235, y: 155, width: 200, height: 40, label: 'Signature of Patient' },  
          // Page 5 (index 4) - Consent section
          { page: 4, x: 95, y: 446, width: 250, height: 35, label: 'Signature' },
         
          // Page 6 (index 5) - Patient responsibilities
          { page: 5, x: 55, y: 133, width: 250, height: 35, label: 'Patient Signature' },
          
          // Page 7 (index 6) - Bill of Rights
          { page: 7, x: 125, y: 115, width: 210, height: 35, label: 'Patient Signature' },
          { page: 8, x: 85, y: 460, width: 250, height: 35, label: 'Signature' },
        
          { page: 10, x: 170, y: 110, width: 175, height: 35, label: 'Signature' },
          { page: 12, x: 130, y: 113, width: 170, height: 35, label: 'Signature' },

        ];
        
        // Apply signature to all locations
        signatureLocations.forEach((location, index) => {
          try {
            if (location.page < pages.length) {
              const page = pages[location.page];
              
              // Draw the signature image
              page.drawImage(signatureImage, {
                x: location.x,
                y: location.y,
                width: location.width,
                height: location.height,
              });
              
              // Draw a line underneath the signature
              page.drawLine({
                start: { x: location.x, y: location.y - 2 },
                end: { x: location.x + location.width, y: location.y - 2 },
                thickness: 1,
                color: rgb(0, 0, 0),
              });
              
              console.log(`✓ Signature ${index + 1} added to page ${location.page + 1} with line`);
            }
          } catch (error) {
            console.log(`✗ Error adding signature ${index + 1}:`, error);
          }
        });
        
        console.log('✓ All signatures added to PDF');
      } catch (error) {
        console.log('✗ Error processing signature:', error);
      }
    }
    
    // Update field appearances (important for checkboxes to render properly)
    try {
      form.updateFieldAppearances();
      console.log('✓ Field appearances updated');
    } catch (error) {
      console.log('✗ Could not update field appearances:', error);
    }
    
    // Save the filled PDF with options to preserve form fields
    const pdfBytes = await pdfDoc.save({
      useObjectStreams: false,
      addDefaultPage: false,
      updateFieldAppearances: true
    });
    console.log('✓ PDF saved with updateFieldAppearances option');
    
    // Convert Uint8Array to Buffer for NextResponse
    const buffer = Buffer.from(pdfBytes);
    
    // Return the PDF as a downloadable file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="patient-application-${data.lastName}-${Date.now()}.pdf"`,
      },
    });
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: errorMessage },
      { status: 500 }
    );
  }
}
