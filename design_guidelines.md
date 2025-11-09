# Design Guidelines: Drive Wise - Toyota Financial Platform

## Design Approach

**Reference-Based Design**: Toyota Financial website aesthetic with professional fintech polish. Draw inspiration from Toyota Financial's clean corporate design, Stripe's data clarity, and Linear's modern typography system.

**Design Principles**:
- Professional trust and credibility through clean layouts
- Data transparency with clear visual hierarchy
- Accessible financial tools that don't overwhelm
- Premium automotive brand quality

## Typography System

**Font Families** (Google Fonts):
- Primary: "Inter" (UI, body text, data displays)
- Accent: "Lexend" (headings, CTAs, emphasis)

**Type Scale**:
- Hero Headline: text-5xl md:text-6xl lg:text-7xl, font-bold
- Section Headers: text-3xl md:text-4xl, font-semibold
- Subsections: text-xl md:text-2xl, font-medium
- Body Text: text-base md:text-lg, font-normal
- Data Labels: text-sm, font-medium, uppercase tracking-wide
- Financial Figures: text-2xl md:text-3xl, font-bold, tabular-nums

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 24 for consistency
- Micro spacing: p-2, gap-4 (internal component spacing)
- Standard spacing: p-6, py-8, gap-6 (sections, cards)
- Major spacing: py-16, py-24 (between page sections)

**Container Strategy**:
- Full-width sections: w-full with max-w-7xl mx-auto px-6
- Content blocks: max-w-6xl for data-rich sections
- Form containers: max-w-2xl for focused input flows
- Text content: max-w-prose for readability

## Core Components

### Navigation
Top navigation bar (sticky): Logo left, primary links center, "Get Started" CTA right with authentication button. Height: h-20. Include subtle border-b with backdrop blur effect.

### Hero Section
Full-width hero (~85vh) with professional Toyota vehicle imagery showcasing flagship models. Overlay gradient for text readability. Left-aligned headline + subheadline with primary CTA ("Calculate Your Budget") and secondary link ("Browse Vehicles"). Include trust indicators below CTAs: "Real-time pricing • AI-powered matching • Transparent costs"

### Financial Input Forms
Multi-step wizard design with progress indicator. Cards with generous padding (p-8), clear input labels above fields, helper text below. Group related inputs (Personal Finance, Vehicle Preferences, Loan Details). Include range sliders for budget/income with live value displays.

### Affordability Dashboard
Three-column layout on desktop, stacked on mobile:
1. Affordability Score (large circular progress indicator with color-coded zones)
2. Monthly Cost Breakdown (donut chart with itemized list)
3. Budget vs. Reality comparison bars

### Interactive Depreciation Visualization
Full-width chart section with checkbox filters above graph area. Use area charts with confidence interval shading. Filter categories in pill-button groups: Vehicle Factors (mileage, condition), Market Factors (interest rates, gas prices), Regional (location-based). Live data points on hover.

### Vehicle Comparison Cards
Grid layout (grid-cols-1 md:grid-cols-2 lg:grid-cols-3) with elevated cards. Each card: Vehicle image top, model name/trim, key specs (3-column micro-grid), pricing summary, match percentage badge (top-right corner), TCO estimate, dual CTAs ("Compare" + "View Details").

### Personalized Recommendations Section
AI-powered matches with "Why This Match" expansion panels. Display percentage match prominently (text-4xl) with breakdown badges (Salary Fit, Reliability, Term Match). Include Gemini-generated natural language explanations.

### Review Integration Module
Masonry-style review cards with CarGurus attribution. Star ratings, verified badge, review snippet (3-4 lines), "Read More" expansion. Filter by model/trim with search functionality.

### Data Transparency Panel
Accordion-style sections showing data sources, last updated timestamps, calculation methodologies. Use monospace font for technical details. Include "Assumptions" expandable with scenario parameters.

## Component Library

**Buttons**:
- Primary: Large, rounded-lg, font-semibold, px-8 py-4
- Secondary: Outlined variant with hover state
- Text links: Underline on hover, font-medium

**Input Fields**:
- Standard height: h-12
- Rounded corners: rounded-lg
- Focus states with ring effect
- Labels: font-medium, mb-2

**Cards**:
- Elevated: shadow-lg with rounded-xl
- Flat: border with rounded-lg
- Padding: p-6 to p-8 depending on content density

**Badges & Tags**:
- Rounded-full for status indicators
- Rounded-md for categorical labels
- Small text (text-xs to text-sm), uppercase, font-semibold

**Charts & Visualizations**:
- Use shadcn/ui chart components with Recharts
- Consistent spacing around chart areas (p-6)
- Clear axis labels with grid lines
- Interactive tooltips on hover

## Page Structure

1. **Hero** (85vh with image)
2. **Quick Calculator Preview** (simplified input → instant affordability score)
3. **How It Works** (3-step process with icons)
4. **Featured Toyota Models** (grid of 6 vehicles with quick stats)
5. **Financial Intelligence** (split section: depreciation insights + AI recommendations)
6. **Reviews & Social Proof** (carousel of customer reviews)
7. **Trust & Transparency** (data sources, methodology, compliance)
8. **Footer** (comprehensive navigation, newsletter signup, contact info, Toyota Financial branding)

## Images

**Hero Image**: High-quality lifestyle photography featuring multiple Toyota models in professional setting (dealership showroom or scenic outdoor environment). Image should convey premium quality and aspiration. Overlay: dark gradient from bottom-left to allow white text contrast.

**Vehicle Cards**: Product photography of each Toyota model on white/transparent background. Consistent angle (3/4 front view), high resolution, showcase vehicle features.

**Section Backgrounds**: Subtle abstract patterns or gradient meshes for visual interest in data-heavy sections. Keep muted to not compete with content.

**Icons**: Use Heroicons (outline variant) throughout for consistency - calculator, chart-bar, shield-check, sparkles (AI), document-text.

## Animations

Minimal, purposeful motion:
- Page transitions: Smooth fade-in with slight upward movement (Framer Motion)
- Chart rendering: Animated line drawing on scroll-into-view
- Card hover: Subtle lift (translateY: -4px) with shadow increase
- Form progression: Slide transitions between wizard steps
- No gratuitous scroll effects