export interface Platform {
  id: string;
  name: string;
  characterLimit: number;
  imageSpecs: {
    width: number;
    height: number;
    aspectRatio: string;
  };
  toneGuidelines: string[];
  hashtagLimit?: number;
}

export const platforms: Platform[] = [
  {
    id: 'twitter',
    name: 'Twitter/X',
    characterLimit: 280,
    imageSpecs: { width: 1200, height: 675, aspectRatio: '16:9' },
    toneGuidelines: ['Concise', 'Engaging', 'Use hashtags', 'Include emojis'],
    hashtagLimit: 2
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    characterLimit: 3000,
    imageSpecs: { width: 1200, height: 627, aspectRatio: '1.91:1' },
    toneGuidelines: ['Professional', 'Thought leadership', 'Industry insights', 'Value-driven']
  },
  {
    id: 'instagram',
    name: 'Instagram',
    characterLimit: 2200,
    imageSpecs: { width: 1080, height: 1080, aspectRatio: '1:1' },
    toneGuidelines: ['Visual-first', 'Story-driven', 'Use hashtags', 'Authentic'],
    hashtagLimit: 30
  },
  {
    id: 'facebook',
    name: 'Facebook',
    characterLimit: 63206,
    imageSpecs: { width: 1200, height: 630, aspectRatio: '1.91:1' },
    toneGuidelines: ['Community-focused', 'Conversational', 'Encourage engagement']
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    characterLimit: 150,
    imageSpecs: { width: 1080, height: 1920, aspectRatio: '9:16' },
    toneGuidelines: ['Trendy', 'Entertaining', 'Use trending sounds', 'Short and punchy']
  },
  {
    id: 'youtube',
    name: 'YouTube',
    characterLimit: 100,
    imageSpecs: { width: 1280, height: 720, aspectRatio: '16:9' },
    toneGuidelines: ['Descriptive', 'SEO-optimized', 'Clear value proposition']
  }
];
