# B2B Subscription Calculator

A production-ready B2B subscription calculator built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- **Tier-based Pricing**: Three subscription tiers with different pricing levels
- **Volume Discounts**: Automatic discounts based on total seat count (25%-75% off)
- **Pay-as-you-go Courses**: Additional course purchases with tier-based discounts
- **Real-time Calculations**: Instant price updates as you configure
- **Full TypeScript**: Complete type safety throughout
- **Accessibility**: WCAG compliant with ARIA labels and keyboard navigation
- **Input Validation**: Comprehensive validation and error handling
- **Responsive Design**: Mobile-friendly layout with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts and your app will be deployed!

### Option 2: Deploy via Vercel Dashboard (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js and configure everything
6. Click "Deploy"

Your app will be live in under a minute!

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles with Tailwind
├── components/
│   └── b2b-subscription-calculator.tsx  # Main calculator component
├── public/                 # Static assets
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── package.json            # Dependencies and scripts

## Environment Variables

No environment variables required for basic functionality.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

## License

MIT
