# WebBuilder - Personal Website Builder

A beautiful, iOS-inspired website builder that lets anyone create stunning personal websites without any coding knowledge.

## Features

- 🎨 **Drag & Drop Builder** - Easily arrange and customize blocks
- 📱 **Mobile Friendly** - Responsive design that works on all devices
- 🌙 **Dark/Light Mode** - Beautiful themes with smooth transitions
- 🎯 **Templates** - Pre-designed templates to get you started
- ⚡ **Real-time Preview** - See changes as you make them
- 💾 **Auto-save** - Never lose your work
- 🚀 **Export Ready** - Deploy to Vercel with one click

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **UI Components**: Radix UI
- **Drag & Drop**: dnd-kit
- **Database**: Supabase (for production)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
cd claude45
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── builder/           # Website builder page
│   ├── templates/         # Template gallery page
│   └── page.tsx           # Landing page
├── components/
│   ├── builder/           # Builder-specific components
│   ├── layout/            # Header, Footer components
│   ├── preview/           # Website preview components
│   │   └── blocks/        # Individual block renderers
│   ├── templates/         # Template selection components
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/
│   ├── constants/         # App constants and block definitions
│   ├── templates/         # Template configurations
│   └── utils/             # Utility functions
├── stores/                # Zustand state stores
└── types/                 # TypeScript type definitions
```

## Available Blocks

- **Hero** - Large banner with headline and CTA
- **About** - Introduction section with text and image
- **Features** - Grid of feature cards
- **Gallery** - Image gallery grid
- **Testimonials** - Customer quotes
- **Contact** - Contact form
- **CTA** - Call to action section
- **Text** - Simple text block
- **Image** - Single image with caption
- **Video** - YouTube/Vimeo embed
- **Spacer** - Vertical spacing
- **Divider** - Horizontal line
- **Social Links** - Social media icons
- **Skills** - Progress bars
- **Experience** - Timeline
- **Projects** - Portfolio showcase

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

### Supabase Setup (for persistence)

1. Create a Supabase project
2. Add your Supabase URL and anon key to `.env.local`
3. Run the database migrations (coming soon)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this for your own projects!

---

Built with ❤️ using Next.js and Tailwind CSS
