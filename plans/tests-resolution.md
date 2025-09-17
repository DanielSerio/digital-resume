# Test Resolution Plan

## Current Issue: "UI State Management > should disable other section edit buttons" Test Failure

### Problem Diagnosis

The test `should disable other section edit buttons during summary editing` is failing because of an **architecture mismatch** between different resume sections.

### Root Cause Analysis

**Expected Behavior**: The test expects all sections to have edit buttons that can be disabled when other sections are being edited.

**Actual Implementation**:
- **Contact & Summary sections**: Have dedicated "Edit" buttons with `data-testid="edit-button"` that toggle edit mode
- **Skills section**: Has multiple individual buttons ("Add Skill" button + individual skill edit buttons) that should all be disabled when other sections are editing - no section-level "Edit" button
- **Education & Work Experience sections**: Always editable (per test comments)

**Specific Technical Issue**:
- Test selector: `mainPage.skillsEditButton = this.skillsSection.getByTestId('edit-button')`
- Skills section DOM: No element with `data-testid="edit-button"` exists (Skills section doesn't have a section-level edit button)
- Result: **Selector not found error**

### Edit State Management Analysis

The edit state system is working correctly:
- `useEditState()` hook provides `canEdit` property that returns `false` when other sections are editing
- Contact and Summary sections properly use `disabled={!canEdit}` on their edit buttons ✅
- Skills section "Add Skill" button uses `disabled={!canEdit}` ✅
- Skills section individual edit buttons should also use `disabled={!canEdit}` ✅

### Possible Solutions

#### Option 1: Fix the Test (Architecture-Aware)
- Update test to recognize that Skills section has no section-level edit button
- Test should verify that individual Skills buttons ("Add Skill" + skill edit buttons) are disabled when other sections are editing
- Update `MainPage.ts` page object to point to a representative Skills button (e.g., "Add Skill")

#### Option 2: Test Multiple Skills Buttons
- Update test to check all Skills section buttons individually
- Verify "Add Skill" button is disabled
- Verify individual skill edit buttons are disabled when other sections are editing
- More comprehensive but requires more test logic

#### Option 3: Representative Button Approach
- Point `skillsEditButton` to the "Add Skill" button as representative of Skills section edit state
- Leverages existing disabled behavior on "Add Skill" button
- Maintains test coverage while accommodating current architecture
- Simpler than checking all individual buttons

### Recommendation

**Option 3** (Representative Button Approach) is most practical because:
- Skills section's "Add Skill" button already implements the desired disabled behavior
- No component changes required
- Test continues to verify mutual exclusion functionality
- Acknowledges that Skills section doesn't have a section-level edit button
- "Add Skill" button represents the edit state for the entire Skills section

### Implementation Plan

1. **Add explicit roles to UI components** (for reliable role-based selectors):
   ```typescript
   // In SkillsDisplay.tsx, update individual skill deletion button:
   <button
     role="button"  // Add explicit role
     onClick={() => handleMarkForDeletion(skill.id)}
     className={`ml-2 transition-colors ${
       isMarkedForDeletion
         ? "text-red-600 hover:text-red-800"
         : "hover:text-red-600"
     }`}
   >
     <X className="h-3 w-3" />
   </button>
   ```

2. **Update `MainPage.ts` page object**:
   ```typescript
   // Change from:
   this.skillsEditButton = this.skillsSection.getByTestId('edit-button');
   // To:
   this.skillsEditButton = this.skillsSection.getByRole('button', { name: /Add Skill/i });
   ```

3. **Verify test passes** with this change
4. **Document** that Skills section uses "Add Skill" button as representative of section edit state
5. **Verify implementation** that individual skill edit buttons also respect `canEdit` state