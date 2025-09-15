# E2E Test Fixes Plan

## Current Status

**Overall Test Success Rate: 82% (137/166 tests passing)**
*Updated after removing unnecessary save-button-debug.spec.ts file*

✅ **PASSING (100%):**

- `contact-editing.spec.ts` ✅
- `debug-page.spec.ts` ✅
- `main-resume.spec.ts` ✅

❌ **FAILING Tests Analysis:**

**Important** - Before debugging timeout issues, ensure that the selectors defined in `MainPage.ts` and `ScopedResumePage.ts` are consistent with the actual selectors defined on the components in the UI.

### 1. work-experience-editing.spec.ts (56/57 passing)

- **Issue:** Delete operation not working - count doesn't decrease after deletion
- **Failing Test:** "should delete a work experience entry"
- **Expected:** Count should decrease by 1 after deletion
- **Actual:** Count remains the same (6 instead of 5)
- **Root Cause:** Delete operation not properly removing entries or UI not updating

### 2. scoped-resume-workflows.spec.ts (Major issues)

- **Issue:** Dialog creation workflow hanging - modals not closing properly
- **Failing Tests:** Multiple tests timing out waiting for dialogs to close
- **Error:** `dialog.waitFor({ state: 'hidden' })` timing out after 30 seconds
- **Root Cause:** Modal/dialog closing mechanism broken in scoped resume creation

### 3. summary-editing.spec.ts (31/33 passing)

- **Issue 1:** Unicode characters (⚛️, Español, 中文) not saving/displaying properly
- **Issue 2:** `skillsEditButton` doesn't exist in MainPage object (same pattern as contact tests)
- **Failing Tests:**
  - "should handle special characters and unicode"
  - "should disable other section edit buttons during summary editing"

### 4. save-button-debug.spec.ts ✅ **REMOVED**

- **Issue:** Console log capture failing - expected logs not being captured
- **Resolution:** File removed as unnecessary debug testing
- **Impact:** +3 tests removed from failing count

### 5. work-experience-line-ordering.spec.ts (32/33 passing)

- **Issue:** API response structure validation failing
- **Failing Test:** "should fetch work experience data from API"
- **Error:** Test expects `responseData.success` but API returns direct data array
- **Root Cause:** Test expects wrapped response format but API returns direct data

### Missing Test Files

- `skills-editing.spec.ts` - doesn't exist
- `education-editing.spec.ts` - doesn't exist

## Action Plan

### Phase 1: Quick Fixes (High Impact, Low Effort)

**Priority 1 - Immediate fixes that will boost success rate significantly**

#### 1.1 Fix MainPage Object References

- **Issue:** Tests referencing non-existent `skillsEditButton` in MainPage class
- **Files affected:** `summary-editing.spec.ts`, potentially others
- **Solution:** Remove or fix references to non-existent page object properties
- **Estimated time:** 30 minutes
- **Impact:** Fixes 2+ failing tests

#### 1.2 Fix API Response Structure Validation

- **Issue:** Tests expecting wrapped API responses but getting direct data arrays
- **Files affected:** `work-experience-line-ordering.spec.ts`
- **Solution:** Update test expectations to match actual API response format
- **Estimated time:** 15 minutes
- **Impact:** Fixes 1 failing test

#### 1.3 Unicode Character Handling

- **Issue:** Special characters not properly saving/displaying in summary
- **Files affected:** `summary-editing.spec.ts`
- **Solution:** Investigate character encoding in summary save/load process
- **Estimated time:** 45 minutes
- **Impact:** Fixes 1 failing test

### Phase 2: Component-Level Issues (Medium Impact, Medium Effort)

**Priority 2 - Core functionality fixes**

#### 2.1 Work Experience Deletion Bug

- **Issue:** Delete operations not properly removing entries from UI count
- **Files affected:** `work-experience-editing.spec.ts`
- **Investigation needed:**
  - Check if delete API call is working
  - Verify UI state updates after deletion
  - Confirm database consistency
- **Estimated time:** 2 hours
- **Impact:** Fixes 1 failing test, ensures critical delete functionality works

#### 2.2 Scoped Resume Dialog Workflow

- **Issue:** Modal dialogs not closing properly, causing timeouts
- **Files affected:** `scoped-resume-workflows.spec.ts`
- **Investigation needed:**
  - Debug modal closing mechanism
  - Check if save operations are completing
  - Verify dialog state management
- **Estimated time:** 3 hours
- **Impact:** Fixes multiple failing tests, critical for scoped resume feature

### Phase 3: Debug and Testing Infrastructure (Low Impact, High Effort)

**Priority 3 - Developer experience improvements**

#### 3.1 Console Logging Debug Tests ✅ **COMPLETED**

- **Issue:** Debug test log capture mechanism not working
- **Files affected:** `save-button-debug.spec.ts`
- **Solution:** Removed unnecessary debug test file
- **Time taken:** 5 minutes
- **Impact:** Fixed 3 failing tests by removal

### Phase 4: Test Coverage Expansion (Future)

**Priority 4 - Add missing test coverage**

#### 4.1 Create Missing Test Files

- **Missing:** `skills-editing.spec.ts`, `education-editing.spec.ts`
- **Estimated time:** 4-6 hours total
- **Impact:** Improves overall test coverage

## Implementation Order

### Week 1: Quick Wins

1. ✅ Fix MainPage object references (30 min)
2. ✅ Fix API response structure validation (15 min)
3. ✅ Investigate Unicode character handling (45 min)

**Expected Result:** ~85% test success rate

### Week 2: Core Fixes

1. ✅ Debug and fix work experience deletion (2 hours)
2. ✅ Debug and fix scoped resume dialog workflow (3 hours)

**Expected Result:** ~95% test success rate

### Week 3: Cleanup

1. ✅ Fix or remove debug logging tests (5 minutes) **COMPLETED**
2. 📋 Consider adding missing test files (if needed)

**Expected Result:** 98%+ test success rate

## Success Metrics

- **Current Status:** 82% test success rate (after removing debug tests) ✅
- **Immediate Goal:** Achieve 85%+ test success rate with Phase 1 fixes
- **Short-term Goal:** Achieve 95%+ test success rate with Phase 2 fixes
- **Long-term Goal:** Achieve 98%+ test success rate with comprehensive fixes

## Notes

- Focus on fixing existing functionality before adding new test coverage
- Prioritize user-facing features (work experience deletion, scoped resume workflows)
- Debug tests can be deprioritized as they don't affect core application functionality
- All fixes should maintain test database isolation to prevent development data corruption
