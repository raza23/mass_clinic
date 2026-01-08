# 🚀 Quick Start Guide

## Get Running in 2 Minutes!

### Step 1: Add Your OpenAI API Key

Edit the `.env.local` file and replace the placeholder:

```env
OPENAI_API_KEY=sk-your-actual-key-here
```

👉 Get your key at: https://platform.openai.com/api-keys

### Step 2: Start the Server

```bash
npm run dev
```

### Step 3: Open Your Browser

```
http://localhost:3000
```

## 🧪 Test It Out!

### Test Eligible Patient

Fill out the form with:
- **Name**: John Doe
- **Age**: 35
- **Household Size**: 4
- **Monthly Income**: 3500

Then on the next page, enter:
- **Reason**: "I have been experiencing persistent back pain for two months. The pain is worse in the morning and after sitting for long periods."

**Expected Result**: 
✅ You'll be taken to a new page → Submit → See AI response on confirmation page!

### Test Ineligible Patient

Fill out the form with:
- **Age**: 17 (too young)

**Expected Result**: 
❌ Ineligible message shown on the same page

## 📖 Need More Help?

- **Setup Issues?** → See `SETUP_INSTRUCTIONS.md`
- **How does AI work?** → See `OPENAI_INTEGRATION.md`
- **Want to understand the flow?** → See `APPLICATION_FLOW.md`
- **Full documentation?** → See `README.md`

## ✅ What You Built

- ✅ Multi-page eligibility checker
- ✅ AI-powered responses (GPT-4o-mini)
- ✅ Beautiful UI with clinic branding
- ✅ Mobile-responsive design
- ✅ Professional confirmation page

## 💰 Cost

Each application costs **less than $0.001** (less than 1/10th of a cent)!

## 🎉 You're Ready!

Start helping patients access free healthcare! 💚

---

**Questions?** Check the documentation files or review the error messages in the browser console (F12).

