## Run Locally

### Requirements
- Node.js 18+
- Docker (setup is handled by the root package.json)

### Setup
```bash
git clone <repo>
cd pastebin-lite
npm install

Create a `.env` file inside the `Server` directory with the following contents:
```env
PORT=3000
REDIS_URL=redis://localhost:6379
TEST_MODE=0

npm run dev
```

### Once running:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### The Stack
- Redis was used as the persistence layer due to it's out-of-the-box support for TTL (expiry) and faster response times.
- The backend was written in Nodejs using the Express framework.
- The frontend used Reactjs, Tailwincss and, React Query (Tanstack Query).
- Everything was deplopyed on vercel at - https://pastebin-lite-assignment-app.vercel.app/
