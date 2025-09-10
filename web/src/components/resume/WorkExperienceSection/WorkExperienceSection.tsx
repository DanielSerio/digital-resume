import React, { useState } from "react";
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
import type { WorkExperience } from "@/types";

export const WorkExperienceSection: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingExperience, setEditingExperience] =
    useState<WorkExperience | null>(null);

  // Data fetching
  const {
    data: workExperiences = [],
    isLoading,
    error,
  } = useWorkExperiencesData();
  const createExperienceMutation = useCreateWorkExperience();
  const updateExperienceMutation = useUpdateWorkExperience();
  const deleteExperienceMutation = useDeleteWorkExperience();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsAdding(false);
    setEditingExperience(null);
  };

  const handleAddExperience = () => {
    setIsAdding(true);
  };

  const handleEditExperience = (experience: WorkExperience) => {
    setEditingExperience(experience);
  };

  const handleSaveNew = async (data: CompleteWorkExperienceFormData) => {
    try {
      const { lines, ...workExperience } = data;
      await createExperienceMutation.mutateAsync({
        workExperience: {
          ...workExperience,
          companyCity: "",
          companyState: "",
        },
        lines,
      });
      toast.success("Work experience added successfully");
      setIsAdding(false);
    } catch (error) {
      toast.error("Failed to add work experience");
      console.error("Add work experience error:", error);
    }
  };

  const handleSaveEdit = async (data: CompleteWorkExperienceFormData) => {
    if (!editingExperience) return;
    try {
      const { lines, ...workExperience } = data;
      await updateExperienceMutation.mutateAsync({
        id: editingExperience.id,
        data: {
          workExperience: {
            ...workExperience,
            companyCity: editingExperience.companyCity || "",
            companyState: editingExperience.companyState || "",
          },
          lines,
        },
      });
      toast.success("Work experience updated successfully");
      setEditingExperience(null);
    } catch (error) {
      toast.error("Failed to update work experience");
      console.error("Update work experience error:", error);
    }
  };

  const handleDelete = async (experienceId: number) => {
    try {
      await deleteExperienceMutation.mutateAsync(experienceId);
      toast.success("Work experience deleted successfully");
      setEditingExperience(null);
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
        className={cn(
          "p-6 transition-colors",
          isEditing && "border-orange-500 border-2",
          "max-w-4xl mx-auto"
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Work Experience</h2>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              Edit
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-6">
            <WorkExperienceDisplay
              workExperiences={workExperiences}
              onEditWorkExperience={handleEditExperience}
            />

            {editingExperience && (
              <WorkExperienceEntryForm
                workExperience={editingExperience}
                onSave={handleSaveEdit}
                onCancel={() => setEditingExperience(null)}
                onDelete={() => handleDelete(editingExperience.id)}
                isSubmitting={isSubmitting}
              />
            )}

            {isAdding && (
              <WorkExperienceEntryForm
                onSave={handleSaveNew}
                onCancel={() => setIsAdding(false)}
                isSubmitting={isSubmitting}
              />
            )}

            {!isAdding && !editingExperience && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddExperience}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Work Experience
              </Button>
            )}

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleCancel}>Done</Button>
            </div>
          </div>
        ) : (
          <WorkExperienceDisplay
            workExperiences={workExperiences}
            onEditWorkExperience={handleEditExperience}
          />
        )}
      </Card>
    </ErrorBoundary>
  );
};