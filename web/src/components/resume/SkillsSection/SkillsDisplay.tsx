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
    <div className="space-y-6" data-testid="skills-list">
      {Object.entries(skillsByCategory).map(
        ([categoryName, categorySkills]) => (
          <div key={categoryName}>
            <h4 className="font-regular text-foreground pt-2 pb-2 px-2 border rounded-t-sm bg-background">
              {categoryName}
            </h4>
            <div className="flex flex-wrap gap-2 border p-2 border-t-0 rounded-b-sm bg-muted-foreground/5">
              {categorySkills.map((skill) => (
                <Badge
                  key={skill.id}
                  variant="outline"
                  className="text-sm bg-background"
                >
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
