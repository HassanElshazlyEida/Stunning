# Website Idea Generator Plan

## Notes
- Project uses Next.js (frontend), NestJS (backend), and MongoDB (database).
- User prefers plan-mode: high-level steps, not technical code.
- AI-powered IDEs (Cursor, Copilot) may be used.
- Fixed JSX/lint errors in BuilderWorkspace (escaped '>' character)
- Backend prompt history & API fully implemented; backend lint fixes complete
- Enabled CORS and global API prefix in backend
- Focus on modular, phase-based delivery; user may update tasks later.
- Completed Phase 3: Transition to Builder Workspace
- Frontend API service supports streaming section responses
- Updated frontend page and BuilderWorkspace to support streaming sections and PromptHistoryItem
- API base URL in frontend now uses /api prefix and port 3002; improved logging/error handling added to API service
- Added optimistic UI and error handling to frontend page component
- Backend "not found" error for /api/prompts/generate likely due to double prefix (global + controller); review backend route configuration
- Backend API route double prefix fixed; endpoint now available at /api/prompts/generate
- Frontend loads prompt history and fetches prompt details (sections) on selection
- Backend endpoints and schema for fetching specific prompts are confirmed working
 
## Task List
- [x] PHASE 1: Project Setup
  - [x] Spin up Next.js app for frontend
  - [x] Spin up NestJS app for API
  - [x] Connect MongoDB (local/Atlas)
  - [x] Set up shared dev environment (env files, linting, formatting)
  - [x] Decide on design system (Tailwind or CSS modules)
- [x] PHASE 2: Home Screen - Animated AI Prompt Experience
  - [x] Centered animated prompt box with catchy title
  - [x] Cool background animation or gradient blobs
  - [x] Rotating static prompt suggestions
  - [x] Flying-in/fading animations for suggestions
  - [x] Transition to builder mode on input focus/typing
- [x] PHASE 3: Transition to Builder Workspace
  - [x] Split-screen layout: Left (IDE-style Preview), Right (Prompt History + Controls)
  - [x] Animate section generation (streaming/fade/slide in)
  - [x] Loading spinner/fake terminal loading log
  - [x] Prompt history from MongoDB (list previous prompts)
  - [x] Prompt input area for update/edit/regenerate
  - [x] Sticky controls: reset/regenerate
- [x] PHASE 4: Backend Updates
  - [x] Modify NestJS to return sections progressively/simulate streaming
  - [x] Save prompt history with timestamp and session ID
  - [x] API: POST /generate, GET /history, optional POST /update
  - [x] Enable CORS and global API prefix   
- [x] PHASE 5: Enhance UX with Animations & Feedback
  - [x] Use Framer Motion/GSAP for flying text, section reveals, cascade loading
  - [x] Clear loading indicators on prompt submit
  - [x] Optimistic UI: show history/preview while loading
  - [x] Implement frontend UX for streaming/loading
- [x] PHASE 6: Persistence & Fetching
  - [x] Save response in DB after submission
  - [x] Fetch latest stored sections on load
  - [x] Let user reload last idea, show last 3 ideas
  - [x] Fix backend API route configuration if double prefix issue
- [x] PHASE 7: Error Handling & Resilience
  - [x] Handle API errors, empty results
  - [x] Show graceful error messages
  - [x] Retry failed requests, offline fallback (localStorage)

