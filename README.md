# PDF Annotator

A full-stack React application that allows users to upload PDF files, highlight text within documents, and persist these highlights for later viewing.

## Features

- **User Authentication** - Register and login with JWT tokens
- **PDF Upload** - Upload and store PDF files with UUIDs
- **Text Highlighting** - Select and highlight text across PDF pages
- **Highlight Persistence** - Save and restore highlights from MongoDB
- **PDF Library** - View, rename, and delete uploaded PDFs

## Tech Stack

### Frontend

- React
- React Router for navigation
- React-PDF for PDF rendering
- Axios for API calls

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads

## Installation

1. **Clone the repository** ---using bash

   git clone
   cd pdf-annotator-full-stack

2. **Install backend and frontend dependencies**
   cd backend
   npm install

cd ../frontend
npm install

3. **Set up environment variables**
   -Backend: Create a .env file with MongoDB URI, JWT secret, etc.
   -Frontend: Create a .env file with API base URL

4. **Start the development servers**
   -Backend: npm run dev (from backend directory)
   -Frontend: npm run dev (from frontend directory)
