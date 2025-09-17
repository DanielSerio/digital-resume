import React from "react";
import { Button } from "@/components/ui/button";
import { ScopedSkillToggle } from "./ScopedSkillToggle";
import type { TechnicalSkill } from "@/types";

interface ScopedSkillCategoryProps {
  categoryName: string;
  skills: TechnicalSkill[];
  includedSkillIds: Set<number>;
  onToggleSkill: (skill: TechnicalSkill, included: boolean) => Promise<void>;
  onBulkToggle: (skills: TechnicalSkill[], include: boolean) => Promise<void>;
}

export const ScopedSkillCategory: React.FC<ScopedSkillCategoryProps> = ({
  categoryName,
  skills,
  includedSkillIds,
  onToggleSkill,
  onBulkToggle,
}) => {
  const allIncluded = skills.every(skill => includedSkillIds.has(skill.id));
  const noneIncluded = skills.every(skill => !includedSkillIds.has(skill.id));

  const handleSelectAll = () => onBulkToggle(skills, true);
  const handleSelectNone = () => onBulkToggle(skills, false);

  return (
    <div className="mb-6">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-sm">{categoryName}</h3>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              disabled={allIncluded}
              className="text-xs h-6 px-2"
            >
              All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectNone}
              disabled={noneIncluded}
              className="text-xs h-6 px-2"
            >
              None
            </Button>
          </div>
        </div>
        <div className="space-y-1">
          {skills.map(skill => (
            <ScopedSkillToggle
              key={skill.id}
              skill={skill}
              isIncluded={includedSkillIds.has(skill.id)}
              onToggle={onToggleSkill}
            />
          ))}
        </div>
      </div>
    </div>
  );
};