import { NextResponse } from 'next/server';
import { analyzeBriefIdeaLocally } from '@/lib/ai-service';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are the CREOVANTA AI Creative Brief Copilot. Analyze this brand campaign idea and return a JSON object with:
                      - suggestedTitle (string)
                      - refinedObjective (string)
                      - creativeConcept (string)
                      - recommendedStyles (array of strings)
                      - recommendedContentTypes (array of strings)
                      - recommendedTools (array of strings)
                      - suggestedBudget: { min: number, max: number }
                      - suggestedDeadlineDays: number
                      - missingInformation: array of strings
                      - conflictingRequirements: array of strings
                      - clarifyingQuestions: array of strings

                      Input prompt: "${prompt}"
                      Return strictly valid JSON without markdown wrapping.`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const cleanText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanText);
            return NextResponse.json({
              engineUsed: 'Gemini Generative API',
              ...parsed,
            });
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to deterministic engine', err);
      }
    }

    // High quality deterministic fallback
    const localResult = analyzeBriefIdeaLocally(prompt);
    return NextResponse.json(localResult);
  } catch (error) {
    console.error('Copilot API error:', error);
    return NextResponse.json(
      { error: 'Failed to process brief idea' },
      { status: 500 }
    );
  }
}
