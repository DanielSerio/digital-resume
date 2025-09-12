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
    <div role="group" aria-labelledby="summary-form-heading">
      <Label htmlFor="summaryText" id="summary-form-heading">Summary *</Label>
      <Textarea
        id="summaryText"
        {...form.register('summaryText')}
        placeholder="Write a compelling professional summary that highlights your experience, skills, and career goals..."
        className={cn(
          "min-h-[120px] resize-y",
          form.formState.errors.summaryText && "border-red-500"
        )}
        role="textbox"
        aria-required="true"
        aria-invalid={!!form.formState.errors.summaryText}
        aria-describedby={`${form.formState.errors.summaryText ? 'summaryText-error' : ''} summaryText-count`.trim()}
        maxLength={2000}
      />
      {form.formState.errors.summaryText && (
        <p className="text-sm text-red-600 mt-1" id="summaryText-error" role="alert">
          {form.formState.errors.summaryText.message}
        </p>
      )}
      <p className="text-xs text-muted-foreground mt-1" id="summaryText-count" aria-live="polite">
        Character count: {form.watch('summaryText')?.length || 0}/2000
      </p>
    </div>
  );
}