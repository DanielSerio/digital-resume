import React from "react";
import { toast } from "sonner";
import { Plus, Minus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ErrorBoundary } from "@/components/common";
import { SkillsDisplay } from "../SkillsSection/SkillsDisplay";
import { AddSkillForm } from "../SkillsSection/AddSkillForm";

import {
  useTechnicalSkillsData,
  useDeleteTechnicalSkill,
  useSkillTaxonomy,
  useScopedResumeData,
} from "@/hooks";
import { cn } from "@/lib/utils";
import { useSkillsEdit } from "@/hooks/edit/useSkillsEdit";
import type { TechnicalSkill } from "@/types";

interface ScopedSkillsSectionProps {
  scopedResumeId: number;
}

export const ScopedSkillsSection: React.FC<ScopedSkillsSectionProps> = ({
  scopedResumeId,
}) => {
  // Use the same edit state hook as main UI
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
  const { data: scopedResume, isLoading: scopedLoading } = useScopedResumeData(scopedResumeId);
  const { getCategoryName } = useSkillTaxonomy();
  const deleteSkillMutation = useDeleteTechnicalSkill();

  // TODO: Add scoped skill mutations
  // const addScopedSkillMutation = useAddScopedSkill();
  // const removeScopedSkillMutation = useRemoveScopedSkill();

  // Determine which skills are included in this scoped resume
  const scopedSkillIds = new Set(
    scopedResume?.scopedSkills?.map(ss => ss.technicalSkillId) || []
  );

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

  const handleToggleSkillInclusion = async (skill: TechnicalSkill, included: boolean) => {
    try {
      if (included) {
        // TODO: Add to scoped resume
        // await addScopedSkillMutation.mutateAsync({
        //   scopedResumeId,
        //   technicalSkillId: skill.id,
        // });
        console.log("Adding skill to scoped resume:", { scopedResumeId, skillId: skill.id });
        toast.success(`Added "${skill.name}" to scoped resume`);
      } else {
        // TODO: Remove from scoped resume
        // await removeScopedSkillMutation.mutateAsync(scopedResumeId, skill.id);
        console.log("Removing skill from scoped resume:", { scopedResumeId, skillId: skill.id });
        toast.success(`Removed "${skill.name}" from scoped resume`);
      }
    } catch (error) {
      toast.error("Failed to update skill inclusion");
      console.error("Toggle skill inclusion error:", error);
    }
  };

  const handleBulkToggle = async (skillsInCategory: TechnicalSkill[], include: boolean) => {
    try {
      const skillsToToggle = include
        ? skillsInCategory.filter(skill => !scopedSkillIds.has(skill.id))
        : skillsInCategory.filter(skill => scopedSkillIds.has(skill.id));

      // TODO: Implement bulk operations
      for (const skill of skillsToToggle) {
        await handleToggleSkillInclusion(skill, include);
      }

      const action = include ? "added to" : "removed from";
      toast.success(`${skillsToToggle.length} skills ${action} scoped resume`);
    } catch (error) {
      toast.error("Failed to update skills");
    }
  };

  if (isLoading || scopedLoading) {
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

  // Group skills by category for bulk operations
  const skillsByCategory = skills.reduce((acc, skill) => {
    const categoryName = getCategoryName(skill.categoryId);
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(skill);
    return acc;
  }, {} as Record<string, TechnicalSkill[]>);

  const includedSkillsCount = skills.filter(skill => scopedSkillIds.has(skill.id)).length;

  return (
    <ErrorBoundary>
      <Card
        data-testid="ScopedSkillsCard"
        className={cn(
          "p-6 transition-colors",
          isAddingSkill && "border-orange-500 border-2",
          "max-w-4xl mx-auto"
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Technical Skills</h2>
            <Badge variant="outline" className="text-xs">
              {includedSkillsCount} of {skills.length} included
            </Badge>
          </div>
        </div>

        {/* Bulk selection controls */}
        <div className="mb-6 space-y-4">
          <div className="text-sm font-medium">Skill Selection by Category:</div>
          {Object.entries(skillsByCategory).map(([categoryName, categorySkills]) => {
            const includedCount = categorySkills.filter(skill => scopedSkillIds.has(skill.id)).length;
            const allIncluded = includedCount === categorySkills.length;
            const noneIncluded = includedCount === 0;

            return (
              <div key={categoryName} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{categoryName}</span>
                  <Badge variant="secondary" className="text-xs">
                    {includedCount}/{categorySkills.length}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkToggle(categorySkills, true)}
                    disabled={allIncluded}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkToggle(categorySkills, false)}
                    disabled={noneIncluded}
                  >
                    <Minus className="h-3 w-3 mr-1" />
                    None
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced skills display with inclusion toggles */}
        <div className="space-y-6">
          <div className="space-y-4">
            {Object.entries(skillsByCategory).map(([categoryName, categorySkills]) => (
              <div key={categoryName} className="space-y-2">
                <h3 className="font-medium text-sm text-muted-foreground">{categoryName}</h3>
                <div className="grid gap-2">
                  {categorySkills.map((skill) => {
                    const isIncluded = scopedSkillIds.has(skill.id);
                    return (
                      <div
                        key={skill.id}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded border transition-colors",
                          isIncluded ? "bg-green-50 border-green-200" : "bg-muted border-border"
                        )}
                      >
                        <Checkbox
                          checked={isIncluded}
                          onCheckedChange={(checked) =>
                            handleToggleSkillInclusion(skill, checked as boolean)
                          }
                          id={`skill-${skill.id}`}
                        />
                        <Label
                          htmlFor={`skill-${skill.id}`}
                          className={cn(
                            "flex-1 cursor-pointer",
                            !isIncluded && "text-muted-foreground"
                          )}
                        >
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-xs ml-2">
                            ({skill.subcategory?.name})
                          </span>
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Add skill form - same as main UI */}
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
              Add New Skill
            </Button>
          )}
        </div>
      </Card>
    </ErrorBoundary>
  );
};