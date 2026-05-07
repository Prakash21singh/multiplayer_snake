# SKILL: Dark SaaS UI — Component Styling Agent Guide

> A complete, copy-paste-ready skill file for any AI agent to produce pixel-consistent, production-grade dark UI components matching the AnyTimeFile / Thesys aesthetic.

---

## 0. How to Use This File

Read this entire file before writing a single line of JSX. Every rule here was derived from real components that passed visual review. Violating any rule below produces inconsistent output.

When the user says "style this", "make this match the theme", or "build a component", your process is:

1. Read **Section 1** — understand the color vocabulary
2. Read **Section 2** — understand the element map (which color goes where)
3. Read **Section 3** — copy the exact pattern for the element type you're building
4. Read **Section 4** — run the pre-flight checklist before outputting

---

## 1. Color Token Reference

All colors are CSS custom properties. **Never use raw hex in component code** — always use the variable. The only exception is file-type icon colors (Section 3.5), which use hardcoded hex because they are semantic, not themeable.

```
BACKGROUNDS (darkest → brightest)
──────────────────────────────────────────────
--color-bg-primary    #0A0A0A   Page body, full-screen wrappers
--color-bg-surface    #111111   Cards, panels, navbars, dialogs
--color-bg-elevated   #1A1A1A   Inputs, nested rows, dropdowns, code blocks
--color-bg-code       #0D0D0D   Terminal windows, code editors
--color-bg-tag        #1E1E1E   Badges, pills, ext chips, stat cells

BORDERS (subtlest → strongest)
──────────────────────────────────────────────
--color-border-subtle   #222222   Section dividers, hairlines, dashed zones
--color-border-default  #2E2E2E   Card outlines, input borders, table rows
--color-border-strong   #3A3A3A   Focused inputs, active/selected states

TEXT (brightest → dimmest)
──────────────────────────────────────────────
--color-text-primary    #FFFFFF   Headings, filenames, prominent values
--color-text-secondary  #8A8A8A   Body copy, descriptions, nav links
--color-text-muted      #555555   Dates, sizes, placeholders, helper labels
--color-text-inverse    #0A0A0A   Text sitting ON the green accent button

ACCENT (green — use sparingly)
──────────────────────────────────────────────
--color-accent          #00D084   Primary CTA buttons, active indicators, key labels
--color-accent-hover    #00B870   Button hover state
--color-accent-active   #009E5E   Button pressed/active state
--color-accent-subtle   #00D08418 Tinted backgrounds: selected rows, banners, hover fills
--color-accent-border   #00D08440 Focus rings, accent-outlined badges

SEMANTIC
──────────────────────────────────────────────
--color-success  #00D084   (same as accent) — checkmarks, valid state
--color-warning  #F5A623   Warning banners, pending badges
--color-danger   #E24B4A   Delete buttons, error messages, invalid inputs
--color-info     #378ADD   Info banners, external link indicators
```

---

## 2. The Element Map — What Color Goes Where

This is the most important section. Every element type has an exact color assignment.

### 2.1 Page / Screen

```
background:  var(--color-bg-primary)          ← always #0A0A0A
```

Never put content directly on `bg-primary` without a card or panel wrapping it.

### 2.2 Cards, Panels, Dialogs, Navbars

```
background:  var(--color-bg-surface)          ← one step lighter than page
border:      1px solid var(--color-border-default)
box-shadow:  0 0 0 1px var(--color-border-subtle), 0 24px 48px rgba(0,0,0,0.5)
border-radius: 12px (rounded-xl) or 16px (rounded-2xl) for modals
```

### 2.3 Nested Content Inside a Card (inputs, rows, code blocks)

```
background:  var(--color-bg-elevated)         ← one more step lighter
border:      1px solid var(--color-border-subtle)
```

### 2.4 Badges, Tags, Ext Chips

```
background:  var(--color-bg-tag)
border:      1px solid var(--color-border-subtle)
color:       var(--color-text-muted)
font-family: monospace
padding:     1px 5px
border-radius: 4px
```

Accent badge variant (NEW, BETA, status):
```
background:  var(--color-accent-subtle)
border:      1px solid var(--color-accent-border)
color:       var(--color-accent)
```

### 2.5 Text Hierarchy

```
Page / card titles:           color: var(--color-text-primary)   font-weight: 600
Section headings:             color: var(--color-text-primary)   font-weight: 600
Body / descriptions:          color: var(--color-text-secondary)
Labels above inputs:          color: var(--color-text-secondary)  font-size: 12px  font-weight: 500
Muted (dates, sizes, counts): color: var(--color-text-muted)
Eyebrow (above heading):      color: var(--color-accent)  font-size: 11px  uppercase  tracking-widest
```

### 2.6 Buttons

**Primary (green)**
```
background:   var(--color-accent)
color:        var(--color-text-inverse)
border:       none
height:       h-10 (default) | h-9 (compact) | h-8 (dense)
border-radius: rounded-lg (8px)
font-size:    text-sm (default) | text-xs (compact)
font-weight:  font-semibold

hover  → background: var(--color-accent-hover)
active → background: var(--color-accent-active)
```

**Secondary / Ghost**
```
background:   var(--color-bg-elevated)
color:        var(--color-text-secondary)
border:       1px solid var(--color-border-default)
border-radius: rounded-lg

hover  → background: var(--color-bg-tag), border-color: var(--color-border-strong)
```

**Danger**
```
background:   #E24B4A14  (transparent danger tint)
color:        var(--color-danger)
border:       1px solid #E24B4A30

hover  → background: #E24B4A22, border-color: var(--color-danger)
```

**Icon button (small w-6 h-6 or w-7 h-7)**
```
background:   transparent
color:        var(--color-text-muted)
border-radius: rounded-md

Standard hover → color: var(--color-text-primary),  background: var(--color-bg-tag)
Accent  hover  → color: var(--color-accent),         background: var(--color-accent-subtle)
Danger  hover  → color: var(--color-danger),         background: #E24B4A12
```

### 2.7 Inputs

```
background:   var(--color-bg-elevated)
border:       1px solid var(--color-border-default)
color:        var(--color-text-primary)
placeholder:  color: var(--color-text-muted)
height:       h-8
border-radius: rounded-lg

focus → border-color: var(--color-accent-border)
        box-shadow:   0 0 0 3px var(--color-accent-subtle)
```

Leading icon inside input:
```
color:  var(--color-text-muted)
size:   15px
left:   left-3
```

### 2.8 Dividers / Separators

```
height:     1px
background: var(--color-border-subtle)    ← for light hairlines
background: var(--color-border-default)   ← for more visible dividers
```

Text dividers:
```html
<div style="height:1px; background: var(--color-border-subtle); margin: 0 16px" />
```

Or flex row version:
```html
<div style="display:flex; align-items:center; gap:12px">
  <div style="flex:1; height:1px; background:var(--color-border-subtle)" />
  <span style="font-size:11px; color:var(--color-text-muted)">or</span>
  <div style="flex:1; height:1px; background:var(--color-border-subtle)" />
</div>
```

### 2.9 Tables / List Rows

```
Column header row:
  background:   var(--color-bg-elevated)
  border-bottom: 1px solid var(--color-border-subtle)
  text:          var(--color-text-muted)  font-size: 12px

Data rows:
  background:   transparent (default)
  border-bottom: 1px solid var(--color-border-subtle) [except last row]
  padding:       py-2 px-4
  height:        ~40px (keep dense)

Row hover:
  background: var(--color-bg-elevated)
  transition: background 0.1s
```

### 2.10 Accent Lines (decorative top border on cards)

```
height:     2px
background: linear-gradient(90deg, transparent, {iconColor}70, transparent)
            — OR —
background: linear-gradient(90deg, transparent, var(--color-accent-border), transparent)
```

---

## 3. Component Patterns (Copy-Paste Ready)

### 3.1 Card Shell

```tsx
<div
  className="rounded-xl overflow-hidden"
  style={{
    background: "var(--color-bg-surface)",
    border: "1px solid var(--color-border-default)",
    boxShadow: "0 0 0 1px var(--color-border-subtle), 0 24px 48px rgba(0,0,0,0.5)",
  }}
>
  {/* optional accent top line */}
  <div style={{ height: 2, background: "linear-gradient(90deg, transparent, var(--color-accent-border), transparent)" }} />

  {/* content */}
</div>
```

### 3.2 Primary Button

```tsx
<button
  className="flex items-center justify-center gap-1.5 h-9 px-4 rounded-lg text-xs font-semibold transition-all duration-150"
  style={{ background: "var(--color-accent)", color: "var(--color-text-inverse)", border: "none" }}
  onMouseEnter={e => { e.currentTarget.style.background = "var(--color-accent-hover)"; }}
  onMouseLeave={e => { e.currentTarget.style.background = "var(--color-accent)"; }}
  onMouseDown={e =>  { e.currentTarget.style.background = "var(--color-accent-active)"; }}
  onMouseUp={e =>    { e.currentTarget.style.background = "var(--color-accent-hover)"; }}
>
  <IconUpload size={13} />
  Upload
</button>
```

### 3.3 Ghost Button

```tsx
<button
  className="flex items-center justify-center gap-1.5 h-9 px-4 rounded-lg text-xs font-medium transition-all duration-150"
  style={{
    background: "var(--color-bg-elevated)",
    border: "1px solid var(--color-border-default)",
    color: "var(--color-text-secondary)",
  }}
  onMouseEnter={e => {
    e.currentTarget.style.background = "var(--color-bg-tag)";
    e.currentTarget.style.borderColor = "var(--color-border-strong)";
  }}
  onMouseLeave={e => {
    e.currentTarget.style.background = "var(--color-bg-elevated)";
    e.currentTarget.style.borderColor = "var(--color-border-default)";
  }}
>
  Cancel
</button>
```

### 3.4 Input with Leading Icon

```tsx
<div className="space-y-1.5">
  <label className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
    Email
  </label>
  <div className="relative">
    <IconMail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
      style={{ color: "var(--color-text-muted)" }} />
    <input
      type="email"
      placeholder="you@company.com"
      className="w-full pl-9 h-10 rounded-lg text-sm"
      style={{
        background: "var(--color-bg-elevated)",
        border: "1px solid var(--color-border-default)",
        color: "var(--color-text-primary)",
        outline: "none",
      }}
      onFocus={e => {
        e.currentTarget.style.borderColor = "var(--color-accent-border)";
        e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-accent-subtle)";
      }}
      onBlur={e => {
        e.currentTarget.style.borderColor = "var(--color-border-default)";
        e.currentTarget.style.boxShadow = "none";
      }}
    />
  </div>
</div>
```

### 3.5 File Icon Chip (for file-type aware display)

These colors are intentionally hardcoded — they represent file type semantics, not the theme.

```tsx
const FILE_COLORS: Record<string, string> = {
  pdf:   "#E24B4A",  // red
  image: "#378ADD",  // blue
  video: "#F5A623",  // amber
  excel: "#00D084",  // green
  other: "#8A8A8A",  // gray
};

// Usage
<div
  className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
  style={{
    background: `${iconColor}14`,          // hex + 14 = ~8% opacity
    border:     `1px solid ${iconColor}28`, // hex + 28 = ~16% opacity
  }}
>
  <FileIcon size={14} style={{ color: iconColor }} />
</div>
```

**Opacity suffix cheat sheet:**
```
08 =  3%    10 =  6%    14 =  8%    18 = ~10%
20 = 12%    28 = 16%    30 = 19%    40 = 25%
50 = 31%    60 = 38%    70 = 44%    80 = 50%
```

### 3.6 Table / File List Row

```tsx
<div
  className="grid items-center px-4 py-2"
  style={{
    gridTemplateColumns: "minmax(0,1fr) 64px 80px 96px 56px",
    borderBottom: isLast ? "none" : "1px solid var(--color-border-subtle)",
    transition: "background 0.1s",
  }}
  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--color-bg-elevated)"; }}
  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
>
```

### 3.7 Compact Dialog / Alert

```tsx
<div
  style={{
    background: "var(--color-bg-surface)",
    border: "1px solid var(--color-border-default)",
    boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px var(--color-border-subtle)",
    borderRadius: 14,
    padding: 20,
    maxWidth: 360,
  }}
>
  {/* icon + title in one row */}
  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
    <div style={{
      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--color-accent-subtle)",
      border: "1px solid var(--color-accent-border)",
    }}>
      <IconLock size={15} style={{ color: "var(--color-accent)" }} />
    </div>
    <div>
      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>Title</p>
      <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>Subtitle</p>
    </div>
  </div>
  {/* right-aligned buttons */}
  <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
    {/* ghost cancel + primary action */}
  </div>
</div>
```

### 3.8 Meta Row (owner / date / count inside a card)

```tsx
<div
  className="rounded-xl overflow-hidden"
  style={{
    background: "var(--color-bg-elevated)",
    border: "1px solid var(--color-border-subtle)",
  }}
>
  {/* each row */}
  <div className="flex items-center gap-3 px-4 py-2.5"
    style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
    <IconUser size={13} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
    <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Name</span>
    <span className="text-xs ml-auto" style={{ color: "var(--color-text-muted)" }}>value</span>
  </div>
</div>
```

### 3.9 Background Stack (page-level atmosphere)

Always use this exact 3-layer stack for full-screen pages:

```tsx
{/* Layer 1: deep green-black gradient from top */}
<div className="absolute inset-0" style={{
  background: "radial-gradient(ellipse 100% 60% at 50% -5%, #0f1a12 0%, #0A0A0A 55%)"
}} />

{/* Layer 2: accent bloom — tinted green glow */}
<div className="absolute inset-0" style={{
  background: "radial-gradient(ellipse 50% 30% at 50% 0%, #00D08412 0%, transparent 70%)"
}} />

{/* Layer 3: subtle grid, masked to center */}
<div className="absolute inset-0" style={{
  backgroundImage: "linear-gradient(to right, #ffffff04 1px, transparent 1px), linear-gradient(to bottom, #ffffff04 1px, transparent 1px)",
  backgroundSize: "48px 48px",
  WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)",
  maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)",
}} />
```

Wrapper pattern:
```tsx
<div className="relative min-h-screen overflow-hidden" style={{ background: "#0A0A0A" }}>
  <div className="absolute inset-0 pointer-events-none">
    {/* paste 3 layers above */}
  </div>
  <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">
    {/* page content */}
  </div>
</div>
```

---

## 4. Pre-Flight Checklist

Before outputting any component, verify every item:

```
□ Every background uses a CSS variable (no raw #hex for backgrounds)
□ Every card has border: 1px solid var(--color-border-default)
□ Every input has a focus ring: box-shadow 0 0 0 3px var(--color-accent-subtle)
□ Headings use --color-text-primary, body uses --color-text-secondary, helpers use --color-text-muted
□ The accent green (#00D084) appears at most once or twice per section
□ All buttons have transition-all duration-150
□ Icon buttons are w-6 h-6 or w-7 h-7 with rounded-md, NOT rounded-full
□ Disabled buttons have opacity: 0.5 and cursor: not-allowed
□ No box-shadow on cards (only border + box-shadow for the outer glow ring)
□ The accent line at the top of cards uses the 90deg linear-gradient pattern
□ File-type icon colors use hardcoded hex with opacity suffix (e.g. ${color}14)
□ All transitions are onMouseEnter/Leave on the element itself (not CSS :hover) for style= props
□ No font-family declared inline — font comes from global CSS (Geist Sans / Inter)
□ Empty states use dashed border + centered icon + muted text
□ Delete/danger actions have red hover (color: var(--color-danger), background: #E24B4A12)
```

---

## 5. Common Mistakes to Avoid

| Mistake | Correct |
|---|---|
| `style={{ background: "#111111" }}` | `style={{ background: "var(--color-bg-surface)" }}` |
| `var(--color-accent / 50)` | `var(--color-accent-border)` or `#00D08440` |
| `border-radius: 9999px` on buttons | `border-radius: 8px` (`rounded-lg`) |
| `color: white` or `color: #fff` | `color: var(--color-text-primary)` |
| `className="hover:bg-zinc-800"` for themed hover | `onMouseEnter/Leave` with `style=` |
| `box-shadow: 0 2px 4px rgba(0,0,0,0.1)` | No shadow on cards. Use border only. |
| `gradient` on buttons | Flat `background: var(--color-accent)` only |
| Multiple accent green elements per section | One primary green CTA max per view |
| Large dialog with `flex-col` buttons taking full width | Compact dialog + `justify-end` row buttons |
| `border-radius` on `border-left` accents | `border-radius: 0` on single-side borders |

---

## 6. Spacing & Sizing Quick Reference

```
Buttons:
  Dense:    h-7  px-2.5  text-xs
  Compact:  h-8  px-3    text-xs
  Default:  h-9  px-4    text-xs / text-sm
  Large:    h-10 px-5    text-sm

Icon buttons:
  Small:   w-6 h-6  rounded-md  icon: 12px
  Default: w-7 h-7  rounded-lg  icon: 13-14px
  Large:   w-8 h-8  rounded-lg  icon: 15-16px

Cards / border radius:
  Chip / badge:   rounded-md   (6px)
  Button / input: rounded-lg   (8px)
  Card:           rounded-xl   (12px)
  Modal:          rounded-2xl  (16px)

Padding:
  Dense row:    px-4 py-2
  Normal row:   px-4 py-3
  Card header:  px-6 pt-6 pb-4
  Dialog:       p-5 (20px)
  Large panel:  px-8 py-10

Gap between form elements:  gap-4 (16px)
Gap inside rows:             gap-2 or gap-2.5 (8–10px)
Gap inside icon+label pairs: gap-1.5 (6px)
```

---

## 7. Icon Rules

**Library**: `@tabler/icons-react` exclusively.

```
In-line with text:     size={13} or size={14}
Form field prefix:     size={15}
Card header icon:      size={17} or size={18}
Empty state:           size={26} or size={28}
Large decorative:      size={32} max

Color assignments:
  Decorative / prefix:  var(--color-text-muted)
  Interactive idle:     var(--color-text-secondary)
  Accent:               var(--color-accent)
  Danger:               var(--color-danger)
  File-type icons:      hardcoded hex (see Section 3.5)
```

Never wrap icons in extra `<div>` containers unless building an icon button — use `flexShrink: 0` inline to prevent them from shrinking.

---

## 8. Branding Footer Pattern

Used on public-facing pages (file download, auth pages):

```tsx
<div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
  <span
    className="inline-block w-3.5 h-3.5 rounded-[4px]"
    style={{ background: "var(--color-accent)" }}
  />
  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
    YourAppName
  </span>
</div>
```