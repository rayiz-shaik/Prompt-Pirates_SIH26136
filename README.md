# MSInS Startup Procurement Sandbox (SIH26136)

## Run
1. Install Node.js 18.17+ (`node -v`).
2. Unzip, open a terminal in `sih26136`.
3. `npm install`
4. `npm run dev` and open the address it prints (usually http://localhost:3000).
5. Production check: `npm run build && npm start`.

## Accounts (password `Demo@2026`; use the eye icon to view it)
| Role | Sign in with | Lands on |
|---|---|---|
| Department Officer | ee.pmc@punecorporation.gov.in or 123412341234 | /officer/dashboard |
| Startup | founder@ravemusarelo.in or ABCDE1234F | /startup/dashboard |
| Technical Evaluator | eval01@msins.gov.in | /officer/challenges |
| Vigilance Auditor | cvo@maharashtra.gov.in | /auditor/trail |

## Data persistence
All data is saved to `data/db.json` on the server after every change, so it survives refreshes, restarts and different browsers. To reset the demo, stop the server, delete `data/db.json`, and start again. The file store needs a writable disk (fine locally; on serverless hosts swap `src/lib/server-db.ts` for a real database).

## Audit trail integrity
The server links every audit entry to the previous one with SHA-256 and rejects any save that edits or removes past entries (HTTP 409). Editing `data/db.json` by hand breaks the chain, and the auditor screen then shows "Chain broken". Try it.

## Rules and limits (verified September 2026)
- Prior turnover and experience relaxation for startups: GFR 2017 Rule 173(i).
- EMD exemption for DPIIT startups: GFR 2017 Rule 170(i) (DoE OM 25-07-2017); DoE OM 12-11-2020 asks for a Bid Security Declaration instead.
- Rule 149 is the mandatory-GeM rule, not a pilot cap. The portal asks officers to confirm a GeM check.
- Rule 144: generic, functional specifications (no brands).
- ₹15,00,000 pilot limit: MSInS work orders under the Maharashtra Startup Policy 2018 / Startup Week. Press reports say Policy 2025 raises it to ₹25 lakh; confirm against the GR and change `PILOT_CAP` in `src/lib/rules.ts`.
- 4 to 26 week pilots: a portal design setting, not a legal rule.
All are defined in `src/lib/rules.ts`.

## Troubleshooting
- 404 after signing in: delete `.next`, restart, and use the printed port.
- Use one address (localhost or 127.0.0.1) throughout; the session cookie is per host.
