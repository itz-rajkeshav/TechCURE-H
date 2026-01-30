# Frontend Todo - LearnPath

## Phase 1: Project Setup (Priority: High)

### 1.1 Initialize Project
- [ ] Run `npx shadcn@latest init --yes --template next --base-color slate`
- [ ] Configure project name as "learnpath"
- [ ] Verify Next.js 15 installation
- [ ] Check TypeScript configuration

### 1.2 Install Dependencies
- [ ] Install React Flow: `npm install @xyflow/react`
- [ ] Install Zustand: `npm install zustand`
- [ ] Install Framer Motion: `npm install framer-motion`
- [ ] Install Lucide React: `npm install lucide-react`
- [ ] Verify all installations in package.json

### 1.3 Install shadcn Components
- [ ] Button: `npx shadcn add button`
- [ ] Card: `npx shadcn add card`
- [ ] Badge: `npx shadcn add badge`
- [ ] Select: `npx shadcn add select`
- [ ] Input: `npx shadcn add input`
- [ ] Sheet: `npx shadcn add sheet` (for mobile sidebar)
- [ ] Separator: `npx shadcn add separator`
- [ ] ScrollArea: `npx shadcn add scroll-area`

### 1.4 Project Structure Setup
- [ ] Create `app/priority/` directory
- [ ] Create `app/path/` directory
- [ ] Create `components/priority/` directory
- [ ] Create `components/path/` directory
- [ ] Create `components/shared/` directory
- [ ] Create `lib/data/` directory
- [ ] Create `lib/types/` directory
- [ ] Create `hooks/` directory
- [ ] Create `store/` directory

### 1.5 Configuration
- [ ] Update `tailwind.config.ts` with custom colors
- [ ] Configure priority colors (high: red, medium: amber, low: green)
- [ ] Update `next.config.js` for static export
- [ ] Create `lib/types/index.ts` with all interfaces

---

## Phase 2: Core Types & Data (Priority: High)

### 2.1 Type Definitions
- [ ] Create `Topic` interface with all fields
- [ ] Create `Subject` interface
- [ ] Create `FlowNode` interface
- [ ] Create `FlowEdge` interface
- [ ] Create `PriorityLevel` type union
- [ ] Create `DepthLevel` type union

### 2.2 Static Data Creation
- [ ] Create `lib/data/physics12.ts`
- [ ] Add 12 topics from PRD
- [ ] Define all topic properties (weight, depth, mistakes, time)
- [ ] Set up dependency arrays for each topic
- [ ] Add position coordinates for flow diagram
- [ ] Verify data completeness

### 2.3 Data Utilities
- [ ] Create helper to group topics by priority
- [ ] Create helper to build flow nodes from topics
- [ ] Create helper to build flow edges from dependencies
- [ ] Add validation for data integrity

---

## Phase 3: State Management (Priority: High)

### 3.1 Zustand Store Setup
- [ ] Create `store/appStore.ts`
- [ ] Define store interface
- [ ] Add `selectedCourse` state
- [ ] Add `selectedClass` state
- [ ] Add `selectedSubject` state
- [ ] Add `selectedTopic` state

### 3.2 Store Actions
- [ ] Implement `setCourse()` action
- [ ] Implement `setClass()` action
- [ ] Implement `setSubject()` action
- [ ] Implement `setTopic()` action
- [ ] Implement `clearSelection()` action
- [ ] Add persistence middleware (optional)

### 3.3 Custom Hooks
- [ ] Create `useSubject()` hook
- [ ] Create `useTopic()` hook
- [ ] Create `usePriorityGroups()` hook
- [ ] Create `useFlowData()` hook

---

## Phase 4: Shared Components (Priority: High)

### 4.1 Layout Components
- [ ] Create `components/shared/Header.tsx`
  - Logo component
  - Navigation links (Home, Priority Map, Learning Path)
  - Mobile hamburger menu
  - Active state styling

- [ ] Create `components/shared/Footer.tsx`
  - Copyright text
  - Links to About page
  - Social links (optional)

- [ ] Create `components/shared/Logo.tsx`
  - SVG or text-based logo
  - Link to home page
  - Responsive sizing

### 4.2 Navigation
- [ ] Create mobile navigation menu
- [ ] Add smooth scroll behavior
- [ ] Implement active route highlighting
- [ ] Add keyboard navigation support

---

## Phase 5: Home Page & Subject Selection (Priority: High)

### 5.1 Hero Section
- [ ] Create hero section with tagline
- [ ] Add gradient or solid background
- [ ] Include product screenshot/preview
- [ ] Add CTA button

### 5.2 Subject Selector Component
- [ ] Create `components/shared/SubjectSelector.tsx`
- [ ] Build Course dropdown (CBSE, JEE, NEET, etc.)
- [ ] Build Class/Semester dropdown
- [ ] Build Subject dropdown
- [ ] Implement cascading dropdown logic
- [ ] Add "Coming Soon" states for unavailable options
- [ ] Style with shadcn Select components

### 5.3 Home Page Integration
- [ ] Update `app/page.tsx`
- [ ] Add hero section
- [ ] Integrate SubjectSelector
- [ ] Add "View Study Plan" button
- [ ] Implement navigation to Priority Map
- [ ] Add loading state

---

## Phase 6: Priority Map Page (Priority: High)

### 6.1 Priority Card Component
- [ ] Create `components/priority/PriorityCard.tsx`
- [ ] Display topic title
- [ ] Add depth badge (Master/Understand/Familiar)
- [ ] Show exam weight percentage
- [ ] Show estimated study time
- [ ] List common mistakes (2-3 items)
- [ ] Add "View in Path" button
- [ ] Implement hover effects
- [ ] Add color coding by priority

### 6.2 Priority Section Component
- [ ] Create `components/priority/PrioritySection.tsx`
- [ ] Section header with priority label
- [ ] Grid layout for cards
- [ ] Column title styling (High/Medium/Low Focus)
- [ ] Add section description

### 6.3 Priority Grid Layout
- [ ] Create `components/priority/PriorityGrid.tsx`
- [ ] Implement 3-column responsive grid
  - Desktop: 3 columns
  - Tablet: 2 columns
  - Mobile: 1 column
- [ ] Group topics by priority level
- [ ] Add spacing between sections
- [ ] Handle empty states

### 6.4 Priority Map Page
- [ ] Create `app/priority/page.tsx`
- [ ] Add page header with subject name
- [ ] Integrate PriorityGrid component
- [ ] Add "View Learning Path" CTA
- [ ] Implement back navigation
- [ ] Add breadcrumb navigation
- [ ] Make responsive

---

## Phase 7: Learning Path Page (Priority: High)

### 7.1 React Flow Setup
- [ ] Create `components/path/LearningFlow.tsx`
- [ ] Import React Flow components
- [ ] Configure React Flow provider
- [ ] Set up viewport controls
- [ ] Add mini-map (optional)
- [ ] Configure zoom levels

### 7.2 Custom Flow Node
- [ ] Create `components/path/FlowNode.tsx`
- [ ] Design node with topic title
- [ ] Add priority color indicator
- [ ] Implement click handler
- [ ] Add hover state styling
- [ ] Style with Tailwind classes

### 7.3 Custom Flow Edge
- [ ] Create `components/path/FlowEdge.tsx`
- [ ] Style edges (color, thickness)
- [ ] Add arrow markers
- [ ] Configure smoothstep type
- [ ] Add animation (optional)

### 7.4 Topic Sidebar
- [ ] Create `components/path/TopicSidebar.tsx`
- [ ] Display selected topic details
- [ ] Show full PriorityCard content
- [ ] Add close button
- [ ] Implement slide-in animation
- [ ] Make responsive (drawer on mobile)

### 7.5 Learning Path Page
- [ ] Create `app/path/page.tsx`
- [ ] Add page header
- [ ] Integrate LearningFlow component
- [ ] Connect TopicSidebar
- [ ] Implement topic selection logic
- [ ] Add legend for color coding
- [ ] Add instructions/help text
- [ ] Handle empty selection state

---

## Phase 8: Styling & Polish (Priority: Medium)

### 8.1 Global Styles
- [ ] Update `app/globals.css`
- [ ] Add custom CSS variables for colors
- [ ] Configure base font styles
- [ ] Add smooth scrolling
- [ ] Set up dark mode variables (future)

### 8.2 Responsive Design
- [ ] Test on mobile devices (320px+)
- [ ] Test on tablets (768px+)
- [ ] Test on desktops (1024px+)
- [ ] Fix overflow issues
- [ ] Adjust font sizes for mobile
- [ ] Optimize touch targets (min 44px)

### 8.3 Animations
- [ ] Add page transition animations
- [ ] Add card hover animations
- [ ] Add sidebar slide animation
- [ ] Add flow node selection animation
- [ ] Configure Framer Motion variants

### 8.4 Accessibility
- [ ] Add proper heading hierarchy
- [ ] Add alt text to images
- [ ] Ensure color contrast (WCAG 4.5:1)
- [ ] Add ARIA labels
- [ ] Test keyboard navigation
- [ ] Add focus indicators

---

## Phase 9: Performance Optimization (Priority: Medium)

### 9.1 Code Splitting
- [ ] Lazy load React Flow component
- [ ] Split priority and path pages
- [ ] Use dynamic imports where needed

### 9.2 Asset Optimization
- [ ] Optimize images
- [ ] Use next/image for images
- [ ] Configure image domains

### 9.3 Bundle Analysis
- [ ] Run `npm run analyze` (if available)
- [ ] Check bundle size
- [ ] Remove unused dependencies
- [ ] Tree-shake Lucide icons

---

## Phase 10: Testing (Priority: Medium)

### 10.1 Manual Testing
- [ ] Test all navigation flows
- [ ] Test subject selection
- [ ] Test priority map display
- [ ] Test learning path interactions
- [ ] Test mobile responsiveness
- [ ] Test on different browsers (Chrome, Firefox, Safari)

### 10.2 Performance Testing
- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Optimize if score < 90
- [ ] Test loading times

### 10.3 User Testing
- [ ] Test with sample users
- [ ] Gather feedback on UX
- [ ] Identify pain points
- [ ] Document issues

---

## Phase 11: Deployment (Priority: High)

### 11.1 Build Configuration
- [ ] Configure `next.config.js` for static export
- [ ] Set output: 'export'
- [ ] Configure distDir
- [ ] Add trailingSlash if needed

### 11.2 Git Setup
- [ ] Initialize git repository
- [ ] Create .gitignore
- [ ] Add all files
- [ ] Create initial commit
- [ ] Push to GitHub

### 11.3 Vercel Deployment
- [ ] Connect GitHub repo to Vercel
- [ ] Configure build settings
- [ ] Set environment variables (if any)
- [ ] Deploy
- [ ] Verify deployment URL
- [ ] Test live site

### 11.4 Post-Deployment
- [ ] Configure custom domain (optional)
- [ ] Set up Vercel Analytics
- [ ] Add Google Analytics (optional)
- [ ] Test all functionality on production
- [ ] Document known issues

---

## Phase 12: Documentation (Priority: Low)

### 12.1 Code Documentation
- [ ] Add JSDoc comments to components
- [ ] Document props interfaces
- [ ] Add README.md to project
- [ ] Document setup instructions

### 12.2 User Documentation
- [ ] Create user guide (optional)
- [ ] Add tooltips/help text
- [ ] Create FAQ section

---

## Quick Reference: File Structure

```
app/
├── page.tsx                    # Home page
├── layout.tsx                  # Root layout
├── globals.css                 # Global styles
├── priority/
│   └── page.tsx               # Priority Map page
├── path/
│   └── page.tsx               # Learning Path page
└── about/
    └── page.tsx               # About page

components/
├── ui/                         # shadcn components
├── priority/
│   ├── PriorityCard.tsx
│   ├── PrioritySection.tsx
│   └── PriorityGrid.tsx
├── path/
│   ├── LearningFlow.tsx
│   ├── FlowNode.tsx
│   ├── FlowEdge.tsx
│   └── TopicSidebar.tsx
└── shared/
    ├── Header.tsx
    ├── Footer.tsx
    ├── Logo.tsx
    └── SubjectSelector.tsx

lib/
├── utils.ts
├── types/
│   └── index.ts
└── data/
    └── physics12.ts

hooks/
├── useSubject.ts
├── useTopic.ts
├── usePriorityGroups.ts
└── useFlowData.ts

store/
└── appStore.ts
```

---

## Priority Legend

- **High**: Critical for MVP, must complete
- **Medium**: Important but can ship without
- **Low**: Nice to have, future enhancement

## Status Tracking

Use these markers:
- [ ] Not started
- [/] In progress
- [x] Completed
- [-] Blocked/Issue

---

**Last Updated**: January 30, 2026
**Estimated Time**: 16-20 hours total
