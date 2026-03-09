# WhatsApp AI Chatbot Dashboard

This is a production-ready WhatsApp AI chatbot dashboard built with Node.js, Express, MongoDB, Next.js, and Tailwind CSS.

## Features
- **WhatsApp Cloud API Integration**: Real-time message reception and sending.
- **AI Auto-Reply**: Integrated with OpenAI API (GPT-3.5) for automated customer support.
- **Admin Dashboard**: Modern chat interface with sidebar, contact list, and active conversation panel.
- **Real-time Updates**: Socket.io ensures messages appear instantly without refreshing.
- **Manual Reply**: Admin can take over and reply manually via the dashboard.

## Tech Stack
- **Backend**: Node.js, Express.js, Socket.io, Mongoose (MongoDB).
- **Frontend**: Next.js, Tailwind CSS, Lucide Icons, Axios.
- **Database**: MongoDB (Atlas or local).

## Setup Instructions

### 1. Prerequisites
- Node.js installed.
- MongoDB database (local or Atlas URI).
- Meta Developer Account (WhatsApp Cloud API setup).
- OpenAI API Key.

### 2. Backend Setup
1. Navigate to `/backend`.
2. Install dependencies: `npm install`.
3. Create a `.env` file based on the template:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   VERIFY_TOKEN=your_custom_verify_token
   ACCESS_TOKEN=your_meta_access_token
   PHONE_NUMBER_ID=your_whatsapp_phone_number_id
   OPENAI_API_KEY=your_openai_api_key
   ```
4. Start the server: `npm run dev`.

### 3. Frontend Setup
1. Navigate to `/frontend`.
2. Install dependencies: `npm install`.
3. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```
4. Start the development server: `npm run dev`.

### 4. Webhook Configuration
- Go to [Meta Developers Portal](https://developers.facebook.com/).
- Set Webhook URL to: `https://yourdomain.com/webhook`.
- Set Verify Token to match `VERIFY_TOKEN` in your backend `.env`.
- Subscribe to `messages` in the Webhooks section.

## Folder Structure
```text
/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Route controllers (webhook, chat)
│   │   ├── models/           # Mongoose schemas (Message, Contact, Conversation)
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic (WhatsApp API, OpenAI)
│   │   └── server.js         # Entry point with Socket.io
├── frontend/
│   ├── app/                  # Next.js App Router (Dashboard, Layout)
│   ├── components/           # Reusable UI components (Sidebar, ChatWindow)
│   ├── services/             # API and Socket configuration
└── README.md
```

## Deployment
1. Deploy the backend to a platform like **Railway**, **Render**, or **DigitalOcean**.
2. Deploy the frontend to **Vercel** or **Netlify**.
3. Ensure the backend URL is correctly set in the frontend environmental variables.
4. Ensure the backend is reachable via HTTPS for the Meta Webhook to work.
