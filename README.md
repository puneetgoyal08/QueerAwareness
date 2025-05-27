# Bias Awareness Assessment

An interactive website that assesses unconscious bias through questionnaires and provides educational resources for awareness and learning.

## Features

- **Interactive Assessment**: 15 thoughtful questions across workplace, social, and decision-making scenarios
- **Personalized Results**: Detailed score breakdown with category analysis
- **Educational Resources**: Curated articles, videos, podcasts, and organizations
- **Pride Month Initiative**: Special branding for diversity and inclusion awareness

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, Node.js
- **Storage**: In-memory storage (perfect for demos and assessments)
- **Routing**: Wouter for client-side routing

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open http://localhost:5000 in your browser

## Deploy to Vercel

### Option 1: Deploy from GitHub (Recommended)

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign up/login
3. Click "New Project" and import your GitHub repository
4. Vercel will automatically detect the project settings
5. Click "Deploy" and your site will be live in minutes!

### Option 2: Deploy from Command Line

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy your project:
```bash
vercel
```

4. Follow the prompts and your site will be deployed!

## Project Structure

```
├── client/          # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application pages
│   │   └── lib/         # Utilities and configurations
├── server/          # Express.js backend
│   ├── index.ts     # Main server file
│   ├── routes.ts    # API routes
│   └── storage.ts   # In-memory data storage
├── shared/          # Shared types and schemas
└── vercel.json      # Vercel deployment configuration
```

## API Endpoints

- `GET /api/assessment/questions` - Fetch all assessment questions
- `POST /api/assessment/submit` - Submit assessment answers
- `GET /api/assessment/result/:sessionId` - Get assessment results
- `GET /api/resources` - Fetch educational resources
- `GET /api/resources?type=article` - Filter resources by type

## Contributing

This project was built for Pride Month 2024 to promote awareness and education about unconscious bias. Feel free to contribute additional questions, resources, or improvements!

## License

MIT License