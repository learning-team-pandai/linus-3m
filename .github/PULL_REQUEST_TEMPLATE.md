# Pull Request Template

## PR Title Format
```
[type]: [brief description]

Examples:
- feat: add LessonCard component with bookmark functionality
- fix: correct progress calculation in useProgress hook
- docs: update DESIGN.md with color palette changes
- refactor: simplify Category page layout
- test: add unit tests for Button component
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Formatting, no code change
- `refactor` - Code restructuring
- `test` - Adding/updating tests
- `chore` - Build/config changes

---

## Description

### What Changed
<!-- Provide a clear, concise description of what this PR does -->
<!-- For AI agents: Summarize in 2-3 bullet points -->
- 
- 
- 

### Why This Change
<!-- Explain the motivation behind this change -->
<!-- Reference any related issues or requirements -->

### Related Issues
<!-- Link to any related issues -->
- Fixes #
- Related to #

---

## Changes Made

### Files Modified
<!-- List all files changed in this PR -->
<!-- Format: filepath | brief description of change -->
```
src/components/Button.jsx        | Add loading state and icon support
src/hooks/useProgress.js         | Fix localStorage sync issue
src/pages/Category.jsx           | Add search and filter functionality
```

### New Files
<!-- List any new files added -->
```
src/components/LessonCard.jsx    | Card component for lesson display
src/utils/helpers.js             | Utility functions for data formatting
```

### Deleted Files
<!-- List any files removed -->
```
src/components/OldComponent.jsx  | Replaced by new implementation
```

---

## Component Checklist

### For UI Components
- [ ] Component renders without errors
- [ ] Props are properly typed (JSDoc comments)
- [ ] All variants work as expected
- [ ] Responsive design tested
- [ ] No console warnings
- [ ] Uses Tabler icons (no emoji)
- [ ] Follows flat design principles

### For Hooks
- [ ] Hook works in component
- [ ] LocalStorage sync works
- [ ] No memory leaks
- [ ] Proper error handling
- [ ] Returns documented values

### For Pages
- [ ] Route accessible
- [ ] Navigation works
- [ ] Mobile responsive
- [ ] Loading states handled
- [ ] Error states handled

---

## Testing

### Manual Testing
<!-- Describe what was tested manually -->
- [ ] Tested on desktop (landscape)
- [ ] Tested on tablet
- [ ] Tested component interactions
- [ ] Tested responsive breakpoints

### Automated Testing
<!-- Check what automated tests were added/updated -->
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] All tests pass (`npm test`)

### Test Coverage
<!-- For AI agents: Report test coverage if available -->
```
Coverage: XX%
- Statements: XX%
- Branches: XX%
- Functions: XX%
- Lines: XX%
```

---

## AI Agent Review Checklist

### For Codex (Development Agent)
Before submitting PR:
- [ ] Code follows project structure
- [ ] Uses existing components where possible
- [ ] No hardcoded values (use constants/config)
- [ ] Proper error boundaries
- [ ] Loading states implemented
- [ ] Accessibility attributes added

### For Aime (Review Agent)
Before approving:
- [ ] Code quality meets standards
- [ ] No redundant code
- [ ] Performance optimized
- [ ] Security best practices followed
- [ ] Documentation updated

### For Akmal (Human Reviewer)
Final approval:
- [ ] UI matches design specs
- [ ] Functionality works as expected
- [ ] No regressions introduced
- [ ] Ready for merge

---

## Screenshots / Videos

### Before (if applicable)
<!-- Add before screenshot -->

### After
<!-- Add after screenshot -->

### Demo Video/GIF
<!-- Optional: Add short demo -->

---

## Performance Impact

### Bundle Size
<!-- Report any bundle size changes -->
```
Previous: XX KB
Current:  XX KB
Change:   +XX KB (-XX KB if reduced)
```

### Performance Metrics
<!-- Report any performance improvements/regressions -->
- [ ] No significant render delays
- [ ] Images optimized
- [ ] Lazy loading implemented (if applicable)

---

## Documentation

### Code Documentation
- [ ] JSDoc comments added
- [ ] Complex logic explained
- [ ] README updated (if needed)

### User Documentation
- [ ] UI text is clear and concise
- [ ] Tooltips added (if needed)
- [ ] Help text updated

---

## Deployment Notes

### Database Changes
<!-- N/A for this project (client-side only) -->

### Environment Variables
<!-- N/A for this project -->

### Migration Steps
<!-- N/A for this project -->

---

## Reviewer Notes

### For Human Reviewers
<!-- Add any specific areas to focus on -->
- Please check: 
- Pay attention to:
- Questions:

### For AI Reviewers
<!-- Special instructions for AI agents -->
- Check for: Common React anti-patterns
- Verify: Prop types match usage
- Ensure: No infinite loops in effects
- Confirm: LocalStorage keys are unique

---

## Merge Checklist

### Pre-Merge (AI Agent)
- [ ] All checklist items completed
- [ ] No merge conflicts
- [ ] Branch is up to date with `aime`
- [ ] Commit messages are descriptive

### Pre-Merge (Human)
- [ ] PR approved by reviewer
- [ ] All conversations resolved
- [ ] CI checks pass (if configured)
- [ ] Squash commits (if needed)

### Post-Merge
- [ ] Delete branch after merge
- [ ] Update project board
- [ ] Notify team (if applicable)

---

## Agentic Model Guidelines

### For AI Agents Creating PRs

1. **Title Format**: Always use `[type]: [description]` format
2. **Description**: Be concise but complete
3. **Checklists**: Fill out all relevant sections
4. **Testing**: Report what was tested, not just checkboxes
5. **Files**: List every file changed with brief description
6. **Questions**: Flag any uncertainties for human review

### For AI Agents Reviewing PRs

1. **Code Quality**: Check for best practices
2. **Consistency**: Ensure it matches existing patterns
3. **Completeness**: Verify all checklist items
4. **Documentation**: Confirm docs are updated
5. **Edge Cases**: Consider error handling
6. **Feedback**: Provide specific, actionable comments

### Communication Format

When AI agents communicate in PRs:

```markdown
## AI Agent Review: [Agent Name]

### Summary
Brief summary of findings

### Issues Found
- [ ] Issue 1: Description and suggested fix
- [ ] Issue 2: Description and suggested fix

### Recommendations
- Suggestion 1
- Suggestion 2

### Approval Status
- [ ] Approved
- [ ] Changes Requested
- [ ] Comment Only
```

---

## Example PR

### Good PR Example

**Title:**
```
feat: add LessonCard component with bookmark and progress
```

**Description:**
```markdown
### What Changed
- Created new LessonCard component for displaying lessons
- Added bookmark toggle functionality
- Integrated progress indicator
- Supports grid and list view modes

### Why This Change
Needed a reusable card component for the category view that displays lesson information and allows quick actions.

### Related Issues
- Related to #5 (Category view implementation)
```

**Changes:**
```
src/components/LessonCard.jsx    | New component
src/components/Icon.jsx          | Added bookmark icon
src/hooks/useBookmarks.js        | Added bookmark hook
src/styles/components.css        | Added card styles
```

---

## Quick Reference

### Common Patterns

**Component Structure:**
```jsx
// Component.jsx
import { IconComponent } from '@tabler/icons-react';

/**
 * Component description
 * @param {Object} props
 * @param {string} props.title - Component title
 */
export const Component = ({ title, ...props }) => {
  // Component logic
  
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
};
```

**Hook Structure:**
```javascript
// useHook.js
/**
 * Hook description
 * @returns {Object} Hook return values
 */
export const useHook = () => {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  return { state, setter };
};
```

---

*This template ensures consistency and quality across all PRs in the Linus 3M project.*
