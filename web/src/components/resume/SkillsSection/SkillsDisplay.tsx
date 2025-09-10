import React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TechnicalSkill } from "@/types";

interface SkillsDisplayProps {
  skills: TechnicalSkill[];
  getCategoryName: (id: number) => string;
  isEditing: boolean;
  onDeleteSkill: (id: number) => Promise<void>;
}

export const SkillsDisplay: React.FC<SkillsDisplayProps> = ({
  skills,
  getCategoryName,
  isEditing,
  onDeleteSkill,
}) => {
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
    <div className="space-y-6">
      {Object.entries(skillsByCategory).map(
        ([categoryName, categorySkills]) => (
          <div key={categoryName}>
            <h4 className="font-medium text-foreground mb-3">
              {categoryName}:
            </h4>
            <div className="flex flex-wrap gap-2">
              {categorySkills.map((skill) => (
                <Badge key={skill.id} variant="secondary" className="text-sm">
                  {skill.name}
                  {isEditing && (
                    <button
                      onClick={() => onDeleteSkill(skill.id)}
                      className="ml-2 hover:text-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};