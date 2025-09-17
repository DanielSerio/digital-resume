import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { TechnicalSkill } from "@/types";

interface ScopedSkillToggleProps {
  skill: TechnicalSkill;
  isIncluded: boolean;
  onToggle: (skill: TechnicalSkill, included: boolean) => Promise<void>;
}

export const ScopedSkillToggle: React.FC<ScopedSkillToggleProps> = ({
  skill,
  isIncluded,
  onToggle,
}) => {
  const handleCheckedChange = (checked: boolean) => {
    onToggle(skill, checked);
  };

  return (
    <div className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-md">
      <Checkbox
        id={`skill-${skill.id}`}
        checked={isIncluded}
        onCheckedChange={handleCheckedChange}
      />
      <Label
        htmlFor={`skill-${skill.id}`}
        className="flex-1 text-sm cursor-pointer"
      >
        {skill.name}
      </Label>
    </div>
  );
};