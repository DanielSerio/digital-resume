import React from "react";
import { Badge } from "@/components/ui/badge";

interface ScopedWorkExperienceHeaderProps {
  includedCount: number;
  totalCount: number;
}

export const ScopedWorkExperienceHeader: React.FC<ScopedWorkExperienceHeaderProps> = ({
  includedCount,
  totalCount,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Work Experience</h2>
        <Badge
          variant="secondary"
          className="text-xs"
          data-testid="work-experience-included-badge"
        >
          {includedCount} of {totalCount} included
        </Badge>
      </div>
    </div>
  );
};