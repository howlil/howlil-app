# Design QA — profile interactions and experience logos

## Comparison target

- Source visual truth: user-supplied `610e4ada-fee1-4402-a9a1-63fa670b0fb8.png` and `66512171-70c5-4c54-b833-38edde35b8a5.png` for social hover states; `metro.jpg` and `meets.jpg` for company marks.
- Implementation target: local `howlil-app` homepage and About route.
- Intended viewport/state: desktop homepage in dark mode, GitHub/profile icon hover, floating navigation hover-open, and the Experience section; mobile responsive state at 360 px.
- Source pixels: 824 × 567 and 824 × 313 for interaction references; 400 × 400 for each supplied logo.
- Implementation pixels/CSS size/density: unavailable because the cloud browser could not reach the running local preview.

## Evidence

- Full-view comparison: blocked; no browser-rendered implementation screenshot could be captured.
- Focused region comparison: blocked for the same environment-level browser access failure.
- Source assets were opened and inspected. The Metro source was non-destructively cropped to its visible lockup (310 × 125) for legibility; the Meets source remains at 400 × 400.

## Findings

- [P1] Browser-rendered comparison unavailable
  - Location: homepage social actions, floating navigation, Experience, and About Experience.
  - Evidence: the local preview service reports running, but the cloud browser rejects its preview address before the application renders.
  - Impact: code-level checks cannot prove visual alignment, hover positioning, responsive overflow, or console cleanliness.
  - Fix: repeat desktop, dark-theme, hover/focus, and 360 px captures when browser access is restored; compare each against the supplied references in the same comparison input.

## Verified outside visual QA

- `astro check`: passed with 0 errors and 2 existing inline-script hints.
- `vitest run tests/unit`: passed, 18/18.
- `astro build`: passed, 15 static pages.
- `git diff --check`: passed.
- Added responsive interaction assertions for company logos, copy-email CTA, GitHub contribution preview, and hover-open navigation; browser execution remains blocked by preview access.

## Primary interactions pending browser verification

- Copy email success state and clipboard value.
- Social hover/focus preview entry and exit.
- GitHub contribution-calendar preview.
- Floating navbar hover, click, keyboard toggle, and Escape close.
- Browser console error check.

## Comparison history

- Iteration 1: source references and assets inspected; implementation built and static checks passed; browser capture blocked before visual comparison.

final result: blocked
