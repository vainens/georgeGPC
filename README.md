# georgeGPC

An original, responsive chat interface prototype for **georgeGPC**.

## Run locally

```bash
npm install
npm run dev
```

## Included in this prototype

- Responsive desktop/mobile chat workspace with conversation history and starter prompts.
- Selectable `gpc-1-lite`, `gpc-1-flash`, and `gpc-1.5 preview` model profiles.
- Local interaction prototype, including simulated streamed answers and an irony toggle.
- Settings for language, privacy, and connecting an external AI provider.
- Sign-in and registration interface.

## Production notes

This is a frontend prototype: it does not include a real AI provider, authentication backend, database, or a hard-coded administrator credential. Production authentication must use a server-side identity provider, password hashing, rate limiting, verified email flows, and environment-managed secrets. Connect model APIs only from a server-side route; never place provider API keys in browser code.
