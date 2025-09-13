import React from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/common";
import { SummaryContent } from "./SummaryContent";
import { SummaryForm } from "./SummaryForm";
import { SummaryFormActions } from "./SummaryFormActions";

import {
  useProfessionalSummaryData,
  useUpdateProfessionalSummary,
} from "@/hooks";
import {
  professionalSummarySchema,
  type ProfessionalSummaryFormData,
} from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useEditState } from "@/hooks/edit/useEditState";

export const SummarySection: React.FC = () => {
  // Use the simple edit state hook
  const {
    isEditing,
    canEdit,
    startEdit,
    cancelEdit,
    completeEdit
  } = useEditState('summary');

  // Data fetching
  const { data: summary, isLoading, error } = useProfessionalSummaryData();
  const updateSummaryMutation = useUpdateProfessionalSummary();

  // Form setup
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
    if (summary && !isEditing) {
      form.reset({
        summaryText: summary.summaryText,
      });
    }
  }, [summary, isEditing, form]);

  const handleEdit = () => {
    if (startEdit() && summary) {
      form.reset({
        summaryText: summary.summaryText,
      });
    }
  };

  const handleCancel = () => {
    form.reset();
    cancelEdit();
  };

  const handleSave = async (data: ProfessionalSummaryFormData) => {
    try {
      await updateSummaryMutation.mutateAsync(data);
      toast.success("Professional summary updated successfully");
      completeEdit();
    } catch (error) {
      toast.error("Failed to update professional summary");
      console.error("Summary update error:", error);
    }
  };

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
        data-testid="SummaryCard"
        className={cn(
          "p-6 transition-colors",
          isEditing && isDirty && "border-orange-500 border-2",
          "max-w-4xl mx-auto"
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Professional Summary</h2>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              data-testid="edit-button"
              disabled={!canEdit}
            >
              Edit
            </Button>
          )}
        </div>

        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
          <SummaryForm isEditing={isEditing} form={form} />
          <SummaryFormActions
            isEditing={isEditing}
            isSubmitting={isSubmitting}
            isDirty={isDirty}
            onCancel={handleCancel}
          />
        </form>

        <SummaryContent
          summary={summary}
          isEditing={isEditing}
          onEdit={handleEdit}
        />
      </Card>
    </ErrorBoundary>
  );
};
