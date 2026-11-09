# Goodbye, 20th Century!

DaJuan Brown’s portfolio homepage. A white editorial canvas, the original studio mark, and five individual project studies.

## Preview

The local preview runs at **http://localhost:5173**. On this Mac, double-click `Start Preview.command` to reopen it. The launcher finds a compatible local Node runtime and uses the installed dependencies without downloading anything.

For a regular Node development setup (Node 22.13 or newer):

```sh
npm ci
npm run dev
```

## Stack

React 19, TypeScript, Vite 8, and lazy-loaded Three.js device viewers, built for Cloudflare Pages. Plain authored CSS provides the responsive layouts, editorial typography, application windows, and motion. Fonts are served locally. No external image service or CDN is required.

## Included interactions

- Muse: three-image homepage gallery and an extended image gallery in project notes.
- Hodeye: a ten-chapter editorial case study, from approved identity and optional brand motion through illustration, original action states, actual website captures, fresh native Home/Chat/Profile captures, proposed product choices, and an apparel mockup. Mobile shows one readable native screen at a time.
- 35MM: a playable local film with pause, seek, restart, skip, mute, expand, close, and reopen controls. The footage is a placeholder for the project.
- Skeepers Sentinel: draggable macOS-style windows, close/minimize/restore/expand controls, a dock, terminal commands, Telegram messages, bot information, and the original notification. The simulation never contacts Telegram or Skeepers. Use `help`, `run`, `test`, `status`, or `clear` in the terminal. Mobile includes an accessible test-sequence button below the desktop.
- Amharist: an interactive typographic book study with three letters, used as a temporary visual.
- Compact 3D device studies: the supplied iPhone 18 Pro and closed iPhone Duo for Muse, Hodeye, and Amharist; the supplied MacBook Pro for 35MM. Drag horizontally or use arrow keys to rotate, and use Home or the reset control to return to the initial view. No Duo hinge animation.
- Muse and Hodeye devices use the four supplied, unmodified UI screenshots. Amharist and the MacBook retain their original model screen artwork until project screenshots are available.
- Editorial App Store links for Muse and 35MM appear in both homepage rows and project dialogs.
- Keyboard-accessible project-note dialogs, mobile navigation, mail links, and back-to-top navigation.

Hodeye has an expanded editorial case study inside the white project dialog. Other project buttons open concise project notes.

## Files

- `app/page.tsx`: homepage, project content, galleries, about panel, and dialogs.
- `app/globals.css`: visual design, responsive rules, and reduced-motion support.
- `components/portfolio/HodeyeEditorialGallery.tsx` and `hodeye-editorial.css`: Hodeye’s responsive ten-chapter editorial gallery.
- `docs/hodeye-editorial.md`: capture provenance, editorial decisions, and disclosure details.
- `components/portfolio/FilmPlayer.tsx`: working video study.
- `components/portfolio/DeviceIndicator.tsx` and `device-scene.ts`: on-demand 3D loading, screen materials, rotation, and cleanup.
- `components/portfolio/AppStoreLink.tsx`: App Store destinations and CTA copy.
- `public/assets/devices/`: web-ready GLB copies of the supplied USDZ geometry and unchanged screen PNGs.
- `scripts/export-devices.py`: Blender conversion script (requires the locally imported `.blend` source copies).
- `components/portfolio/SentinelDesktop.tsx`: self-contained desktop simulation.
- `public/assets/`: copied project assets and local fonts.
- `design-review/asset-provenance.json`: original source paths and SHA-256 hashes.

The original 18 sourced image/font/branding assets and four new UI screenshots were copied byte for byte. Device models were converted from the supplied USDZ files to GLB copies with Blender; original geometry, materials, and UVs are retained, with one Pro device selected from the supplied two-device presentation. Screens are textured on the original display meshes at runtime. Models and the Three.js viewer load near the viewport; rendering stops when idle or offscreen.

The original 18 sourced assets were copied byte for byte. Original files were preserved; no background removal or image retouching was needed. Images are sized and framed using CSS. Asset contact sheets in `design-review/` are inspection artifacts and are not used by the website.

## Validation

```sh
npm run typecheck
npm run build
```

The homepage was reviewed in Safari at desktop size and in a 390px responsive viewport. Galleries, project dialogs, terminal commands, the scripted campaign sequence, and notification handoff were exercised in the browser. The 3D update was reviewed at desktop and 390px widths, including drag rotation, real Muse/Hodeye screen mapping, MacBook screen artwork, and App Store links in both homepage rows and dialogs. The dependency lockfile also passed an npm 10 Linux clean-install dry run.

## Publishing updates

Production uses Cloudflare Pages connected to [God-of-Cloud/goodbye20thcentury-comingsoon](https://github.com/God-of-Cloud/goodbye20thcentury-comingsoon). Push updates to `main` to trigger a build and deployment:

```sh
git add app components public
git commit -m "Update portfolio"
git push origin main
```

For package or configuration changes, also stage the relevant files before committing. GitHub Desktop can perform the same commit-and-push workflow without terminal commands.

Cloudflare Pages settings:

- Production branch: `main`
- Framework: React (Vite)
- Build command: `npm run build`
- Build output: `dist`
- Node: 22.16.0 (declared in `.node-version`)
- Domain: `goodbye20thcentury.com`

The build checks TypeScript and verifies that every deployed file fits Cloudflare's 25 MiB asset limit. The original 4K placeholder film stays intact in the ignored `source-assets/35mm/` folder; the page serves a separate 1080p web copy, `film-web.mp4`. Original image and branding files are unchanged. The earlier framework scaffold is archived locally in the ignored `work/vinext-reference/` folder.
