# Smart Copilot development setup

## Persistent workspace database
Smart Copilot uses Convex as its database for the shared demo workspace:
- Business profile
- Saved policy and document drafts
- AI advisor conversation history (last 100 messages)

A browser-generated workspace ID links this development workspace to its Convex record. This survives refreshes and browser restarts on the same browser profile. Because authentication is intentionally deferred, it does not yet sync across different browsers/devices and must not be treated as private multi-user production storage.

## Run locally
1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Set `NEXT_PUBLIC_CONVEX_URL` to your Convex deployment URL (the `.convex.cloud` URL).
4. Set `NEXT_PUBLIC_CONVEX_SITE_URL` if your deployment provides it.
5. Add a newly generated Groq API key to `GROQ_API_KEY`.
6. In one terminal run `npx convex dev` and keep it running. This deploys the schema and functions and generates `convex/_generated` files.
7. In another terminal run `npm run dev`.
8. Open `/onboarding` to create a blank workspace, or `/business` to edit it.

After changing environment variables, restart the Next.js server. Do not commit `.env.local`, API keys, Convex deployment tokens, or production secrets.

## Security and next milestone
Authentication is intentionally deferred. The current browser-generated workspace ID is a development convenience, not an authentication or authorization boundary. Before public or multi-user deployment, add authentication and enforce ownership checks in every Convex query and mutation. Rotate any API key or deployment token previously pasted into chat; never reuse exposed credentials.

## Known MVP limitations
- Workspace persistence is on Convex, but this unauthenticated development workspace is tied to one browser profile.
- AI output must be reviewed; no legal compliance or eligibility guarantee is made.
- Document export is plain text in this first pass; PDF/DOCX, document version history, official-source sync, vector search and multilingual QA remain follow-up work.
- Run `npm run lint` and `npm run build` locally after starting Convex and configuring environment variables.
