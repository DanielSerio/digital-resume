import React from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/common";
import { WorkExperienceDisplay } from "./WorkExperienceDisplay";
import { WorkExperienceEntryForm } from "./WorkExperienceEntryForm";

import {
  useWorkExperiencesData,
  useCreateWorkExperience,
  useUpdateWorkExperience,
  useDeleteWorkExperience,
} from "@/hooks";
import { type CompleteWorkExperienceFormData } from "@/lib/validation";
import { cn } from "@/lib/utils";
import type { WorkExperience, WorkExperienceLineInput } from "@/types";
import { useItemEdit } from "@/hooks/edit/useItemEdit";

export const WorkExperienceSection: React.FC = () => {
  // Data fetching
  const queryData = useWorkExperiencesData();
  const { data: workExperiences = [], isLoading, error } = queryData;
  // Use the collection edit hook
  const {
    isAdding,
    editingItemId: editingExperienceId,
    editingItem: editingExperience,
    canEdit,
    isEditingAnything,
    startAdd,
    startEditItem,
    cancelEdit,
    completeAdd,
    completeEditItem,
    deleteItem,
  } = useItemEdit("workExperience", workExperiences);
  const createExperienceMutation = useCreateWorkExperience();
  const updateExperienceMutation = useUpdateWorkExperience();
  const deleteExperienceMutation = useDeleteWorkExperience();

  const handleAddExperience = () => {
    startAdd();
  };

  const handleEditExperience = (experience: WorkExperience) => {
    startEditItem(experience);
  };

  const handleSaveNew = async (data: CompleteWorkExperienceFormData) => {
    try {
      const { lines, ...workExperience } = data;
      await createExperienceMutation.mutateAsync({
        workExperience: {
          companyName: workExperience.companyName,
          companyCity: workExperience.companyCity || "",
          companyState: workExperience.companyState || "",
          jobTitle: workExperience.jobTitle,
          dateStarted: workExperience.startDate,
          dateEnded: workExperience.endDate ?? null,
        },
        lines: lines.map(
          (line): WorkExperienceLineInput => ({
            ...line,
            lineText: line.lineText,
            sortOrder: line.sortOrder,
          })
        ),
      });
      toast.success("Work experience added successfully");
      completeAdd();
    } catch (error) {
      toast.error("Failed to add work experience");
      console.error("Add work experience error:", error);
    }
  };

  const handleSaveEdit = async (data: CompleteWorkExperienceFormData) => {
    if (!editingExperience) return;
    try {
      const { lines, ...workExperience } = data;

      console.log(
        "Lines being sent to API:",
        lines.map((line, index) => ({
          lineText: line.lineText.substring(0, 30) + "...",
          sortOrder: line.sortOrder,
          arrayIndex: index,
        }))
      );

      console.log("=== CALLING API MUTATION ===");
      console.log("Work Experience ID:", editingExperience.id);
      console.log("Mutation data being sent:", {
        workExperience: {
          companyName: workExperience.companyName,
          jobTitle: workExperience.jobTitle,
        },
        lines: lines.map(
          (line): WorkExperienceLineInput => ({
            ...line,
            lineText: line.lineText.substring(0, 30) + "...",
            sortOrder: line.sortOrder,
          })
        ),
      });

      await updateExperienceMutation.mutateAsync({
        id: editingExperience.id,
        data: {
          workExperience: {
            companyName: workExperience.companyName,
            companyCity:
              workExperience.companyCity || editingExperience.companyCity || "",
            companyState:
              workExperience.companyState ||
              editingExperience.companyState ||
              "",
            jobTitle: workExperience.jobTitle,
            dateStarted: workExperience.startDate,
            dateEnded: workExperience.endDate ?? null,
          },
          lines: (lines ?? []).map(
            (line): WorkExperienceLineInput => ({
              ...line,
              lineText: line.lineText,
              sortOrder: line.sortOrder,
            })
          ),
        },
      });
      console.log("=== API MUTATION COMPLETED SUCCESSFULLY ===");
      toast.success("Work experience updated successfully");
      completeEditItem();
    } catch (error) {
      console.error("Update work experience error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      toast.error("Failed to update work experience");
    }
  };

  const handleDelete = async (experienceId: number) => {
    try {
      await deleteExperienceMutation.mutateAsync(experienceId);
      toast.success("Work experience deleted successfully");
      deleteItem();
    } catch (error) {
      toast.error("Failed to delete work experience");
      console.error("Delete work experience error:", error);
    }
  };

  const isSubmitting =
    createExperienceMutation.isPending ||
    updateExperienceMutation.isPending ||
    deleteExperienceMutation.isPending;

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  console.info("queryData", queryData);

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <p>Failed to load work experience</p>
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
        data-testid="WorkExpCard"
        className={cn(
          "p-6 transition-colors",
          (isAdding || editingExperience) && "border-orange-500 border-2",
          "max-w-4xl mx-auto"
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Work Experience</h2>
        </div>

        <div className="space-y-6">
          <WorkExperienceDisplay
            workExperiences={workExperiences}
            isEditing={true}
            onEditWorkExperience={handleEditExperience}
            isAnyEditActive={isEditingAnything}
            currentEditId={editingExperienceId}
          />

          {editingExperience && (
            <WorkExperienceEntryForm
              workExperience={editingExperience}
              onSave={handleSaveEdit}
              onCancel={cancelEdit}
              onDelete={() => handleDelete(editingExperience.id)}
              isSubmitting={isSubmitting}
            />
          )}

          {isAdding && (
            <WorkExperienceEntryForm
              onSave={handleSaveNew}
              onCancel={cancelEdit}
              isSubmitting={isSubmitting}
            />
          )}

          {!isAdding && !editingExperience && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddExperience}
              className="flex items-center gap-2"
              disabled={!canEdit}
            >
              <Plus className="h-4 w-4" />
              Add Work Experience
            </Button>
          )}
        </div>
      </Card>
    </ErrorBoundary>
  );
};
