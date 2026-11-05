# Smart Copilot development setup

## Authentication: email and password

Smart Copilot uses a first-party email/password experience built with Better Auth and the Convex Better Auth component. The authentication database and session verification run through the existing Convex deployment; no Clerk, Auth0, hosted identity tenant, Google login or SMS provider is required.

### One-time setup after pulling this branch

1. Install and lock the new dependencies:
   `npm install`
2. Generate the Better Auth component schema:
   `npx auth generate --config ./convex/betterAuth/auth.ts --output ./convex/betterAuth/schema.ts`
3. Generate a new Better Auth secret and set it on the Convex deployment (do not put this in the browser environment):
   `npx convex env set BETTER_AUTH_SECRET "$(openssl rand -base64 32)"`
4. Set the local site URL on the Convex deployment:
   `npx convex env set SITE_URL http://localhost:3000`
5. Run `npx convex dev` and wait for the deployment to finish.
6. In another terminal, run `npm run dev`.
7. Open `/signup` to create an account. New users continue to the conversational business onboarding; returning users use `/login`.

For a deployed environment, set `SITE_URL` to the exact HTTPS application origin on the corresponding Convex deployment. Keep `BETTER_AUTH_SECRET` private and use a separate strong secret for production. The Next.js app also needs `NEXT_PUBLIC_CONVEX_URL` and `NEXT_PUBLIC_CONVEX_SITE_URL` in its local environment.

Email/password sign-up is enabled without email verification for the initial MVP. Password-reset emails and verified-email delivery are not enabled yet because no email delivery service has been configured. Do not advertise password reset or email verification as available until a mail provider and verified sender are configured.

## Account-owned workspace data

All workspace queries and mutations derive the owner from the authenticated Convex identity. The browser-generated workspace ID is no longer an authorization mechanism. Profile, saved documents and advisor history are stored under the signed-in account; unauthenticated workspace reads and writes are rejected.

**Legacy data note:** existing records created by the old browser-ID demo are retained as unowned records. They are not automatically assigned to the first account that signs in, because a local-storage ID is not proof of ownership. Existing users should keep the old browser profile until a deliberate, verified data-transfer flow is implemented. Do not run an ownership migration that assigns records based only on a client-supplied workspace ID.

## Shared business context

The Advisor sends the latest authenticated Convex profile to the AI endpoint with each request. The Document Studio includes the same profile when drafting and asks the owner only for document-specific rules. The Scheme Navigator generates cautious, profile-aware discovery suggestions from a curated list of official portals; matches are leads to verify, never eligibility decisions. Convex subscriptions keep profile edits visible across these modules without separate copies of the profile.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Set `NEXT_PUBLIC_CONVEX_URL` to your Convex deployment URL (the `.convex.cloud` URL).
4. Set `NEXT_PUBLIC_CONVEX_SITE_URL` to the matching `.convex.site` URL.
5. Add a newly generated Groq API key to `GROQ_API_KEY`.
6. Run the authentication setup above, then keep `npx convex dev` running.
7. In another terminal run `npm run dev`.

After changing environment variables, restart the Next.js server. Do not commit `.env.local`, API keys, Convex deployment tokens, Better Auth secrets, or production secrets.

## Known MVP limitations

- Password reset and email verification require an email delivery provider and are not yet enabled.
- AI output must be reviewed; no legal compliance or scheme eligibility guarantee is made.
- Scheme discovery uses a small curated catalogue and AI matching; there is no live official-source sync, application tracking, deadline monitoring or verified eligibility engine.
- Document export is plain text only; PDF/DOCX, document version history, reusable custom templates and e-signature are not implemented.
- The Advisor is a basic request/response chat; streaming, voice input/output, task tracking and proactive reminders are not implemented.
- Search/RAG over uploaded business files, vector search, multilingual quality assurance and citations from live authoritative sources are not implemented.
- Team roles, multi-user collaboration, notifications, analytics, billing/subscriptions and production observability are not implemented.
- Run `npm run lint` and `npm run build` locally after starting Convex and configuring environment variables.
