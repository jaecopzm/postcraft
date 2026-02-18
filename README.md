# PostCraft - AI Social Media Content Creator

Generate platform-perfect content for Twitter, LinkedIn, Instagram, Facebook, TikTok, and YouTube in seconds.

## 🚀 Features

- **AI Content Generation**: Create engaging posts tailored for each platform
- **Multi-Platform Support**: 6 major social platforms with 3 variations each
- **Content Calendar**: Visual planning and scheduling
- **Brand Voice**: Custom tone and style presets
- **Content Library**: Organize with folders, tags, and search
- **AI Tools**: Hashtag generator, emoji suggestions, CTA optimizer
- **Export Options**: CSV, PDF, and copy-paste formats
- **Analytics Dashboard**: Track your content performance
- **Pro Features**: Unlimited generations, 10 variations, advanced tools

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **AI**: Google Gemini 2.0 Flash
- **Payments**: Stripe

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/postcraft.git
cd postcraft

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

Required variables in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
GEMINI_API_KEY=
STRIPE_SECRET_KEY=
```

See `.env.example` for complete list.

## 🚢 Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

### Docker
```bash
docker build -t postcraft .
docker run -p 3000:3000 postcraft
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🎨 Project Structure

```
postcraft/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Main dashboard
│   ├── calendar/          # Content calendar
│   ├── library/           # Content library
│   ├── ai-tools/          # AI enhancements
│   ├── brand-voice/       # Brand voice manager
│   └── export/            # Export tools
├── components/            # Reusable components
├── lib/                   # Utilities and helpers
└── public/               # Static assets
```

## 🔐 Security

- HTTPS enforced in production
- Rate limiting on API routes
- Input sanitization
- CORS configuration
- Security headers configured

## 📊 Performance

- Lighthouse score: 90+
- Code splitting enabled
- Image optimization
- Font optimization
- Lazy loading

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

## 📄 License

MIT License - see [LICENSE](./LICENSE)

## 🆘 Support

- Documentation: [docs.postcraft.app](https://docs.postcraft.app)
- Email: support@postcraft.app
- Discord: [Join our community](https://discord.gg/postcraft)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- OpenAI for GPT-4 API
- Vercel for hosting
- All contributors

---

Made with ❤️ by the PostCraft team
