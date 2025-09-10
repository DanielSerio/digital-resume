import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { UseFormReturn } from "react-hook-form";
import type { ProfessionalSummaryFormData } from "@/lib/validation";

interface SummaryFormProps {
  isEditing: boolean;
  form: UseFormReturn<ProfessionalSummaryFormData>;
}

export function SummaryForm({ isEditing, form }: SummaryFormProps) {
  if (!isEditing) return null;

  return (
    <div>
      <Label htmlFor="summaryText">Summary *</Label>
      <Textarea
        id="summaryText"
        {...form.register('summaryText')}
        placeholder="Write a compelling professional summary that highlights your experience, skills, and career goals..."
        className={cn(
          "min-h-[120px] resize-y",
          form.formState.errors.summaryText && "border-red-500"
        )}
      />
      {form.formState.errors.summaryText && (
        <p className="text-sm text-red-600 mt-1">
          {form.formState.errors.summaryText.message}
        </p>
      )}
      <p className="text-xs text-muted-foreground mt-1">
        Character count: {form.watch('summaryText')?.length || 0}/2000
      </p>
    </div>
  );
}