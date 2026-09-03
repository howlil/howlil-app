# Portfolio Design Contract

## Purpose

The portfolio should communicate engineering judgment and evidence before visual decoration. The visual identity is **technical editorial**: calm, specific, readable, and architecture-led.

## Hierarchy

1. Engineering identity must be clear above the fold.
2. Flagship work is the dominant proof surface.
3. Project evidence should surface the constraint, decision, result, and relevant architecture before secondary metadata.
4. Experience and writing support the portfolio; they should not compete with selected work.
5. Prefer hierarchy through typography, spacing, alignment, and density before adding borders or containers.

## Visual vocabulary

Use:
- warm neutral page and surface tokens;
- strong sans-serif headings with readable serif long-form prose;
- real architecture, state, deployment, and workflow diagrams;
- thin rules where they clarify structure;
- modest radius and almost no shadow;
- monospace only for actual metadata such as dates, indices, technical focus, or code;
- functional motion for navigation, focus, disclosure, and image inspection.

Avoid by default:
- decorative gradients or glow;
- glass cards and floating panels;
- decorative bento layouts;
- fake terminals or random code backgrounds;
- logo clouds and decorative metric widgets;
- excessive pills/chips;
- large rounded cards without a structural reason;
- 3D/WebGL decoration;
- animation added only to make the portfolio feel dynamic.

## Decision rule

Before adding a visual treatment, it must materially improve at least one of:

- information hierarchy;
- comprehension;
- navigation or interaction feedback;
- technical evidence.

If it does not, do not add it.

## Responsive rule

Mobile preserves the same hierarchy rather than creating a different product: identity first, flagship evidence second, supporting information last. Technical diagrams must remain readable without horizontal page overflow, and interactive targets remain touch-safe.
