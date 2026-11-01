# Pocket Vault project context

Personal Android password manager. React Native + Expo + TypeScript. Vietnamese UI.

## Current checkpoint

Phase 1 only: in-memory demo CRUD UI. No login, PIN, persistence, encryption, cloud, or production-ready security yet. User will review each phase on Android. Do not implement later phases without the user's next instruction.

## Product decisions

- Android first; one person using their own device.
- Final storage is on-device only; no remote DB or cloud setup is needed.
- Future unlock UX: app-specific 6-digit PIN, no email/password sign-in.
- Keep full vault encrypted in a later phase. PIN UI is not a substitute for encryption or key protection.
- Do not auto-fetch website icons or send credentials to a service.
- No autofill integration in the initial scope.

## Working rules

- Read README.md and docs/ROADMAP.md before changing scope.
- Use fictional credentials only. Never log credentials, PINs, or encryption keys.
- Keep screens, domain logic, state, and repository implementation separate.
- Preserve password characters exactly, including whitespace.
- Support multiple accounts for one website.
- Keep the lockfile and Expo-compatible dependency versions. Do not upgrade React Native independently.
- Run npm run check and npm run export:android for relevant changes.
- State clearly if native Android testing was not available. Web tests and Android bundling are not device verification.
- Stop at the requested phase, summarize changes and checks, and supply a short manual UI checklist.

## Commands

- npm ci
- npm start
- npm run web
- npm run check
- npm run export:android
