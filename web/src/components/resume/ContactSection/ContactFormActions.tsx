import { Button } from "@/components/ui/button";

interface ContactFormActionsProps {
  isEditing: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  onCancel: () => void;
}

export function ContactFormActions({ 
  isEditing, 
  isSubmitting, 
  isDirty, 
  onCancel 
}: ContactFormActionsProps) {
  if (!isEditing) return null;

  return (
    <div className="flex justify-end gap-2 pt-4 border-t" role="group" aria-label="Form actions">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
        aria-label="Cancel editing contact information"
        role="button"
        data-testid="cancel-button"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={!isDirty || isSubmitting}
        aria-label={isSubmitting ? "Saving contact information" : "Save contact information"}
        role="button"
        data-testid="save-button"
      >
        {isSubmitting ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}