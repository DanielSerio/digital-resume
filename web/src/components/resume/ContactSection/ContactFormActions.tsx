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
    <div className="flex justify-end gap-2 pt-4 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={!isDirty || isSubmitting}>
        {isSubmitting ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}