# ✨ Webstax - Modern Website Builder

Build stunning websites in minutes, not hours. Webstax is a friendly, intuitive drag-and-drop website builder that makes creating beautiful, professional websites a joy.

![Webstax Preview](https://via.placeholder.com/1200x600/8b5cf6/ffffff?text=Webstax+Website+Builder)

## 🚀 Features

- 🎨 **Drag & Drop Builder** - Simply drag blocks and watch your website come to life
- 📱 **Mobile Friendly** - Every site looks perfect on phones, tablets, and desktops
- 🌈 **Beautiful Templates** - 10+ professionally designed starter templates
- ✨ **Modern Animations** - Smooth, delightful animations powered by Framer Motion
- 🎯 **Live Preview** - See your changes instantly as you design
- 💾 **Auto-save** - Your work is always safe
- 🎭 **Dark/Light Mode** - Design in the mode you love
- 🚀 **One-Click Export** - Export to HTML, React, or deploy instantly

## 🎨 Starter Templates

| Template | Description |
|----------|-------------|
| 🎯 **Minimal Portfolio** | Clean design for creatives |
| 🎨 **Creative Portfolio** | Bold and colorful for artists |
| 💼 **SaaS Landing** | Modern landing page for software products |
| 🧑‍💻 **Developer** | Clean portfolio for software developers |
| 🍴 **Restaurant** | Elegant template for restaurants and cafes |
| 🏢 **Agency** | Bold template for creative agencies |
| 📝 **Personal Blog** | Warm and inviting personal website |
| 💼 **Professional** | Clean design for business professionals |
| 🧑‍🎨 **Freelancer** | Personal brand for freelancers |
| ⬜ **Blank Canvas** | Start from scratch |

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **UI Components**: Radix UI
- **Drag & Drop**: dnd-kit
- **Icons**: Lucide React

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/webstax.git

# Navigate to the project
cd webstax

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start building! 🎉

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── builder/           # The website builder
│   ├── templates/         # Template gallery
│   └── page.tsx           # Landing page
├── components/
│   ├── builder/           # Builder components (toolbar, panels, etc.)
│   ├── layout/            # Header, Footer
│   ├── preview/           # Live preview components
│   │   └── blocks/        # All block types (Hero, Features, etc.)
│   ├── templates/         # Template selection UI
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/
│   ├── constants/         # Block definitions, presets, themes
│   ├── templates/         # Starter template configurations
│   └── utils/             # Helper functions, export utilities
├── stores/                # Zustand state management
└── types/                 # TypeScript types
```

## 🧱 Available Blocks

| Block | Description |
|-------|-------------|
| 🦸 **Hero** | Eye-catching banner with headline, subtext & CTA |
| 👤 **About** | Introduction with optional image |
| ✨ **Features** | Grid of feature cards with icons |
| 📊 **Stats** | Animated number counters |
| 💬 **Testimonials** | Customer quotes carousel |
| 💳 **Pricing** | Pricing tables with comparison |
| ❓ **FAQ** | Accordion-style Q&A |
| 📞 **Contact** | Contact form |
| 🎯 **CTA** | Call-to-action section |
| 📝 **Text** | Rich text content |
| 🖼 **Gallery** | Image grid |
| 🎬 **Video** | YouTube/Vimeo embed |
| 🔗 **Social Links** | Social media icons |
| 📈 **Skills** | Progress bars |
| 📅 **Experience** | Timeline layout |
| 💼 **Projects** | Portfolio showcase |
| 🗺 **Map** | Google Maps embed |
| 📰 **Blog** | Blog post grid |
| 🧭 **Navigation** | Header navigation |
| 📄 **Footer** | Site footer |

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repo to [Vercel](https://vercel.com)
3. Deploy! ✨

### Export Options

- **HTML/CSS** - Static export for any hosting
- **React** - Export as a React component
- **Tailwind** - Export with Tailwind CSS classes

## 🤝 Contributing

We love contributions! Feel free to:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this for personal or commercial projects!

---

<p align="center">
  Made with ❤️ by the Webstax team
  <br />
  <a href="#features">Features</a> • <a href="#getting-started">Get Started</a> • <a href="#templates">Templates</a>
</p>
