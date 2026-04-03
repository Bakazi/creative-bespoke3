---
## Task ID: 2 - frontend-developer
### Work Task
Build a "Luminary" Business Landing Page in Next.js by converting the static HTML template at `/home/z/my-project/upload/business_landing_page.html` into a fully interactive Next.js 16 application with React components.

### Work Summary

#### Files Modified/Created:
1. **`src/app/globals.css`** — Added all custom CSS from the HTML template, scoped under `body.luminary-body` to avoid conflicts with existing shadcn/ui styles. This includes:
   - CSS custom properties (`--lum-bg`, `--lum-gold`, `--lum-accent`, etc.)
   - All component styles (nav, hero, stats, services, feature, testimonials, CTA, footer)
   - All keyframe animations (`lum-fadeUp`, `lum-fadeIn`, `lum-scrollAnim`, `lum-spin`)
   - Custom cursor styles (gold dot + ring)
   - Full responsive media queries (mobile breakpoint at 900px)
   - Kept existing Tailwind CSS imports and shadcn/ui theme variables intact

2. **`src/app/layout.tsx`** — Updated to use Cormorant Garamond and DM Mono via `next/font/google`, removed Geist fonts, updated metadata for Luminary branding, and removed the `antialiased bg-background text-foreground` classes so the custom dark theme takes over.

3. **`src/app/page.tsx`** — Complete single-page application as a `'use client'` component with:
   - **Custom Cursor** (`useCustomCursor` hook): Gold dot + ring following mouse with smooth interpolation via `requestAnimationFrame`
   - **Hover Detection** (`useHoverDetection` hook): Adds/removes `hovering` class on body when hovering interactive elements (a, button, input), with MutationObserver to handle dynamically added elements
   - **Navbar**: Fixed nav with scroll detection (`scrolled` class toggles background blur and border)
   - **Hero Section**: Full-height with grid background, animated title/subtitle/description with staggered CSS `fadeUp` animations, CTA buttons, scroll indicator
   - **Stats Bar**: 4-column grid with animated number counters using `IntersectionObserver` and eased `requestAnimationFrame` animation
   - **Services Grid**: 6 service cards with inline SVG icons, hover effects (top border reveal, background change), scroll-triggered fade-in with staggered delays
   - **Feature/Approach Section**: Split layout with animated orb (spinning dashed border rings) and feature list with scroll-reveal animations
   - **Testimonials**: 3 testimonial cards with quotes, avatar initials, author info, hover border effects
   - **CTA Section**: Email input with validation logic (checks for `@`), Enter key support, success/error messaging with auto-reset
   - **Footer**: 3-column grid with logo, links, copyright

#### Key Technical Decisions:
- Used `body.luminary-body` CSS scoping to isolate the landing page styles from the default shadcn/ui theme
- Extracted `animateNumbers` as a standalone function (outside the hook) to resolve ESLint `react-hooks/immutability` error about accessing a function before declaration
- Used `data-idx` attributes on service cards and feature list items for staggered animation delays
- Used `data-value` attributes on stat numbers for reliable counter animation values
- All SVG icons are inline React components for zero external dependencies
- Used `useCallback` for the `handleSubmit` and `handleKeyDown` handlers to prevent unnecessary re-renders

#### Verification:
- ESLint passes with zero errors
- Dev server compiles successfully (GET / 200)
- No TypeScript errors
- All animations (cursor, scroll reveal, number counter, nav scroll) are functional
- Responsive design works with 900px mobile breakpoint
