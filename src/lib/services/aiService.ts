// AI Service using Gemini API for content generation

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyDIcmSJNqyuYEEZMYgFsKCaVVEBi357Fzs';
const GEMINI_MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-2.0-flash-lite';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export interface AIGenerationOptions {
  type: 'headline' | 'subheadline' | 'description' | 'features' | 'testimonial' | 'faq' | 'cta' | 'about' | 'full-section';
  context?: string;
  industry?: string;
  tone?: 'professional' | 'casual' | 'playful' | 'formal' | 'creative';
  length?: 'short' | 'medium' | 'long';
  existingContent?: string;
}

export interface AIGenerationResult {
  success: boolean;
  content: string | Record<string, unknown>;
  error?: string;
}

const prompts: Record<AIGenerationOptions['type'], (options: AIGenerationOptions) => string> = {
  headline: (options) => `Generate a compelling, attention-grabbing headline for a ${options.industry || 'business'} website. 
Tone: ${options.tone || 'professional'}
Length: ${options.length === 'short' ? '3-6 words' : options.length === 'long' ? '10-15 words' : '6-10 words'}
${options.context ? `Context: ${options.context}` : ''}
${options.existingContent ? `Improve this headline: ${options.existingContent}` : ''}
Return ONLY the headline text, nothing else.`,

  subheadline: (options) => `Generate a supporting subheadline for a ${options.industry || 'business'} website.
Tone: ${options.tone || 'professional'}
${options.context ? `Context: ${options.context}` : ''}
${options.existingContent ? `Main headline: ${options.existingContent}` : ''}
The subheadline should complement the main message and be 15-25 words.
Return ONLY the subheadline text, nothing else.`,

  description: (options) => `Write a compelling description for a ${options.industry || 'business'} website section.
Tone: ${options.tone || 'professional'}
Length: ${options.length === 'short' ? '50-75 words' : options.length === 'long' ? '150-200 words' : '100-125 words'}
${options.context ? `Context: ${options.context}` : ''}
${options.existingContent ? `Improve/expand this: ${options.existingContent}` : ''}
Return ONLY the description text, nothing else.`,

  features: (options) => `Generate 3 compelling feature/service items for a ${options.industry || 'business'} website.
Tone: ${options.tone || 'professional'}
${options.context ? `Context: ${options.context}` : ''}
Return as JSON array with format: [{"icon": "icon-name", "title": "Feature Title", "description": "Brief description"}]
Use icon names from: Palette, Code, Rocket, Shield, Zap, Heart, Star, Target, Users, Globe, Award, Clock`,

  testimonial: (options) => `Generate a realistic customer testimonial for a ${options.industry || 'business'}.
Tone: ${options.tone || 'professional'}
${options.context ? `Context: ${options.context}` : ''}
Return as JSON: {"quote": "testimonial text", "author": "Name", "role": "Job Title, Company"}`,

  faq: (options) => `Generate 3 frequently asked questions and answers for a ${options.industry || 'business'} website.
${options.context ? `Context: ${options.context}` : ''}
Return as JSON array: [{"question": "Q?", "answer": "A"}]`,

  cta: (options) => `Generate a compelling call-to-action for a ${options.industry || 'business'} website.
Tone: ${options.tone || 'professional'}
${options.context ? `Context: ${options.context}` : ''}
Return as JSON: {"headline": "CTA headline", "description": "Supporting text", "buttonText": "Button label"}`,

  about: (options) => `Write an "About" section for a ${options.industry || 'business'} website.
Tone: ${options.tone || 'professional'}
Length: ${options.length === 'short' ? '75-100 words' : options.length === 'long' ? '200-250 words' : '125-175 words'}
${options.context ? `Context: ${options.context}` : ''}
Return as JSON: {"title": "About Title", "description": "About description text"}`,

  'full-section': (options) => `Generate content for a website section.
Type: ${options.context || 'hero'}
Industry: ${options.industry || 'business'}
Tone: ${options.tone || 'professional'}
Return appropriate JSON content based on the section type.`,
};

export async function generateAIContent(options: AIGenerationOptions): Promise<AIGenerationResult> {
  try {
    const prompt = prompts[options.type](options);
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Try to parse JSON if expected
    if (['features', 'testimonial', 'faq', 'cta', 'about', 'full-section'].includes(options.type)) {
      try {
        // Extract JSON from response (handle markdown code blocks)
        const jsonMatch = generatedText.match(/```(?:json)?\s*([\s\S]*?)```/) || 
                          generatedText.match(/\[[\s\S]*\]/) ||
                          generatedText.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]).trim() : generatedText;
        const parsed = JSON.parse(jsonStr);
        return { success: true, content: parsed };
      } catch {
        // Return as string if JSON parsing fails
        return { success: true, content: generatedText.trim() };
      }
    }

    return { success: true, content: generatedText.trim() };
  } catch (error) {
    console.error('AI generation error:', error);
    return {
      success: false,
      content: '',
      error: error instanceof Error ? error.message : 'Failed to generate content',
    };
  }
}

export async function improveContent(content: string, instruction: string): Promise<AIGenerationResult> {
  try {
    const prompt = `Improve the following content based on the instruction.
Content: "${content}"
Instruction: ${instruction}
Return ONLY the improved content, nothing else.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    return { success: true, content: generatedText.trim() };
  } catch (error) {
    console.error('AI improvement error:', error);
    return {
      success: false,
      content: '',
      error: error instanceof Error ? error.message : 'Failed to improve content',
    };
  }
}

export async function suggestImages(query: string, count: number = 6): Promise<string[]> {
  // Using Unsplash Source for placeholder images
  const baseUrl = 'https://source.unsplash.com/800x600/?';
  const keywords = query.split(' ').slice(0, 3).join(',');
  
  return Array.from({ length: count }, (_, i) => 
    `${baseUrl}${encodeURIComponent(keywords)}&sig=${Date.now() + i}`
  );
}

// Preset content suggestions by industry
export const industryPresets: Record<string, { headlines: string[]; descriptions: string[]; features: Array<{ icon: string; title: string; description: string }> }> = {
  technology: {
    headlines: [
      'Build the Future Today',
      'Innovation Starts Here',
      'Transform Your Digital Experience',
    ],
    descriptions: [
      'We craft cutting-edge solutions that drive business growth and digital transformation.',
      'Empowering businesses with technology that scales and performs.',
    ],
    features: [
      { icon: 'Code', title: 'Custom Development', description: 'Tailored solutions built for your needs' },
      { icon: 'Shield', title: 'Secure & Reliable', description: 'Enterprise-grade security built in' },
      { icon: 'Zap', title: 'Lightning Fast', description: 'Optimized for speed and performance' },
    ],
  },
  creative: {
    headlines: [
      'Where Creativity Meets Strategy',
      'Design That Speaks Volumes',
      'Bringing Ideas to Life',
    ],
    descriptions: [
      'We create memorable brand experiences that connect and inspire.',
      'Award-winning design studio focused on impactful visual storytelling.',
    ],
    features: [
      { icon: 'Palette', title: 'Brand Identity', description: 'Distinctive visual identities that stand out' },
      { icon: 'Target', title: 'Strategic Design', description: 'Design with purpose and intention' },
      { icon: 'Star', title: 'Award-Winning', description: 'Recognized for creative excellence' },
    ],
  },
  business: {
    headlines: [
      'Grow Your Business Today',
      'Success Starts Here',
      'Your Partner in Growth',
    ],
    descriptions: [
      'Professional solutions that help businesses thrive in competitive markets.',
      'Trusted by industry leaders to deliver results that matter.',
    ],
    features: [
      { icon: 'Target', title: 'Results-Driven', description: 'Focused on measurable outcomes' },
      { icon: 'Users', title: 'Expert Team', description: 'Industry professionals at your service' },
      { icon: 'Award', title: 'Proven Track Record', description: 'Years of successful partnerships' },
    ],
  },
  personal: {
    headlines: [
      'Hi, I\'m [Your Name]',
      'Creative Developer & Designer',
      'Building Digital Experiences',
    ],
    descriptions: [
      'Passionate about creating beautiful, functional websites and applications.',
      'Helping brands tell their story through thoughtful design and development.',
    ],
    features: [
      { icon: 'Code', title: 'Development', description: 'Clean, efficient code that works' },
      { icon: 'Palette', title: 'Design', description: 'User-focused, beautiful interfaces' },
      { icon: 'Heart', title: 'Passion', description: 'Love for craft in every project' },
    ],
  },
};
