# Nara

Premium cinematic landing page built with Next.js, GSAP, Three.js, and Lenis smooth scroll.

## Stack

- **Next.js 15** (App Router, static export)
- **Tailwind CSS**
- **GSAP** + ScrollTrigger
- **Three.js** (hero starfield)
- **Lenis** (smooth scroll)

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

Static files are output to the `out/` directory.

## Deploy to GitHub Pages

### 1. Create a GitHub repository

Push this project to a new repo on GitHub.

### 2. Enable GitHub Pages

In your repo: **Settings → Pages → Build and deployment → Source → GitHub Actions**.

### 3. Push to `main`

The included workflow (`.github/workflows/deploy.yml`) builds and deploys automatically on every push to `main`.

### Base path notes

| Repo type | URL example | Config needed |
|---|---|---|
| Project site | `username.github.io/nara` | Set `NEXT_PUBLIC_BASE_PATH=/nara` in the workflow (already uses repo name) |
| User site | `username.github.io` | Use a repo named `username.github.io` — base path stays empty |

To deploy as a user site, edit `.github/workflows/deploy.yml` and remove or empty the `NEXT_PUBLIC_BASE_PATH` env var.

## Fonts

| Role | Font |
|---|---|
| Logo | Outfit |
| Headings | Inter Tight |
| Body | Geist Sans |
| Eyebrows | Geist Mono |

## License

Private — © Nara. All rights reserved.
