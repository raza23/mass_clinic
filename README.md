# Healthcare Eligibility Checker

A modern, AI-powered eligibility checker for **Muslim American Social Services** non-profit healthcare clinic. This application helps potential patients determine if they qualify for free healthcare services and provides personalized guidance through OpenAI integration.

![Clinic Logo](public/clinic-logo.png)

## 🌟 Features

- ✅ **Multi-Step Eligibility Screening** - Validates age and income requirements
- ✅ **Income Threshold Validation** - Based on 200% Federal Poverty Level guidelines
- ✅ **AI-Powered Responses** - GPT-4o-mini provides personalized guidance
- ✅ **Separate Page Navigation** - Eligible patients navigate to dedicated page
- ✅ **Professional UI** - Dark blue branding (#0E1238) with gold accents
- ✅ **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- ✅ **Loading States** - Clear feedback during AI processing
- ✅ **Error Handling** - Graceful error messages and recovery
- ✅ **Confirmation Page** - Complete application summary with AI response
- ✅ **Print Option** - Patients can print their confirmation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Create `.env.local` file:**
```bash
OPENAI_API_KEY=sk-your-actual-key-here
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Open your browser:**
```
http://localhost:3000
```

📖 **Detailed setup instructions:** See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)

## 📋 Eligibility Requirements

### Age Requirement
- Must be **18 years or older**

### Income Requirements (200% FPL)

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

## 🎯 Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│  1. HOME PAGE (/)                                           │
│  • Collect: Name, Age, Household Size, Monthly Income       │
│  • Validate eligibility criteria                            │
└─────────────────────────────────────────────────────────────┘
                          ↓
                    [Eligible?]
                    ↙         ↘
              YES ↙             ↘ NO
                ↙                 ↘
┌─────────────────────────┐   ┌─────────────────────────┐
│  2A. INELIGIBLE         │   │  2B. ELIGIBLE PAGE      │
│  (Same Page)            │   │  (/eligible)            │
│  • Show reason          │   │  • Success message      │
│  • Start over option    │   │  • Collect medical      │
└─────────────────────────┘   │    reason               │
                              │  • Submit to AI         │
                              └─────────────────────────┘
                                        ↓
                              ┌─────────────────────────┐
                              │  3. CONFIRMATION        │
                              │  (/confirmation)        │
                              │  • AI response          │
                              │  • Application summary  │
                              │  • Next steps           │
                              │  • Print option         │
                              └─────────────────────────┘
```

## 🤖 AI Integration

The application uses **OpenAI's GPT-4o-mini** model to act as a clinic administrator:

### System Prompt
```
Play the role of an admin of a free healthcare clinic. The patient will 
provide you with their name and age as well as the total amount of people 
in their household, and their underlying issue. You will initially check 
if they're eligible based on their monthly income. Based on the clinic's 
guidelines you will determine if they are eligible. If they are eligible 
you will obtain more information about the patient and schedule them an 
appointment.
```

### What the AI Does
- Reviews patient information
- Acknowledges eligibility
- Provides personalized guidance based on medical concern
- Suggests next steps for scheduling
- Asks clarifying questions if needed

📖 **Full AI documentation:** See [OPENAI_INTEGRATION.md](OPENAI_INTEGRATION.md)

## 📁 Project Structure

```
mass_clinic/
├── app/
│   ├── api/
│   │   └── process-application/
│   │       └── route.ts              # OpenAI API integration
│   ├── components/
│   │   └── EligibilityChecker.tsx    # Main form component
│   ├── eligible/
│   │   └── page.tsx                  # Eligible patient page
│   ├── confirmation/
│   │   └── page.tsx                  # Confirmation page
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Home page
├── public/
│   └── clinic-logo.png               # Clinic logo
├── .env.local                        # Environment variables (create this)
├── .env.example                      # Environment template
├── package.json                      # Dependencies
└── Documentation files...
```

## 🎨 Design Specifications

### Color Palette
- **Primary Background**: `#0E1238` (Dark Navy Blue)
- **Accent Color**: `#D4AF37` (Gold)
- **Success**: `#10B981` (Green)
- **Error**: `#DC2626` (Red)

### Typography
- **Font Family**: Arial, Helvetica, sans-serif
- **Headings**: 3xl-4xl, bold
- **Body**: base-lg, regular

### Responsive Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

## 🧪 Testing

### Test Eligible Patient
```
Name: John Doe
Age: 35
Household Size: 4
Monthly Income: 3500
Reason: I have been experiencing persistent back pain...
```
**Expected**: ✅ Eligible → Navigate to `/eligible` → AI response on confirmation

### Test Ineligible Patient
```
Age: 17 (too young)
OR
Household Size: 1, Income: 3000 (income too high)
```
**Expected**: ❌ Ineligible message shown on same page

## 💰 Cost Estimation

Using GPT-4o-mini:
- **Per Application**: < $0.001 (less than 1/10th of a cent)
- **1,000 Applications**: ~$0.10 - $0.30
- **10,000 Applications**: ~$1.00 - $3.00

Perfect for non-profit budgets! 💚

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) | Quick setup guide |
| [OPENAI_INTEGRATION.md](OPENAI_INTEGRATION.md) | Complete AI integration docs |
| [APPLICATION_FLOW.md](APPLICATION_FLOW.md) | Detailed user journey |
| [FRONTEND_SETUP.md](FRONTEND_SETUP.md) | Frontend architecture |

## 🔒 Security

- ✅ API keys stored in environment variables
- ✅ `.env.local` excluded from version control
- ✅ API routes only (no client-side API calls)
- ✅ Input validation on all forms
- ✅ Error handling for failed requests

## 🌐 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android 10+)

## ♿ Accessibility

- ✅ Semantic HTML5
- ✅ Proper ARIA labels
- ✅ Keyboard navigation
- ✅ High contrast colors (WCAG AA)
- ✅ Screen reader friendly
- ✅ Focus visible states

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add `OPENAI_API_KEY` environment variable
4. Deploy!

[Deploy with Vercel](https://vercel.com/new)

### Environment Variables for Production

```env
OPENAI_API_KEY=sk-your-production-key
```

## 🔜 Future Enhancements

- [ ] Database integration (PostgreSQL/Supabase)
- [ ] Email notifications
- [ ] SMS confirmations
- [ ] Admin dashboard
- [ ] Multi-language support (Arabic, Spanish)
- [ ] Appointment scheduling
- [ ] Document upload (ID, proof of income)
- [ ] Medical triage categorization
- [ ] Voice input for medical concerns

## 🤝 Contributing

This is a non-profit healthcare project. Contributions are welcome!

## 📄 License

This project is created for Muslim American Social Services.

## 🙏 Acknowledgments

- **Muslim American Social Services** - For their mission to provide free healthcare
- **OpenAI** - For GPT-4o-mini API
- **Next.js** - For the amazing framework
- **Tailwind CSS** - For beautiful styling

## 📞 Support

For questions or issues:
1. Check the documentation files
2. Review error messages in browser console
3. Verify OpenAI API key is configured correctly
4. Ensure development server is running

---

Built with ❤️ for Muslim American Social Services

**Providing compassionate healthcare to those in need**
