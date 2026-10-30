# Sources

Where every value in `tokens.css` and `components.css` came from.

## 1. Gestalt, Pinterest's design system (main source)

- **Package:** `gestalt-design-tokens@177.0.12` on npm. I read it, I didn't install it into the project.
- **Files read:**
  - `dist/css/vr-theme/variables.css`: base and semantic colours, pressed colours, font family, font sizes and weights, space, rounding, elevation, motion
  - `dist/css/vr-theme/variables-dark.css`: dark mode colours
  - `dist/css/vr-theme/font-lineheight-default.css`: line heights
  - `dist/ios-swift/vr-theme/GestaltTokensFontSizeVR.swift` and `GestaltTokensFontWeightVR.swift`: confirms the iOS type scale matches the web one
- **Taken:** Pinterest red `#e60023`, the grey scale, semantic colours, the 12/14/16/20/28/36 type scale, weights 400/500/700, space 1–48px, rounding 8–32px and pill, shadows.
- **Not available:** the font itself. Gestalt names "Pin Sans" first, but it isn't public, so the screens fall through to `-apple-system`, the iPhone system font. Gestalt lists it second.

## 2. Gestalt Button docs

- https://gestalt.pinterest.systems/web/button
- **Taken:** Button sizes "sm: 32px, md: 40px, lg: 48px". "Large is the only size that should be used on Pinner surfaces." Button text is 16px. The colour roles: red for primary, gray for secondary, and the dark and white variants.
- **ButtonToggle** (https://gestalt.pinterest.systems/web/buttontoggle): the same three sizes. Used for the filter chips.

## 3. Apple Human Interface Guidelines

- https://developer.apple.com/design/human-interface-guidelines/accessibility: minimum tap target 44 × 44 pt
- https://developer.apple.com/design/human-interface-guidelines/typography: never below 11 pt
- https://developer.apple.com/design/human-interface-guidelines/sheets: sheet with grabber
- **Contrast:** 4.5:1 for text (WCAG AA, which the HIG points to).

## 4. iPhone 17 (the student's phone)

- Screen: 402 × 874 pt.
- The status bar height (54), home indicator size (139 × 5) and corner radius (55) are **estimated**. They aren't in the HIG. Apple's iOS UI kit for Figma has them, and it would replace these if the team adds it.

## 5. The team's reference screens (uploaded 29 Oct 2026)

Twelve hi-fi screens of the My Closet flow, plus the profile entry point. They were used for:
- **Layout:** what goes where on each screen.
- **Content:** item names, board names and counts, Ava Moreno's profile, product names, brands and prices, and all the copy.
- **Sizes Gestalt doesn't publish (all estimated):** icon sizes (16 / 24), stroke width (2), tab bar height (50), nav bar height (52), check badge (22), inspo thumbnail (64 × 88), tile and pin ratios, profile avatar (32).

## 6. Icons

Pinterest's icons ship inside Gestalt as React components, and Apple's SF Symbols aren't published for the web. So `icons.js` has **simple SVG copies**, drawn to match the shapes in the reference screens: back, close, more, share, chevron, plus, check, sparkle, camera, photos, receipt, hanger, home, search, message, bag, trash.

## 7. Skin tones (round 2)

- **Package:** `gestalt@177.0.12`, `dist/gestalt.es.js`, ButtonToggle `skinColor`, tones 1 to 16. This is the same set Pinterest uses for its skin tone ranges in search.
- Kept in `tokens.css` as `--skin-tone-1` to `--skin-tone-16`. `avatar.js` reads them from there.

## 8. Avatar illustration (round 2)

- Drawn in `avatar.js`, faceless and flat, to match the reference screens' figures.
- Hair and garment colours are illustration content, not UI colours, and are estimated from the reference screens.

## 9. Images

Round 1: labelled grey tiles. Round 2: the team asked for real photos. Every tile is now a photo slot. A file in `images/` with the right name replaces its tile (see `images/README.md`). No photos are in the project yet.

## 10. Closet photos (round 3)

- **What:** 11 flat-lay photos the team sent: screenshots of listings from a resale app.
- **Processing:** the menu button, like count, page dots and sale badge were painted out (OpenCV inpaint). Then the backgrounds were removed (rembg, isnet-general-use model) and saved as PNG cutouts in `images/`.
- **Credit:** Depop (the team's decision, round 4). The closet photos, the gray plaid zip jacket and the light-wash baggy jeans all come from Depop listings.
- **Inspo pin:** the team's own mirror photo of the outfit.
