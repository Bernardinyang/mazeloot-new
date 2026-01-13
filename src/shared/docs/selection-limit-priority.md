# Selection Limit Priority

## Overview

When both a **Set Limit** and a **Selection Limit** exist, the system uses a priority system to determine which limit applies.

## Priority Order

1. **Set Limit** (Highest Priority) - Most specific, applies only to the current set
2. **Selection Limit** (Lower Priority) - General limit, applies to all sets in the selection
3. **Unlimited** (No Limit) - When both are null/undefined

## Examples

### Example 1: Set Limit Overrides Selection Limit

- **Set Limit**: 5
- **Selection Limit**: 10
- **Effective Limit**: **5** ✅ (Set limit wins)

**Use Case**: You want most sets to allow 10 selections, but one specific set (e.g., "Favorites") only allows 5.

### Example 2: Selection Limit Used When Set Has No Limit

- **Set Limit**: null (no limit set)
- **Selection Limit**: 10
- **Effective Limit**: **10** ✅ (Selection limit used)

**Use Case**: You set a general limit of 10 for the entire selection, and most sets inherit this limit.

### Example 3: Unlimited When Both Are Null

- **Set Limit**: null
- **Selection Limit**: null
- **Effective Limit**: **null** (unlimited) ✅

**Use Case**: No restrictions on selections.

### Example 4: Set Limit Used Even When Selection Has No Limit

- **Set Limit**: 5
- **Selection Limit**: null
- **Effective Limit**: **5** ✅ (Set limit used)

**Use Case**: Most sets are unlimited, but one specific set has a limit of 5.

## Implementation

### Frontend

```javascript
import { useSelectionLimits } from '@/composables/useSelectionLimits'

const { getEffectiveLimit } = useSelectionLimits(selection, currentSet)

// getEffectiveLimit.value will return the effective limit following priority
```

### Backend

```php
$selectionLimitService = app(\App\Domains\Memora\Services\SelectionLimitService::class);
$limit = $selectionLimitService->getSelectionLimit($selectionId, $setId);
// Returns the effective limit following priority
```

## Why This Priority?

1. **Set limits are more specific** - They apply to individual sets, allowing fine-grained control
2. **Selection limits are general** - They provide a default for all sets
3. **Set limits override** - When a set needs different rules, it can override the general limit

This design allows:

- Setting a general limit for the entire selection
- Overriding specific sets with different limits
- Having some sets unlimited while others have limits
