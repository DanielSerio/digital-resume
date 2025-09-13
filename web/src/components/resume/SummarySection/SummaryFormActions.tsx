import { Button } from "@/components/ui/button";

interface SummaryFormActionsProps {
  isEditing: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  onCancel: () => void;
}

export function SummaryFormActions({ 
  isEditing, 
  isSubmitting, 
  isDirty, 
  onCancel 
}: SummaryFormActionsProps) {
  if (!isEditing) return null;

  return (
    <div className="flex justify-end gap-2 pt-4 border-t" role="group" aria-label="Form actions">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
        aria-label="Cancel editing professional summary"
        role="button"
        data-testid="cancel-button"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={!isDirty || isSubmitting}
        aria-label={isSubmitting ? 'Saving professional summary' : 'Save professional summary'}
        role="button"
        data-testid="save-button"
      >
        {isSubmitting ? 'Saving...' : 'Save'}
      </Button>
    </div>
  );
}