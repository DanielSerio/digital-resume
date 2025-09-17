import React from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ErrorBoundary } from "@/components/common";
import { SummaryForm } from "../SummarySection/SummaryForm";
import { SummaryFormActions } from "../SummarySection/SummaryFormActions";
import { SummaryContent } from "../SummarySection/SummaryContent";

import {
  useProfessionalSummaryData,
  useScopedResumeData,
  useUpdateScopedSummary,
  useRemoveScopedSummary,
} from "@/hooks";
import {
  professionalSummarySchema,
  type ProfessionalSummaryFormData,
} from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useEditState } from "@/hooks/edit/useEditState";

interface ScopedSummarySectionProps {
  scopedResumeId: number;
}

export const ScopedSummarySection: React.FC<ScopedSummarySectionProps> = ({
  scopedResumeId,
}) => {
  // Use the same edit state hook as main UI
  const {
    isEditing,
    canEdit,
    startEdit,
    cancelEdit,
    completeEdit
  } = useEditState('summary');

  // Data fetching - both main and scoped
  const { data: mainSummary, isLoading: mainLoading, error: mainError } = useProfessionalSummaryData();
  const { data: scopedResume, isLoading: scopedLoading } = useScopedResumeData(scopedResumeId);

  // Determine display summary and customization status
  const scopedSummary = scopedResume?.scopedProfessionalSummary || null;
  const displaySummary = scopedSummary || mainSummary;
  const hasCustomizations = !!scopedSummary;


  const isLoading = mainLoading || scopedLoading;
  const error = mainError; // Focus on main summary errors for now

  // Scoped summary mutations
  const updateScopedSummaryMutation = useUpdateScopedSummary();
  const removeScopedSummaryMutation = useRemoveScopedSummary();

  // Form setup - identical to main SummarySection
  const form = useForm<ProfessionalSummaryFormData>({
    resolver: standardSchemaResolver(professionalSummarySchema),
    defaultValues: {
      summaryText: "",
    },
  });

  const {
    formState: { isDirty, isSubmitting },
  } = form;

  // Update form when data loads
  React.useEffect(() => {
    if (displaySummary && !isEditing) {
      form.reset({
        summaryText: displaySummary.summaryText,
      });
    }
  }, [displaySummary, isEditing, form]);

  const handleEdit = () => {
    if (startEdit() && displaySummary) {
      form.reset({
        summaryText: displaySummary.summaryText,
      });
    }
  };

  const handleCancel = () => {
    form.reset();
    cancelEdit();
  };

  const handleSave = async (data: ProfessionalSummaryFormData) => {
    try {
      await updateScopedSummaryMutation.mutateAsync({
        scopedResumeId,
        summaryText: data.summaryText
      });

      toast.success("Professional summary updated for this scoped resume");
      completeEdit();
    } catch (error) {
      toast.error("Failed to update professional summary");
      console.error("Scoped summary update error:", error);
    }
  };

  const handleResetToOriginal = async () => {
    try {
      await removeScopedSummaryMutation.mutateAsync(scopedResumeId);
      toast.success("Reset to original professional summary");
    } catch (error) {
      toast.error("Failed to reset to original");
      console.error("Scoped summary reset error:", error);
    }
  };

  // Loading state - identical to main UI
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </div>
      </Card>
    );
  }

  // Error state - identical to main UI
  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <p>Failed to load professional summary</p>
          <Button variant="outline" size="sm" className="mt-2">
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <Card
        data-testid="ScopedSummaryCard"
        className={cn(
          "p-6 transition-colors",
          isEditing && isDirty && "border-orange-500 border-2", // Same orange border
          "max-w-4xl mx-auto"
        )}
      >
        {/* Header - enhanced with customization indicator */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Professional Summary</h2>
            {hasCustomizations && (
              <Badge variant="secondary" className="text-xs" data-testid="summary-customized-badge">Customized</Badge>
            )}
          </div>
          {!isEditing && (
            <div className="flex gap-2">
              {hasCustomizations && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetToOriginal}
                  className="text-muted-foreground"
                  data-testid="summary-reset-button"
                >
                  Reset to Original
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                data-testid="edit-button"
                disabled={!canEdit}
              >
                Edit
              </Button>
            </div>
          )}
        </div>

        {/* Form - identical to main UI */}
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
          <SummaryForm isEditing={isEditing} form={form} />
          <SummaryFormActions
            isEditing={isEditing}
            isSubmitting={isSubmitting}
            isDirty={isDirty}
            onCancel={handleCancel}
          />
        </form>

        {/* Content display with original vs customized indicator */}
        {!isEditing && hasCustomizations && mainSummary && (
          <div className="mt-4 space-y-2">
            <details className="text-xs">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                View original content
              </summary>
              <div className="mt-1 p-2 bg-muted rounded text-muted-foreground">
                {mainSummary.summaryText}
              </div>
            </details>
          </div>
        )}

        <SummaryContent
          summary={displaySummary}
          isEditing={isEditing}
          onEdit={handleEdit}
        />
      </Card>
    </ErrorBoundary>
  );
};