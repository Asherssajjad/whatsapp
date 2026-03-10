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
   AI_API_KEY_HIDDEN=your_openai_api_key
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

## Local Development & Testing

To run and test the system on your local machine:

### 1. Prerequisites
- **Node.js** (v20 or higher)
- **PostgreSQL** (Running locally or a remote URL)
- **Meta Developer Account** (For WhatsApp API)

### 2. Setup Environment Variables
Create a `.env` file in the `backend` folder:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/whatsapp_bot"
VERIFY_TOKEN="DigitalMinds_Bot_2026"
ACCESS_TOKEN="your_meta_access_token"
PHONE_NUMBER_ID="your_phone_number_id"
AI_KEY="your_key"
```

### 3. Install Dependencies
Run this in the root directory:
```bash
npm install
```

### 4. Initialize Database
Sync your database schema with Prisma:
```bash
cd backend
npx prisma db push
```

### 5. Start Development Servers
Run both backend and frontend from the root:
- Backend: `npm run backend:dev`
- Frontend: `npm run frontend:dev`

---

If you see an error like `secret AI_KEY: not found` during build on Railway:

1. **Add the Variable**: Go to the **Variables** tab in Railway and add `AI_KEY` (even a dummy value if you don't have one).
2. **Build Settings**: Ensure you haven't enabled any "Build Secrets" that you haven't provided values for.
3. **Database URL**: Make sure `DATABASE_URL` is added to your backend service variables.

### 4. Webhook Configuration
- Go to [Meta Developers Portal](https://developers.facebook.com/).
- Set Webhook URL to: `https://whatsapp-production-c833.up.railway.app/webhook`.
- Set Verify Token to match `VERIFY_TOKEN` in your backend variables.
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

### Railway.app (Recommended)
1.  **Multiple Services**: Since this is a monorepo, follow these steps in your Railway dashboard:
    -   Click "Create New Project" -> "Deploy from GitHub Repo".
    -   Once connected, Railway might attempt to build from the root and fail with an **"Error creating build plan"**.
2.  **To Fix Build Errors**:
    -   **For Backend Service**: Go to `Settings` -> `General` -> `Root Directory` and set it to `/backend`.
    -   **For Frontend Service**: Go to `Settings` -> `General` -> `Root Directory` and set it to `/frontend`.
3.  **Environment Variables**:
    -   Ensure each service has its own `.env` values set in the Railway dashboard.
4. **Auto-Configuration**: This repository includes a `railway.json` file which helps Railway automatically detect the services. 

### 🚀 Production URLs
- **Backend (Engine)**: `https://whatsapp-production-c833.up.railway.app`
- **Frontend (Dashboard)**: (Check your dashboard service for the generated domain)
