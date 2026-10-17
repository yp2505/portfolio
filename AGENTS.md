<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:ui-and-animation-rules -->
# UI Design Engineering & Animation Guidelines (Emil Kowalski Skills)

When creating, reviewing, or editing UI elements, components, and animations in this codebase, strictly follow the rules in `.agents/skills/` (also mirrored at `.skills/`):

- **Main Philosophy (`emil-design-eng` & `animate`)**: Prioritize subtle, high-craft visual polish, appropriate easings (`ease-out` for enters, `ease-in` for exits, never reversed), correct durations (usually 150ms-300ms for micro-interactions), and animating only composite-friendly properties (`transform`, `opacity`).
- **Animation Review (`review-animations`)**: Refer to `review-animations` before concluding any transition or animation implementation.
- **Performance (`animation-performance`)**: Keep animations within the 60/120fps frame budget, avoid layout thrashing, and minimize heavy filter/blur recalcs.
- **Mobile Native Polish (`mobile-native`)**: Prevent sticky hover states on touch, fix mobile viewport 100vh issues (use `dvh`), disable unwanted tap highlight flashes (`-webkit-tap-highlight-color: transparent`), handle safe-area insets, and prevent iOS input auto-zooming.
- **Stress-Testing (`break-ui`)**: Test components against edge cases (long text, empty states, overflow, rapid interactions).
<!-- END:ui-and-animation-rules -->

