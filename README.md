# Website Idea Generator

An AI-powered tool that generates website ideas and sections based on user prompts. Built with Next.js, NestJS, and MongoDB.

## Features

- Interactive prompt input with animated suggestions
- Split-screen builder workspace with real-time preview
- Progressive section generation with simulated streaming
- Prompt history with timestamp and session tracking
- Offline fallback with localStorage caching
- Error handling and retry mechanisms
- Responsive design with animations

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Framer Motion
- **Backend**: NestJS, MongoDB, Mongoose
- **Development**: TypeScript, ESLint, Prettier

## Project Structure

```
stunning/
├── frontend/                # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js app directory
│   │   │   ├── components/  # React components
│   │   │   ├── services/    # API services
│   │   │   └── page.tsx     # Main page component
│   │   └── ...
│   └── ...
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── prompts/         # Prompts module (controller, service)
│   │   ├── schemas/         # MongoDB schemas
│   │   ├── config/          # Configuration modules
│   │   └── ...
│   └── ...
└── plan.md                  # Project plan and progress tracking
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB (local instance or Atlas)
- XAMPP or similar for local development

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/stunning.git
   cd stunning
   ```

2. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```
   cd ../backend
   npm install
   ```

4. Set up environment variables:
   - Create `.env` file in the backend directory:
     ```
     MONGODB_URI=mongodb://localhost:27017/stunning
     PORT=3001
     ```
   - Create `.env.local` file in the frontend directory:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:3001/api
     ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm run start:dev
   ```

2. Start the frontend development server:
   ```
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Enter a prompt in the home screen input box
2. The application will generate website sections based on your prompt
3. View, edit, or regenerate sections in the builder workspace
4. Access your prompt history on the right sidebar
5. Use the reset button to start over

## Future Enhancements

- Real-time streaming using WebSockets or Server-Sent Events
- User authentication and personalized prompt history
- Export generated website ideas to various formats
- AI-powered image suggestions for each section
- Theme customization options

## License

MIT
