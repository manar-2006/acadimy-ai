---
name: Academic Tech
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#43474e'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#455f88'
  primary: '#002045'
  on-primary: '#ffffff'
  primary-container: '#1a365d'
  on-primary-container: '#86a0cd'
  inverse-primary: '#adc7f7'
  secondary: '#006b5f'
  on-secondary: '#ffffff'
  secondary-container: '#62fae3'
  on-secondary-container: '#007165'
  tertiary: '#09007b'
  on-tertiary: '#ffffff'
  tertiary-container: '#1910af'
  on-tertiary-container: '#9194ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#adc7f7'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#2d476f'
  secondary-fixed: '#62fae3'
  secondary-fixed-dim: '#3cddc7'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005047'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Sora
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Sora
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-xl-mobile:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system establishes a visual language described as "Academic Tech." It bridges the gap between the historic prestige of higher education and the frictionless speed of modern artificial intelligence. The personality is authoritative yet empowering, designed to provide university students with a high-focus environment that feels both institutionally reliable and technologically advanced.

The aesthetic leans into **Corporate Modern** with strategic **Glassmorphic** accents. High-contrast typography and generous whitespace ensure cognitive load is minimized during intense study sessions. The "AI" elements are distinguished by translucent layers and vibrant accents, signaling intelligence and responsiveness within a stable, traditional framework.

## Colors

This design system utilizes a palette that conveys trust through depth and innovation through vibrance.

- **Primary (Deep Academic Blue):** Used for core navigation, headers, and primary actions to establish an authoritative foundation.
- **Secondary (Vibrant Teal):** Reserved for AI-driven features, active states, and "smart" highlights. It represents the innovative pulse of the system.
- **Tertiary (Soft Indigo):** Used for interactive secondary elements and subtle brand moments that connect tradition with tech.
- **Surface & Background:** A base of clean white is supported by very light cool grays to define zones without introducing visual noise.
- **Functional Colors:** Emerald and Amber are employed strictly for progress tracking and status indicators, ensuring students can quickly scan their academic standing.

## Typography

The typography strategy focuses on a hierarchy that balances technical precision with editorial readability.

**Sora** is utilized for headlines to provide a geometric, modern character that feels "engineered." It is set with tighter letter-spacing in larger formats to create a compact, professional impact.

**Inter** is the workhorse for all body copy and UI labels. To support long-form academic reading, the `body-lg` and `body-md` levels feature an increased line-height (1.6x) to prevent eye strain. Semantic labels use a slightly increased letter-spacing and bold weight for immediate identification in data-heavy contexts.

## Layout & Spacing

This design system employs a **Fixed Grid** model for desktop to maintain a professional, journal-like reading experience, while transitioning to a **Fluid Grid** for mobile devices.

- **Desktop:** A 12-column grid with a 1280px max-width centered in the viewport. Gutters are set to 24px to provide clear separation between cards and content modules.
- **Mobile:** A 4-column fluid grid with 16px side margins.
- **Rhythm:** An 8px base unit governs all padding and margins, ensuring a consistent vertical rhythm. Components like "Intelligent Cards" use `stack-md` (24px) internal padding to ensure high-contrast content feels airy and approachable.

## Elevation & Depth

Depth is used to distinguish between static academic content and dynamic AI interactions:

1.  **Level 0 (Flat):** Primary background surface (#F8FAFC).
2.  **Level 1 (Raised):** Standard cards and navigation sidebars. Use a subtle 1px border (#E2E8F0) and a soft, low-opacity shadow (Offset 0 4px, Blur 12px, 2% Primary Color tint).
3.  **Level 2 (AI/Floating):** Chat bubbles and AI insight panels. These use a **Glassmorphic** effect: `backdrop-filter: blur(12px)` with a 70% white fill and a 1px border using a gradient of white to Secondary Teal.
4.  **Level 3 (Overlay):** Modals and dropdowns. These use deeper, more diffused shadows to focus user attention, with a semi-transparent backdrop blur over the content below.

## Shapes

The shape language is "Softly Professional." This design system uses the **Rounded** (Level 2) configuration to balance the sharpness of academic rigor with the friendliness of a modern learning tool.

- **Standard Elements:** 8px (`0.5rem`) for inputs and small buttons.
- **Containers/Cards:** 16px (`1rem`) for course cards and main dashboard panels.
- **AI Components:** 24px (`1.5rem`) for AI chat bubbles to emphasize a more organic, conversational feel compared to the structured grid.

## Components

### Intelligent Cards
Cards serve as the primary container for courses and projects. They feature a white background, a soft border, and a `rounded-lg` corner radius. The header of the card should use `headline-sm` in Primary Blue.

### AI Chat Interface
The assistant UI utilizes the glassmorphic style. User messages are styled with the Primary Blue background and white text, while AI responses use the teal-tinted glass surface. The input field should be a "pill-shape" (`rounded-xl`) to distinguish it from standard form fields.

### Progress Rings & Analytics
Data visualization uses the Secondary Teal for current progress and the Primary Blue for benchmarks. Ensure a thick stroke-width for progress rings to maintain accessibility and high-contrast visual weight.

### Sidebar Navigation
The navigation resides in a fixed left-side panel. It uses a very light gray background (#F1F5F9) to subtly separate it from the main workspace. Active states are indicated by a 4px vertical "Secondary Teal" bar on the left edge of the menu item and a shift in text weight to bold.

### Form Inputs
Input fields use a subtle cool gray border that transitions to the Secondary Teal on focus. Labels always sit above the field in `label-md` for maximum clarity during data entry.