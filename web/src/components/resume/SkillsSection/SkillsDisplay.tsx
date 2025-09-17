import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TechnicalSkill } from "@/types";

interface SkillsDisplayProps {
  skills: TechnicalSkill[];
  getCategoryName: (id: number) => string;
  isEditing?: boolean;
  onEditCategory?: (categoryName: string) => void;
  onSaveCategory?: (categoryName: string, deletedSkillIds: number[]) => Promise<void>;
  onCancelCategoryEdit?: () => void;
  isAnyEditActive?: boolean;
  currentEditCategory?: string | null;
}

export const SkillsDisplay: React.FC<SkillsDisplayProps> = ({
  skills,
  getCategoryName,
  isEditing,
  onEditCategory,
  onSaveCategory,
  onCancelCategoryEdit,
  isAnyEditActive = false,
  currentEditCategory = null,
}) => {
  // Track pending deletions locally
  const [pendingDeletions, setPendingDeletions] = useState<Set<number>>(new Set());

  // Reset pending deletions when edit category changes
  useEffect(() => {
    setPendingDeletions(new Set());
  }, [currentEditCategory]);

  // Handle temporary skill deletion (just marks for deletion)
  const handleMarkForDeletion = (skillId: number) => {
    setPendingDeletions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(skillId)) {
        newSet.delete(skillId); // Un-mark if already marked
      } else {
        newSet.add(skillId); // Mark for deletion
      }
      return newSet;
    });
  };

  // Handle save - actually delete the marked skills
  const handleSave = async () => {
    if (!currentEditCategory || !onSaveCategory) return;
    await onSaveCategory(currentEditCategory, Array.from(pendingDeletions));
    setPendingDeletions(new Set());
  };

  // Handle cancel - clear pending deletions
  const handleCancel = () => {
    setPendingDeletions(new Set());
    if (onCancelCategoryEdit) {
      onCancelCategoryEdit();
    }
  };
  // Group skills by category
  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      const categoryName = getCategoryName(skill.categoryId);
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(skill);
      return acc;
    },
    {} as Record<string, TechnicalSkill[]>
  );

  if (Object.keys(skillsByCategory).length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>No technical skills added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="skills-list">
      {Object.entries(skillsByCategory).map(
        ([categoryName, categorySkills]) => {
          const isCategoryEditing = currentEditCategory === categoryName;

          return (
            <div key={categoryName} className="border rounded-lg">
              <div className="flex justify-between items-center pt-2 pb-2 px-4 border-b bg-background rounded-t-lg">
                <h4 className="font-regular text-foreground">
                  {categoryName}
                </h4>
                {isEditing && onEditCategory && !isCategoryEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditCategory(categoryName)}
                    disabled={isAnyEditActive}
                  >
                    Edit
                  </Button>
                )}
                {isCategoryEditing && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSave}
                    >
                      Save
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2 p-4 bg-muted-foreground/5 rounded-b-lg">
                {categorySkills.map((skill) => {
                  const isMarkedForDeletion = pendingDeletions.has(skill.id);
                  const isHidden = isMarkedForDeletion;

                  return (
                    <Badge
                      key={skill.id}
                      variant="outline"
                      className={`text-sm transition-all duration-200 ${
                        isHidden
                          ? "opacity-50 line-through bg-red-50 border-red-200"
                          : "bg-background"
                      }`}
                    >
                      {skill.name}
                      {isCategoryEditing && (
                        <button
                          role="button"
                          onClick={() => handleMarkForDeletion(skill.id)}
                          className={`ml-2 transition-colors ${
                            isMarkedForDeletion
                              ? "text-red-600 hover:text-red-800"
                              : "hover:text-red-600"
                          }`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  );
                })}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};
