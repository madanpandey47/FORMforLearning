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
