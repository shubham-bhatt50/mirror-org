# Whatfix Mirror - Prototype

A working prototype for Whatfix Mirror's content organization system with nested folder support and streamlined workflow stages.

## Key Features

### 1. Streamlined Workflow Stages
- **Draft**: Work in progress items
- **Production**: Published items
- **No "Ready" state**: Removed unnecessary intermediate stage

### 2. Nested Folder Structure
- Create unlimited nested folders
- Organize workflows and simulations hierarchically
- Breadcrumb navigation for easy traversal
- Visual folder icons and navigation

### 3. Content Types
- **Workflows**: Individual workflow screens
- **Simulations**: Collections of workflows
- **Folders**: Organizational containers (can be nested infinitely)

### 4. Features Implemented
- ✅ Create new folders, workflows, and simulations
- ✅ Nested folder navigation with breadcrumbs
- ✅ Search functionality
- ✅ Delete items with confirmation
- ✅ Visual indicators (assessment badges, screen counts)
- ✅ Responsive layout matching Whatfix design
- ✅ Tabler icons throughout
- ✅ Draft/Production tabs (no Ready state)

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage Guide

### Creating Content

1. **Create a Folder**:
   - Click "Create new" button
   - Select "Create folder"
   - Enter folder name
   - Folder appears in current location

2. **Create a Workflow**:
   - Click "Create new" button
   - Select "Create workflow"
   - Enter workflow name
   - Workflow is created in current folder

3. **Create a Simulation**:
   - Click "Create new" button or "Create simulation" in header
   - Select "Create simulation"
   - Enter simulation name
   - Simulation is created in current folder

### Navigating Folders

1. **Enter a Folder**:
   - Click on any folder row to navigate into it

2. **Navigate Back**:
   - Use breadcrumb navigation at the top
   - Click on any breadcrumb level to jump to that folder

3. **View All Items**:
   - Click "Workflows" or home icon in breadcrumbs to go to root

### Managing Items

- **Delete**: Click the three-dot menu (⋮) on any item and select "Delete"
- **Search**: Use the search bar to filter items by name
- **Switch Stages**: Toggle between "Draft" and "Production" tabs

## Technology Stack

- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first styling
- **Tabler Icons**: Beautiful SVG icons
- **React Context API**: State management

## Project Structure

\`\`\`
mirror-org/
├── app/
│   ├── components/
│   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   ├── WorkflowsTable.tsx   # Main table view
│   │   ├── ItemRow.tsx          # Individual item row
│   │   └── CreateItemModal.tsx  # Creation modal
│   ├── context/
│   │   └── ItemsContext.tsx     # Global state management
│   ├── utils/
│   │   └── mockData.ts          # Sample data
│   ├── types.ts                 # TypeScript definitions
│   ├── page.tsx                 # Main workflows page
│   ├── analytics/page.tsx       # Analytics page
│   ├── settings/page.tsx        # Settings page
│   └── globals.css              # Global styles
└── package.json
\`\`\`

## Design Decisions

### Color Scheme
- **Primary**: Blue (#3b82f6) - Actions and active states
- **Secondary**: Orange (#ff6b35) - Branding and alerts
- **Dark**: Gray (#2d3748) - Sidebar background
- **Background**: Light gray (#f7fafc) - Page background

### User Experience
1. **Simplified States**: Removed "Ready" state to reduce complexity
2. **Nested Folders**: Allow unlimited nesting for better organization
3. **Visual Feedback**: Hover states, loading indicators, and confirmations
4. **Breadcrumb Navigation**: Clear path indication and quick navigation

## Testing with Users

This prototype is ready for user testing. Key scenarios to test:

1. **Folder Organization**:
   - Can users create logical folder hierarchies?
   - Is navigation intuitive with breadcrumbs?

2. **Stage Management**:
   - Does removing "Ready" state simplify the workflow?
   - Is Draft → Production transition clear?

3. **Content Creation**:
   - Is the creation flow straightforward?
   - Are item types clearly differentiated?

4. **Search & Filter**:
   - Can users quickly find items?
   - Are visual indicators helpful?

## Future Enhancements

- Drag-and-drop for reorganizing items
- Bulk operations (move, delete multiple items)
- Advanced filtering options
- Rename functionality
- Move items between folders
- Export/import capabilities
- Collaboration features (sharing, comments)
- Version history

## License

This is a prototype for internal testing at Whatfix.
