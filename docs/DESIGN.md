# Design System: Exposure

> The visual language. Every UI decision references these tokens. No ad-hoc values in components.

## Direction

Cinematic, not applicative. The player should forget they are looking at a web page. The office act is warm, expensive and completely ordinary — an actual private consulting room in Marylebone, not a horror set. The world act is near-black and full-bleed with no interface on it at all.

Interface chrome is the enemy. There are no panels, no cards, no borders, no headers, no buttons with backgrounds, no icons. Text floats on image. The only interactive element in the entire office act is a single text input, and it appears as an overlay over the scene rather than a form on a page.

**What this is not:** a dashboard, a chat UI, a SaaS product, a Tailwind template, or anything with a visible container. If a screen has a rounded rectangle with a drop shadow on it, it is wrong.

## Colour

Two palettes. The office palette is warm and lit; the world palette is near-absent because the video fills the frame.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0A0908` | Base page background, letterbox bars |
| `--office-warm` | `#D9C7A7` | Warm light key, subtitle text in office |
| `--office-cream` | `#EDE4D3` | Highest-value text on dark image areas |
| `--walnut` | `#3A2A1E` | Deep shadow tone in overlays |
| `--burgundy` | `#5C1F26` | Single accent. Used sparingly: input caret, notebook ink underline |
| `--brass` | `#B08A4A` | Hairline accents, focus ring |
| `--text` | `#EDE4D3` | Primary text |
| `--text-muted` | `rgba(237,228,211,0.55)` | Secondary, hints, character count |
| `--overlay` | `rgba(10,9,8,0.72)` | Scrim behind the answer input |
| `--danger` | `#8C2F2F` | Error states only |

All body and subtitle text sits at or above 4.5:1 against its backdrop. Because text sits on photographic images, every text block requires a scrim or a text shadow — never place `--text` directly on an unscrimmed image.

No gradients except the door-sequence fade to black. No glassmorphism. No neon.

## Typography

Two faces, both from Google Fonts, both loaded via `next/font`.

- **EB Garamond** — the psychologist's dialogue and the notebook. Serif, editorial, human. Weights 400 and 500. Italic used only for her acknowledgement lines.
- **Inter** — everything functional: the input, the character count, error text. Weights 400 and 500. Never used for her dialogue.

Scale, 1.25 major third, base 16px:

| Token | Size / line-height | Use |
|---|---|---|
| `--text-xs` | 0.8rem / 1.5 | Character count, hints |
| `--text-sm` | 1rem / 1.6 | Input text, errors |
| `--text-base` | 1.25rem / 1.65 | Notebook lines |
| `--text-lg` | 1.563rem / 1.5 | Her subtitles (default) |
| `--text-xl` | 1.953rem / 1.4 | "I think I understand." and the closing line |
| `--text-2xl` | 2.441rem / 1.25 | Title on the gate |
| `--text-3xl` | 3.052rem / 1.15 | Reserved, likely unused |

Her dialogue is letterspaced `0.01em` and never bold. Emphasis comes from size and silence, not weight.

## Spacing & layout

Base unit 4px. Scale: `4, 8, 12, 16, 24, 32, 48, 64, 96`.

The app is always full-viewport, `100dvh`, `overflow: hidden`. No scrolling exists anywhere in the product. Desktop only — 1280px minimum width. No responsive breakpoints; if the viewport is narrower than 1024px, show a single line asking for a larger screen.

Subtitles sit in a centred column, `max-width: 52ch`, bottom-anchored at `--space-64` from the base.

## Radii, borders, shadows

- Radius: `0` everywhere except the answer input, which is `2px`. Nothing is rounded. Rounded corners read as UI and UI breaks the illusion.
- Borders: one style only — a `1px` hairline in `--brass` at 20% opacity, used on the answer input's bottom edge and nowhere else.
- Shadows: none. Depth comes from the vignette and the image, not from box-shadow.

## The cinematic treatment layer

This is what makes generated stills and 480p video look intentional. It applies to the office scene and the world screen alike, as a fixed overlay stack above the media and below the text.

1. **Vignette** — radial gradient, transparent centre to `rgba(0,0,0,0.55)` at the corners.
2. **Grain** — a tiling SVG feTurbulence noise layer at 4–6% opacity, `mix-blend-mode: overlay`. Static, not animated.
3. **Letterbox** — `--bg` bars top and bottom to a 2.39:1 frame. Non-negotiable; it does more for the feel than any other single decision.
4. **Warm grade (office only)** — `sepia(0.08) saturate(1.1) contrast(1.05)`.
5. **Cold crush (world only)** — `contrast(1.15) saturate(0.85) brightness(0.92)`. This also conceals the world model's lower resolution; darkness is the best upscaler available.

The office image additionally gets a slow drift: a 60-second `ease-in-out` alternating transform, scaling 1.04 → 1.07 with a 1.5% translate. Barely perceptible. Its purpose is to stop the brain registering a still image.

## Motion

- Standard transition: `220ms cubic-bezier(0.4, 0, 0.2, 1)`.
- Subtitle entrance: 400ms fade with a 6px rise. Exit: 250ms fade, no movement.
- Answer overlay: 300ms scrim fade, input rises 12px.
- Notebook lines: typed out at 32ms per character, 600ms pause between lines.
- Door sequence and the cut to black: 1500ms, slower than anything else in the app.
- The hard cut at t=60s is a **cut**, 0ms. No fade. It should be jarring.
- No spinners. No progress bars. No skeleton loaders. Anywhere. Waiting is covered by content, never by an indicator.
- Respect `prefers-reduced-motion`: drop the drift and the subtitle rise, keep the fades.

## Required UI states

There are only three states in this product and all three are designed:

- **Waiting** — covered by the door sequence, the ambience, and the rising sub-bass. Never a loading indicator.
- **Error** — a single line of Inter in `--danger`, centred on `--bg`, in plain human language, with no code and no stack trace. One line only.
- **Populated** — the normal path.

There is no empty state, because there is no data view.

## Component rules

**Gate.** Full black. Title in EB Garamond at `--text-2xl`, centred. One line beneath in `--text-muted`: the instruction to begin. The whole viewport is the click target. No button.

**Subtitle.** Her lines appear as a whole block, not typed character by character. Bottom-anchored, scrimmed with a subtle upward `--overlay` gradient behind the text only.

**Answer overlay.** `--overlay` scrim across the full frame. A single input, no label, no placeholder, `--text-sm` Inter, transparent background, `--brass` hairline underneath, `--burgundy` caret. Autofocus. Enter submits. Character count appears in `--text-xs` only after 400 characters. Rejection of an empty submission is a 3px horizontal shake, not an error message.

**World screen.** The video element fills the frame, `object-fit: cover`. Zero interface on top of it — no timer, no crosshair, no control hints, no HUD. If the player needs to know the controls, show them for 2.5 seconds at the very start and then remove them permanently.

**Notebook.** Off-white paper tone, EB Garamond at `--text-base`, `--walnut` ink, lines typed out sequentially. The only element in the app permitted a paper texture.

**Focus states.** Every focusable element gets a visible `2px --brass` outline at `outline-offset: 2px`. The input is the only focusable element in the app, so there is no excuse for getting this wrong.

## Quality bar

The test is whether a still frame from any point in this app would look at home as a shot in an A24 film. If a screen looks like software, it is not done. Consistency of grade and letterbox across all eight states matters more than the polish of any single one.
