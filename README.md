# Handoff: Vollfood — Family Cookbook App

## Overview
Vollfood is a private, invite-only family cookbook app. The core concept is **recipe forking**: multiple family members can have their own version of the same recipe, and the app lets you browse, compare, and save all versions side-by-side. The app is mobile-first (iOS) with an invite-only login, role-based family management, and a voice-first recipe creation flow.

## About the Design Files
The files in this bundle (`Vollfood.html`, `vollfood-app.jsx`) are **HTML/React design references** — high-fidelity prototypes showing intended look, layout, and interaction behaviour. They are **not** production code to copy directly.

Your task is to **recreate these designs in your target codebase** (React Native, Swift/SwiftUI, Expo, etc.) using its established patterns, navigation libraries, and component systems. Use the HTML prototypes as a pixel-level visual reference and interaction spec.

To preview the designs locally: open `Vollfood.html` in a browser (requires internet for React/Babel CDN). All mock data and components are in `vollfood-app.jsx`.

## Fidelity
**High-fidelity.** Colors, typography, spacing, component shapes, and interactions are all finalised. Recreate pixel-accurately.

---

## Design Tokens

### Colors (default: Terracotta scheme)
```
Background:       #FAF7F2
Card/surface:     #FFFFFF
Primary:          #C8622A
Primary soft:     #F0CDB8
Primary bg:       #FDF3EC
Primary dark:     #8B3812
Text:             #2A1810
Mid text:         #7D5A48
Muted text:       #B8967A
Border:           #EDE3D8
Surface:          #F5EDE3
Success:          #4E7C5E
Tab bar bg:       rgba(250,247,242,0.97)
```

Alternative schemes (user-switchable):
- **Forest Green**: primary `#4E7C5E`, bg `#F5FAF6`
- **Dark**: primary `#E8A87C`, bg `#1A1209`, dark mode

### Typography
- **Font family**: `Helvetica Neue, Helvetica, Arial, sans-serif` throughout
- Title / screen heading: 22px, weight 700
- Section label: 12px, weight 700, uppercase, letter-spacing 0.8px, muted colour
- Body / list item: 15px, weight 600 (name), 12px muted (meta)
- Small labels / badges: 11–12px, weight 600
- Button primary: 16px, weight 700

### Spacing
- Screen horizontal padding: 16px
- Card border-radius: 16–18px
- Row height (compact list): ~68px with 12px vertical padding
- Section gap: 8–12px

### Shadows
- Primary button: `0 4px 18px {primary}44`
- Recipe hero card: `0 8px 32px {primary}55`

### Role badge colours
- Admin: `#C8622A` (primary)
- Editor: `#4E7C5E` (green)
- Contributor: `#6B7CB8` (blue-purple)

---

## Screens / Views

### 1. Login Screen
**Purpose**: Authenticate and join a family vault.

**Layout**: Single-column scroll. Vertically centred on screen.
- App wordmark "Vollfood": 38px, weight 800, primary colour, letter-spacing -1px
- Tagline: 14px muted, "Your family's kitchen, forever."
- Email/password card: white card, 18px radius, two rows separated by a 1px border. Each row has an 11px uppercase label + 16px input below.
- Primary CTA button: full-width, 16px padding, 14px radius, primary bg, white text "Enter the Kitchen"
- Invite code card: separate card below, same style, single field. Caption: "Ask your family admin for an invite code"
- Error state: 13px red text centred between card and button

**Behaviour**: Any non-empty email + password proceeds to home. Invite code is a separate input for joining a new family.

---

### 2. Home Screen
**Purpose**: Main landing — quick access to categories, search, and add recipe.

**Layout**: Scrollable, 80px bottom padding for tab bar.

**Header row** (padding 20px 16px 12px):
- Left: Greeting "Good morning, {name} 👋" 22px/700, subtitle "{n} recipes · {n} family members" 13px muted
- Right: Avatar circle (40px) with user initials

**Add Recipe CTA card** (margin 4px 16px 12px):
- Background: primary colour
- Border radius: 16px
- Shadow: `0 4px 18px {primary}44`
- Left: 44px circle (rgba white 20%) with mic SVG icon
- Text: "Add new recipe" 15px/700 white + "Speak it — we'll handle the rest" 12px rgba-white-75
- Right: chevron icon rgba-white-60
- Taps → **Add Recipe Screen**

**Search bar** (margin 0 16px 4px):
- White card, 14px radius, 1px border
- Search icon + placeholder "Search recipes…" 15px
- Live filters recipe list below on input

**Categories grid** (2-column, gap 10px, padding 0 16px):
- Each cell: `{accent}18` background, `{accent}30` border, 16px radius, 16px padding
- Title 15px/700 text-dark, count 12px/600 in accent colour
- Taps → **Category Screen**

**Recently Added section**: SectionLabel + compact recipe rows (see RecipeRow component)

---

### 3. Category Screen
**Purpose**: Browse recipes within a category.

**Layout**: Header + scrollable list. 80px bottom padding.

- Back header with category name 17px/700
- Count subtitle "N recipes" 13px muted, padding 12px 16px
- Recipe rows in white card block (see RecipeRow)

---

### 4. Recipe Detail Screen
**Purpose**: View a recipe, switch between family versions, compare versions.

**Header**: Back arrow + recipe name + "Compare" toggle button (top-right).
- Compare button: when inactive — primaryBg bg, primary text; when active — primary bg, white text

**Hero image area** (height 160px):
- Gradient placeholder `linear-gradient(135deg, primarySoft, primary33)`
- Bottom-left: pill badges for time and servings (white 85% bg, 12px/600)

**Fork selector bar** (shown if >1 fork):
- Horizontal scroll row of pill buttons, 7px 12px padding, 99px radius
- Each pill: author avatar (22px) + first name
- Active: primaryBg bg, primary border (1.5px), primary text 700
- Inactive: white bg, border colour border

**Author note card** (margin 12px 16px):
- primaryBg background, left border 3px primary, 12px radius
- Author avatar (24px) + name 13px/700 + role badge
- Note text 13px mid, line-height 1.5

**Ingredients / Steps tabs**:
- Two full-width tabs, 14px. Active: primary colour + 2px bottom border. Inactive: muted.
- Ingredients: each row — 6px primary dot + 14px text, 11px vertical padding, border-bottom
- Steps: each row — numbered circle (24px primary), step text 14px line-height 1.55

---

### 5. Compare View (inside Recipe screen)
**Purpose**: Side-by-side diff of two recipe versions.

**Layout**: Ingredients/Steps tab selector, then two equal columns.

**Author headers** (2-column grid):
- Left column: primaryBg background. Right column: #F0F7F0 background.
- Each: avatar (24px) + first name 12px/700 + "v1" / "v2" label 10px muted

**Comparison rows** (2-column grid):
- Left: white bg. Right: #F8FBF8.
- Divider: 1px border between columns and rows.
- Ingredients: 12px text, 10px padding. Missing items show "—" at 30% opacity.
- Steps: numbered circle (18px) + 12px text, line-height 1.45. Missing steps show "—".

---

### 6. Add Recipe Screen (Voice-first)
**Purpose**: Create a new recipe primarily through voice input.

**States**: idle → recording → processing → review

**Idle state**:
- Centered column layout
- Heading "Tell us your recipe" 20px/700 + body copy 14px muted
- Mic button: 120px circle, primary bg, `boxShadow 0 8px 32px {primary}55`, white mic SVG (44px)
- Caption "Tap to start speaking" 13px muted
- Divider + "Type instead" 14px muted underlined link below

**Recording state**:
- 100px mic button (primary) with 3 concentric pulse rings animating outward (CSS `pulse-ring` keyframes, opacity 0.15→0.05)
- "Listening…" label with blinking 7px dot in primary colour
- Live transcript card: white, 16px radius, 1px border, flex-1 height. Text 14px, line-height 1.6. Blinking cursor at end (CSS `blink` keyframe).
- Cancel button: outlined pill

**Processing state**:
- Centered spinner: 56px circle, 3px border, top arc in primary, `spin` keyframe 0.8s linear infinite
- "Parsing your recipe…" 15px mid

**Review state**:
- Success banner: primaryBg, green checkmark, "Recipe parsed! Review and save."
- Editable fields card: Name / Category / Cook Time / Serves — right-aligned value, 15px
- Ingredients section (same style as recipe detail)
- Steps section (same style as recipe detail)
- Bottom buttons row: "Re-record" (outlined) + "Save Recipe" (primary filled, flex:2)

---

### 7. All Recipes Screen
**Purpose**: Browse every recipe across all categories with sorting.

- Heading "All Recipes" 22px/700 + count 13px muted
- Sort pills: "A–Z", "Quickest", "Most Versions" — pill toggles, active: primaryBg/primary, inactive: card/border
- Full list of RecipeRow items

---

### 8. Authors Screen
**Purpose**: Browse all family members and their contributions.

- Heading "Family" 22px/700 + member count
- List rows: Avatar (44px) + name 15px/600 + recipe count 12px muted + RoleBadge + chevron
- Tap → **Author Detail Screen**

---

### 9. Author Detail Screen
**Purpose**: See all recipes contributed by one family member.

- Back header with first name
- Profile section: Avatar (64px) + full name 18px/700 + RoleBadge + recipe count 13px muted
- Recipe list below (same RecipeRow)

---

### 10. Settings Screen
**Purpose**: Manage profile, family members, roles, and cookbook settings.

**My Profile section**:
- Avatar (48px) + name 16px/600 + email 12px muted + RoleBadge
- Editable fields: Display Name, Email (right-aligned value + chevron)

**Family Members section**:
- Same row style as Authors screen
- Tap non-admin member → expands inline panel with role pills (Admin/Editor/Contributor) + red "Remove" button
- Bottom row: dashed circle + "Invite Family Member" in primary

**Cookbook section**:
- Rows for Cookbook Name, Default Serves, Language (right-aligned value + chevron)

**Footer**: "Sign Out" in red, centred

---

## Shared Components

### RecipeRow
- Height ~68px, padding 12px 16px
- Left: 52px square thumbnail (rounded 10px, placeholder gradient)
- Centre: recipe name 15px/600 + stacked author avatars (18px circles, -5px margin overlap) + time 12px muted
- Right: "N versions" badge (primaryBg, primary text, 99px radius) if >1 fork + servings count 12px muted
- Hover: background fades to primaryBg

### Avatar
- Circle, size configurable (16–64px)
- Background: member's personal hue (unique per member, see mock data)
- Text: member initials, white, weight 700, fontSize = size × 0.38

### RoleBadge
- Pill: `{roleColor}22` background, `{roleColor}` text
- 11px, weight 600, letter-spacing 0.3px, padding 2px 8px

### Header (screen nav bar)
- Height 52px, padding 12px 16px, border-bottom
- Back arrow (chevron left, primary colour) | Title 17px/700 | Optional right action

### SectionLabel
- 12px, weight 700, uppercase, letter-spacing 0.8px, muted colour
- Padding 18px 16px 8px

### TabBar
- Position absolute bottom 0, height 72px, background tabBg with blur
- 4 tabs: Home · All Recipes · Authors · Settings
- Active: primary icon + primary label 10px/600
- Inactive: muted icon + muted label
- 8px bottom padding (home indicator clearance)

---

## Navigation Model
Stack-based on top of tab navigation:
- **Tab state**: `home | all | authors | settings`
- **Screen stack**: array of `{screen, params}` — push to drill in, pop to go back
- Tab switch resets the stack
- Screens: `login`, `home`, `all`, `category(categoryId)`, `recipe(recipeId)`, `add`, `author(authorId)`, `settings`

---

## Interactions & Animations
- Category card: `scale(1.02)` on hover, 0.1s transition
- Recipe row: background fades to primaryBg on hover, 0.15s
- Primary CTA button on home: scale(1.02) + stronger shadow on hover
- Compare toggle: instant background/color swap
- Fork selector: active pill has primary border + primaryBg
- Settings member expand: chevron rotates 90° on expand, 0.2s transition
- Add Recipe pulse rings: CSS keyframe `pulse-ring`, three rings staggered at 0.9s, 1.1s, 1.3s
- Add Recipe blink cursor: CSS keyframe `blink`, 0.9s infinite
- Processing spinner: CSS keyframe `spin`, 0.8s linear infinite

---

## Data Model (from mock data in vollfood-app.jsx)

```ts
Member {
  id: number
  name: string
  initials: string        // 2-char
  role: 'admin' | 'editor' | 'contributor'
  hue: string             // hex, unique avatar bg per member
  recipes: number         // count
}

Category {
  id: string
  name: string
  count: number
  accent: string          // hex
}

Recipe {
  id: number
  name: string
  category: string        // category id
  authorId: number        // original author
  time: string            // e.g. "45 min"
  serves: number
  forks: Fork[]
}

Fork {
  authorId: number
  note: string            // author's personal note about this version
  ingredients: string[]
  steps: string[]
}
```

---

## State Management Notes
- Auth state: `loggedIn: boolean`
- Tab state: `tab: string`
- Navigation stack: `stack: {screen, params}[]`
- Recipe screen: `forkIdx` (selected fork), `activeTab` (ingredients/steps), `comparing: boolean`
- Add Recipe: `stage` (idle/recording/processing/review), `transcript: string`
- Settings: `expanded: memberId | null` (inline role editor)
- All Recipes: `sort: 'name' | 'time' | 'forks'`

---

## Files in This Bundle
| File | Purpose |
|------|---------|
| `Vollfood.html` | Full prototype shell — open in browser to preview |
| `vollfood-app.jsx` | All React components, screens, mock data, navigation |
| `ios-frame.jsx` | iOS device bezel component (design preview only, not needed in prod) |
| `README.md` | This document |

---

## Notes for Implementation
- The prototype uses mock/static data. In production, wire up to a real backend (Supabase, Firebase, or custom API).
- Voice recording uses a simulated demo transcript. In production, integrate the Web Speech API (browser) or a native speech-to-text SDK (iOS: SFSpeechRecognizer, Android: SpeechRecognizer).
- The recipe parser (voice → structured recipe) will need an LLM call — the prompt should extract name, category, time, serves, ingredients, and steps from free-form speech.
- Family invite codes should generate unique short tokens server-side.
- Role permissions to enforce server-side: Admin can manage members; Editor can add/edit own recipes; Contributor can only fork existing recipes.
