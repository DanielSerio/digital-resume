# Test Resolution Plan

## ✅ RESOLVED: "UI State Management > should disable other section edit buttons" Test Failure

**Resolution**: Updated page object to use "Add Skill" button as representative Skills section edit button and added explicit `role="button"` attributes.

---

## Current Issue: "Work Experience CRUD Operations > should delete a work experience entry" Test Failure

### Problem Diagnosis

The test `should delete a work experience entry` is failing during the work experience deletion workflow.

### Root Cause Analysis

**Expected Behavior**: The test should be able to delete a work experience entry and verify that the count decreases.

**Test Flow**:
1. Get initial count of work experience entries
2. Click edit button on first work experience entry
3. Click delete button in the form
4. Verify the count decreases by 1

**Potential Issues to Investigate**:

#### 1. **API/Backend Issues**
- Delete endpoint may not be working correctly
- Database transaction may be failing
- Cache invalidation may not be working properly

#### 2. **React Query Cache Issues**
- `queryClient.invalidateQueries()` may not be refreshing the UI after deletion
- Optimistic updates may be interfering with the deletion flow
- Stale data may be persisting in the cache

#### 3. **Edit State Management**
- `deleteItem()` call in `handleDelete()` may not be updating the local state correctly
- Edit mode may not be exiting properly after deletion
- Item edit hook may have state synchronization issues

#### 4. **Component Re-rendering**
- WorkExperienceDisplay may not be re-rendering after data changes
- Count selector `.border` may not be accurate for counting entries
- DOM updates may be delayed or not occurring

#### 5. **Test Timing Issues**
- Test may not be waiting for API response and UI updates
- Race condition between deletion and count verification
- Network request may be timing out

### Diagnostic Steps

1. **Check API Endpoint**
   - Verify the DELETE `/work-experiences/:id` endpoint is working in backend
   - Test deletion manually via API client or browser dev tools
   - Check server logs for deletion errors

2. **Test React Query Cache**
   - Add temporary logging in `useDeleteWorkExperience` hook
   - Verify `onSuccess` callback is executing
   - Check if `invalidateQueries` is actually refreshing data

3. **Inspect Edit State Hook**
   - Add logging in `useItemEdit` hook's `deleteItem()` method
   - Verify local state is being cleared after deletion
   - Check if `editingExperienceId` is reset properly

4. **Test Timing**
   - Add explicit waits in test after delete button click
   - Use `page.waitForResponse()` to wait for API call completion
   - Add `page.waitForTimeout()` to allow UI updates

### Recommended Investigation Plan

#### Step 1: Add Test Timing Fixes (Most Likely Issue)
```typescript
// In work-experience-editing.spec.ts
test('should delete a work experience entry', async () => {
  const initialEntries = await mainPage.workExperienceList.locator('.border').count();

  await mainPage.getWorkExperienceEditButton(0).click();
  await expect(mainPage.getWorkExperienceForm()).toBeVisible();

  // Wait for delete API call to complete
  const responsePromise = page.waitForResponse(response =>
    response.url().includes('/work-experiences/') &&
    response.request().method() === 'DELETE'
  );

  await mainPage.getDeleteButton().click();
  await responsePromise;

  // Wait for UI to update
  await page.waitForTimeout(1000);

  await expect(mainPage.workExperienceList.locator('.border')).toHaveCount(initialEntries - 1);
});
```

#### Step 2: Verify API Endpoint (If Step 1 Fails)
- Test deletion endpoint manually
- Check server logs for errors
- Verify database transaction completion

#### Step 3: Fix Cache Issues (If Step 2 Passes)
- Add temporary logging to `useDeleteWorkExperience`
- Verify cache invalidation is working
- Check for stale data persistence

#### Step 4: Fix Edit State Management (Last Resort)
- Debug `useItemEdit` hook's `deleteItem()` method
- Ensure local state synchronization with API calls