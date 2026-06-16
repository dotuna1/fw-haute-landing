# FW Haute

Static jewellery landing page, prepared for GitHub and Railway deployment.

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:3000`.

## Deploy to Railway

1. Push this repo to GitHub.
2. Create a new Railway project from the GitHub repo.
3. Railway will use `npm start` from `railway.toml`.

## Notes

- `server.js` serves the static site from the repository root.
- The page uses local SVG assets in `images/`.
