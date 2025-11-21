# Quick Start Guide - Whatfix Mirror Prototype

## 🚀 Your Prototype is Ready!

The development server is running at: **http://localhost:3000**

## ✅ What's Been Built

### Core Features
1. **Two-stage workflow** (Draft/Production) - no "Ready" state
2. **Unlimited nested folders** - organize content hierarchically
3. **Three content types**: Folders, Workflows, Simulations
4. **Breadcrumb navigation** - easy folder traversal
5. **Search functionality** - find items quickly
6. **Modern UI** - Whatfix colors and Tabler icons

## 🎯 Try These Actions

### 1. Create Your First Folder
- Click the "Create new" button
- Select "Create folder"
- Name it "India Market" or "STS Application"
- Hit Enter or click Create

### 2. Navigate Into Folders
- Click on any folder row to open it
- Notice the breadcrumbs update at the top
- Create more folders and items inside

### 3. Create Nested Structure
Try recreating the structure from your mockup:
```
STS (Application)
├── IND (Market)
│   ├── DAP 1 Mirror 2025
│   │   ├── Flow 1 (workflow)
│   │   ├── Flow 2 (workflow)
│   │   └── Flow 3 (workflow)
│   └── DAP 2 Mirror 2025
├── THA (Market)
└── FRA (Market)
```

### 4. Create Workflows and Simulations
- Inside any folder, click "Create new"
- Choose "Create workflow" or "Create simulation"
- Give it a name and create
- See the count badges and type indicators

### 5. Switch Between Stages
- Toggle between "Draft" and "Production" tabs
- Notice items filter by stage
- Create items in different stages

### 6. Use Search
- Type in the search box to filter items
- Search works within current folder
- Clear search to see all items

### 7. Explore Navigation
- Click breadcrumbs to jump to any parent folder
- Click home icon to return to root
- Navigate deep into nested folders

### 8. Delete Items
- Click the three-dot menu (⋮) on any item
- Select "Delete"
- Confirm the deletion

### 9. Get Help
- Click the blue help button (?) in bottom-right
- View keyboard shortcuts and tips
- Close with X or Escape key

## 📊 Sample Data

The prototype comes with pre-loaded sample data including:
- Google 1.3 workflow
- Multi Lang test workflows
- TEST simulation (with assessment)
- SirionLabs workflow (in Production)
- And more...

Feel free to delete these and create your own structure!

## 🎨 Design Highlights

### Colors (Matching Whatfix)
- **Primary Blue**: #3b82f6 (actions, active states)
- **Orange**: #ff6b35 (banner, branding)
- **Dark Sidebar**: #2d3748
- **Clean Background**: #f7fafc

### Icons
- All icons from Tabler Icons library
- Folders: 📁 icon
- Workflows: 📄 icon  
- Simulations: ⊞ grid icon

## 🧪 Testing Scenarios

### Test 1: Organization Flexibility
Can you create the exact folder structure your teams need?
- Try different hierarchies
- Test deep nesting (5+ levels)
- Mix folders, workflows, and simulations

### Test 2: Navigation Ease
Is it easy to find your way around?
- Navigate deep into folders
- Use breadcrumbs to go back
- Try the search function

### Test 3: Workflow Simplification
Does removing "Ready" state make sense?
- Consider your current process
- Is Draft → Production sufficient?
- What about intermediate states?

### Test 4: Content Creation
Is creating items intuitive?
- Try creating all three types
- Create items in different folders
- Create items in different stages

## 💡 Pro Tips

1. **Keyboard Shortcuts**
   - `Enter` in modals confirms action
   - `Escape` closes modals/menus
   - Click anywhere outside menus to close them

2. **Folder Strategy**
   - Use folders for markets/regions at top level
   - Use folders for projects at second level
   - Keep workflows inside project folders

3. **Naming Convention**
   - Use clear, descriptive names
   - Consider prefixes for easier sorting
   - Keep names concise for better UI

4. **Stage Management**
   - Start everything in Draft
   - Move to Production when ready
   - Use search to find items across stages

## 🐛 Known Limitations (Prototype)

This is a working prototype, so some features are simplified:
- ❌ Can't move items between folders (yet)
- ❌ Can't move items between stages (yet)
- ❌ Can't rename items inline (yet)
- ❌ No drag-and-drop (yet)
- ❌ No user management (uses mock user)
- ❌ No persistence (data resets on refresh)

These would be implemented in the full version!

## 📝 Feedback

While testing, consider:
1. Does nested folders solve your organization problem?
2. Is the two-stage workflow (Draft/Production) sufficient?
3. Are there any missing features you need?
4. Is the navigation intuitive?
5. Does the UI feel like Whatfix?

## 🛠️ Development Commands

```bash
# Start dev server (already running)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📚 Documentation

- `README.md` - Project overview and setup
- `FEATURES.md` - Detailed feature documentation
- `QUICK_START.md` - This file

## 🎉 Have Fun Testing!

The prototype is fully functional and ready for user testing. Explore all features, create complex folder structures, and see if this solution addresses your organization needs.

**Access the prototype at: http://localhost:3000**

