# LearnPath: Visual Academic Clarity & Priority System

**Version**: 1.0  
**Date**: January 30, 2026  
**Status**: MVP Specification  
**Author**: Product Team

---

## 1. Executive Summary

### 1.1 Vision
LearnPath is a **decision support system for studying** that eliminates cognitive overload by providing instant visual clarity on what to study, in what order, and to what depth.

### 1.2 Tagline
**Clear focus. Smart order. Better results.**

### 1.3 Core Value Proposition
Students don't fail due to lack of effort—they fail due to **decision paralysis**. LearnPath solves this by providing structured, honest guidance that points students to the highest-impact work first.

---

## 2. Problem Statement

### 2.1 The Core Problem
Students face daily confusion about:
- **Which topics matter most** for their exams/goals
- **The logical order** to learn them (dependencies and prerequisites)
- **How deeply to study** each topic

### 2.2 Why Existing Solutions Fail
| Tool Type | Focus | Gap |
|-----------|-------|-----|
| Content Delivery | Videos, notes | Doesn't solve prioritization |
| Scheduling | Calendars, Pomodoro | Doesn't guide *what* to study |
| Memorization | Flashcards, SRS | Doesn't provide structure |
| AI Tutors | Generated plans | Overkill, lacks transparency |

**The missing layer**: Cognitive structuring + academic prioritization.

---

## 3. Solution Overview

### 3.1 Unique Approach
LearnPath delivers pure, visual clarity through two fused features:

1. **Priority Map** – Visual importance ranking (high/medium/low focus)
2. **Visual Learning Path** – Interactive flow diagram showing dependencies

### 3.2 What We DON'T Do
- No flashcards or spaced repetition
- No note-taking features
- No AI-generated study plans
- No content delivery (videos, PDFs)
- No complex scheduling

### 3.3 Defensibility
Focus on **clarity of thinking and prioritization**—the rarely-addressed standalone layer that directly boosts academic performance.

---

## 4. Target Users

### 4.1 Primary Users
- **High school students** preparing for board exams (CBSE, ICSE, State)
- **College students** preparing for competitive exams (JEE, NEET, GATE)
- **University students** in structured subjects (CS, Math, Physics, Biology)

### 4.2 User Personas

#### Persona 1: "Overwhelmed Ananya"
- Class 12 CBSE student
- Has 6 months until boards
- Doesn't know where to start with Physics
- Needs: Clear priority ranking, logical sequence

#### Persona 2: "Strategic Rahul"
- JEE aspirant
- Wants to maximize score with limited time
- Needs: Exam weightage data, dependency mapping

#### Persona 3: "Lost Freshman"
- First-year CS student
- Struggling with programming fundamentals
- Needs: Prerequisite chains, depth guidance

---

## 5. Feature Specifications

### 5.1 Feature Matrix

| Feature | MVP | v1.1 | v2.0 |
|---------|-----|------|------|
| Subject Selection | ✅ | ✅ | ✅ |
| Priority Map | ✅ | ✅ | ✅ |
| Visual Learning Path | ✅ | ✅ | ✅ |
| Multiple Subjects | ❌ | ✅ | ✅ |
| User Accounts | ❌ | ❌ | ✅ |
| Progress Tracking | ❌ | ❌ | ✅ |
| Export (PDF/Image) | ❌ | ✅ | ✅ |
| Community Maps | ❌ | ❌ | ✅ |
| Mobile App | ❌ | ❌ | ✅ |

### 5.2 Detailed Feature Descriptions

#### 5.2.1 Subject Selection
**Purpose**: Entry point for users to select their study context.

**UI Components**:
- Course dropdown (CBSE, JEE, NEET, University)
- Semester/Class dropdown (Class 11, 12, Semester 1-8)
- Subject dropdown (Physics, Chemistry, Math, etc.)
- "View Study Plan" CTA button

**Flow**:
```
Home Page → Select Course → Select Class → Select Subject → Priority Map
```

**MVP Scope**: Only Class 12 Physics (CBSE) functional, others show "Coming Soon"

---

#### 5.2.2 Priority Map
**Purpose**: Visual hierarchy of topic importance.

**Layout**: Three-column responsive grid
- **Column 1**: High-Focus Topics (40-60% exam weight)
- **Column 2**: Medium-Focus Topics (20-40% exam weight)
- **Column 3**: Low-Focus Topics (5-20% exam weight / quick review)

**Card Components**:
```typescript
interface PriorityCard {
  id: string;
  title: string;
  examWeight: number;        // Percentage (e.g., 45)
  requiredDepth: 'Master' | 'Understand' | 'Familiar';
  commonMistakes: string[];  // Array of 2-3 mistakes
  estimatedTime: string;     // e.g., "8-10 hours"
  dependencies: string[];    // IDs of prerequisite topics
  priority: 'high' | 'medium' | 'low';
}
```

**Visual Design**:
- **Master**: Red badge (critical)
- **Understand**: Yellow badge (important)
- **Familiar**: Green badge (awareness)
- Card shadows for depth
- Hover: Slight elevation + shadow increase

---

#### 5.2.3 Visual Learning Path
**Purpose**: Interactive diagram showing study sequence and dependencies.

**Technology Options**:

**Option A: React Flow** (Recommended for MVP)
- Pros: Interactive, customizable, good performance
- Cons: Heavier bundle size
- Use case: When interactivity is key

**Option B: Mermaid.js** (Simpler alternative)
- Pros: Text-based, lightweight, easy to maintain
- Cons: Less interactive
- Use case: When simplicity is preferred

**Diagram Elements**:
- **Nodes**: Topics (color-coded by priority)
- **Edges**: Arrows showing "depends on" or "study first"
- **Node States**:
  - Default: Outline only
  - Hover: Fill with priority color
  - Active (clicked): Full color + sidebar details

**Interactivity**:
- Click node → Sidebar opens with Priority Card details
- Pan and zoom (if using React Flow)
- Legend for color coding

**Layout Algorithms**:
- Top-to-bottom flow for sequential topics
- Left-to-right branching for parallel tracks
- Group related topics visually

---

## 6. User Flows

### 6.1 Primary User Journey

```
┌─────────────────────────────────────────────────────────────┐
│                        LANDING PAGE                         │
│  • Hero section with tagline                                │
│  • Subject selection form                                   │
│  • Example preview (screenshot of Priority Map)             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                     SUBJECT SELECTION                       │
│  1. User selects:                                           │
│     • Course: CBSE                                          │
│     • Class: 12                                             │
│     • Subject: Physics                                      │
│  2. Clicks "View Study Plan"                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      PRIORITY MAP                           │
│  • Views 3-column layout                                    │
│  • Scans High-Focus topics first                            │
│  • Clicks on "Electromagnetic Induction" card               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   LEARNING PATH PAGE                        │
│  • Sees full topic dependency graph                         │
│  • "Electromagnetic Induction" highlighted                  │
│  • Sidebar shows card details                               │
│  • User traces prerequisites:                               │
│    Magnetic Effects → Faraday's Law → EMI                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      DECISION MADE                          │
│  User now knows:                                            │
│  ✓ Start with Magnetic Effects of Current                   │
│  ✓ Study to "Master" depth                                  │
│  ✓ Allocate 10 hours                                        │
│  ✓ Avoid common integration mistakes                        │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Navigation Flow

```
                    ┌──────────────┐
                    │    Home      │
                    └──────┬───────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │Priority Map  │ │Learning Path │ │   About      │
    └──────┬───────┘ └──────┬───────┘ └──────────────┘
           │               │
           └───────┬───────┘
                   │
                   ▼
          ┌──────────────┐
          │ Topic Detail │
          │   (Modal)    │
          └──────────────┘
```

### 6.3 Alternative Flows

**Flow A: Quick Path Check**
```
Home → Learning Path (direct) → Click any node → See details
```

**Flow B: Priority-First Approach**
```
Home → Priority Map → Click card → "View in Path" button → Learning Path (focused)
```

---

## 7. Technical Architecture

### 7.1 Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | Tanstack(react) (App Router) | SSR support, file-based routing, Vercel optimization |
| **Language** | TypeScript | Type safety, better DX |
| **Styling** | Tailwind CSS 4.0 | Utility-first, rapid development, consistent design |
| **UI Components** | shadcn/ui | Accessible, customizable components |
| **Flow Diagram** | React Flow | Interactive node-based graphs |
| **State Management** | Zustand | Lightweight, minimal boilerplate |
| **Icons** | Lucide React | Consistent, tree-shakeable |
| **Animation** | Framer Motion | Smooth transitions, gesture support |
| **Deployment** | Vercel | Edge network, CI/CD, free tier |

### 7.2 Project Structure

```
learnpath/
├── app/                          # Tanstack App Router
│   ├── page.tsx                  # Landing/Subject selection
│   ├── layout.tsx                # Root layout with providers
│   ├── globals.css               # Global styles + Tailwind
│   ├── priority/
│   │   └── page.tsx              # Priority Map page
│   ├── path/
│   │   └── page.tsx              # Learning Path page
│   └── about/
│       └── page.tsx              # About/FAQ page
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── select.tsx
│   ├── priority/
│   │   ├── PriorityCard.tsx      # Individual topic card
│   │   ├── PrioritySection.tsx   # Column (High/Med/Low)
│   │   └── PriorityGrid.tsx      # 3-column layout
│   ├── path/
│   │   ├── LearningFlow.tsx      # React Flow wrapper
│   │   ├── FlowNode.tsx          # Custom node component
│   │   ├── FlowEdge.tsx          # Custom edge component
│   │   └── TopicSidebar.tsx      # Detail sidebar
│   └── shared/
│       ├── Header.tsx            # Navigation header
│       ├── Footer.tsx            # Footer component
│       ├── SubjectSelector.tsx   # Course/Class/Subject form
│       └── Logo.tsx              # Brand logo
├── lib/
│   ├── utils.ts                  # Utility functions (cn helper)
│   ├── data/
│   │   └── physics12.ts          # Static subject data
│   └── types/
│       └── index.ts              # TypeScript interfaces
├── hooks/
│   ├── useSubject.ts             # Subject selection state
│   └── useTopic.ts               # Selected topic state
├── store/
│   └── appStore.ts               # Zustand store
├── public/
│   ├── logo.svg
│   └── preview.png               # OG image
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### 7.3 Data Schema

```typescript
// types/index.ts

export interface Topic {
  id: string;
  title: string;
  description: string;
  examWeight: number;
  requiredDepth: 'Master' | 'Understand' | 'Familiar';
  commonMistakes: string[];
  estimatedTime: string;
  dependencies: string[];
  priority: 'high' | 'medium' | 'low';
  position: { x: number; y: number }; // For flow diagram
}

export interface Subject {
  id: string;
  name: string;
  course: string;
  class: string;
  topics: Topic[];
}

export interface FlowNode {
  id: string;
  type: 'topic';
  position: { x: number; y: number };
  data: Topic;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type: 'smoothstep';
  animated: boolean;
}
```

### 7.4 State Management

```typescript
// store/appStore.ts
import { create } from 'zustand';
import { Subject, Topic } from '@/lib/types';

interface AppState {
  // Selection
  selectedCourse: string | null;
  selectedClass: string | null;
  selectedSubject: Subject | null;
  
  // Topic focus
  selectedTopic: Topic | null;
  
  // Actions
  setCourse: (course: string) => void;
  setClass: (cls: string) => void;
  setSubject: (subject: Subject) => void;
  setTopic: (topic: Topic | null) => void;
  clearSelection: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedCourse: null,
  selectedClass: null,
  selectedSubject: null,
  selectedTopic: null,
  
  setCourse: (course) => set({ selectedCourse: course }),
  setClass: (cls) => set({ selectedClass: cls }),
  setSubject: (subject) => set({ selectedSubject: subject }),
  setTopic: (topic) => set({ selectedTopic: topic }),
  clearSelection: () => set({
    selectedCourse: null,
    selectedClass: null,
    selectedSubject: null,
    selectedTopic: null,
  }),
}));
```

---

## 8. UI/UX Design

### 8.1 Design Principles

1. **Clarity First**: Every element serves the goal of reducing confusion
2. **Minimalism**: White space, clean typography, no decorative elements
3. **Visual Hierarchy**: Color and size guide attention naturally
4. **Mobile-First**: Core functionality works on all screen sizes

### 8.2 Color System

```css
/* Primary Colors */
--color-primary: #2563eb;        /* Blue - actions, links */
--color-primary-hover: #1d4ed8;

/* Priority Colors */
--color-high: #dc2626;           /* Red - Master */
--color-medium: #f59e0b;         /* Amber - Understand */
--color-low: #16a34a;            /* Green - Familiar */

/* Neutral Colors */
--color-bg: #ffffff;             /* White background */
--color-surface: #f8fafc;        /* Cards, sidebars */
--color-border: #e2e8f0;         /* Borders, dividers */
--color-text: #0f172a;           /* Primary text */
--color-text-muted: #64748b;     /* Secondary text */

/* Semantic Colors */
--color-success: #22c55e;
--color-warning: #f59e0b;
--color-error: #ef4444;
```

### 8.3 Typography

```css
/* Font Stack */
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;

/* Type Scale */
--text-xs: 0.75rem;      /* 12px - captions */
--text-sm: 0.875rem;     /* 14px - body small */
--text-base: 1rem;       /* 16px - body */
--text-lg: 1.125rem;     /* 18px - lead */
--text-xl: 1.25rem;      /* 20px - h4 */
--text-2xl: 1.5rem;      /* 24px - h3 */
--text-3xl: 1.875rem;    /* 30px - h2 */
--text-4xl: 2.25rem;     /* 36px - h1 */

/* Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### 8.4 Component Specifications

#### Priority Card
```
┌─────────────────────────────────────────┐
│  Electromagnetic Induction     [Master] │  ← Title + Badge
│  ─────────────────────────────────────  │
│  Weight: 45% of exam                    │  ← Exam weight
│  Time: 10-12 hours                      │  ← Time estimate
│                                         │
│  Common mistakes:                       │  ← Mistakes section
│  • Forgetting Lenz's law direction      │
│  • Incorrect flux calculations          │
│                                         │
│  [View in Path →]                       │  ← CTA button
└─────────────────────────────────────────┘

Specs:
- Width: 100% of column (responsive)
- Padding: 24px
- Border-radius: 12px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Hover shadow: 0 4px 6px rgba(0,0,0,0.1)
- Badge colors: Red (#dc2626) / Amber (#f59e0b) / Green (#16a34a)
```

#### Flow Node
```
┌────────────────────────┐
│  ○ Magnetic Effects    │  ← Circle indicator + Title
│    of Electric Current │
└────────────────────────┘

States:
- Default: White fill, gray border (2px)
- Hover: Priority color fill (20% opacity)
- Active: Priority color fill (solid), white text
- Selected: Ring (3px) + shadow

Specs:
- Min-width: 160px
- Padding: 12px 16px
- Border-radius: 8px
- Font-size: 14px
```

### 8.5 Responsive Breakpoints

```css
/* Mobile First */
default: 0-639px       /* Single column */
sm: 640px-1023px       /* 2 columns */
md: 768px-1023px       /* 2 columns, larger text */
lg: 1024px-1279px      /* 3 columns */
xl: 1280px+            /* 3 columns, max-width container */
```

---

## 9. MVP Data: Class 12 Physics (CBSE)

### 9.1 Topic List (15 Topics)

```typescript
// lib/data/physics12.ts

export const physics12CBSE: Subject = {
  id: 'physics-12-cbse',
  name: 'Physics',
  course: 'CBSE',
  class: '12',
  topics: [
    {
      id: 'electrostatics',
      title: 'Electrostatics',
      description: 'Electric charges, fields, potential, and capacitance',
      examWeight: 50,
      requiredDepth: 'Master',
      commonMistakes: [
        'Sign errors in potential calculations',
        'Confusing field vs potential',
        'Incorrect Gauss law applications'
      ],
      estimatedTime: '15-18 hours',
      dependencies: [],
      priority: 'high',
      position: { x: 250, y: 0 }
    },
    {
      id: 'current-electricity',
      title: 'Current Electricity',
      description: 'Ohm\'s law, circuits, and electrical measurements',
      examWeight: 35,
      requiredDepth: 'Master',
      commonMistakes: [
        'Incorrect Kirchhoff\'s law setup',
        'Wheatstone bridge errors',
        'Meter bridge calculation mistakes'
      ],
      estimatedTime: '12-14 hours',
      dependencies: ['electrostatics'],
      priority: 'high',
      position: { x: 250, y: 150 }
    },
    {
      id: 'magnetic-effects',
      title: 'Magnetic Effects of Current',
      description: 'Biot-Savart law, Ampere\'s law, and moving charges',
      examWeight: 40,
      requiredDepth: 'Master',
      commonMistakes: [
        'Direction confusion with right-hand rules',
        'Integration errors in Biot-Savart',
        'Torque on dipole formula mistakes'
      ],
      estimatedTime: '14-16 hours',
      dependencies: ['current-electricity'],
      priority: 'high',
      position: { x: 100, y: 300 }
    },
    {
      id: 'emi',
      title: 'Electromagnetic Induction',
      description: 'Faraday\'s law, Lenz\'s law, and induced currents',
      examWeight: 45,
      requiredDepth: 'Master',
      commonMistakes: [
        'Forgetting Lenz\'s law direction',
        'Incorrect flux calculations',
        'Motional EMF sign errors'
      ],
      estimatedTime: '12-14 hours',
      dependencies: ['magnetic-effects'],
      priority: 'high',
      position: { x: 100, y: 450 }
    },
    {
      id: 'ac-circuits',
      title: 'Alternating Current',
      description: 'AC circuits, resonance, and power',
      examWeight: 30,
      requiredDepth: 'Understand',
      commonMistakes: [
        'Phase angle confusion',
        'Impedance calculation errors',
        'Power factor misconceptions'
      ],
      estimatedTime: '10-12 hours',
      dependencies: ['emi'],
      priority: 'medium',
      position: { x: 100, y: 600 }
    },
    {
      id: 'optics-ray',
      title: 'Ray Optics',
      description: 'Reflection, refraction, and optical instruments',
      examWeight: 35,
      requiredDepth: 'Master',
      commonMistakes: [
        'Sign convention errors',
        'Lens/mirror formula confusion',
        'Magnification calculation errors'
      ],
      estimatedTime: '12-14 hours',
      dependencies: [],
      priority: 'high',
      position: { x: 400, y: 300 }
    },
    {
      id: 'optics-wave',
      title: 'Wave Optics',
      description: 'Interference, diffraction, and polarization',
      examWeight: 25,
      requiredDepth: 'Understand',
      commonMistakes: [
        'Path difference confusion',
        'Fringe width formula errors',
        'Polarization angle mistakes'
      ],
      estimatedTime: '8-10 hours',
      dependencies: ['optics-ray'],
      priority: 'medium',
      position: { x: 400, y: 450 }
    },
    {
      id: 'dual-nature',
      title: 'Dual Nature of Radiation',
      description: 'Photoelectric effect and matter waves',
      examWeight: 20,
      requiredDepth: 'Understand',
      commonMistakes: [
        'Work function confusion',
        'De Broglie wavelength errors',
        'Einstein\'s equation misapplication'
      ],
      estimatedTime: '6-8 hours',
      dependencies: ['optics-wave'],
      priority: 'medium',
      position: { x: 400, y: 600 }
    },
    {
      id: 'atoms',
      title: 'Atoms',
      description: 'Rutherford and Bohr models',
      examWeight: 15,
      requiredDepth: 'Familiar',
      commonMistakes: [
        'Energy level calculations',
        'Spectral series confusion',
        'Bohr model limitations'
      ],
      estimatedTime: '5-6 hours',
      dependencies: ['dual-nature'],
      priority: 'low',
      position: { x: 550, y: 600 }
    },
    {
      id: 'nuclei',
      title: 'Nuclei',
      description: 'Nuclear structure and radioactivity',
      examWeight: 15,
      requiredDepth: 'Familiar',
      commonMistakes: [
        'Half-life calculation errors',
        'Q-value formula confusion',
        'Nuclear reaction balancing'
      ],
      estimatedTime: '5-6 hours',
      dependencies: ['atoms'],
      priority: 'low',
      position: { x: 550, y: 750 }
    },
    {
      id: 'semiconductors',
      title: 'Semiconductor Electronics',
      description: 'Diodes, transistors, and logic gates',
      examWeight: 30,
      requiredDepth: 'Understand',
      commonMistakes: [
        'PN junction biasing confusion',
        'Transistor configuration errors',
        'Logic gate truth tables'
      ],
      estimatedTime: '10-12 hours',
      dependencies: [],
      priority: 'medium',
      position: { x: 700, y: 300 }
    },
    {
      id: 'communication',
      title: 'Communication Systems',
      description: 'Signal propagation and modulation',
      examWeight: 10,
      requiredDepth: 'Familiar',
      commonMistakes: [
        'Modulation index confusion',
        'Bandwidth calculation errors',
        'Demodulation process unclear'
      ],
      estimatedTime: '4-5 hours',
      dependencies: ['semiconductors'],
      priority: 'low',
      position: { x: 700, y: 450 }
    }
  ]
};
```

### 9.2 Dependency Graph

```
Electrostatics
    ↓
Current Electricity
    ↓
Magnetic Effects of Current
    ↓
Electromagnetic Induction
    ↓
Alternating Current

Ray Optics
    ↓
Wave Optics
    ↓
Dual Nature of Radiation
    ↓
Atoms
    ↓
Nuclei

Semiconductor Electronics
    ↓
Communication Systems
```

---

## 10. Implementation Timeline

### 10.1 MVP Build Plan (8 Hours)

| Hour | Task | Deliverable |
|------|------|-------------|
| 1 | Project setup | Next.js + Tailwind + shadcn/ui initialized |
| 2 | Layout + Navigation | Header, footer, page structure |
| 3 | Subject Selector | Dropdowns, state management |
| 4 | Priority Card Component | Card UI with all data fields |
| 5 | Priority Map Page | 3-column grid layout |
| 6 | React Flow Setup | Node and edge components |
| 7 | Learning Path Page | Interactive diagram |
| 8 | Polish + Deploy | Responsive fixes, Vercel deployment |

### 10.2 Detailed Hour-by-Hour Plan

**Hour 1: Setup**
```bash
npx shadcn@latest init --yes --template next --base-color slate
npm install reactflow zustand framer-motion lucide-react
npx shadcn add button card badge select
```
- Configure Tailwind theme colors
- Set up folder structure
- Create type definitions

**Hour 2: Layout**
- Create root layout with providers
- Build Header component with navigation
- Build Footer component
- Set up Zustand store

**Hour 3: Subject Selection**
- Create SubjectSelector component
- Build home page with hero section
- Implement form state management
- Add navigation to Priority Map

**Hour 4: Priority Components**
- Create PriorityCard component
- Implement depth badges (Master/Understand/Familiar)
- Style cards with Tailwind
- Add hover interactions

**Hour 5: Priority Map**
- Create PriorityGrid component
- Group topics by priority level
- Implement responsive 3-column layout
- Add section headers

**Hour 6: Flow Setup**
- Install and configure React Flow
- Create custom node component
- Create custom edge component
- Build TopicSidebar component

**Hour 7: Learning Path**
- Build LearningFlow component
- Map topics to nodes
- Create edges from dependencies
- Implement click-to-view details

**Hour 8: Polish & Deploy**
- Mobile responsive testing
- Add loading states
- Configure next.config.js for static export
- Deploy to Vercel

---

## 11. Success Metrics

### 11.1 MVP Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Page Load Time | < 2s | Lighthouse performance score |
| Time to First Interaction | < 3s | User testing |
| Mobile Responsiveness | 100% | Chrome DevTools testing |
| User Task Completion | 90%+ | Can users find topic path? |

### 11.2 Post-Launch Metrics

| Metric | Target | Tool |
|--------|--------|------|
| Daily Active Users | 100+ | Vercel Analytics |
| Bounce Rate | < 40% | Google Analytics |
| Avg. Session Duration | > 3 min | Google Analytics |
| Priority Map Views | 70% of sessions | Custom events |
| Path Diagram Interactions | 50% of sessions | Custom events |

---

## 12. Future Roadmap

### 12.1 Version 1.1 (2-3 Weeks)
- [ ] Additional CBSE subjects (Chemistry, Mathematics)
- [ ] JEE/NEET specific priority weightings
- [ ] Export path as PNG/PDF
- [ ] Print-friendly styles
- [ ] Keyboard navigation support

### 12.2 Version 2.0 (1-2 Months)
- [ ] User accounts (Clerk/Auth.js)
- [ ] Progress tracking (check off completed topics)
- [ ] Multiple subject support
- [ ] Search functionality
- [ ] Dark mode

### 12.3 Version 3.0 (3-6 Months)
- [ ] Community-submitted priority maps
- [ ] Admin panel for content management
- [ ] Analytics dashboard for educators
- [ ] Mobile app (React Native/Expo)
- [ ] Offline support (PWA)

---

## 13. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| React Flow bundle size | Medium | Medium | Lazy load, or switch to Mermaid |
| Data accuracy disputes | High | Medium | Add disclaimer, cite sources |
| Mobile diagram usability | High | High | Simplify to vertical list on mobile |
| Scope creep | High | High | Strict MVP adherence |
| Limited subject appeal | Medium | High | Fast-follow with popular subjects |

---

## 14. Appendix

### 14.1 Glossary

| Term | Definition |
|------|------------|
| **Priority Map** | Visual grid showing topics organized by importance |
| **Learning Path** | Interactive diagram showing topic dependencies |
| **Depth Level** | Required mastery level (Master/Understand/Familiar) |
| **Exam Weight** | Percentage of exam marks from a topic |
| **Prerequisite** | Topic that must be studied before another |

### 14.2 References

- CBSE Class 12 Physics Syllabus 2024-25
- JEE Main Physics Weightage Analysis
- React Flow Documentation: https://reactflow.dev
- Next.js App Router Documentation

### 14.3 Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-30 | Initial PRD for MVP |

---

**End of Document**
