import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialise Gemini client
// If API key is missing, log a warning but don't crash the server
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const MODEL_NAME = 'gemini-3.5-flash-lite';

export const generateDescription = async (req, res) => {
  try {
    // 1. Extract fields from request body
    const { expense_title, expense_category, department, amount } = req.body;

    // 2. Validate required fields
    if (!expense_title || !department || !amount) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'expense_title, department, and amount are required'
        }
      });
    }

    // 3. Check AI client is initialised
    if (!genAI) {
      return res.status(503).json({
        success: false,
        error: {
          message: 'AI service is not configured. Set GEMINI_API_KEY in .env'
        }
      });
    }

    // 4. Build the prompt
    const category = expense_category || 'General';
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);

    const prompt = `
You are a corporate expense management assistant for an Indian company.
Write a professional 2-3 sentence business justification for an expense
reimbursement voucher. Be specific, formal, and concise.

Rules:
- Use formal business English
- Do NOT fabricate specific names, dates, meeting details, or locations
  that were not provided
- Do NOT use bullet points or headers
- Output plain paragraph text only
- Keep it between 40-80 words

Expense details:
  Title    : ${expense_title}
  Category : ${category}
  Department: ${department}
  Amount   : ${formattedAmount}

Write the justification now:
`.trim();

    // 5. Call Gemini API
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    const description = result.response.text().trim();

    // 6. Return generated description
    return res.status(200).json({
      success: true,
      data: { description }
    });

  } catch (error) {
    // Graceful failure — AI errors must never crash the main app
    console.error('[AI] generateDescription error:', error.message);
    return res.status(500).json({
      success: false,
      error: {
        message: 'AI description generation failed. Please write manually.'
      }
    });
  }
};
