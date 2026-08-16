---
name: Sree & Sajith Wedding Invitation
description: A warm, traditional South Indian wedding invitation expressed with quiet ceremonial richness.
colors:
  warm-ivory: "#fffdf8"
  ceremonial-cream: "#fbf8f0"
  soft-sand: "#f1e8d8"
  green-wash: "#f0f1e8"
  kumkum-maroon: "#7a2634"
  deep-maroon: "#6b1f2e"
  temple-gold: "#b28a45"
  pale-brass: "#dcc58d"
  readable-brass: "#765b25"
  leaf-green: "#536758"
  warm-ink: "#352d29"
  muted-brown: "#7b7069"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(3rem, 15vw, 8rem)"
    fontWeight: 500
    lineHeight: 0.88
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(2rem, 5vw, 3rem)"
    fontWeight: 500
    lineHeight: 1.1
  body:
    fontFamily: "Noto Sans, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Noto Sans, Arial, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.18em"
rounded:
  none: "0"
  field: "0"
  soft: "10px"
  card: "14px"
  pill: "999px"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1.25rem"
  lg: "2rem"
  xl: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.kumkum-maroon}"
    textColor: "{colors.warm-ivory}"
    rounded: "{rounded.pill}"
    padding: "0.55rem 0.9rem"
    height: "44px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.kumkum-maroon}"
    rounded: "{rounded.pill}"
    padding: "0.55rem 0.9rem"
    height: "44px"
  card:
    backgroundColor: "{colors.warm-ivory}"
    textColor: "{colors.warm-ink}"
    rounded: "{rounded.card}"
    padding: "clamp(1.5rem, 4vw, 2rem)"
---

# Design System: Sree & Sajith Wedding Invitation

## Overview

**Creative North Star: "The Kerala Heirloom Invitation"**

The interface should feel like a cherished ceremonial invitation translated into a calm digital experience: warm, gracious, traditional, and unmistakably personal. Its richness comes from measured shifts among ivory, sand, maroon, brass, and leaf green—not from visual excess.

The composition remains centered and welcoming, with generous breathing room and a clear procession from invitation to events, venues, RSVP, and closing. Components are tactile and ceremonial, while the overall surface is softly layered and easy to use.

**Key Characteristics:**

- Warm paper-like surfaces with restrained ceremonial color.
- Elegant serif display type paired with highly legible multilingual sans serif text.
- Softly layered cards, fine borders, and selective shadows.
- Tactile pill actions with accessible touch targets.
- Traditional atmosphere without ornamental density.

## Colors

The palette draws exclusively from a traditional wedding family, balancing kumkum maroon and temple brass with leaf green and warm paper neutrals.

### Primary

- **Kumkum Maroon:** The principal ceremonial accent for names, major headings, primary actions, and selection states.
- **Deep Maroon:** A deeper anchor reserved for strong closing or navigation surfaces where sufficient contrast is maintained.

### Secondary

- **Leaf Green:** A calm counterpoint used for supporting headings, details, icons, and selected section treatments.
- **Temple Gold:** A decorative accent for borders, dividers, symbols, and small details; it is not body text on light backgrounds.

### Tertiary

- **Readable Brass:** The accessible dark-brass text color for small gold-character copy on cream or ivory.
- **Pale Brass:** A highlight for dark ceremonial surfaces and focus indicators.

### Neutral

- **Warm Ivory:** The cleanest card and form surface.
- **Ceremonial Cream:** The primary page ground.
- **Soft Sand:** A warmer sectional surface, particularly effective around RSVP content.
- **Green Wash:** A subtle neutral alternative when a section needs a cooler traditional rhythm.
- **Warm Ink:** The default readable text color.
- **Muted Brown:** Secondary text and address content.

**The Brass Is Detail Rule.** Gold and brass signal ceremony through small accents; they never carry long-form copy or low-contrast text on pale surfaces.

**The Procession Rule.** Section colors should alternate with intent, but adjacent sections must still feel like pages from the same invitation rather than unrelated blocks.

## Typography

**Display Font:** Cormorant Garamond (with Georgia and serif fallbacks)  
**Body Font:** Noto Sans (with Arial and sans-serif fallbacks)  
**Malayalam Font:** Noto Sans Malayalam  
**Tamil Font:** Noto Sans Tamil

**Character:** The high-contrast serif brings invitation-form elegance; the Noto family keeps details, controls, and multilingual lines clear and culturally respectful.

### Hierarchy

- **Display** (500, responsive clamp, compact line height): Couple names and the singular hero statement.
- **Headline** (500, responsive clamp, approximately 1.1 line height): Section and card headings.
- **Body** (400, 1rem, 1.65 line height): Invitation, venue, event, and form support copy.
- **Label** (700, small, widely tracked uppercase): Eyebrows, navigation, dates, and field labels.

**The One Flourish Rule.** Let the serif provide the flourish; supporting text remains quiet, legible, and structurally consistent.

## Layout

The page uses a centered ceremonial procession with full-width section surfaces and content constrained to roughly 680–760px for primary reading and form areas. Large screens receive generous vertical padding; smaller screens compress without losing the sense of occasion.

Cards use one- or two-column arrangements where the content benefits from comparison. At tablet widths they collapse to a single column. Touch targets remain at least 44px high, and narrow screens preserve readable names, stacked actions, and full-width form controls.

## Elevation & Depth

The system is softly layered. Tonal shifts and fine borders establish most hierarchy; restrained ambient shadows may lift task-focused surfaces such as the RSVP form. Cards should never appear glossy, heavily floating, or app-dashboard-like.

### Shadow Vocabulary

- **Ambient Ceremony** (`0 18px 50px rgba(0,0,0,.10)`): Optional, used sparingly for a single important light surface over a tonal section.

**The One Lift Rule.** Within a section, elevate the primary interaction surface and allow supporting cards to remain border-led.

## Shapes

Cards use gently rounded 14px corners, contact items use restrained 10px corners, and action buttons use a full pill silhouette. Inputs remain square-edged to preserve a formal stationery character. Fine borders, circles, and simple geometric marks echo traditional invitation detailing without introducing dense ornament.

## Components

### Buttons

- **Shape:** Tactile pill silhouette with a minimum 44px touch target.
- **Primary:** Kumkum maroon with warm ivory text where the action needs clear emphasis.
- **Hover / Focus:** Hover may shift to leaf green; keyboard focus uses a visible pale-brass outline with offset.
- **Outline:** Transparent with a restrained maroon border and maroon label.

### Cards / Containers

- **Corner Style:** Gently rounded (14px).
- **Background:** Warm ivory over ceremonial cream, maroon, or sand section grounds.
- **Shadow Strategy:** Border-led by default; ambient shadow only for a primary task surface.
- **Internal Padding:** Responsive, generally 1.5–2rem.

### Inputs / Fields

- **Style:** Warm white field surface, square corners, dark neutral text, and a fine warm-brown border.
- **Focus:** Visible outline and clear caret color; never rely on color change alone.
- **Error / Disabled:** Field-level maroon error text, `aria-invalid`, linked descriptions, and a reinforced error border.

### Navigation

The navigation is a light, lightly translucent cream bar with an editorial monogram and small uppercase links. Links retain 44px touch height at every size; the mobile treatment stays visible and direct rather than introducing dead or hidden menu behavior.

### Event and Venue Cards

Event cards use ivory surfaces against a deep maroon ceremonial section. Venue cards are centered, restrained, and bordered in muted temple gold. Both prioritize event truth and actionable details over decoration.

## Do's and Don'ts

### Do:

- **Do** create rhythm with warm neutrals, maroon, brass, and leaf green while keeping paragraphs in warm ink or another high-contrast neutral.
- **Do** use soft layering, fine borders, and at most one restrained elevated surface per section.
- **Do** keep components tactile, ceremonial, and comfortably touchable.
- **Do** preserve the centered, gracious invitation character across screen sizes.

### Don't:

- **Don't** drift into generic trendy luxury minimalism or fashion-editorial coldness.
- **Don't** create bright festival-style color blocking or treat each section as an unrelated palette.
- **Don't** add dense ornamental decoration, visual clutter, or gratuitous traditional motifs.
- **Don't** place low-contrast gold text on cream or ivory.
- **Don't** recolor every paragraph; color should establish rhythm and hierarchy.
