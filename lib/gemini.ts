import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateContent(
  topic: string,
  platform: string,
  tone: string,
  variationCount: number = 3
): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

  const platformLimits: Record<string, { limit: number; style: string }> = {
    twitter: { limit: 280, style: 'concise, engaging, with hashtags' },
    linkedin: { limit: 3000, style: 'professional, detailed, thought-leadership' },
    instagram: { limit: 2200, style: 'visual, engaging, with emojis and hashtags' },
    facebook: { limit: 63206, style: 'conversational, community-focused' },
    tiktok: { limit: 2200, style: 'trendy, energetic, with hashtags' },
    youtube: { limit: 5000, style: 'descriptive, SEO-optimized' }
  };

  const platformInfo = platformLimits[platform] || platformLimits.twitter;

  const prompt = `Generate ${variationCount} unique variations of social media content for ${platform}.

Topic: ${topic}
Tone: ${tone}
Character limit: ${platformInfo.limit}
Style: ${platformInfo.style}

Requirements:
- Each variation should be distinct and creative
- Stay within character limit
- Match the ${tone} tone
- Follow ${platform} best practices
- Include relevant hashtags where appropriate
- Use emojis if suitable for the platform

Return ONLY the ${variationCount} variations, separated by "---" (three dashes on a new line).
Do not include numbering, labels, or any other text.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Split by separator and clean up
    const variations = text
      .split('---')
      .map(v => v.trim())
      .filter(v => v.length > 0)
      .slice(0, variationCount);

    return variations;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate content');
  }
}

export async function generateHashtags(topic: string, count: number = 10): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

  const prompt = `Generate ${count} relevant and trending hashtags for the topic: "${topic}"

Requirements:
- Mix of popular and niche hashtags
- Relevant to the topic
- No spaces in hashtags
- Include # symbol

Return ONLY the hashtags, one per line, nothing else.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text
      .split('\n')
      .map(h => h.trim())
      .filter(h => h.startsWith('#'))
      .slice(0, count);
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate hashtags');
  }
}

export async function generateCTA(context: string): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

  const prompt = `Generate 8 engaging call-to-action phrases for social media based on: "${context}"

Requirements:
- Short and actionable
- Include relevant emojis
- Encourage engagement (likes, comments, shares, follows)
- Varied approaches

Return ONLY the CTAs, one per line, nothing else.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text
      .split('\n')
      .map(c => c.trim())
      .filter(c => c.length > 0)
      .slice(0, 8);
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate CTAs');
  }
}
export async function analyzeAura(sampleContent: string): Promise<{
  tone: string;
  keywords: string[];
  style: string;
}> {
  const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

  const prompt = `Analyze the stylistic DNA of the following content samples to create a "Brand Aura" profile.
  
  Content Samples:
  "${sampleContent}"
  
  Extract and define the following attributes:
  1. TONE: Choose the closest match from [professional, casual, enthusiastic, informative].
  2. KEYWORDS: Extract 5-8 recurring or signature keywords or themes.
  3. STYLE: A brief (2-sentence) description of the unique linguistic style, rhythm, and structural nuances.
  
  Return the result in JSON format with NO OTHER TEXT:
  {
    "tone": "professional | casual | enthusiastic | informative",
    "keywords": ["...", "..."],
    "style": "..."
  }`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Attempt to parse JSON
    const cleanJson = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Gemini Aura Analysis error:', error);
    throw new Error('Failed to analyze Aura');
  }
}
