import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, fullName, firstName, lastName, age, householdSize, monthlyIncome, reason } = body;

    // Get patient name (support both old and new format)
    const patientName = fullName || name || `${firstName} ${lastName}`;

    // Validate required fields
    if (!patientName || !age || !householdSize || !monthlyIncome || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check eligibility
    const ageNum = parseInt(age);
    const householdSizeNum = parseInt(householdSize);
    const monthlyIncomeNum = parseFloat(monthlyIncome);

    const isEligible = 
      ageNum >= 18 && 
      monthlyIncomeNum < (INCOME_THRESHOLDS[householdSizeNum] || INCOME_THRESHOLDS[10]);

    if (!isEligible) {
      return NextResponse.json(
        { 
          eligible: false, 
          message: 'Patient does not meet eligibility requirements' 
        },
        { status: 200 }
      );
    }

    // Create the system prompt with patient data
    const systemPrompt = `Play the role of an admin of a free healthcare clinic. The patient will provide you with their name and age as well as the total amount of people in their household (under the age of 18), and their underlying issue. You will initially check if they're eligible based on their monthly income. Based on the clinic's guidelines you will determine if they are eligible. If they are eligible you will obtain more information about the patient and schedule them an appointment.

Patient Information:
- Name: ${patientName}
- Age: ${age} years old
- Household Size: ${householdSize} people
- Monthly Income: $${monthlyIncomeNum.toLocaleString()}
- Income Threshold for Household: $${(INCOME_THRESHOLDS[householdSizeNum] || INCOME_THRESHOLDS[10]).toLocaleString()}
- Eligibility Status: ELIGIBLE (Age ≥ 18 and Income < Threshold)

The patient has already been confirmed as eligible. Your role is to:
1. Acknowledge their eligibility
2. Review their medical concern/issue
3. Provide compassionate guidance
4. Suggest next steps for scheduling an appointment
5. Ask any clarifying questions if needed about their medical concern`;

    // User message with the patient's reason
    const userMessage = `My name is ${patientName}. I am ${age} years old with ${householdSize} people in my household. My monthly income is $${monthlyIncomeNum.toLocaleString()}. 

Here is my medical concern and reason for seeking healthcare assistance:

${reason}`;

    // Call OpenAI API with GPT-4o-mini (note: gpt-4.1-mini doesn't exist, using gpt-4o-mini)
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using gpt-4o-mini as it's the latest mini model
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiResponse = completion.choices[0]?.message?.content || 'No response generated';

    // Return the AI response along with eligibility confirmation
    return NextResponse.json({
      eligible: true,
      aiResponse,
      patientData: {
        name: patientName,
        fullName: patientName,
        age,
        householdSize,
        monthlyIncome,
        reason,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error processing application:', error);
    
    // Handle OpenAI API errors
    if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key. Please check your configuration.' },
        { status: 500 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to process application', details: errorMessage },
      { status: 500 }
    );
  }
}


