# Folder Management Guide

This guide explains how to create and manage folders within folders and organize your content.

## Overview

Your application supports a hierarchical folder structure where you can:
- Create folders at any level
- Create folders inside other folders (nested folders)
- Add content (workflows) inside folders
- Navigate through folders using breadcrumbs
- Delete folders (which also deletes all child items)

## How to Create Folders

### Method 1: From the Main Content View

1. Click the **"Create new"** button in the top-right area
2. Select **"Create folder"** from the dropdown menu
3. Enter a name for your folder
4. Click **"Create"**

The folder will be created at the root level (no parent folder).

### Method 2: From Inside a Folder

1. Navigate into any folder by clicking on it
2. Click the **"Create new"** button
3. Select **"Create folder"** from the dropdown
4. Enter a name for your folder
5. Click **"Create"**

The folder will be created inside the current folder you're viewing.

### Method 3: From Empty State

1. If you're in an empty folder, you'll see an empty state message
2. Click the **"Create your first item"** button
3. This will open the create folder modal
4. Enter a name and click **"Create"**

## Creating Folders Within Folders (Nested Folders)

To create a folder inside another folder:

1. **Navigate into a folder**: Click on any folder in the table to open it
2. **Create a new folder**: Use the "Create new" button → "Create folder"
3. **Name your folder**: Enter a descriptive name
4. **Create**: Click the "Create" button

The new folder will be created inside the current folder you're viewing. You can repeat this process to create folders within folders at any depth.

## Adding Content Inside Folders

To add content (workflows) inside a folder:

1. **Navigate into the folder** where you want to add content
2. **Click "Create new"** button
3. **Select "Create content"** from the dropdown
4. **Enter a name** for your content
5. **Click "Create"**

The content will be created inside the current folder.

## Navigating Folders

### Entering a Folder

- **Click on any folder row** in the table to navigate into it
- You'll see the folder's contents displayed

### Using Breadcrumbs

When you're inside a folder, breadcrumbs appear at the top showing your navigation path:
- **Content** → **Folder Name** → **Subfolder Name**

You can click on any breadcrumb to navigate back to that level.

### Going Back

- Click on **"Content"** in the breadcrumbs to return to the root level
- Click on any folder name in the breadcrumbs to navigate to that folder

## Folder Structure Example

Here's an example of a nested folder structure:

```
Content (root)
├── Marketing
│   ├── Campaigns
│   │   ├── Q1 Campaign
│   │   └── Q2 Campaign
│   └── Templates
├── Sales
│   ├── Onboarding
│   └── Training
└── Support
    └── Documentation
```

## Managing Folders

### Deleting Folders

1. Click the **three dots (⋮)** icon in the Actions column
2. Select **"Delete"** from the menu
3. Confirm the deletion

**Important**: Deleting a folder will also delete all items inside it (folders and content). This action cannot be undone.

### Editing Folders

1. Click the **three dots (⋮)** icon in the Actions column
2. Select **"Edit"** from the menu
3. Make your changes
4. Save

## Best Practices

1. **Use descriptive names**: Name your folders clearly so you can easily find content
2. **Organize by purpose**: Group related content together in folders
3. **Keep depth reasonable**: While you can nest folders deeply, 2-3 levels is usually sufficient
4. **Use consistent naming**: Follow a naming convention for easier navigation

## Technical Details

- Folders use a `parentId` field to track hierarchy
- Each item (folder or content) can have one parent folder
- The root level has `parentId: null`
- Breadcrumbs are automatically calculated based on the folder hierarchy
- When you delete a folder, all child items are recursively deleted

## Troubleshooting

### Can't see my folder after creating it?

- Make sure you're viewing the correct stage (Draft or Production)
- Check if you're in the correct parent folder
- Use the search function to find your folder

### Folder appears empty but I added items?

- Verify you created the items while inside that folder
- Check the stage filter (Draft/Production tabs)
- Ensure you're not in a different folder

### Can't navigate into a folder?

- Make sure you're clicking on the folder row, not just the icon
- Check that the folder type is "Folder" in the Type column

