# Vallibel One — Student Programme Portal

Registration and information portal for Vallibel One PLC's Industry Exposure
and Knowledge Sharing Programme (12th Intern Batch). Built with React + Vite.

**⚠️ Prototype status:** the registration form is currently static — it does
not send data anywhere yet. Dates, venue and capacity shown in the Schedule
tab are placeholder values pending confirmation. Search the codebase for
`pending confirmation` to find everything that still needs real data.

## Local development

```bash
npm install
npm run dev
```

This starts a local dev server (usually at `http://localhost:5173`) with
hot reload.

## Build

```bash
npm run build
```

Outputs a production build to `dist/`.

## Deploy to GitHub Pages

This repo is already configured for `https://VenukIndrapala.github.io/VallibelOne/`.

1. Push this project to a GitHub repo named `VallibelOne` under the
   `VenukIndrapala` account.
2. Install the deploy dependency (already listed in `package.json`, just run):
   ```bash
   npm install
   ```
3. Deploy:
   ```bash
   npm run deploy
   ```
   This builds the app and pushes the compiled output to a `gh-pages` branch.
4. In the GitHub repo, go to **Settings → Pages** and set the source branch
   to `gh-pages` (folder: `/root`).
5. The site will be live at **https://VenukIndrapala.github.io/VallibelOne/**
   within a few minutes.

If you rename the repo or change accounts, update:
- `base` in `vite.config.js`
- `homepage` in `package.json`

## Project structure

```
├── index.html          # HTML entry point
├── vite.config.js       # Vite config (includes GitHub Pages base path)
├── package.json
└── src/
    ├── main.jsx         # React mount point
    └── App.jsx          # All app logic, tabs, and styling
```

## Next steps

- Wire the registration form to a real backend or a form service
  (e.g. Formspree, Firebase, Supabase) once you're ready to collect
  real submissions.
- Replace placeholder dates/venue/capacity once confirmed by the
  programme team.
- Confirm photography consent wording with the relevant department
  before going live.
