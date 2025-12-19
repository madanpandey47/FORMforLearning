# Form Page Refactoring - Module Structure

## Overview

The form page has been refactored from a monolithic 1416-line file into a modular, maintainable structure following best practices.

## Directory Structure

```
src/app/form/
├── page.tsx                  # Main form component (refactored)
├── page-original-backup.tsx  # Backup of original implementation
├── layout.tsx               # Form layout
├── components/
│   ├── index.ts            # Barrel exports
│   ├── ImageUploadField.tsx # Reusable image upload component
│   ├── FormProgress.tsx      # Progress indicator component
│   ├── FormNavigation.tsx    # Navigation buttons component
│   └── steps/
│       ├── index.ts         # Barrel exports for all steps
│       ├── PersonalDetailsStep.tsx    # Step 1
│       ├── ContactInfoStep.tsx        # Step 2
│       ├── AddressStep.tsx            # Step 3
│       └── DocumentsStep.tsx          # Step 9 (Combined documents)
│
├── hooks/
│   ├── index.ts                    # Barrel exports
│   ├── useLookups.ts               # Manages dropdown options/lookups
│   ├── useFormSubmit.ts            # Handles form submission logic
│   ├── useFormNavigation.ts        # Manages step navigation
│   ├── useImagePreviews.ts         # Manages image preview states
│   └── useLoadStudentData.ts       # Loads student data in edit mode
│
├── constants/
│   ├── index.ts            # Barrel exports
│   └── formSteps.ts        # Form step definitions and constants
│
└── utils/
    └── (To be added for utility functions)
```

## Key Components

### 1. **Form Steps** (`components/steps/`)

Each form step is now a separate, reusable component:

- `PersonalDetailsStep` - Step 1: Personal info, blood type, citizenship
- `ContactInfoStep` - Step 2: Email and phone details
- `AddressStep` - Step 3: Permanent & temporary addresses
- `DocumentsStep` - Step 9: File uploads and confirmation

**Benefits:**

- Easy to test individual steps
- Can be reused or refactored independently
- Cleaner component hierarchy

### 2. **Custom Hooks** (`hooks/`)

#### `useLookups()`

- Loads and manages all dropdown options (blood types, genders, provinces, etc.)
- Handles municipality loading based on selected province
- Prevents redundant API calls

```typescript
const { bloodTypeOptions, provinceOptions, lookupsLoaded, ... } = useLookups(permanentProvince, temporaryProvince);
```

#### `useFormSubmit()`

- Encapsulates form submission logic
- Handles both create and update operations
- Manages error handling and user feedback

```typescript
const { onSubmit, onError } = useFormSubmit(isEditMode, studentId, router);
```

#### `useFormNavigation()`

- Manages step validation and navigation
- Handles next, back, save, and cancel operations
- Triggers field validation per step

```typescript
const { handleNext, handleBack, handleCancel, handleSave } = useFormNavigation(...);
```

#### `useImagePreviews()`

- Manages state for all 4 image previews
- Provides setters for URL management
- Centralized image state management

```typescript
const { profileImagePreviewUrl, setProfileImagePreviewUrl, ... } = useImagePreviews();
```

#### `useLoadStudentData()`

- Loads student data when in edit mode
- Populates form with existing data
- Loads image previews
- Sets up municipalities for addresses

```typescript
useLoadStudentData(isEditMode, studentId, lookupsLoaded, ...);
```

### 3. **Reusable Components** (`components/`)

#### `ImageUploadField`

- Reusable component for image uploads with preview
- Handles profile and document images
- Supports remove functionality
- Used by DocumentsStep

#### `FormProgress`

- Displays current step number and name
- Shows progress bar with visual feedback
- Responsive and animated

#### `FormNavigation`

- Navigation buttons for form flow
- Conditional rendering based on mode (create/edit)
- Responsive layout

### 4. **Constants** (`constants/`)

#### `formSteps.ts`

- Defines all form steps with their fields
- Country options configuration
- Easy to add new steps or modify existing ones

```typescript
export const FORM_STEPS: FormStep[] = [
  { name: "Personal Details", fields: [...] },
  // ...
];
```

## Refactoring Benefits

### 1. **Maintainability**

- ✅ Reduced page component from 1416 lines to ~655 lines
- ✅ Each section has a single responsibility
- ✅ Easier to find and modify specific functionality

### 2. **Reusability**

- ✅ Components and hooks can be used in other pages
- ✅ ImageUploadField is standalone and reusable
- ✅ Form steps can be composed differently if needed

### 3. **Testability**

- ✅ Hooks can be tested independently
- ✅ Components can be unit tested
- ✅ Logic is separated from UI

### 4. **Scalability**

- ✅ Easy to add new form steps
- ✅ Simple to add new hooks for specific functionality
- ✅ Clear structure for future developers

### 5. **Performance**

- ✅ Hooks prevent unnecessary re-renders
- ✅ Lookups loaded once and cached
- ✅ Modular components reduce bundle size

## Usage Examples

### Using in Page

```typescript
// Import hooks
const { bloodTypeOptions, lookupsLoaded } = useLookups(province);
const { onSubmit, onError } = useFormSubmit(isEditMode, studentId, router);

// Use components
<PersonalDetailsStep register={register} errors={errors} ... />
<FormProgress currentStep={currentStep} ... />
<FormNavigation onNext={handleNext} ... />
```

### Creating a New Step

```typescript
// 1. Create component in components/steps/
// 2. Export in components/steps/index.ts
// 3. Import in page.tsx
// 4. Add to renderStep() switch statement
```

### Adding New Lookup

```typescript
// 1. Add API call in useLookups.ts
// 2. Create state variable
// 3. Load in useEffect
// 4. Return from hook
// 5. Use in component
```

## File Size Comparison

| File        | Before     | After                             |
| ----------- | ---------- | --------------------------------- |
| page.tsx    | 1416 lines | 655 lines                         |
| hooks/      | -          | ~350 lines (split across 5 files) |
| components/ | -          | ~400 lines (split across 7 files) |
| constants/  | -          | ~30 lines                         |

Total: **1416 lines → 1435 lines** (includes modular structure overhead of ~19 lines)

**Main benefit**: Code is now properly organized and maintainable rather than having tight coupling.

## Migration Notes

- Original page backed up as `page-original-backup.tsx`
- All functionality preserved
- No API changes or breaking changes
- File structure follows React best practices

## Future Improvements

1. Extract remaining steps (4-8) to separate components
2. Create reusable FieldArray component for dynamic fields
3. Add form state persistence
4. Create form validation utils
5. Add form analytics/tracking
6. Extract business logic to custom hooks

## Related Files

- `Frontend/src/lib/validation/formvalidation.ts` - Form validation schema
- `Frontend/src/lib/api/student-api.ts` - API integration
- `Frontend/src/hooks/useSyncTemporaryAddress.ts` - Address sync logic
