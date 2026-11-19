# Goalqube — Matchday Edit

Next.js football website redesigned from the supplied Liverpool eCommerce and football dashboard references. The home page combines an ivory and burgundy editorial layout, yellow highlights, player portrait, side navigation, matchday tabs, a club spotlight carousel, editorial links and a searchable club directory.

The approved black-and-white, tagline-free Goalqube logo is used in the shared navigation and footer. Existing football routes, Firebase authentication and Vercel setup are retained.

## Run locally

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Production validation: `npm run build`, then `npm start`.

## Main files

- `src/components/MatchdayExperience.tsx`: new homepage and local UI interactions.
- `src/components/matchday.css`: responsive layout and styling.
- `src/components/Brand.tsx`: approved logo artwork in SVG viewports.
- `src/components/Navbar.tsx`: existing Firebase-aware shared navigation.
- `public/images/goalqube-player.png`: ImageGen editorial player portrait, inspired by the supplied reference.
- `public/brand/goalqube-logo-v6.png`: approved logo without tagline.

The landing page shows editorial football content, with no fabricated live scores, betting odds or player statistics. Existing data pages continue to use their original providers. Publish source changes through the connected GitHub/Vercel workflow when ready.
