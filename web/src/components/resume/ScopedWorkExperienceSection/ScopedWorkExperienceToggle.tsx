import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkExperience } from "@/types";

interface ScopedWorkExperienceToggleProps {
  experience: WorkExperience;
  isIncluded: boolean;
  isEditing: boolean;
  canEdit: boolean;
  onToggle: (experience: WorkExperience, included: boolean) => Promise<void>;
  onEdit: (experience: WorkExperience) => void;
}

export const ScopedWorkExperienceToggle: React.FC<ScopedWorkExperienceToggleProps> = ({
  experience,
  isIncluded,
  isEditing,
  canEdit,
  onToggle,
  onEdit,
}) => {
  const handleCheckedChange = (checked: boolean) => {
    onToggle(experience, checked);
  };

  return (
    <div
      className={cn(
        "p-4 rounded border transition-colors",
        isIncluded ? "bg-green-50 border-green-200" : "bg-muted border-border",
        isEditing && "border-orange-500 border-2"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isIncluded}
            onCheckedChange={handleCheckedChange}
            id={`experience-${experience.id}`}
          />
          <Label
            htmlFor={`experience-${experience.id}`}
            className={cn(
              "cursor-pointer font-medium",
              !isIncluded && "text-muted-foreground"
            )}
          >
            {experience.jobTitle} at {experience.companyName}
          </Label>
        </div>

        {isIncluded && !isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(experience)}
            disabled={!canEdit}
          >
            <Edit3 className="h-3 w-3 mr-1" />
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};