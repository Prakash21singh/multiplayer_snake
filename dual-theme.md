# SKILL: Dual-Theme SaaS UI — Component Styling Agent Guide

> A complete, copy-paste-ready skill file for producing pixel-consistent, production-grade UI components in **both dark and light themes**, with the same design rigor. Matching the AnyTimeFile / Thesys aesthetic family.

---

## 0. How to Use This File

Read this entire file before writing a single line of JSX. Every rule here was derived from real components that passed visual review. Violating any rule produces inconsistent output.

When the user says "style this", "make this match the theme", "build a component", or specifies `dark` / `light` mode:

1. Read **Section 1** — understand both color vocabularies (dark + light)
2. Read **Section 2** — understand the element map (which variable goes where)
3. Read **Section 3** — copy the exact pattern for the element type you're building
4. Read **Section 4** — implement the theme-switch mechanism
5. Read **Section 5** — run the pre-flight checklist before outputting

**Choosing a theme:**
- If the user specifies `dark` → use `[data-theme="dark"]` variable set
- If the user specifies `light` → use `[data-theme="light"]` variable set
- If the user wants both / toggleable → implement Section 4's toggle pattern
- Default when unspecified: **dark**

---

## 1. Color Token Reference

All colors are CSS custom properties scoped to `[data-theme]`. **Never use raw hex in component code** — always use the variable. The only exception is file-type icon colors (Section 3.5), which use hardcoded hex because they are semantic, not themeable.

### 1.1 Dark Theme Tokens — `[data-theme="dark"]`

```css
[data-theme="dark"] {
  /* BACKGROUNDS (darkest → brightest) */
  --color-bg-primary:   #0A0A0A;  /* Page body, full-screen wrappers */
  --color-bg-surface:   #111111;  /* Cards, panels, navbars, dialogs */
  --color-bg-elevated:  #1A1A1A;  /* Inputs, nested rows, dropdowns, code blocks */
  --color-bg-code:      #0D0D0D;  /* Terminal windows, code editors */
  --color-bg-tag:       #1E1E1E;  /* Badges, pills, ext chips, stat cells */

  /* BORDERS (subtlest → strongest) */
  --color-border-subtle:  #222222;  /* Section dividers, hairlines, dashed zones */
  --color-border-default: #2E2E2E;  /* Card outlines, input borders, table rows */
  --color-border-strong:  #3A3A3A;  /* Focused inputs, active/selected states */

  /* TEXT (brightest → dimmest) */
  --color-text-primary:   #FFFFFF;  /* Headings, filenames, prominent values */
  --color-text-secondary: #8A8A8A;  /* Body copy, descriptions, nav links */
  --color-text-muted:     #555555;  /* Dates, sizes, placeholders, helper labels */
  --color-text-inverse:   #0A0A0A;  /* Text ON the green accent button */

  /* ACCENT (green — use sparingly) */
  --color-accent:         #00D084;  /* Primary CTA, active indicators, key labels */
  --color-accent-hover:   #00B870;  /* Button hover */
  --color-accent-active:  #009E5E;  /* Button pressed */
  --color-accent-subtle:  #00D08418;/* Tinted backgrounds: selected rows, banners */
  --color-accent-border:  #00D08440;/* Focus rings, accent-outlined badges */

  /* SEMANTIC */
  --color-success: #00D084;
  --color-warning: #F5A623;
  --color-danger:  #E24B4A;
  --color-info:    #378ADD;

  /* SHADOWS */
  --shadow-card:   0 0 0 1px #222222, 0 24px 48px rgba(0,0,0,0.5);
  --shadow-dialog: 0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px #222222;
}
```

---

### 1.2 Light Theme Tokens — `[data-theme="light"]`

The light theme is **not simply inverted dark** — it has its own hierarchy with warm-neutral backgrounds, stronger border contrast, and the same green accent at slightly reduced opacity to avoid harshness on white.

```css
[data-theme="light"] {
  /* BACKGROUNDS (brightest → slightly darker) */
  --color-bg-primary:   #F5F5F3;  /* Page body — warm off-white, never pure white */
  --color-bg-surface:   #FFFFFF;  /* Cards, panels, navbars, dialogs */
  --color-bg-elevated:  #F0F0EE;  /* Inputs, nested rows, dropdowns, code blocks */
  --color-bg-code:      #F7F7F5;  /* Code blocks — slightly warm */
  --color-bg-tag:       #EAEAE8;  /* Badges, pills, chips, stat cells */

  /* BORDERS (subtlest → strongest) */
  --color-border-subtle:  #E4E4E2;  /* Section dividers, hairlines */
  --color-border-default: #D4D4D2;  /* Card outlines, input borders, table rows */
  --color-border-strong:  #BBBBB9;  /* Focused inputs, active/selected states */

  /* TEXT (darkest → lightest) */
  --color-text-primary:   #111111;  /* Headings, filenames, prominent values */
  --color-text-secondary: #555555;  /* Body copy, descriptions, nav links */
  --color-text-muted:     #999999;  /* Dates, sizes, placeholders, helper labels */
  --color-text-inverse:   #FFFFFF;  /* Text ON the green accent button */

  /* ACCENT (same green family, slightly darker for light bg readability) */
  --color-accent:         #00B870;  /* Primary CTA — slightly darker for contrast */
  --color-accent-hover:   #009E5E;  /* Button hover */
  --color-accent-active:  #008A52;  /* Button pressed */
  --color-accent-subtle:  #00B87012;/* Tinted backgrounds — very light green wash */
  --color-accent-border:  #00B87030;/* Focus rings, accent-outlined badges */

  /* SEMANTIC (same across themes) */
  --color-success: #00B870;
  --color-warning: #E09010;  /* Slightly darker amber for light bg contrast */
  --color-danger:  #D03B3A;  /* Slightly darker red for contrast */
  --color-info:    #2A6DB5;  /* Slightly darker blue for contrast */

  /* SHADOWS — light theme uses softer, cooler shadows */
  --shadow-card:   0 0 0 1px #E4E4E2, 0 4px 16px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
  --shadow-dialog: 0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px #D4D4D2;
}
```

**Key light-theme philosophy:**
- `bg-primary` is **warm off-white** (`#F5F5F3`), NOT `#FFFFFF` — pure white looks harsh
- `bg-surface` (cards) IS `#FFFFFF` — so cards lift off the page background
- Borders must be **visible** — use `--color-border-default` liberally; light UI relies on borders more than dark UI
- Accent green is **darkened** by ~1 stop (→ `#00B870`) so it reads at 4.5:1 contrast on white
- Shadows are **soft and layered** (not deep/dramatic like dark theme) — light UI depth comes from borders + subtle shadow

---

## 2. The Element Map — What Color Goes Where

Both themes use the **same variable names** — only the token values change. This means all component code works for both themes by just switching `data-theme` on the root.

### 2.1 Page / Screen

```
background: var(--color-bg-primary)
```

Dark:  deep `#0A0A0A` — content needs a card wrapper
Light: warm `#F5F5F3` — cards visually "float" since surface is white

### 2.2 Cards, Panels, Dialogs, Navbars

```
background:   var(--color-bg-surface)
border:       1px solid var(--color-border-default)
box-shadow:   var(--shadow-card)
border-radius: 12px (rounded-xl) or 16px (rounded-2xl) for modals
```

**Light-theme note:** The shadow is essential here — it's what lifts the white card off the white-ish page. Don't omit it in light mode.

### 2.3 Nested Content Inside a Card (inputs, rows, code blocks)

```
background: var(--color-bg-elevated)
border:     1px solid var(--color-border-subtle)
```

Dark:  slight brightness lift
Light: slight darkness drop (slightly gray vs white card)

### 2.4 Badges, Tags, Ext Chips

```
background:   var(--color-bg-tag)
border:       1px solid var(--color-border-subtle)
color:        var(--color-text-muted)
font-family:  monospace
padding:      1px 5px
border-radius: 4px
```

Accent badge variant (NEW, BETA, status):
```
background: var(--color-accent-subtle)
border:     1px solid var(--color-accent-border)
color:      var(--color-accent)
```

### 2.5 Text Hierarchy

```
Page / card titles:           color: var(--color-text-primary)    font-weight: 600
Section headings:             color: var(--color-text-primary)    font-weight: 600
Body / descriptions:          color: var(--color-text-secondary)
Labels above inputs:          color: var(--color-text-secondary)  font-size: 12px  font-weight: 500
Muted (dates, sizes, counts): color: var(--color-text-muted)
Eyebrow (above heading):      color: var(--color-accent)  font-size: 11px  uppercase  tracking-widest
```

### 2.6 Buttons

**Primary (green)**
```
background:    var(--color-accent)
color:         var(--color-text-inverse)
border:        none
height:        h-10 (default) | h-9 (compact) | h-8 (dense)
border-radius: rounded-lg (8px)
font-size:     text-sm (default) | text-xs (compact)
font-weight:   font-semibold

hover  → background: var(--color-accent-hover)
active → background: var(--color-accent-active)
```

**Secondary / Ghost**
```
background:    var(--color-bg-elevated)
color:         var(--color-text-secondary)
border:        1px solid var(--color-border-default)
border-radius: rounded-lg

hover  → background: var(--color-bg-tag), border-color: var(--color-border-strong)
```

**Danger**
```
background: transparent (dark) / #FEF2F2 (light — use semantic tint in light)
color:      var(--color-danger)
border:     1px solid color-mix(in srgb, var(--color-danger) 30%, transparent)

hover → border-color: var(--color-danger), background lightens slightly
```

For light mode danger button, use:
```
background: #FEF2F2
border:     1px solid #FCCACA
```

**Icon button (small w-6 h-6 or w-7 h-7)**
```
background:    transparent
color:         var(--color-text-muted)
border-radius: rounded-md

Standard hover → color: var(--color-text-primary),  background: var(--color-bg-tag)
Accent  hover  → color: var(--color-accent),         background: var(--color-accent-subtle)
Danger  hover  → color: var(--color-danger),         background: color-mix(in srgb, var(--color-danger) 8%, transparent)
```

### 2.7 Inputs

```
background:   var(--color-bg-elevated)
border:       1px solid var(--color-border-default)
color:        var(--color-text-primary)
placeholder:  color: var(--color-text-muted)
height:       h-8 or h-10
border-radius: rounded-lg

focus → border-color: var(--color-accent-border)
        box-shadow:   0 0 0 3px var(--color-accent-subtle)
```

**Light-theme note:** In light mode the elevated background is slightly gray — this is intentional. It signals "interactive field" vs the white card background.

### 2.8 Dividers / Separators

```
height:     1px
background: var(--color-border-subtle)    ← for light hairlines
background: var(--color-border-default)   ← for more visible dividers
```

### 2.9 Tables / List Rows

```
Column header row:
  background:    var(--color-bg-elevated)
  border-bottom: 1px solid var(--color-border-subtle)
  text:          var(--color-text-muted)  font-size: 12px

Data rows:
  background:    transparent (default)
  border-bottom: 1px solid var(--color-border-subtle) [except last]
  padding:       py-2 px-4

Row hover:
  background: var(--color-bg-elevated)
  transition: background 0.1s
```

### 2.10 Accent Lines (decorative top border on cards)

```
height:     2px
background: linear-gradient(90deg, transparent, var(--color-accent-border), transparent)
```

In light mode, this renders as a soft green line — works beautifully.

---

## 3. Component Patterns (Copy-Paste Ready)

All patterns below are **theme-agnostic** — they use CSS variables only and work in both themes.

### 3.1 Card Shell

```tsx
<div
  className="rounded-xl overflow-hidden"
  style={{
    background: "var(--color-bg-surface)",
    border: "1px solid var(--color-border-default)",
    boxShadow: "var(--shadow-card)",
  }}
>
  {/* optional accent top line */}
  <div style={{
    height: 2,
    background: "linear-gradient(90deg, transparent, var(--color-accent-border), transparent)"
  }} />
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
    <IconMail size={15}
      className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
      style={{ color: "var(--color-text-muted)" }}
    />
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

### 3.5 File Icon Chip

File-type colors are intentionally hardcoded — semantic, not themeable.

```tsx
const FILE_COLORS: Record<string, string> = {
  pdf:   "#E24B4A",
  image: "#378ADD",
  video: "#F5A623",
  excel: "#00D084",
  other: "#8A8A8A",
};

<div
  className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
  style={{
    background: `${iconColor}14`,
    border: `1px solid ${iconColor}28`,
  }}
>
  <FileIcon size={14} style={{ color: iconColor }} />
</div>
```

**Opacity suffix cheat sheet:**
```
08=3%  10=6%  14=8%  18=10%  20=12%  28=16%  30=19%  40=25%  50=31%  70=44%  80=50%
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
  {/* cells */}
</div>
```

### 3.7 Compact Dialog / Alert

```tsx
<div
  style={{
    background: "var(--color-bg-surface)",
    border: "1px solid var(--color-border-default)",
    boxShadow: "var(--shadow-dialog)",
    borderRadius: 14,
    padding: 20,
    maxWidth: 360,
  }}
>
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
  <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
    {/* ghost cancel + primary action */}
  </div>
</div>
```

### 3.8 Meta Row

```tsx
<div
  className="rounded-xl overflow-hidden"
  style={{
    background: "var(--color-bg-elevated)",
    border: "1px solid var(--color-border-subtle)",
  }}
>
  <div className="flex items-center gap-3 px-4 py-2.5"
    style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
    <IconUser size={13} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
    <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Name</span>
    <span className="text-xs ml-auto" style={{ color: "var(--color-text-muted)" }}>value</span>
  </div>
</div>
```

### 3.9 Background Stack — Dark Theme (page-level atmosphere)

```tsx
{/* Layer 1: deep green-black gradient */}
<div className="absolute inset-0" style={{
  background: "radial-gradient(ellipse 100% 60% at 50% -5%, #0f1a12 0%, #0A0A0A 55%)"
}} />
{/* Layer 2: accent bloom */}
<div className="absolute inset-0" style={{
  background: "radial-gradient(ellipse 50% 30% at 50% 0%, #00D08412 0%, transparent 70%)"
}} />
{/* Layer 3: subtle grid */}
<div className="absolute inset-0" style={{
  backgroundImage: "linear-gradient(to right, #ffffff04 1px, transparent 1px), linear-gradient(to bottom, #ffffff04 1px, transparent 1px)",
  backgroundSize: "48px 48px",
  WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)",
  maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)",
}} />
```

### 3.10 Background Stack — Light Theme (page-level atmosphere)

Light theme uses a **warm-to-cool gradient** with a very faint dot grid — no glow bloom (looks garish on light backgrounds).

```tsx
{/* Layer 1: warm off-white with a top gradient tint */}
<div className="absolute inset-0" style={{
  background: "radial-gradient(ellipse 100% 50% at 50% -10%, #e8f5ee 0%, #F5F5F3 50%)"
}} />
{/* Layer 2: very faint accent wash at top */}
<div className="absolute inset-0" style={{
  background: "radial-gradient(ellipse 60% 25% at 50% 0%, #00B87008 0%, transparent 70%)"
}} />
{/* Layer 3: dot grid (lighter, warmer dots) */}
<div className="absolute inset-0" style={{
  backgroundImage: "radial-gradient(circle, #00000008 1px, transparent 1px)",
  backgroundSize: "28px 28px",
  WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)",
  maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)",
}} />
```

Wrapper pattern (works for both themes — only bg changes via the token):
```tsx
<div
  data-theme="light"  {/* or "dark" */}
  className="relative min-h-screen overflow-hidden"
  style={{ background: "var(--color-bg-primary)" }}
>
  <div className="absolute inset-0 pointer-events-none">
    {/* paste appropriate atmosphere layers above */}
  </div>
  <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">
    {/* page content */}
  </div>
</div>
```

---

## 4. Theme Toggle Implementation

### 4.1 CSS Variable Setup (Paste into `<style>` or global CSS)

```css
/* ─── Dark Theme ─────────────────────────────────────────────── */
[data-theme="dark"] {
  --color-bg-primary:   #0A0A0A;
  --color-bg-surface:   #111111;
  --color-bg-elevated:  #1A1A1A;
  --color-bg-code:      #0D0D0D;
  --color-bg-tag:       #1E1E1E;
  --color-border-subtle:  #222222;
  --color-border-default: #2E2E2E;
  --color-border-strong:  #3A3A3A;
  --color-text-primary:   #FFFFFF;
  --color-text-secondary: #8A8A8A;
  --color-text-muted:     #555555;
  --color-text-inverse:   #0A0A0A;
  --color-accent:         #00D084;
  --color-accent-hover:   #00B870;
  --color-accent-active:  #009E5E;
  --color-accent-subtle:  #00D08418;
  --color-accent-border:  #00D08440;
  --color-success: #00D084;
  --color-warning: #F5A623;
  --color-danger:  #E24B4A;
  --color-info:    #378ADD;
  --shadow-card:   0 0 0 1px #222222, 0 24px 48px rgba(0,0,0,0.5);
  --shadow-dialog: 0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px #222222;
}

/* ─── Light Theme ─────────────────────────────────────────────── */
[data-theme="light"] {
  --color-bg-primary:   #F5F5F3;
  --color-bg-surface:   #FFFFFF;
  --color-bg-elevated:  #F0F0EE;
  --color-bg-code:      #F7F7F5;
  --color-bg-tag:       #EAEAE8;
  --color-border-subtle:  #E4E4E2;
  --color-border-default: #D4D4D2;
  --color-border-strong:  #BBBBB9;
  --color-text-primary:   #111111;
  --color-text-secondary: #555555;
  --color-text-muted:     #999999;
  --color-text-inverse:   #FFFFFF;
  --color-accent:         #00B870;
  --color-accent-hover:   #009E5E;
  --color-accent-active:  #008A52;
  --color-accent-subtle:  #00B87012;
  --color-accent-border:  #00B87030;
  --color-success: #00B870;
  --color-warning: #E09010;
  --color-danger:  #D03B3A;
  --color-info:    #2A6DB5;
  --shadow-card:   0 0 0 1px #E4E4E2, 0 4px 16px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
  --shadow-dialog: 0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px #D4D4D2;
}
```

### 4.2 React Toggle Hook

```tsx
import { useState, useEffect } from "react";

type Theme = "dark" | "light";

export function useTheme(defaultTheme: Theme = "dark") {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    return (localStorage.getItem("theme") as Theme) ?? defaultTheme;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme(t => (t === "dark" ? "light" : "dark"));

  return { theme, toggle, setTheme };
}
```

### 4.3 Theme Toggle Button Component

```tsx
function ThemeToggle({ theme, toggle }: { theme: "dark" | "light"; toggle: () => void }) {
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggle}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150"
      style={{
        background: "var(--color-bg-elevated)",
        border: "1px solid var(--color-border-default)",
        color: "var(--color-text-secondary)",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "var(--color-bg-tag)";
        e.currentTarget.style.color = "var(--color-text-primary)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "var(--color-bg-elevated)";
        e.currentTarget.style.color = "var(--color-text-secondary)";
      }}
    >
      {isDark ? <IconSun size={15} /> : <IconMoon size={15} />}
    </button>
  );
}
```

### 4.4 Root App Wrapper Pattern

```tsx
export default function App() {
  const { theme, toggle } = useTheme("dark");

  return (
    <div
      data-theme={theme}
      className="relative min-h-screen"
      style={{ background: "var(--color-bg-primary)", color: "var(--color-text-primary)" }}
    >
      {/* nav */}
      <nav style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
        <ThemeToggle theme={theme} toggle={toggle} />
      </nav>
      {/* content */}
    </div>
  );
}
```

---

## 5. Pre-Flight Checklist

Run before outputting any component:

```
□ Every background uses a CSS variable — no raw hex for backgrounds
□ File-type icon colors are the ONLY hardcoded hex values
□ Every card has border: 1px solid var(--color-border-default)
□ Every card uses boxShadow: "var(--shadow-card)"
□ Every input has focus ring: box-shadow 0 0 0 3px var(--color-accent-subtle)
□ Headings → --color-text-primary, body → --color-text-secondary, helpers → --color-text-muted
□ Accent green appears at most once or twice per section — not scattered everywhere
□ All buttons have transition-all duration-150
□ Icon buttons are w-6 h-6 or w-7 h-7 with rounded-md, NOT rounded-full
□ Disabled buttons have opacity: 0.5 and cursor: not-allowed
□ Accent line at top of cards uses the 90deg linear-gradient pattern
□ All hover styles use onMouseEnter/Leave on style= props (not CSS :hover)
□ No font-family declared inline — comes from global CSS (Geist Sans / Inter)
□ Empty states use dashed border + centered icon + muted text
□ Delete/danger actions have color: var(--color-danger) hover
□ data-theme is set on the root wrapper element (or document.documentElement)
□ Light theme: bg-primary is #F5F5F3 (warm off-white), NOT pure #FFFFFF
□ Light theme: accent is #00B870 (one stop darker for contrast), NOT #00D084
□ Light theme: shadow-card includes a subtle drop shadow for card lift
□ Both themes: bg-surface (cards) is the "lightest" surface in dark, "brightest" in light
```

---

## 6. Theme Comparison — Same Variable, Different Value

| Token | Dark value | Light value | Why different |
|---|---|---|---|
| `--color-bg-primary` | `#0A0A0A` | `#F5F5F3` | Opposite poles — both slightly off-pure for warmth |
| `--color-bg-surface` | `#111111` | `#FFFFFF` | Cards lift off page in both themes |
| `--color-bg-elevated` | `#1A1A1A` | `#F0F0EE` | Inputs sink slightly into the card |
| `--color-border-default` | `#2E2E2E` | `#D4D4D2` | Both are ~18% contrast step from surface |
| `--color-text-primary` | `#FFFFFF` | `#111111` | Full contrast in both themes |
| `--color-text-secondary` | `#8A8A8A` | `#555555` | Darker in light mode for AA readability |
| `--color-text-muted` | `#555555` | `#999999` | Lighter in light mode (same relative dim) |
| `--color-accent` | `#00D084` | `#00B870` | Darker in light for 4.5:1 contrast on white |
| `--color-accent-subtle` | `#00D08418` | `#00B87012` | Both ~8-10% — very faint wash |
| `--shadow-card` | Dark + deep | Soft + layered | Light UI: depth from shadow, dark: depth from black |
| `--color-warning` | `#F5A623` | `#E09010` | Darker in light for legibility |
| `--color-danger` | `#E24B4A` | `#D03B3A` | Slightly darker in light for contrast |

---

## 7. Common Mistakes to Avoid

| Mistake | Correct |
|---|---|
| `style={{ background: "#111111" }}` | `style={{ background: "var(--color-bg-surface)" }}` |
| `style={{ background: "#FFFFFF" }}` for page bg in light | `var(--color-bg-primary)` → `#F5F5F3` |
| Using `#00D084` as accent in light mode | Use `var(--color-accent)` — it resolves to `#00B870` in light |
| Using `color: white` or `color: #000` | `color: var(--color-text-primary)` |
| Omitting `boxShadow` on light-theme cards | Light UI depends on shadow for card lift — always include `var(--shadow-card)` |
| `className="hover:bg-zinc-800"` | `onMouseEnter/Leave` with `style=` |
| Setting `data-theme` on a child div, not root | Set on the outermost wrapper / `document.documentElement` |
| Same accent opacity for both themes | Dark: `#00D08418`, Light: `#00B87012` — values differ |
| Pure black text on light bg: `#000000` | `var(--color-text-primary)` → `#111111` (softer) |
| `border-radius: 9999px` on buttons | `border-radius: 8px` (`rounded-lg`) |
| Gradient on buttons | Flat `background: var(--color-accent)` only |
| Multiple green elements per section | One primary CTA max per view |

---

## 8. Spacing & Sizing (Identical Across Both Themes)

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

Border radius:
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

Gap between form elements:   gap-4 (16px)
Gap inside rows:              gap-2 or gap-2.5 (8-10px)
Gap inside icon+label pairs:  gap-1.5 (6px)
```

---

## 9. Icon Rules (Identical Across Both Themes)

**Library**: `@tabler/icons-react` exclusively.

```
In-line with text:    size={13} or size={14}
Form field prefix:    size={15}
Card header icon:     size={17} or size={18}
Empty state:          size={26} or size={28}
Large decorative:     size={32} max

Color assignments:
  Decorative / prefix:  var(--color-text-muted)
  Interactive idle:     var(--color-text-secondary)
  Accent:               var(--color-accent)
  Danger:               var(--color-danger)
  File-type icons:      hardcoded hex (see Section 3.5)
```

---

## 10. Branding Footer Pattern

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

The accent square and muted text both resolve correctly in both themes via CSS variables.