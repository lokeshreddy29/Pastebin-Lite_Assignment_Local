## Run Locally

### Requirements
- Node.js 18+
- Docker (make sure the Docker Application is running on your machine)

### Setup
```bash
Run:

git clone <url>
cd Pastebin-Lite_Assignment_Local
npm install

Create a `.env` file inside the `Server` directory with the following contents:

Copy to .env:

PORT=3000
REDIS_URL=redis://localhost:6379
TEST_MODE=0

Run:

npm run dev
```

### Once running:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### The Stack
- Redis was used as the persistence layer due to it's out-of-the-box support for TTL (expiry) and faster response times.
- The backend was written in Nodejs using the Express framework.
- The frontend used Reactjs, Tailwincss and, React Query (Tanstack Query).





