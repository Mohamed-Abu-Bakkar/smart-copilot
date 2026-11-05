# Smart Copilot development setup

## Persistent workspace database
Smart Copilot uses the canonical Convex `workspaces` table for:
- Business profile, including business goals
- Saved policy and document drafts
- AI advisor conversation history (last 100 messages)
- One shared profile context consumed by the Advisor, Scheme Navigator and Document Studio

A browser-generated workspace ID links this development workspace to its Convex record. It survives refreshes and browser restarts on the same browser profile. Because authentication is intentionally deferred, it does not yet sync across different browsers/devices and must not be treated as private multi-user production storage.

## One-time legacy data migration
The previous table was named `demoWorkspaces`. The schema temporarily retains it so existing data can be copied safely.

1. Pull the latest `feat/core-mvp-implementation` branch.
2. Run `npx convex dev` and wait for the updated schema and functions to deploy.
3. In a second terminal, run `npx convex run workspace:migrateLegacyWorkspaces`.
4. Confirm the command reports the migrated rows and `legacyRowsRemoved`.
5. Refresh the app. The app now reads and writes the `workspaces` table.
6. After confirming the migration succeeded, the legacy `demoWorkspaces` table can be removed from `convex/schema.ts` in a follow-up cleanup and deployed.

The migration preserves workspace IDs, profiles, saved documents and advisor messages. If a canonical row already exists, it merges missing legacy profile/documents and combines message history rather than overwriting current data.

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

## Shared business context
The Advisor sends the latest Convex profile to the AI endpoint with each request. The Document Studio includes the same profile when drafting and asks the owner only for document-specific rules. The Scheme Navigator can generate cautious, profile-aware discovery suggestions from a curated list of official portals; matches are leads to verify, never eligibility decisions. Convex subscriptions keep profile edits visible across these modules without separate copies of the profile.

## Security and next milestone
Authentication is intentionally deferred. The current browser-generated workspace ID is a development convenience, not an authentication or authorization boundary. Before public or multi-user deployment, add authentication and enforce ownership checks in every Convex query and mutation. Rotate any API key or deployment token previously pasted into chat; never reuse exposed credentials.

## Known MVP limitations
- Workspace persistence is on Convex, but this unauthenticated development workspace is tied to one browser profile.
- AI output must be reviewed; no legal compliance or scheme eligibility guarantee is made.
- Scheme discovery uses a small curated catalogue and AI matching; there is no live official-source sync, application tracking, deadline monitoring or verified eligibility engine.
- Document export is plain text only; PDF/DOCX, document version history, reusable custom templates and e-signature are not implemented.
- The Advisor is a basic request/response chat; streaming, voice input/output, task tracking and proactive reminders are not implemented.
- Search/RAG over uploaded business files, vector search, multilingual quality assurance and citations from live authoritative sources are not implemented.
- Authentication, account ownership, team roles, multi-user collaboration and cross-device sync are not implemented.
- Notifications, analytics, billing/subscriptions and production observability are not implemented.
- Run `npm run lint` and `npm run build` locally after starting Convex and configuring environment variables.
