import React, { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/common";
import { EducationDisplay } from "./EducationDisplay";
import { EducationEntryForm } from "./EducationEntryForm";

import {
  useEducationData,
  useCreateEducation,
  useUpdateEducation,
  useDeleteEducation,
} from "@/hooks";
import { type EducationFormData } from "@/lib/validation";
import { cn } from "@/lib/utils";
import type { Education } from "@/types";

export const EducationSection: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(
    null
  );

  // Data fetching
  const { data: educations = [], isLoading, error } = useEducationData();
  const createEducationMutation = useCreateEducation();
  const updateEducationMutation = useUpdateEducation();
  const deleteEducationMutation = useDeleteEducation();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsAdding(false);
    setEditingEducation(null);
  };

  const handleAddEducation = () => {
    setIsAdding(true);
  };

  const handleEditEducation = (education: Education) => {
    setEditingEducation(education);
  };

  const handleSaveNew = async (data: EducationFormData) => {
    try {
      await createEducationMutation.mutateAsync(data);
      toast.success("Education entry added successfully");
      setIsAdding(false);
    } catch (error) {
      toast.error("Failed to add education entry");
      console.error("Add education error:", error);
    }
  };

  const handleSaveEdit = async (data: EducationFormData) => {
    if (!editingEducation) return;
    try {
      await updateEducationMutation.mutateAsync({
        id: editingEducation.id,
        data,
      });
      toast.success("Education entry updated successfully");
      setEditingEducation(null);
    } catch (error) {
      toast.error("Failed to update education entry");
      console.error("Update education error:", error);
    }
  };

  const handleDelete = async (educationId: number) => {
    try {
      await deleteEducationMutation.mutateAsync(educationId);
      toast.success("Education entry deleted successfully");
      setEditingEducation(null);
    } catch (error) {
      toast.error("Failed to delete education entry");
      console.error("Delete education error:", error);
    }
  };

  const isSubmitting =
    createEducationMutation.isPending ||
    updateEducationMutation.isPending ||
    deleteEducationMutation.isPending;

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <p>Failed to load education information</p>
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
          isEditing && (isAdding || editingEducation) && "border-orange-500 border-2",
          "max-w-4xl mx-auto"
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Education</h2>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              Edit
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-6">
            <EducationDisplay
              educations={educations}
              isEditing={isEditing}
              onEditEducation={handleEditEducation}
            />

            {editingEducation && (
              <EducationEntryForm
                education={editingEducation}
                onSave={handleSaveEdit}
                onCancel={() => setEditingEducation(null)}
                onDelete={() => handleDelete(editingEducation.id)}
                isSubmitting={isSubmitting}
              />
            )}

            {isAdding && (
              <EducationEntryForm
                onSave={handleSaveNew}
                onCancel={() => setIsAdding(false)}
                isSubmitting={isSubmitting}
              />
            )}

            {!isAdding && !editingEducation && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddEducation}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Education
              </Button>
            )}

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleCancel}>Done</Button>
            </div>
          </div>
        ) : (
          <EducationDisplay
            educations={educations}
            isEditing={isEditing}
            onEditEducation={handleEditEducation}
          />
        )}
      </Card>
    </ErrorBoundary>
  );
};