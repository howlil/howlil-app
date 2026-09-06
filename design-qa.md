# Design QA — profile interactions and experience logos

## Comparison target

- Source visual truth: user-supplied `610e4ada-fee1-4402-a9a1-63fa670b0fb8.png` and `66512171-70c5-4c54-b833-38edde35b8a5.png` for social hover states; `metro.jpg` and `meets.jpg` for company marks.
- Browser-rendered implementation: `https://howlil.tech/` after commit `eec0c7eb2540a7761d4b683f81d70a7517fccc81` reached production.
- Full-view viewport: 1363 × 936 CSS px at 1× density.
- Focused comparison crop: 450 × 230/250 CSS px at 1× density.
- Source pixels: 824 × 567 and 824 × 313 for interaction references; 400 × 400 for each supplied logo.
- States: light homepage, dark LinkedIn hover, dark GitHub hover, floating navigation hover-open, Experience, and copy-email activation.

## Evidence

- Full-view: the production homepage preserves the established 640 px reading column, compact action row, Experience hierarchy, and floating navigation while adding the requested states without changing page density.
- Focused LinkedIn comparison: both source and implementation place a rounded dark profile card above the action row with avatar, identity copy, and a right-aligned destination action. The implementation uses verified portfolio identity content and the site’s tighter type scale.
- Focused GitHub comparison: both source and implementation use a wider rounded card above the GitHub icon and a 7-row contribution calendar. The implementation renders 364 cells and avoids a fabricated contribution total.
- Company marks: Metro loads at natural 310 × 125 and renders at approximately 44.8 × 21.6; Meets loads at natural 400 × 400 and renders at approximately 21.6 × 21.6. Both complete successfully without distortion.
- Motion: profile cards enter/exit on hover and keyboard focus; the navbar opens on pointer hover and remains available through click, keyboard shortcut, and Escape.
- Console: no application-origin warnings or errors. Browser-extension metadata errors were excluded.

## Required fidelity surfaces

- Fonts and typography: existing serif identity and compact sans/mono UI scale are preserved; card hierarchy and truncation remain readable in both themes.
- Spacing and layout rhythm: hover cards align to the action row, remain inside the narrow shell, and match the reference’s card-above-icons relationship; navbar expansion does not shift its center.
- Colors and tokens: cards use the existing neutral surface/border tokens in light mode and the reference-like graphite surface in dark mode; GitHub activity uses restrained green levels.
- Image quality and asset fidelity: supplied company marks are used directly; Metro is cropped to the visible lockup for legibility, not redrawn. Social brands come from the maintained Font Awesome 6 icon set in `react-icons`.
- Copy and content: CTA reads “Copy my email” and targets `mhdulilabshar27@gmail.com`; social cards use real profile identity and destination labels.

## Findings

- P0: none.
- P1: none.
- P2: none.
- P3: the cloud browser disallows clipboard writes, so the clipboard payload cannot be read back in this environment. The production code uses the secure Clipboard API first, a selected-text copy fallback second, and `mailto:` only if both browser copy paths fail.
- P3: the repository CI deploy step fails on the existing Cloudflare API token permissions after all verification steps pass. The linked production deployment still updated independently.

## Verification

- `astro check`: passed with 0 errors and existing inline-script/deprecation hints only.
- `vitest run tests/unit`: passed, 18/18.
- `astro build`: passed, 15 pages.
- GitHub CI responsive suite: passed, 25/25 at 360 px, 768 px, and 1280 px before the separate Cloudflare credential failure.
- Primary interactions tested in production: social hover cards, GitHub contribution preview, floating navbar hover-open, theme switch, Escape close, and copy-email activation.

## Comparison history

- Iteration 1: local cloud-preview access was blocked; static checks passed and the report remained blocked.
- Iteration 2: production deployment became available; focused dark LinkedIn and GitHub states were captured alongside the supplied references. No P0/P1/P2 mismatch remained.
- Iteration 3: clipboard write was not observable under cloud-browser policy; a second local copy fallback was added and the implementation was rebuilt.

final result: passed
