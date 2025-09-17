import React from "react";
import { Badge } from "@/components/ui/badge";

interface ScopedSkillsHeaderProps {
  includedCount: number;
  totalCount: number;
}

export const ScopedSkillsHeader: React.FC<ScopedSkillsHeaderProps> = ({
  includedCount,
  totalCount,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Technical Skills</h2>
        <Badge
          variant="secondary"
          className="text-xs"
          data-testid="skills-included-badge"
        >
          {includedCount} of {totalCount} included
        </Badge>
      </div>
    </div>
  );
};