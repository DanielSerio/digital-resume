import React from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/common";
import { SkillsDisplay } from "./SkillsDisplay";
import { AddSkillForm } from "./AddSkillForm";

import {
  useTechnicalSkillsData,
  useDeleteTechnicalSkill,
  useSkillTaxonomy,
} from "@/hooks";
import { cn } from "@/lib/utils";
import { useSkillsEdit } from "@/hooks/edit/useSkillsEdit";

export const SkillsSection: React.FC = () => {
  // Use the specialized Skills edit hook
  const {
    isAddingSkill,
    isEditingCategory,
    currentEditCategory,
    canEdit,
    startAddSkill,
    startEditCategory,
    cancelEdit,
    completeAddSkill
  } = useSkillsEdit();

  // Data fetching
  const { data: skills = [], isLoading, error } = useTechnicalSkillsData();
  const { getCategoryName } = useSkillTaxonomy();
  const deleteSkillMutation = useDeleteTechnicalSkill();

  const handleAddSkillSuccess = () => {
    completeAddSkill();
  };


  const handleSaveCategory = async (categoryName: string, deletedSkillIds: number[]) => {
    try {
      // Delete all marked skills
      await Promise.all(
        deletedSkillIds.map(skillId => deleteSkillMutation.mutateAsync(skillId))
      );

      if (deletedSkillIds.length > 0) {
        toast.success(`${deletedSkillIds.length} skill${deletedSkillIds.length > 1 ? 's' : ''} removed from ${categoryName}`);
      }

      // Exit edit mode
      cancelEdit();
    } catch (error) {
      toast.error("Failed to save changes");
      console.error("Save category error:", error);
    }
  };

  const handleCancelCategoryEdit = () => {
    cancelEdit();
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-muted rounded w-20"></div>
              <div className="h-6 bg-muted rounded w-16"></div>
              <div className="h-6 bg-muted rounded w-24"></div>
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
          <p>Failed to load technical skills</p>
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
        data-testid="SkillsCard"
        className={cn(
          "p-6 transition-colors",
          isAddingSkill && "border-orange-500 border-2",
          "max-w-4xl mx-auto"
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Technical Skills</h2>
        </div>

        <div className="space-y-6">
          <SkillsDisplay
            skills={skills}
            getCategoryName={getCategoryName}
            isEditing={true}
            onEditCategory={startEditCategory}
            onSaveCategory={handleSaveCategory}
            onCancelCategoryEdit={handleCancelCategoryEdit}
            isAnyEditActive={isEditingCategory || isAddingSkill}
            currentEditCategory={currentEditCategory}
          />

          {isAddingSkill ? (
            <AddSkillForm
              onSuccess={handleAddSkillSuccess}
              onCancel={cancelEdit}
            />
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={startAddSkill}
              className="flex items-center gap-2"
              disabled={!canEdit}
            >
              <Plus className="h-4 w-4" />
              Add Skill
            </Button>
          )}
        </div>
      </Card>
    </ErrorBoundary>
  );
};
