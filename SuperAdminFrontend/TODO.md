# TypeScript Syntax Fix Plan

## Files to Fix:
- [ ] src/components/ui/badge.jsx - Fix import syntax and interface definition
- [ ] src/components/ui/form.jsx - Fix multiple TypeScript syntax issues
- [ ] Check other UI components for similar issues

## Issues to Address:
1. Convert `import *React from "react"` to `import React from "react"`
2. Remove `type` keyword from imports
3. Remove interface definitions
4. Remove type annotations from React.createContext, forwardRef, etc.
5. Remove generic type parameters
6. Fix incomplete code from TypeScript-to-JavaScript conversion

## Progress:
- [x] badge.jsx - Fixed (removed type import and interface)
- [x] form.jsx - Fixed (converted TSX to JSX, removed type annotations)
- [ ] Other files - To be checked
