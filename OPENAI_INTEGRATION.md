# OpenAI Integration Guide

## Overview

The healthcare eligibility checker now integrates with OpenAI's GPT-4o-mini model to provide intelligent, personalized responses to patient applications. The AI acts as a clinic administrator, reviewing patient information and providing guidance on next steps.

## Setup Instructions

### 1. Install Dependencies

The OpenAI SDK has already been installed:

```bash
npm install openai
```

### 2. Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Navigate to "API Keys" section
4. Click "Create new secret key"
5. Copy the generated key (it starts with `sk-`)

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# In the mass_clinic directory
touch .env.local
```

Add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
```

**Important**: 
- Never commit `.env.local` to version control
- The `.gitignore` file is already configured to exclude it
- Use `.env.example` as a template for other developers

### 4. Restart the Development Server

After adding the API key, restart the server:

```bash
npm run dev
```

## How It Works

### System Prompt

The AI is given a comprehensive system prompt that includes:

```
Play the role of an admin of a free healthcare clinic. The patient will provide you 
with their name and age as well as the total amount of people in their household 
(under the age of 18), and their underlying issue. You will initially check if 
they're eligible based on their monthly income. Based on the clinic's guidelines 
you will determine if they are eligible. If they are eligible you will obtain more 
information about the patient and schedule them an appointment.
```

### Patient Data Injection

The system prompt is dynamically populated with:
- **Patient Name**: `{{name}}`
- **Age**: `{{age}}`
- **Household Size**: `{{total}}` (number of people in household)
- **Monthly Income**: `{{monthly_income}}`
- **Income Threshold**: Calculated based on household size
- **Eligibility Status**: Pre-confirmed as ELIGIBLE
- **Medical Issue**: `{{issue}}` (patient's reason for seeking care)

### API Flow

```
User fills form → Submits application → API Route → OpenAI API → AI Response → Confirmation Page
```

#### Detailed Flow:

1. **Patient fills out form** on `/eligible` page
   - Name, age, household size, monthly income already collected
   - Patient enters detailed reason for seeking healthcare

2. **Form submission** triggers API call
   - POST request to `/api/process-application`
   - Shows loading spinner during processing

3. **API Route processes request** (`/app/api/process-application/route.ts`)
   - Validates all required fields
   - Double-checks eligibility criteria
   - Constructs system prompt with patient data
   - Calls OpenAI API with GPT-4o-mini

4. **OpenAI generates response**
   - AI reviews patient information
   - Provides personalized guidance
   - Suggests next steps
   - May ask clarifying questions

5. **Response stored and displayed**
   - AI response saved to sessionStorage
   - User redirected to confirmation page
   - AI message displayed in special section

## API Endpoint

### POST `/api/process-application`

**Request Body:**
```json
{
  "name": "John Doe",
  "age": "35",
  "householdSize": "4",
  "monthlyIncome": "3500",
  "reason": "I have been experiencing severe chest pain..."
}
```

**Success Response (200):**
```json
{
  "eligible": true,
  "aiResponse": "Thank you, John. I've reviewed your application...",
  "patientData": {
    "name": "John Doe",
    "age": "35",
    "householdSize": "4",
    "monthlyIncome": "3500",
    "reason": "I have been experiencing severe chest pain..."
  },
  "timestamp": "2025-01-07T12:00:00.000Z"
}
```

**Error Response (400/500):**
```json
{
  "error": "Missing required fields",
  "details": "Additional error information"
}
```

## Model Configuration

### Current Settings

```typescript
model: 'gpt-4o-mini'
temperature: 0.7
max_tokens: 1000
```

### Model Details

- **Model**: `gpt-4o-mini` (Note: "gpt-4.1-mini" doesn't exist; using the latest mini model)
- **Temperature**: `0.7` - Balanced between creativity and consistency
- **Max Tokens**: `1000` - Sufficient for detailed responses
- **Cost**: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens

### Alternative Models

You can change the model in `/app/api/process-application/route.ts`:

```typescript
// For more advanced responses (higher cost)
model: 'gpt-4o'

// For faster, cheaper responses
model: 'gpt-3.5-turbo'

// Current (recommended for balance)
model: 'gpt-4o-mini'
```

## User Experience

### Loading State

When submitting the application:
- Submit button shows loading spinner
- Button text changes to "Processing..."
- Button is disabled to prevent double-submission

### Error Handling

If something goes wrong:
- Red error banner appears above the form
- Clear error message displayed
- User can retry submission
- Submit button re-enabled

### Success State

On successful submission:
- User redirected to confirmation page
- AI response displayed in blue box with icon
- Full application summary shown
- Next steps and contact information provided

## Example AI Responses

### Example 1: Routine Medical Issue

**Patient Input:**
```
I need a general checkup and have been experiencing mild headaches 
for the past few weeks.
```

**AI Response:**
```
Thank you for your application, [Name]. I'm glad to confirm that you 
are eligible for our free healthcare services.

Based on your description of experiencing mild headaches for the past 
few weeks, I'd like to schedule you for a comprehensive general checkup 
with one of our primary care physicians. During this appointment, we'll:

1. Conduct a thorough physical examination
2. Review your medical history
3. Discuss your headache symptoms in detail
4. Determine if any additional tests are needed

Please bring the following to your appointment:
- Valid government-issued ID
- Proof of income (recent pay stubs or tax documents)
- List of any current medications
- Any previous medical records if available

We'll contact you within 2-3 business days to schedule your appointment. 
If your symptoms worsen before then, please don't hesitate to call us 
immediately.

Welcome to Muslim American Social Services!
```

### Example 2: Urgent Medical Concern

**Patient Input:**
```
I've been experiencing severe chest pain and shortness of breath 
for the past 3 days. I'm very worried.
```

**AI Response:**
```
Thank you for reaching out, [Name]. Your application has been received 
and you are eligible for our services.

I'm concerned about the symptoms you've described - severe chest pain 
and shortness of breath are serious symptoms that require immediate 
medical attention. 

IMPORTANT: If you are currently experiencing these symptoms, please:
1. Call 911 immediately, or
2. Go to the nearest emergency room right away

Do not wait for our appointment. These symptoms could indicate a serious 
cardiac or respiratory condition that needs urgent evaluation.

Once you've received emergency care, please contact our clinic at 
[phone number] so we can coordinate your follow-up care and ensure 
continuity of treatment. We're here to support you through your 
healthcare journey.

Your health and safety are our top priority.
```

## Security Considerations

### API Key Protection

✅ **DO:**
- Store API key in `.env.local`
- Add `.env.local` to `.gitignore`
- Use environment variables in API routes only
- Never expose API key in client-side code

❌ **DON'T:**
- Commit API keys to Git
- Share API keys in screenshots or documentation
- Use API keys directly in client components
- Store API keys in public repositories

### Rate Limiting

Consider implementing rate limiting to prevent abuse:

```typescript
// Future enhancement: Add rate limiting
// Example: Max 10 requests per IP per hour
```

### Input Validation

The API validates:
- ✅ All required fields present
- ✅ Eligibility criteria met
- ✅ Reasonable data values

Future enhancements:
- Sanitize user input
- Check for malicious content
- Implement CAPTCHA for bot prevention

## Cost Estimation

### GPT-4o-mini Pricing (as of Jan 2025)

- **Input**: ~$0.15 per 1M tokens
- **Output**: ~$0.60 per 1M tokens

### Per Application Cost

Approximate token usage per application:
- System prompt: ~200 tokens
- User message: ~100-300 tokens (varies by reason length)
- AI response: ~200-500 tokens

**Estimated cost per application**: $0.0001 - $0.0003 (less than 1 cent)

### Monthly Cost Projection

| Applications/Month | Estimated Cost |
|-------------------|----------------|
| 100               | $0.01 - $0.03  |
| 1,000             | $0.10 - $0.30  |
| 10,000            | $1.00 - $3.00  |
| 100,000           | $10 - $30      |

## Troubleshooting

### Error: "Invalid OpenAI API key"

**Solution:**
1. Check that `.env.local` exists in the project root
2. Verify API key is correct (starts with `sk-`)
3. Ensure no extra spaces or quotes around the key
4. Restart the development server

### Error: "Failed to process application"

**Possible causes:**
1. No internet connection
2. OpenAI API is down
3. Rate limit exceeded
4. Invalid request format

**Solution:**
- Check console for detailed error message
- Verify internet connection
- Check [OpenAI Status Page](https://status.openai.com/)
- Review API usage limits in OpenAI dashboard

### AI Response Not Showing

**Check:**
1. Is `aiResponse` in sessionStorage?
2. Check browser console for errors
3. Verify API call completed successfully
4. Check network tab for API response

## Testing

### Test Cases

1. **Valid Application**
   - Fill out all fields correctly
   - Submit and verify AI response appears
   - Check response is relevant to patient's issue

2. **Error Handling**
   - Submit without API key (should show error)
   - Submit with invalid data
   - Test network failure scenario

3. **Edge Cases**
   - Very long reason text (>1000 characters)
   - Special characters in input
   - Multiple rapid submissions

### Manual Testing Steps

1. Start development server
2. Navigate to homepage
3. Fill out eligibility form with valid data
4. Proceed to eligible page
5. Enter detailed medical reason
6. Submit application
7. Verify:
   - Loading spinner appears
   - No errors shown
   - Redirected to confirmation page
   - AI response displays correctly
   - Response is relevant and helpful

## Future Enhancements

### Planned Features

- [ ] **Conversation History**: Allow patients to ask follow-up questions
- [ ] **Multi-language Support**: Translate AI responses to Arabic, Spanish
- [ ] **Appointment Scheduling**: Direct integration with calendar system
- [ ] **Medical Triage**: AI categorizes urgency level (routine, urgent, emergency)
- [ ] **Document Analysis**: Upload medical records for AI review
- [ ] **SMS Notifications**: Send AI response via text message
- [ ] **Voice Input**: Allow patients to speak their medical concerns
- [ ] **Admin Dashboard**: View all AI responses and patient interactions

### Advanced Prompt Engineering

Consider enhancing the system prompt with:
- Medical knowledge base integration
- Clinic-specific policies and procedures
- Available services and specialties
- Appointment availability
- Insurance and billing information

## Support

For issues or questions:
- Check this documentation first
- Review [OpenAI API Documentation](https://platform.openai.com/docs)
- Contact development team
- Check application logs for detailed error messages

## Changelog

### v1.0.0 (Jan 7, 2025)
- ✅ Initial OpenAI integration
- ✅ GPT-4o-mini model implementation
- ✅ System prompt with patient data injection
- ✅ API route for application processing
- ✅ Loading states and error handling
- ✅ AI response display on confirmation page
- ✅ Environment variable configuration


