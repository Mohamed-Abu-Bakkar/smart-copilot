# Smart Copilot development setup

## Current development mode
- Authentication is intentionally deferred.
- The app starts with an empty demo workspace.
- Business profile and saved document drafts are persisted in the current browser using localStorage.
- The Advisor and document generator call the server-side `/api/assistant` route.
- The Groq key is read only on the server from `GROQ_API_KEY`.
- Scheme cards link to official portals; eligibility and benefit claims are not calculated.

## Run locally
1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Add a newly generated Groq API key to `GROQ_API_KEY`.
4. Run `npm run dev`.
5. Open `/onboarding` to create a blank demo profile, or `/business` to edit it.

## Secrets
Never commit `.env.local`, API keys, Convex deployment credentials, or production secrets. The key previously pasted into chat should be revoked and replaced. Do not reuse it.

## Convex and authentication
The repository already contains a Convex schema, but it currently models Clerk-linked users. This branch does not claim that Convex is deployed or connected. Connect a development Convex deployment and configure `NEXT_PUBLIC_CONVEX_URL` before wiring cloud persistence. Authentication is intentionally a later milestone; before public deployment, replace the browser-only demo workspace with authenticated Convex queries/mutations and enforce per-user ownership on every read and write.

## Known MVP limitations
- Browser localStorage is local to one browser/device and is not suitable for production or sensitive data.
- AI output must be reviewed; no legal compliance or eligibility guarantee is made.
- Document export is plain text in this first pass; PDF/DOCX, cloud document versions, official-source sync, vector search and multilingual QA remain follow-up work.
- No test/build has been run in GitHub's remote editing environment. Run `npm run lint` and `npm run build` after cloning and configuring the project.
