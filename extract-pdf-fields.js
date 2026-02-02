const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function extractPdfFields() {
  try {
    // Read the PDF file
    const pdfPath = './new_patient.pdf';
    const existingPdfBytes = fs.readFileSync(pdfPath);
    
    // Load the PDF
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    
    // Get the form
    const form = pdfDoc.getForm();
    
    // Get all fields
    const fields = form.getFields();
    
    console.log('\n========================================');
    console.log('PDF FORM FIELDS FOUND');
    console.log('========================================\n');
    console.log(`Total fields: ${fields.length}\n`);
    
    if (fields.length === 0) {
      console.log('⚠️  No form fields found in this PDF.');
      console.log('This might mean:');
      console.log('  1. The PDF is not a fillable form');
      console.log('  2. The PDF has a different structure');
      console.log('  3. The fields are not standard AcroForm fields\n');
      return;
    }
    
    // Organize fields by type
    const fieldsByType = {
      text: [],
      checkbox: [],
      dropdown: [],
      radio: [],
      button: [],
      signature: [],
      other: []
    };
    
    fields.forEach((field, index) => {
      const name = field.getName();
      const type = field.constructor.name;
      
      const fieldInfo = {
        index: index + 1,
        name: name,
        type: type
      };
      
      // Categorize by type
      if (type.includes('Text')) {
        fieldsByType.text.push(fieldInfo);
      } else if (type.includes('CheckBox')) {
        fieldsByType.checkbox.push(fieldInfo);
      } else if (type.includes('Dropdown')) {
        fieldsByType.dropdown.push(fieldInfo);
      } else if (type.includes('Radio')) {
        fieldsByType.radio.push(fieldInfo);
      } else if (type.includes('Button')) {
        fieldsByType.button.push(fieldInfo);
      } else if (type.includes('Signature')) {
        fieldsByType.signature.push(fieldInfo);
      } else {
        fieldsByType.other.push(fieldInfo);
      }
    });
    
    // Display organized results
    console.log('📝 TEXT FIELDS:');
    console.log('─────────────────────────────────────────');
    if (fieldsByType.text.length > 0) {
      fieldsByType.text.forEach(f => {
        console.log(`  ${f.index}. "${f.name}" (${f.type})`);
      });
    } else {
      console.log('  (none)');
    }
    
    console.log('\n☑️  CHECKBOX FIELDS:');
    console.log('─────────────────────────────────────────');
    if (fieldsByType.checkbox.length > 0) {
      fieldsByType.checkbox.forEach(f => {
        console.log(`  ${f.index}. "${f.name}" (${f.type})`);
      });
    } else {
      console.log('  (none)');
    }
    
    console.log('\n📋 DROPDOWN FIELDS:');
    console.log('─────────────────────────────────────────');
    if (fieldsByType.dropdown.length > 0) {
      fieldsByType.dropdown.forEach(f => {
        console.log(`  ${f.index}. "${f.name}" (${f.type})`);
      });
    } else {
      console.log('  (none)');
    }
    
    console.log('\n🔘 RADIO BUTTON FIELDS:');
    console.log('─────────────────────────────────────────');
    if (fieldsByType.radio.length > 0) {
      fieldsByType.radio.forEach(f => {
        console.log(`  ${f.index}. "${f.name}" (${f.type})`);
      });
    } else {
      console.log('  (none)');
    }
    
    console.log('\n✍️  SIGNATURE FIELDS:');
    console.log('─────────────────────────────────────────');
    if (fieldsByType.signature.length > 0) {
      fieldsByType.signature.forEach(f => {
        console.log(`  ${f.index}. "${f.name}" (${f.type})`);
      });
    } else {
      console.log('  (none)');
    }
    
    console.log('\n🔲 OTHER FIELDS:');
    console.log('─────────────────────────────────────────');
    if (fieldsByType.other.length > 0) {
      fieldsByType.other.forEach(f => {
        console.log(`  ${f.index}. "${f.name}" (${f.type})`);
      });
    } else {
      console.log('  (none)');
    }
    
    console.log('\n========================================');
    console.log('SUMMARY');
    console.log('========================================');
    console.log(`Total Fields: ${fields.length}`);
    console.log(`  - Text Fields: ${fieldsByType.text.length}`);
    console.log(`  - Checkboxes: ${fieldsByType.checkbox.length}`);
    console.log(`  - Dropdowns: ${fieldsByType.dropdown.length}`);
    console.log(`  - Radio Buttons: ${fieldsByType.radio.length}`);
    console.log(`  - Signatures: ${fieldsByType.signature.length}`);
    console.log(`  - Other: ${fieldsByType.other.length}`);
    console.log('========================================\n');
    
    // Save to a text file for reference
    const outputLines = [
      'PDF FORM FIELDS ANALYSIS',
      '=' .repeat(80),
      '',
      `Total Fields Found: ${fields.length}`,
      '',
      'FIELD LIST (for mapping to frontend data):',
      '-'.repeat(80),
      ''
    ];
    
    fields.forEach((field, index) => {
      const name = field.getName();
      const type = field.constructor.name;
      outputLines.push(`${index + 1}. Field Name: "${name}"`);
      outputLines.push(`   Type: ${type}`);
      outputLines.push('');
    });
    
    fs.writeFileSync('pdf-fields-list.txt', outputLines.join('\n'));
    console.log('✅ Field list saved to: pdf-fields-list.txt\n');
    
  } catch (error) {
    console.error('❌ Error extracting PDF fields:');
    console.error(error.message);
    console.error('\nMake sure:');
    console.error('  1. The PDF file exists at: ./new_patient.pdf');
    console.error('  2. You have installed pdf-lib: npm install pdf-lib');
    console.error('  3. The PDF is not corrupted or password-protected\n');
  }
}

// Run the extraction
extractPdfFields();
