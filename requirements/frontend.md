Tech Stack: We will use Next.js, Shadcn UI, Supabase, and Clerk for authentication.

User Authentication:

Implement authentication using Clerk.
Allow users to sign in with social media accounts (e.g., Twitter).
Wallet Management:

Use the ZBD API to create and manage bitcoin wallets for users.
Store wallet information securely in Supabase.
Tipping Mechanism:

Create a public profile page for each influencer displaying their content and a "Tip" button.
When followers click the "Tip" button:
Allow them to enter the amount they wish to tip.
Process the payment using the ZBD API.
Provide real-time feedback on the transaction status.
Notifications:

Implement real-time notifications for influencers when they receive a tip.
Use Supabase real-time features or websockets for instant updates.
Analytics Dashboard:

Build a dashboard for influencers to:
View total earnings.
See transaction history.
Identify top tippers.
Customization:

Allow influencers to customize their tipping widget/button (e.g., style, text).
Provide embeddable widgets for personal websites or blogs.
UI/UX:

Design a user-friendly interface using Shadcn UI components.
Ensure responsive design for both desktop and mobile devices.
Add animations for actions like sending a tip or loading data.
Security:

Securely handle all sensitive data.
Use environment variables for API keys and secrets.
Implement error handling and input validation.
Relevant Docs
ZBD API Integration
Setup
Environment Variable: Set the ZBD_API_KEY in your .env.local file.

bash
Copy code
ZBD_API_KEY=<your-zbd-api-key>
Install Dependencies:

bash
Copy code
npm install axios
Creating a Wallet
Function: Create a wallet for a new user upon registration.

javascript
Copy code
// lib/zbd.js
import axios from 'axios';

export const createWallet = async (userId) => {
  const response = await axios.post(
    'https://api.zbd.gg/wallet',
    { userId },
    {
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.ZBD_API_KEY,
      },
    }
  );
  return response.data;
};
Generating a Payment Invoice
Function: Generate an invoice when a follower wants to tip.

javascript
Copy code
// lib/zbd.js
export const createPaymentRequest = async (amount, description) => {
  const response = await axios.post(
    'https://api.zbd.gg/payment-requests',
    {
      amount, // Amount in Satoshi
      description,
      expiresIn: 300, // Invoice expires in 5 minutes
    },
    {
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.ZBD_API_KEY,
      },
    }
  );
  return response.data; // Contains the payment invoice
};
Sending a Payment
Function: Process the payment from the follower to the influencer.

javascript
Copy code
// lib/zbd.js
export const sendPayment = async (invoice) => {
  const response = await axios.post(
    'https://api.zbd.gg/payments',
    { invoice },
    {
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.ZBD_API_KEY,
      },
    }
  );
  return response.data;
};
Webhooks for Notifications
Setup: Configure webhooks to receive real-time notifications for incoming payments.

Endpoint: Create an API route in /app/api/webhooks/zbd.js to handle webhook events.
Verification: Ensure the webhook signature is verified to secure the endpoint.
javascript
Copy code
// app/api/webhooks/zbd.js
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req, res) => {
  const signature = req.headers['x-zbd-signature'];
  // Verify signature here

  const event = req.body;
  // Handle the event (e.g., update database, send notification)

  res.status(200).json({ received: true });
};
Documentation: Refer to ZBD API Webhooks for detailed setup.

Supabase Integration
Installation:

bash
Copy code
npm install @supabase/supabase-js
Initialization:

javascript
Copy code
// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
Usage:

Store user profiles, wallet IDs, and transaction records.
Utilize Supabase's real-time features for instant updates on the frontend.
Clerk Authentication
Installation:

bash
Copy code
npm install @clerk/nextjs
Setup:

Follow the Clerk Next.js Quickstart Guide for configuration.
Enable social login providers like Twitter in your Clerk dashboard.
Usage:

Wrap your app with <ClerkProvider> in pages/_app.js.

javascript
Copy code
// pages/_app.js
import { ClerkProvider } from '@clerk/nextjs';

function MyApp({ Component, pageProps }) {
  return (
    <ClerkProvider>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}

export default MyApp;
Protect routes using withAuth or useAuth.

Current File Structure
lua
Copy code
.
├── app
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── dashboard
│   │   └── page.tsx
│   ├── profile
│   │   └── [username]
│   │       └── page.tsx
│   ├── settings
│   │   └── page.tsx
│   └── api
│       ├── webhooks
│       │   └── zbd.js
│       └── zbd
│           └── route.js
├── components
│   ├── ui
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── TipButton.tsx
│   ├── DashboardChart.tsx
│   └── NotificationBell.tsx
├── lib
│   ├── zbd.js
│   ├── supabaseClient.js
│   └── utils.js
├── public
│   └── images
├── styles
│   └── globals.css
├── .env.local
├── .gitignore
├── next-env.d.ts
├── next.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── tsconfig.json
Rules
Component Organization:

All new components should go in /components and be named in PascalCase (e.g., ExampleComponent.tsx).
Reusable UI components go in /components/ui.
Page Organization:

All new pages go in /app.
Use nested routes for user profiles, settings, etc.
Coding Standards:

Use TypeScript for all files.
Follow best practices for React and Next.js.
Keep code clean, modular, and well-documented.
Styling:

Use Shadcn UI components and utilities.
Ensure responsive design for mobile and desktop.
Follow a consistent design system.
Environment Variables:

Store all API keys and secrets in .env.local.
Do not commit .env.local to version control.
Asynchronous Operations:

Use async/await syntax.
Handle errors gracefully with try/catch blocks.
Data Handling:

Validate and sanitize all user inputs.
Securely store sensitive information.
Implement proper error messages for users.
Git Workflow:

Write clear commit messages.
Use feature branches for new features.