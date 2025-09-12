import { Button } from "@/components/ui/button";
import type { ProfessionalSummary } from "@/types";

interface SummaryContentProps {
  summary: ProfessionalSummary | undefined;
  isEditing: boolean;
  onEdit: () => void;
}

export function SummaryContent({
  summary,
  isEditing,
  onEdit,
}: SummaryContentProps) {
  if (isEditing) return null;

  if (summary?.summaryText) {
    return (
      <div className="prose prose-sm max-w-none">
        <p className="text-foreground leading-relaxed whitespace-pre-wrap max-w-[70ch] mx-auto mb-16">
          {summary.summaryText}
        </p>
      </div>
    );
  }

  return (
    <div className="text-center text-muted-foreground py-8">
      <p>No professional summary available</p>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onEdit} 
        className="mt-2"
        aria-label="Add professional summary"
        role="button"
      >
        Add Professional Summary
      </Button>
    </div>
  );
}
