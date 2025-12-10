# Product Navigation Guide

This guide explains how to configure and use dynamic product-specific navigation in the Mazeloot application.

## Overview

Each product (Memora, Collections, Overview, etc.) can have its own unique navigation menu. The navigation automatically changes based on the current route/product context.

## How It Works

1. **Route Detection**: The system detects which product you're using based on the current route path
2. **Navigation Loading**: The appropriate navigation configuration is loaded for that product
3. **Dynamic Updates**: Navigation automatically updates when you navigate between products

## Product Detection

The system detects products from route paths:

- `/dashboard/memora` or `/memora/*` → **Memora** product
- `/overview` or `/dashboard` → **Overview** product
- `/collections/*` → **Collections** product
- Any other route → **Default** navigation

## Adding a New Product Navigation

### Step 1: Create Navigation Configuration

Edit `src/constants/productNavigation.ts` and add your product navigation:

```typescript
import { YourIcon } from "lucide-vue-next";
import type { NavItem } from "@/types/navigation";

export const YOUR_PRODUCT_NAVIGATION: NavItem[] = [
  {
    title: "Dashboard",
    url: "/your-product",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      {
        title: "Overview",
        url: "/your-product",
      },
      {
        title: "Settings",
        url: "/your-product/settings",
      },
    ],
  },
  {
    title: "Features",
    url: "/your-product/features",
    icon: YourIcon,
    items: [
      {
        title: "Feature 1",
        url: "/your-product/features/1",
      },
      {
        title: "Feature 2",
        url: "/your-product/features/2",
      },
    ],
  },
];
```

### Step 2: Add to Product Navigation Map

Add your product to the `PRODUCT_NAVIGATION` map:

```typescript
export const PRODUCT_NAVIGATION: Record<string, NavItem[]> = {
  memora: MEMORA_NAVIGATION,
  overview: OVERVIEW_NAVIGATION,
  collections: COLLECTIONS_NAVIGATION,
  yourProduct: YOUR_PRODUCT_NAVIGATION, // Add here
  default: DEFAULT_NAVIGATION,
};
```

### Step 3: Update Product Detection

Edit `src/composables/useProductNavigation.ts` and add detection logic:

```typescript
export function getProductFromRoute(path: string): ProductId {
  if (path.startsWith("/dashboard/memora") || path.startsWith("/memora")) {
    return "memora";
  }
  if (path.startsWith("/your-product")) {
    // Add this
    return "yourProduct";
  }
  // ... other products
  return "default";
}
```

Also update the `ProductId` type:

```typescript
export type ProductId =
  | "memora"
  | "overview"
  | "collections"
  | "yourProduct"
  | "default";
```

## Navigation Item Structure

Each navigation item follows this structure:

```typescript
interface NavItem {
  title: string; // Display name
  url: string; // Main URL for the section
  icon?: LucideIcon; // Icon component (from lucide-vue-next)
  isActive?: boolean; // Should this section be expanded by default?
  items?: NavSubItem[]; // Sub-navigation items
}

interface NavSubItem {
  title: string; // Display name
  url: string; // Route URL
}
```

## Using Navigation in Components

### In AppSidebar (Automatic)

The `AppSidebar` component automatically uses dynamic navigation:

```vue
<template>
  <Sidebar>
    <SidebarContent>
      <NavMain :items="navigationItems" />
    </SidebarContent>
  </Sidebar>
</template>

<script setup lang="ts">
import { useProductNavigation } from "@/composables/useProductNavigation";

const { navigationItems } = useProductNavigation();
</script>
```

### Manual Usage

You can also use the composable manually in any component:

```vue
<script setup lang="ts">
import { useProductNavigation } from "@/composables/useProductNavigation";

const {
  currentProduct, // Current product ID
  navigationItems, // Current navigation items
  getNavigationForProduct, // Get nav for specific product
} = useProductNavigation();

// Get navigation for a specific product
const memoraNav = getNavigationForProduct("memora");
</script>
```

## Available Icons

Use icons from `lucide-vue-next`. Common icons include:

- `LayoutDashboard` - Dashboard/Overview
- `Images` - Gallery/Photos
- `Upload` - Upload actions
- `Users` - Users/Clients
- `Settings` - Settings
- `FolderOpen` - Collections/Folders
- `Camera` - Camera/Photos
- `Album` - Albums
- `Share2` - Sharing
- `Download` - Downloads
- `Star` - Favorites
- `Grid3x3` - Grid/Products
- `FileImage` - Files/Images
- `UserPlus` - Add User
- `CreditCard` - Billing
- `BarChart3` - Analytics

See [Lucide Icons](https://lucide.dev/icons/) for the full list.

## Examples

### Memora Navigation

Memora (Photo Gallery) has navigation for:

- Dashboard with analytics
- Gallery with filters
- Collections management
- Upload functionality
- Client management
- Settings

### Overview Navigation

Overview (Main App) has navigation for:

- Product overview
- Product listing
- Account management

### Collections Navigation

Collections product has navigation for:

- Dashboard
- Collection management
- Creation tools
- Settings

## Best Practices

1. **Keep it organized**: Group related items under parent sections
2. **Use clear titles**: Navigation items should be self-explanatory
3. **Consistent icons**: Use similar icons for similar functions across products
4. **Logical URLs**: Follow a consistent URL pattern for each product
5. **Active states**: Set `isActive: true` for the main dashboard/overview item

## Troubleshooting

### Navigation not updating

- Check that your route path matches the detection logic in `getProductFromRoute`
- Verify your product is added to `PRODUCT_NAVIGATION` map
- Ensure the product ID matches in both the type and the map

### Wrong navigation showing

- Verify the route path detection logic
- Check that the product ID in `PRODUCT_NAVIGATION` matches the return value from `getProductFromRoute`

### Icons not showing

- Ensure icons are imported from `lucide-vue-next`
- Check that the icon component is passed correctly (not as a string)
